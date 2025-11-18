import { Server } from "socket.io";

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // Client will join a room with their userId to receive direct events
    socket.on("join", (userId) => {
      if (userId) socket.join(userId.toString());
    });

    // Realtime messaging via sockets (in addition to REST fallback)
    socket.on("sendMessage", async ({ to, message, from }) => {
      if (!to || !message || !from) return;
      // deliver to receiver room
      io.to(to.toString()).emit("receiveMessage", { message, from });
      // optional notification payload for inbox UIs
      io.to(to.toString()).emit("notification", {
        type: "message",
        text: "New message",
        from,
        at: Date.now(),
      });
      // Persist message
      try {
        const { default: Message } = await import("./models/message.model.js");
        await Message.create({ sender: from, receiver: to, message });
      } catch (err) {
        console.error("Socket message DB error:", err.message);
      }
    });

    // Generic notify event (optional usage from client)
    socket.on("notify", ({ to, notification }) => {
      if (!to || !notification) return;
      io.to(to.toString()).emit("notification", notification);
    });
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}
