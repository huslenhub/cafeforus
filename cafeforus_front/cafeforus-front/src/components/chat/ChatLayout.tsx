import React from "react";
import ChatWindow from "./ChatWindow";
import ContactsList from "./ContactList";

const ChatLayout = () => {
  return (
    <div className="flex h-screen mt-32">
      <ContactsList />
      <ChatWindow />
    </div>
  );
};

export default ChatLayout;
