import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useChat } from "../hooks/useChat";
import { useSelector, useDispatch } from "react-redux";
import { clearUnreadFrom } from "../redux/notificationSlice";
import { serverUrl } from "../App";
import { FiSend } from "react-icons/fi";

const ChatBox = ({ targetUserId }) => {
  const { userData } = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chat = useChat(userData?._id);
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch chat history
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/chat/messages/${targetUserId}`,
          { withCredentials: true }
        );
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();

    // clear unread count for this conversation when opened
    if (targetUserId) {
      dispatch(clearUnreadFrom(targetUserId))
    }

    // Listen for new messages
    chat.onMessage((msg) => {
      const received = { sender: msg.from, message: msg.message || msg, createdAt: msg.createdAt || Date.now() }
      setMessages((prev) => [...prev, received]);
    });
  }, [targetUserId, userData?._id]);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim()) {
      chat.sendMessage(targetUserId, input);
      setMessages((prev) => [
        ...prev,
        { sender: userData._id, message: input, createdAt: Date.now() },
      ]);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-[100%] bg-gray-50  rounded-lg shadow-md">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Group messages by day and render a centered date header for each day */}
        {(() => {
          if (!messages || messages.length === 0) return <div className="text-center text-gray-400 mt-6">No messages yet.</div>
          // Group messages by YYYY-MM-DD
          const groups = messages.reduce((acc, m) => {
            const d = new Date(m.createdAt || Date.now())
            const key = d.toISOString().slice(0,10)
            if (!acc[key]) acc[key] = []
            acc[key].push(m)
            return acc
          }, {})

          const keys = Object.keys(groups).sort()

          return keys.map((k) => {
            const dayMsgs = groups[k]
            const readable = new Date(k).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
            return (
              <div key={k} className="mb-4">
                <div className="w-full flex items-center my-3">
                  <div className="flex-1 border-t border-gray-300" />
                  <div className="px-3 text-sm text-gray-500">{readable}</div>
                  <div className="flex-1 border-t border-gray-300" />
                </div>
                <div className="space-y-3 px-2">
                  {dayMsgs.map((m, i) => (
                    <div key={i} className={`flex ${m.sender === userData._id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl text-sm shadow ${m.sender === userData._id ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                        {m.message}
                        <div className="text-xs text-black mt-1 text-right">{new Date(m.createdAt || Date.now()).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })
        })()}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 p-3 border-t bg-white">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 rounded-full px-4 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={sendMessage}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
        >
          <FiSend size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
