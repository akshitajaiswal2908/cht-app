const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = process.env;


router.post('/register', async (req, res) => {
try {
const { name, email, password } = req.body;
if (!name || !email || !password) return res.status(400).json({ message: 'Please enter all fields' });
let user = await User.findOne({ email });
if (user) return res.status(400).json({ message: 'User already exists' });
const hashed = await bcrypt.hash(password, 10);
user = new User({ name, email, password: hashed });
await user.save();
const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
} catch (err) {
res.status(500).json({ message: err.message });
}
});


router.post('/login', async (req, res) => {
try {
const { email, password } = req.body;
if (!email || !password) return res.status(400).json({ message: 'Please enter all fields' });
const user = await User.findOne({ email });
if (!user) return res.status(400).json({ message: 'Invalid credentials' });
const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
} catch (err) {
res.status(500).json({ message: err.message });
}
});


module.exports = router;