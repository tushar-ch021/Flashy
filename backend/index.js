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
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
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
  console.log(`Server is running on http://localhost:${port}`)
})
// tushar245101