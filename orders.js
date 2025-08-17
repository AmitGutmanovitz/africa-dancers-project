const express = require('express');
const router = express.Router();
const { Pool } = require('pg'); 
const authenticateToken = require('./middleware.js');
const upload = require('./multer.js');
const stripe = require('stripe')(process.env.PAYMENT_PRIVTE_KEY)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const sendEmails = require('./emails.js'); // Import email sending function

router.get('/home/:orderId', authenticateToken, async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const result = await pool.query('SELECT * FROM orders WHERE order_id = $1', [orderId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    } else {
      return res.status(200).json(result.rows[0]);
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/add', authenticateToken, upload.single('images'), async (req, res) => {
  //console.log(req.file)
  const filePath = req.file.path.replace(/\\/g, '/'); // Normalize the file path for cross-platform compatibility
  //console.log(filePath)
  
  const userId = req.user.id;
  
  try {
    const { video, name, status } = req.body;

    if (!name || !video || !status) {
      return res.status(400).json({ error: 'name, video, and status are required' });
    }


  const response = await pool.query(
  'INSERT INTO orders (user_ref, video_ref, order_name, img_url, status) VALUES ($1, $2, $3, $4, $5) RETURNING order_id',
  [userId, video, name, filePath, status]
);
const orderId = response.rows[0].order_id;
  
    await pool.query(
      'UPDATE users SET isorder = $1 WHERE id = $2',
      [true, userId]
    );
    
    const info = await pool.query("select * from users where id = $1", [userId]);
    const email = info.rows[0].email;
    const username = info.rows[0].username;
    await sendEmails(email, username, 'order_unpaid', { videoPath: filePath });



    return res.status(200).json({ order_id: orderId, message: 'Order is being processed, we will notify you when it is ready.' });
  
  } catch (err) {
    console.error(`error order: ${err}`);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/list', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const orderInfo = await pool.query('SELECT * FROM orders, videos WHERE video_ref=video_id and user_ref=$1', [userId]);
    if (orderInfo.rows.length === 0) {
      return res.status(404).json({ message: 'You do not have any orders yet' });
    }
    res.status(200).json(orderInfo.rows);
  } catch (err) {
    //console.error('Error fetching orders:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/edit/:orderID', authenticateToken, upload.single('images'), async(req, res) =>{
  const userId = req.user.id;
  const orderId = req.params.orderID  ;
  const filePath = req.file ? req.file.path.replace(/\\/g, '/') : null; // Handle optional file
  
  try {
   
    
    const { video, name } = req.body;

    const progress = await pool.query('SELECT status FROM orders WHERE user_ref = $1', [userId]);
    if(progress.rows[0].status === 'uploading'){    
        await pool.query('UPDATE orders SET video_ref = $1,  order_name = $2, img_url = $3 WHERE order_id = $4', [video, name, filePath, orderId]);
      res.json('We are editing the video, however it could take an extra day!');
    }else{
      res.status(200).json({ message: 'You can not edit this order, it is already in progress' });
    }
     
  } catch(err){
    console.error(err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

router.put('/update/:orderID', authenticateToken, async(req, res) =>{
  const orderId = req.params.orderID  ;
  if(!orderId){
    res.status(400).json({ message: 'Order ID is required' });
    return;
  }
  
  try {
   

        
      
    const orderInfo = await pool.query('SELECT * FROM orders WHERE order_id = $1', [orderId]);
    if(orderInfo.rows.length === 0) {
      return res.status(200).json({ message: 'Order not found' });
    }
    const userRes = await pool.query("select * from users where id = $1", [orderInfo.rows[0].user_ref]);
    const email = userRes.rows[0].email;
    const username = userRes.rows[0].username;

    setTimeout(async () => {
      await pool.query('UPDATE orders SET status = $1 WHERE order_id = $2', ['confirm', orderId]);
      await sendEmails(email, username, 'updated');
    }, 1000 * 30);


      setTimeout(async () => {
        await pool.query('UPDATE orders SET status = $1 WHERE order_id = $2', ['been ordered', orderId]);
        await sendEmails(email, username, 'video_ready', { videoPath: "./video.mp4" });
  }, 1000 * 40);


setTimeout(async () => {
    await pool.query("UPDATE orders SET status = $1 WHERE order_id = $2", ['progress', orderId]);
  }, 1000 * 240); // Update status to 'progress' after 4 minutes
    return res.status(200).json({ message: 'Your order has been sent!' });
   
  } catch(err){
    console.error(err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});


router.get('/info', async (req, res) => {
  try {
    const response = await pool.query('SELECT * FROM videos');
    res.json(response.rows);  // Sending response successfully
  } catch (err) {
    // Handle the error properly in the catch block
    console.error(err);  // Log the error for debugging
    res.status(500).json({ message: "server error", error: err.message });
  }
});

router.get('image/:videoID', authenticateToken, async(req, res) =>{
  const videoID = req.params.video
  try{
  const getting = await pool.query('select video_image_url from videos where video_id=$1', [videoID]) 
  if(getting){
    res.status(200).json(getting.rows)
  }
  }catch(err){
    res.status(500).json({message: 'server error', error: err.message });
  }
})



router.post('/create-checkout-session', authenticateToken,async (req, res) => {
  const { videoId, orderId } = req.body;
  
  try {
    // שליפת סרטון ספציפי לפי ID
    const result = await pool.query('SELECT * FROM videos WHERE video_id = $1', [videoId]);
    const video = result.rows[0];

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  mode: 'payment',
  line_items: [
    {
      price_data: {
        currency: 'ils',
        unit_amount: video.video_price,
        product_data: {
          name: video.video_name || 'Custom video',
          description: video.description || 'Custom video',
          images: video.video_image_url ? [video.video_image_url] : []
        }
      },
      quantity: 1
    }
  ],
  success_url: 'http://localhost:5173/orders/list',
  
  cancel_url: 'http://localhost:5173/orders/cancel'
});

res.status(200).json({ url: session.url });
console.log("url", session.url); // Log the session URL for debugging

}catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



/*router.post('/cart/menpolation', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { status, videoId } = req.body;  // Status and videoId come from the frontend

  // Validate request body    jhvghffggrffgdsrf
  if (!videoId || !status) {
    return res.status(400).json({ error: 'videoId and status are required' });
  }

  const validStatuses = ['add', 'delete']; // Define valid statuses

  // Check if status is valid
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Valid statuses are: add or delete' });
  }

  try {
    // Check if the video is already in the user's cart
    const cartResult = await pool.query(
      'SELECT * FROM cart WHERE cart_user_id = $1 AND video_id = $2',
      [userId, videoId]
    );

    if (cartResult.rows.length === 0) {
      // If the video is not in the cart and status is "Loveble", add it to the cart
      if (status === 'Loveble') {
        await pool.query(
          'INSERT INTO cart (cart_user_id, video_id) VALUES ($1, $2)',
          [userId, videoId]
        );
        return res.status(200).json({ message: 'Video added to cart' });
      } else {
        // If status is "unLoveble" and video is not in the cart, return an error
        return res.status(400).json({ message: 'Video is not in cart to remove' });
      }
    } else {
      // If the video is already in the cart, and status is "unLoveble", remove it from the cart
      if (status === 'unLoveble') {
        await pool.query(
          'DELETE FROM cart WHERE cart_user_id = $1 AND video_id = $2',
          [userId, videoId]
        );
        return res.status(200).json({ message: 'Video removed from cart' });
      } else {
        // If status is "Loveble", do nothing (since video is already in cart)
        return res.status(204).json({ message: 'Video is already in the cart' });
      }
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

*/
router.post('/cart/add', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { videoId } = req.body;

  if (!videoId) {
    return res.status(400).json({ error: 'videoId is required' });
  }

  try {
    // Check if already in cart
    const cartResult = await pool.query(
      'SELECT * FROM cart WHERE cart_user_id = $1 AND video_id = $2',
      [userId, videoId]
    );
    if (cartResult.rows.length > 0) {
      return res.status(200).json({ message: 'Video is already in the cart' });
    }

    await pool.query(
      'INSERT INTO cart (cart_user_id, video_id) VALUES ($1, $2)',
      [userId, videoId]
    );
    res.status(200).json({ message: 'Video added to cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/cart/delete', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { videoId } = req.body;

  if (!videoId) {
    return res.status(400).json({ error: 'videoId is required' });
  }

  try {
    const cartResult = await pool.query(
      'SELECT * FROM cart WHERE cart_user_id = $1 AND video_id = $2',
      [userId, videoId]
    );
    if (cartResult.rows.length === 0) {
      return res.status(400).json({ message: 'Video is not in cart to remove' });
    }

    await pool.query(
      'DELETE FROM cart WHERE cart_user_id = $1 AND video_id = $2',
      [userId, videoId]
    );
    res.status(200).json({ message: 'Video removed from cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});



router.get('/cart', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const orderInfo = await pool.query('SELECT * FROM cart WHERE cart_user_id=$1', [userId]);
    if(orderInfo.rows.length === 0) {
      res.status(404).json({ message: 'You do not have any loveble orders yet' });
    }else {
      res.status(200).json(orderInfo.rows);
      const videoInfo = await pool.query('SELECT video_image_url, video_name FROM videos WHERE video_id=$1', [orderInfo.rows[1]]);
      if(videoInfo.rows.length === 0) {
        res.status(404).json({ message: 'You do not have any loveble orders yet' });
    }else{
      res.status(200).json(videoInfo.rows);
    }
  
  }}catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  } 
});


module.exports = router;
