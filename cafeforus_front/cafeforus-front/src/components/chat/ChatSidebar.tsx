import React, { useState } from 'react';

interface ChatHistoryEntry {
  username: string;
  lastMessage: string;
}

interface ChatSidebarProps {
  chatHistory: ChatHistoryEntry[];
  startChatWithUser: (username: string) => Promise<boolean>;
  setActiveUser: (username: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chatHistory,
  startChatWithUser,
  setActiveUser,
}) => {
  const [username, setUsername] = useState('');

  const handleStartChat = async () => {
    const trimmed = username.trim();
    if (!trimmed) return;

    const success = await startChatWithUser(trimmed);
    if (!success) {
      alert('유저가 존재하지 않습니다.');
    } else {
      setUsername('');
    }
  };

  const handleClickChat = (username: string) => {
    setActiveUser(username);
    startChatWithUser(username);
  };

  return (
<aside className="w-72 h-[calc(100vh-150px)] bg-white border-r border-gray-200 p-4 flex flex-col shadow-sm rounded-lg mt-4 ml-4">
<h2 className="text-xl font-bold mb-4">채팅 시작</h2>

      <div className="flex mb-4">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="유저 이름"
        />
        <button
          onClick={handleStartChat}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          채팅
        </button>
      </div>

      <h3 className="text-lg font-semibold mb-2">이전 채팅</h3>
      <ul className="space-y-2 overflow-y-auto">
        {chatHistory.length === 0 ? (
          <li className="text-sm text-gray-500">기록 없음</li>
        ) : (
          chatHistory.map((entry, idx) => (
            <li
              key={idx}
              onClick={() => handleClickChat(entry.username)}
              className="cursor-pointer px-3 py-2 bg-gray-50 rounded hover:bg-blue-100 border border-gray-200 transition-colors"
            >
              <div className="font-semibold text-gray-800">{entry.username}</div>
              <div className="text-sm text-gray-500 truncate">{entry.lastMessage}</div>
            </li>
          ))
        )}
      </ul>
    </aside>
  );
};

export default ChatSidebar;
