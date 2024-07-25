const jwt = require('jsonwebtoken');


const secret = 'kpu_scheduler'; // This should match the secret in auth.js

module.exports = function(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send({ message: 'Access denied' });
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send({ message: 'Invalid token' });
  }
};
