import React, { useState } from "react";

const mockMessages = [
  { sender: "Lucian", type: "text", content: "He carefully crafted a beautiful sculpture...", timestamp: "1h ago" },
  { sender: "Lucian", type: "image", content: "/images/artwork.png", timestamp: "15m ago" },
  { sender: "You", type: "text", content: "The concert was a mesmerizing experience...", timestamp: "1m ago" },
  { sender: "You", type: "text", content: "The waves crashed against the shore...", timestamp: "Just now" },
];

const ChatWindow = () => {
  const [input, setInput] = useState("");

  return (
    <div className="flex-1 flex flex-col h-screen">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Lucian Obrien</h3>
        <p className="text-sm text-green-500">online</p>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {mockMessages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-md p-3 rounded-lg ${msg.sender === "You" ? "bg-green-100" : "bg-gray-100"}`}>
              {msg.type === "text" ? (
                <p>{msg.content}</p>
              ) : (
                <img src={msg.content} alt="chat-img" className="rounded-md w-full" />
              )}
              <p className="text-xs text-gray-500 mt-1 text-right">{msg.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          className="flex-1 border rounded-lg p-2"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
