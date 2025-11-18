# Flashy

A full-stack social media application (prototype) with features inspired by modern social apps: posts, comments, likes, saves, stories, short-form reels (moments), direct messages, real-time notifications, and a simple search. This repository contains two main parts:

- `backend/` — Node.js + Express API, MongoDB (Mongoose), Cloudinary for media, Socket.io for realtime events.
- `frontend/flashy` — React + Vite frontend using Redux Toolkit and Tailwind CSS.

This README documents project functionality, technologies used, how to run the project, key endpoints, socket messages, and developer notes.

---

## Contents / High-level features

- User authentication and profile (signup/signin, edit profile).
- Posts: image/video posts with caption, likes, comments, save/bookmark, author-only delete.
- Moments: short video reels with autoplay, mute/unmute controls, save/unsave, likes, comments.
- Stories: ephemeral images shown in a full-screen viewer with a 25s auto-close timer and top progress bar.
- Feed: scrollable feed showing posts and moments.
- Post viewer (modal): open a post full-screen with navigation between posts.
- Comments UI: newest-first ordering, clickable avatars/names to go to profiles.
- Direct messages (chat): socket-based messaging and unread counts.
- Notifications: real-time via Socket.io (likes, comments, follows, etc.).
- Search: simple user search (client-side filtering of suggested users).
- Share: UI to send a post link to your followings (via sockets).

---

## Technologies

Frontend
- React (functional components & hooks)
- Vite (dev tooling)
- Redux Toolkit (state management)
- Tailwind CSS (styling)
- axios (HTTP)
- socket.io-client (real-time)
- react-icons & lucide-react (icons)

Backend
- Node.js + Express
- MongoDB with Mongoose
- Socket.io (real-time server)
- Cloudinary (media uploads)
- multer (multipart form handling)

Utilities
- nodemon (dev server)
- dotenv (env vars)

---

## Repository structure (important files)

- backend/
  - index.js — server entry (express + socket setup)
  - controllers/ — REST controllers (auth, posts, moments, stories, chat, user)
  - routes/ — route registration
  - models/ — Mongoose schemas (User, Post, Moment, Story, Message)
  - config/cloudinary.js — media upload helper
  - socket.js — central socket.io/helper to get server IO

- frontend/flashy/
  - src/
    - App.jsx — client routes and initial data fetch hooks
    - components/ — shared components (StoryViewer, StoryCard, PostCard, ChatBox, ShareModal, SocketListener, etc.)
    - pages/ — page screens (Home, Profile, Messages, Search, ScrollPosts modal)
    - redux/ — slices: user, post, moment, story, notification
    - hooks/ — custom hooks (GetCurrentUser, useChat, etc.)
    - contexts/ — MuteContext for global mute state
    - utils/ — small helpers (time format, media queries)

---

## Required environment variables

Create a `.env` file in `backend/` with at least:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
PORT=8000
```

Frontend has `serverUrl` in `src/App.jsx` (default `http://localhost:8000`). If you run the backend on another host/port, update that constant or provide a mechanism to override it.

---

## Run locally (development)

Backend (API + sockets)
```powershell
cd backend
npm install
npm run dev
```
- `npm run dev` typically runs with `nodemon`. If you see EADDRINUSE on port 8000, either stop the process using that port or change `PORT` in `.env`.

Frontend (client)
```powershell
cd frontend/flashy
npm install
npm run dev
```
- Vite starts the frontend dev server (hot reload). Open the app in your browser (default printed by Vite, usually `http://localhost:5173`).

---

## Important API endpoints (summary)

Auth
- `POST /api/auth/signup` — register
- `POST /api/auth/signin` — login
- `GET /api/auth/signout` — logout

User
- `GET /api/user/current` — current authenticated user (populated data)
- `GET /api/user/getProfile/:userName` — public profile data
- `GET /api/user/suggested` — suggested users (used by Search page)
- `GET /api/user/followers` — followers of current user
- Follow/unfollow: `GET /api/user/follow/:targetUserId`

Posts
- `POST /api/post/upload` — upload post (image/video)
- `GET /api/post/getAll` — get all posts
- `GET /api/post/like/:postId` — toggle like
- `POST /api/post/comment/:postId` — add comment
- `POST /api/post/saved/post/:postId` — toggle save for post
- `DELETE /api/post/delete/:postId` — delete post (author only)

Moments (reels)
- `POST /api/moment/upload` — upload a moment
- `GET /api/moment/getAll` — get all moments
- `GET /api/moment/like/:momentId` — toggle moment like
- `POST /api/moment/comment` — comment on moment
- `POST /api/post/saved/moment/:momentId` — toggle save for moment
- `DELETE /api/moment/delete/:momentId` — delete moment (author only)

Stories
- `POST /api/story/upload` — upload story (image)
- `GET /api/story/getByUserName/:userName` — get user stories
- `GET /api/story/view/:storyId` — view story (server update of viewers) — implementation details may vary

Chat
- `POST /api/chat/create` — create conversation (depending on implementation)
- `GET /api/chat/messages/:userId` — fetch chat history between authenticated user and userId

Notes: check `backend/routes` for the exact endpoints in your copy — some endpoints may be added or changed during development.

---

## Socket events (client <-> server)

- Client emits `join` with userId (socket joins room for userId).
- Client emits `sendMessage` with { to, message, from }.
- Server emits `receiveMessage` to recipient(s) for delivered messages.
- Server emits `notification` with payloads like { type, text, from, at, postId } for likes/comments/follows.

The frontend mounts a global `SocketListener` to handle incoming notifications and message events and to update Redux state.

---

## Developer notes and patterns

- Mute state for moments is handled client-side by a `MuteContext` available across components. The server does not persist mute preferences by default.
- Story seen/unseen state is stored in `localStorage` (key: `seenStories`) for quick UX; server-side view persistence is available via story controllers, but the UI uses local storage for immediate responsiveness.
- Time formatting: `src/components/time.js` provides `getRelativeTime(date, short = true)` for short and long formats.
- Share flow: the `ShareModal` sends post links via sockets to selected followings. This is a fast client-side push; implement server persistence if you want to track shares.

---

## Troubleshooting

- Backend crashes on start with `ReferenceError: ... is not defined`: open the stack trace, it usually points to a missing import or exported symbol in a `routes` file. Fix by ensuring controllers exported/imported names match.
- `EADDRINUSE: address already in use :::8000` — either stop the process using that port or set `PORT` in `.env`.
- Frontend shows build errors after edits: a syntax error or corrupted JSX file is the most common cause; check the file modified most recently.

---

## Testing & Code Quality

- No formal tests included. You can add Jest/React Testing Library for frontend and Jest/Supertest for backend endpoints.
- Keep ESLint/Prettier in sync with the project style for consistent formatting.

---

## Next improvements (ideas)

- Server-side search endpoint with pagination (recommended for production-scale user base).
- Persist story views server-side and show seen-state across devices.
- Add push notification support and background job processing for heavy notifications.
- Implement end-to-end tests for critical flows (auth, posting, messaging).

---


