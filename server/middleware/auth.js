const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = process.env;


module.exports = async function (req, res, next) {
const token = req.header('Authorization')?.split(' ')[1];
if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
try {
const decoded = jwt.verify(token, JWT_SECRET);
req.user = await User.findById(decoded.id).select('-password');
if (!req.user) return res.status(401).json({ message: 'Invalid token' });
next();
} catch (err) {
res.status(401).json({ message: 'Token is not valid' });
}
};