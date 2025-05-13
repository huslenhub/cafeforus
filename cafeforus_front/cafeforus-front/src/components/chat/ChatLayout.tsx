
//chatLayout
import React from 'react';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import { useChat } from './useChat';

const ChatLayout: React.FC = () => {
  const chat = useChat();

  return (
    <main className=" overflow-y-auto w-screen flex bg-gray-50">


      {/* 사이드바: 왼쪽 고정 너비 */}
      <ChatSidebar
        chatHistory={chat.chatHistory}
        startChatWithUser={chat.startChatWithUser}
        setActiveUser={chat.setActiveUser}
      />

       {/* 채팅창: 오른쪽 가변 영역 */}
       {chat.activeUser ? (
        <ChatWindow
          activeUser={chat.activeUser}
          messageHistory={chat.messageHistory}
          sendMessage={chat.sendMessage}
        />
      ) : (
        <div className="flex-1 flex justify-center items-center text-gray-500">
          <span>채팅할 유저를 선택하세요</span>
        </div>
      )}
    </main>
  );
};

export default ChatLayout;
