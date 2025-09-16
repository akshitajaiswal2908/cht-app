const mongoose = require('mongoose');


const MessageSchema = new mongoose.Schema({
from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
text: { type: String, required: true },
createdAt: { type: Date, default: Date.now },
delivered: { type: Boolean, default: false },
deliveredAt: { type: Date }
});


module.exports = mongoose.model('Message', MessageSchema);