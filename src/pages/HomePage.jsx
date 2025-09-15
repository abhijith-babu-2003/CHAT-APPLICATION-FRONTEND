import React, { useEffect, useState } from "react";

import { userAuthStore } from "../store/userAuthStore";
import ChatContainer from "../components/ChattContainer";
import NoChatSelected from "../components/NoChatSelected";
import { useChatStore } from "../store/useChatStore";


function HomePage() {
  const { getUsers, users, selectedUser, setSelectedUser, isUserLoading } = useChatStore();
  const { onlineUsers } = userAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  return (
    <div className="h-screen flex bg-gray-900 text-gray-100">
      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity md:hidden ${
          mobileSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed z-50 top-0 left-0 h-full border-r border-gray-700 flex flex-col bg-gray-900 transition-all
          ${mobileSidebarOpen ? "translate-x-0 w-72" : "-translate-x-full w-72"} 
          md:relative md:translate-x-0 md:w-${sidebarExpanded ? "72" : "20"} duration-200
        `}
      >
        {/* Sidebar Header */}
        <div
          className="border-b border-gray-700 p-5 flex items-center justify-between cursor-pointer"
          onClick={() => {
            if (window.innerWidth < 768) setMobileSidebarOpen(!mobileSidebarOpen);
            else setSidebarExpanded(!sidebarExpanded);
          }}
        >
          <span className={`text-lg font-bold ${sidebarExpanded ? "" : "hidden md:block"}`}>Contacts</span>
          <span className="text-gray-400 md:hidden">{mobileSidebarOpen ? "⏴" : "⏵"}</span>
        </div>

        {/* Users List */}
        <div className="overflow-y-auto flex-1 py-3 space-y-1">
          {isUserLoading && <div className="p-4 text-gray-400">Loading users...</div>}
          {filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => {
                setSelectedUser(user);
                if (window.innerWidth < 768) setMobileSidebarOpen(false);
              }}
              className={`flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-700 transition-colors
                ${selectedUser?._id === user._id ? "bg-gray-700 ring-1 ring-gray-500" : ""}`}
            >
              <div className="relative flex-shrink-0">
                <img src={user.profilePic || "/avatar.png"} alt={user.fullName} className="w-12 h-12 rounded-full object-cover" />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-gray-900" />
                )}
              </div>
              {sidebarExpanded && (
                <div className="flex flex-col min-w-0">
                  <div className="font-medium truncate">{user.fullName}</div>
                  <div className="text-sm text-gray-400">{onlineUsers.includes(user._id) ? "Online" : "Offline"}</div>
                </div>
              )}
            </button>
          ))}
          {filteredUsers.length === 0 && (
            <div className="text-center text-gray-400 py-4">{showOnlineOnly ? "No users online" : "No users found"}</div>
          )}
        </div>
      </aside>

      {/* Chat Area */}
      <main className={`flex-1 flex flex-col transition-all duration-200 ${sidebarExpanded ? "md:ml-72" : "md:ml-20"}`}>
        {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
        {!mobileSidebarOpen && (
          <button
            className="fixed bottom-5 left-5 z-50 md:hidden bg-gray-800 p-3 rounded-full shadow-lg"
            onClick={() => setMobileSidebarOpen(true)}
          >
            ☰
          </button>
        )}
      </main>
    </div>
  );
}

export default HomePage;
