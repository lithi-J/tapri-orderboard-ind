import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import orderRoutes from './routes/orderRoutes';
import { createNotificationRouter } from './routes/notificationRoutes';

dotenv.config();

const app = express();
export { app };
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  }
});

const port = process.env.BACKEND_PORT || process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
// Normalize URLs (e.g. //api -> /api)
app.use((req, res, next) => {
  req.url = req.url.replace(/\/+/g, '/');
  next();
});


// Initialize Notification System first so it can be used by other services
const { router: notificationRouter, notificationService } = createNotificationRouter(io);

// Attach io and notificationService to request
app.use((req, res, next) => {
  (req as any).io = io;
  (req as any).notificationService = notificationService;
  next();
});

// API Routes
app.use('/api/orders', orderRoutes);
app.use('/api/notifications', notificationRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Socket connection
io.on('connection', (socket) => {
  console.log('[socket]: Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('[socket]: Client disconnected');
  });
});

import { migrate } from './db';

const startServer = async () => {
  try {
    await migrate();
    httpServer.listen(port, () => {
      console.log(`[server]: Tapri Backend is running on port ${port} ☕`);
    });
  } catch (err) {
    console.error('[server]: Failed to start server:', err);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  startServer();
}

export default app;
