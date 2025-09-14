import React from "react";

function NoChatSelected() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-16 bg-gray-900 text-gray-100">
      <div className="max-w-md text-center space-y-6">
        <div className="w-16 h-16 mx-auto bg-blue-800 flex items-center justify-center rounded-2xl animate-bounce">
          <span className="text-3xl">💬</span>
        </div>
        <h2 className="text-2xl font-bold">Welcome to Chatty!</h2>
        <p className="text-gray-400">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
}

export default NoChatSelected;
