// Africa.js
require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');




// Custom middleware to authenticate JWT access tokens
function authenticateToken(req, res, next) {

  if(req.method === 'OPTIONS'){
    return next();
  }
  // Expecting header format: "Authorization: Bearer <token>"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token)
    
    return res.status(401).json({ message: 'Access token missing.' });
    

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ message: 'Invalid or expired token.' });
        req.user = user; // token payload should include user id
next();
  });
}
// Export the authenticateToken function
module.exports =  authenticateToken ;