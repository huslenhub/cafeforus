import React, { useEffect, useRef, useState } from 'react';

interface MessageHistoryEntry {
  id: number;
  sender: string;
  receiver: string;
  content: string;
}

interface ChatWindowProps {
  activeUser: string;
  messageHistory: MessageHistoryEntry[];
  sendMessage: (message: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  activeUser,
  messageHistory,
  sendMessage,
}) => {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSend = () => {
    if (messageInput.trim() === '') return;
    sendMessage(messageInput.trim());
    setMessageInput('');
  };

  // ✅ 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageHistory]);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] w-full p-4">
      <h2 className="text-xl font-bold mb-4">채팅: {activeUser}</h2>

      {/* ✅ 메시지 영역: 스크롤 가능, 높이 자동 */}
      <div className="flex-1 overflow-y-auto mb-4 border rounded p-3 bg-white">
        {messageHistory.length === 0 ? (
          <p className="text-gray-400">메시지가 없습니다.</p>
        ) : (
          messageHistory.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 ${msg.sender === activeUser ? 'text-left' : 'text-right'}`}
            >
              <div className="inline-block bg-gray-200 p-2 rounded max-w-xs break-words">
                {msg.content}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ✅ 입력창: 항상 아래에 고정 */}
      <div className="flex">
        <input
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          className="flex-1 p-2 border rounded"
          placeholder="메시지를 입력하세요"
        />
        <button
          onClick={handleSend}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
