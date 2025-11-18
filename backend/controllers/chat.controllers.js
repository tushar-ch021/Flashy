
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { getIO } from "../socket.js";
import mongoose from "mongoose";

// Send a message (save to DB) and emit realtime
export const sendMessage = async (req, res) => {
  try {
    const { to, message } = req.body;
    const from = req.userId;
    const newMessage = await Message.create({ sender: from, receiver: to, message });

    try {
      const io = getIO();
      io.to(to.toString()).emit("receiveMessage", { message, from });
      io.to(to.toString()).emit("notification", {
        type: "message",
        text: "New message",
        from,
        at: Date.now(),
      });
    } catch {}

    res.status(200).json({ success: true, message: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all messages between two users
export const getMessages = async (req, res) => {
  try {
    const userId = req.userId;
    const otherUserId = req.params.userId;
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId }
      ]
    }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get conversation list (users who have messaged with current user) with last message
export const getConversations = async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId(req.userId);
    const conversations = await Message.aggregate([
      { $match: { $or: [{ sender: userId }, { receiver: userId }] } },
      { $project: {
          sender: 1,
          receiver: 1,
          message: 1,
          createdAt: 1,
          other: { $cond: [{ $eq: ["$sender", userId] }, "$receiver", "$sender"] }
        }
      },
      { $sort: { createdAt: -1 } },
      { $group: {
          _id: "$other",
          lastMessage: { $first: "$message" },
          at: { $first: "$createdAt" },
          lastSender: { $first: "$sender" }
        }
      },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
      { $unwind: "$user" },
      { $project: {
          _id: 0,
          user: { _id: "$user._id", userName: "$user.userName", profileImage: "$user.profileImage" },
          lastMessage: 1,
          at: 1,
          lastSender: 1
        }
      },
      { $sort: { at: -1 } }
    ]);

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
