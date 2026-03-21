require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();
const INITIAL_PORT = parseInt(process.env.PORT, 10) || 5000;

// Request Logging Middleware for monitoring traffic
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Middleware setup
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(express.json());

// Main API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Health Check Endpoint
app.get('/', (req, res) => {
  res.status(200).send('SkillServe API is running safely.');
});

// Attach Global Error Handling Middlewares
app.use(notFound);       // Catches 404s
app.use(errorHandler);   // Centralized error responder

// Socket.io Config and Initialization
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'],
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true
  }
});

let onlineUsers = [];

io.on('connection', (socket) => {
  console.log(`User connected to socket: ${socket.id}`);

  // Adding New Online User
  socket.on("addNewUser", (userId) => {
    if (userId) {
      const existingUser = onlineUsers.find((user) => user.userId === userId);
      if (existingUser) {
        existingUser.socketId = socket.id; // Update to the active socket
      } else {
        onlineUsers.push({
          userId,
          socketId: socket.id,
        });
      }
    }
    io.emit("getOnlineUsers", onlineUsers);
  });

  // Relay Message via Socket
  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find((user) => user.userId === message.recipientId);
    if (user) {
      io.to(user.socketId).emit("getMessage", message);
      io.to(user.socketId).emit("getNotification", {
        senderId: message.senderId,
        isRead: false,
        date: new Date(),
      });
    }
  });

  // Relay Message Deletion via Socket
  socket.on("deleteMessage", ({ messageId, receiverId }) => {
    const user = onlineUsers.find((user) => user.userId === receiverId);
    if (user) {
      io.to(user.socketId).emit("getMessageDeleted", messageId);
    }
  });

  // Relay Conversation Deletion via Socket
  socket.on("deleteConversation", ({ conversationId, receiverId }) => {
    const user = onlineUsers.find((user) => user.userId === receiverId);
    if (user) {
      io.to(user.socketId).emit("getConversationDeleted", conversationId);
    }
  });

  // Typing Status Logic
  socket.on("typing", ({ senderId, receiverId, isTyping }) => {
    const user = onlineUsers.find((user) => user.userId === receiverId);
    if (user) {
      io.to(user.socketId).emit("displayTyping", { senderId, isTyping });
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

// Database Connection & Safe Port Binding
const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in your .env configuration file.");
    }
    
    // Establishing MongoDB Connection
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected Successfully');

    server.listen(INITIAL_PORT, () => {
      console.log(`🚀 SkillServe Backend safely running on port ${INITIAL_PORT}`);
    });

  } catch (error) {
    console.error(`❌ Initialization Error: ${error.message}`);
    process.exit(1);
  }
};

startServer();

// Graceful Shutdown Protocol for unhandled sigs
process.on('SIGINT', async () => {
  console.log('SIGINT received. Shutting down gracefully...');
  await mongoose.connection.close();
  server.close(() => {
    console.log('Process terminated.');
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await mongoose.connection.close();
  server.close(() => {
    console.log('Process terminated.');
    process.exit(0);
  });
});
