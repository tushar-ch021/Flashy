import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
import cookieParser from 'cookie-parser';
import http from 'http';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import postRouter from './routes/post.routes.js';
import momentRouter from './routes/moment.routes.js';
import storyRouter from './routes/story.routes.js';
import chatRouter from './routes/chat.routes.js';
import { initSocket } from './socket.js';

dotenv.config();

const app = express();

// Trust proxy when deployed behind a proxy (Render, etc.) so secure cookies & client IP work correctly
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// parse JSON bodies
app.use(express.json());
// parse cookies
app.use(cookieParser());

// CORS: allow your frontend origin (and localhost for local dev)
const allowedOrigins = [
  process.env.FRONTEND_URL,        // set this in Render / env (e.g. https://your-frontend-domain.com)
  'http://localhost:5173',        // Vite dev
  'http://localhost:3000'         // other dev ports if needed
].filter(Boolean); // remove undefined

if (process.env.NODE_ENV === 'production' && !process.env.FRONTEND_URL) {
  console.warn('Warning: FRONTEND_URL is not set in environment. CORS is in permissive mode only if ALLOW_ALL_ORIGINS is enabled.');
}

const corsOptions = {
  origin: function(origin, callback) {
    // log origin for easier debugging on Render logs
    console.log('CORS request origin:', origin);
    // allow requests with no origin (e.g. mobile apps, curl)
    if (!origin) return callback(null, true);

    // exact match from allowedOrigins
    if (allowedOrigins.length && allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }

    // opt-in quick fix: when ALLOW_ALL_ORIGINS=true the server will reflect the request origin
    // This is less strict — only enable temporarily when you can't set FRONTEND_URL in the host dashboard.
    if (process.env.ALLOW_ALL_ORIGINS === 'true') {
      return callback(null, true);
    }

    return callback(new Error('CORS policy: This origin is not allowed: ' + origin));
  },
  credentials: true,
};

app.use(cors(corsOptions));

// enable preflight for all routes using the same options
app.options('*', cors(corsOptions));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/post', postRouter);
app.use('/api/moment', momentRouter);
app.use('/api/story', storyRouter);
app.use('/api/chat', chatRouter);

// Basic error handler (return JSON instead of crashing the connection)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err?.message || err);
  if (err && err.message && err.message.startsWith('CORS policy')) {
    return res.status(403).json({ error: err.message });
  }
  res.status(err?.status || 500).json({ error: err?.message || 'Internal Server Error' });
});

// start server after DB connection
const port = process.env.PORT || 5000;

async function start() {
  try {
    await connectDb(); // wait for DB connection before listening
    const server = http.createServer(app);
    initSocket(server);

    server.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });

    // graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received — shutting down gracefully');
      server.close(() => process.exit(0));
    });
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
      process.exit(1);
    });
    process.on('unhandledRejection', (reason) => {
      console.error('Unhandled Rejection:', reason);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
