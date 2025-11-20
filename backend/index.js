import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDb from './config/db.js'
import cookieParser from 'cookie-parser'
import http from 'http'
import authRouter from './routes/auth.routes.js'
import userRouter from './routes/user.routes.js'
import postRouter from './routes/post.routes.js'
import momentRouter from './routes/moment.routes.js'
import storyRouter from './routes/story.routes.js'
import chatRouter from './routes/chat.routes.js'
import { initSocket } from './socket.js'

dotenv.config()
const app = express()
const port = process.env.PORT || 5000

// Allowed origins: local dev + optional FRONTEND_URL from environment
const allowedOrigins = [
  'http://localhost:5173',        // your vite dev
  'http://localhost:3000'         // optional (if you use CRA)
];

// if FRONTEND_URL is set in env, add it
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // otherwise block it
    return callback(new Error(`CORS policy: Origin ${origin} not allowed`));
  },
  credentials: true,
}));

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/post', postRouter)
app.use('/api/moment', momentRouter)
app.use('/api/story', storyRouter)
app.use('/api/chat', chatRouter)

const server = http.createServer(app)
initSocket(server)

server.listen(port, () => {
  connectDb()
  console.log(`Server is running on port ${port}`)
})
