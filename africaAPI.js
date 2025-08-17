require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');  
const cors = require('cors');
const orderRoutes = require('./orders.js'); // Import order.js
const authenticateToken = require('./middleware.js'); // Import from new file
const sendEmails = require('./emails.js'); // Import email sending function

const app = express();
app.use(express.json());
app.use(express.static ('public'));
app.use(express.json());
app.use('/images', express.static('images'));


app.use(cors({
  origin: 'http://localhost:5173', 
 methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // only if you're using cookies/sessions 
  

  
}));


// Use order routes with "/orders" prefix

app.use('/orders', orderRoutes);
// Rate limiting middleware configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 70, // limit each IP to 70 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// PostgreSQL connection pool setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // e.g., "postgres://user:password@localhost:5432/mydb"
  // For production with SSL, uncomment the following:
  // ssl: { rejectUnauthorized: false }
});





// Helper function to generate tokens
function generateTokens(user) {
  const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '3d',
  });

  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });

  return { accessToken, refreshToken };
}


// --- REGISTER ROUTE ---
// Expects { email, username, password } in the request body
app.post('/register', async (req, res) => {
  //console.log('Registering user...');
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ message: 'Email, username, and password are required.' });
  }

  try {
    // Check if user exists
    const userCheck = await pool.query(
      'SELECT id FROM public.users WHERE email = $1 OR username = $2',
      [email, username]
    );
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Hash password
    const saltRounds = 11;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    

    // Insert new user
    const result = await pool.query(
      'INSERT INTO users (email, username, password, isorder) VALUES ($1, $2, $3, $4) RETURNING id, email, username',
      [email, username, hashedPassword, false]
    );
    const newUser = result.rows[0];

    //send welcome email
    await sendEmails(newUser.email, newUser.username, "register");
    // Generate tokens
    const tokens = generateTokens(newUser);

    // Store refresh token in DB
    await pool.query('UPDATE users SET token = $1 WHERE id = $2', [tokens.accessToken, newUser.id]);

    // Send tokens + user info
    return res.status(201).json({
      message: 'User registered successfully.',
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: newUser,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});


// --- LOGIN ROUTE ---
// Expects { email, password } in the request body
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Basic input validation
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'Email and password are required.' });
  }

  try {
 
    // Retrieve user by email
    const userQuery = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);
    if (userQuery.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const user = userQuery.rows[0];

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    //sending emails
    await sendEmails(user.email, user.username , 'login');

    // Generate access and refresh tokens
 
    const tokens = generateTokens(user);
    //console.log(tokens)
    await pool.query('update public.users set token = $1 where email = $2', [tokens.accessToken, user.email]);
    

    const { password: pwd, ...userWithoutPassword } = user;
    //console.log('user token added to the data base')

    return res.status(200).json({  

      message: 'Logged in successfully.',
      tokens,
      user: userWithoutPassword,
    });
    
    
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// --- TOKEN REFRESH ROUTE ---
// Expects { token } in the request body (the refresh token)
app.post('/token', async(req, res) => {
  const { token } = req.cookies.token || req.body ;
  if (!token)
    return res.status(401).json({ message: 'Refresh token required.' });

  const result = await pool.query('select * from users where token=$1', [token]);
  if (result.rows.length === 0)
      return res.status(403).json({ message: 'Refresh token invalid.' });

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err)
      return res
        .status(403)
        .json({ message: 'Invalid or expired refresh token.' });
    // Generate a new access token
    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '3d',
    });
    return res.json({ accessToken });
  });
});

// --- LOGOUT ROUTE ---
// Allows a user to revoke a refresh token (optional)
app.post('/logout', async (req, res) => {
  const { token } = req.body;
  try {
  // בדיקה אם הטוקן חסר
  if (!token) {
    return res.status(400).json({ message: 'you already logged out' });
  }


    // עדכון במסד: מחיקת הטוקן של המשתמש
    const finding = await pool.query(
      'UPDATE users SET token = NULL WHERE token = $1',
      [token]
    );

    // אם לא נמצא משתמש עם הטוקן הזה
    if (finding.rowCount === 0) {
      return res.status(404).json({ message: 'already logged out' });
    }

    // הצלחה
    return res.status(200).json({ message: 'User logged out successfully' });

  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});



// --- PROTECTED ROUTE ---
// Example route that requires a valid access token
app.get('/profile',  authenticateToken, async (req, res) => {
  try {
    // req.user.id comes from the token payload
    const userId = req.user.id;
    const userResult = await pool.query(
      'SELECT id, email, username FROM users WHERE id = $1',
      [userId]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: `you aren't logged in.` });
    }
    res.json({ user: userResult.rows[0] });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

 


// --- START THE SERVER ---
const PORT = process.env.PORT || 4000;
app.listen(PORT);