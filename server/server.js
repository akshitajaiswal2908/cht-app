require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');

// Models
const Message = require('./models/Message');
const User = require('./models/User');

// Routes
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

const PORT = process.env.PORT || 5000;

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Map userId -> socketId
const onlineUsers = new Map();

// Setup socket.io
const io = new Server(server, {
  cors: { origin: '*' }
});

// Authenticate socket connection using JWT
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication error'));
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return next(new Error('Authentication error'));

    socket.user = user;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  const userId = socket.user._id.toString();
  onlineUsers.set(userId, socket.id);
  console.log('User connected:', socket.user.name);

  // Send user ID to client
  socket.emit('me', { id: userId });

  // Handle private messages
  socket.on('private_message', async ({ to, text }) => {
    try {
      const from = userId;
      const message = new Message({ from, to, text });
      await message.save();

      // Emit to sender
      socket.emit('private_message', { 
        from, to, text, 
        createdAt: message.createdAt, 
        _id: message._id 
      });

      // Emit to receiver if online
      const targetSocketId = onlineUsers.get(to);
      if (targetSocketId) {
        io.to(targetSocketId).emit('private_message', { 
          from, to, text, 
          createdAt: message.createdAt, 
          _id: message._id 
        });
      }
    } catch (err) {
      console.error(err);
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    onlineUsers.delete(userId);
    console.log('User disconnected:', userId);
  });
});

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
