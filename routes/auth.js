const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const router = express.Router();

const secret = 'kpu_scheduler'; // Change this to our jwt secret
const pocketbaseUrl = 'http://127.0.0.1:8090'; 

// User login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // get the user info from the pocketbase.
    const response = await axios.get(`${pocketbaseUrl}/api/collections/users/records?filter=(username='${username}')`);
    const user = response.data.items[0];

    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' });
      res.send({ token });
    } else {
      res.status(401).send({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error logging in' });
  }
});

module.exports = router;
