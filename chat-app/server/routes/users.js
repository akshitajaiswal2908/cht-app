const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Message = require('../models/Message');


// get all users (excluding current)
router.get('/', auth, async (req, res) => {
const users = await User.find({ _id: { $ne: req.user._id } }).select('-password');
res.json(users);
});


// get messages between current user and another user
router.get('/messages/:userId', auth, async (req, res) => {
const otherId = req.params.userId;
const myId = req.user._id;
const messages = await Message.find({
$or: [
{ from: myId, to: otherId },
{ from: otherId, to: myId }
]
}).sort('createdAt');
res.json(messages);
});


module.exports = router;