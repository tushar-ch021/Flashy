import express from "express";
import { sendMessage, getMessages, getConversations } from "../controllers/chat.controllers.js";
import isAuth from "../middlewares/isAuth.js";
const router = express.Router();

router.post("/send", isAuth, sendMessage);
router.get("/messages/:userId", isAuth, getMessages);
router.get("/conversations", isAuth, getConversations);

export default router;
