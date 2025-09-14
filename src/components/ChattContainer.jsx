import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { userAuthStore } from "../store/userAuthStore";
import toast from "react-hot-toast";
import { X } from "lucide-react";

function ChatContainer() {
  const {
    messages,
    selectedUser,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
    sendMessage,
  } = useChatStore();
  const { authUser, onlineUsers } = userAuthStore();
  const messageEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }
    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedUser) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file?.type.startsWith("image/"))
      return toast.error("Please select an image file");
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    await sendMessage({ text: text.trim(), image: imagePreview });
    setText("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-900 text-white relative">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 flex-shrink-0 flex items-center justify-between p-4 md:p-6 h-20 sticky top-16 z-20 relative">
        {/* User Info */}
        <div className="flex items-center gap-4">
          <img
            src={selectedUser.profilePic || "/avatar.png"}
            alt={selectedUser.fullName || "User"}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <h3 className="font-semibold text-lg text-white">
              {selectedUser.fullName}
            </h3>
            <p
              className={`text-sm ${
                onlineUsers.includes(selectedUser._id)
                  ? "text-green-400"
                  : "text-gray-400"
              }`}
            >
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => useChatStore.getState().setSelectedUser(null)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full hover:bg-gray-700 transition z-30"
          aria-label="Close chat"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-900">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${
              msg.senderId === authUser._id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-xl max-w-[70%] break-words ${
                msg.senderId === authUser._id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-100"
              }`}
            >
              {msg.image && (
                <img
                  src={msg.image}
                  alt=""
                  className="max-w-full rounded-md mb-2"
                />
              )}
              {msg.text && <p>{msg.text}</p>}
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 md:p-4 border-t border-gray-800 flex-shrink-0 flex flex-col gap-2 bg-gray-900">
        {imagePreview && (
          <div className="relative w-32 h-32 md:w-40 md:h-40">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg border border-gray-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-700 hover:bg-red-500 flex items-center justify-center text-white"
            >
              ✕
            </button>
          </div>
        )}
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            className="flex-1 rounded-lg px-3 py-2 bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
          >
            🖼️
          </button>
          <button
            type="submit"
            className={`px-3 py-2 rounded-lg ${
              text.trim() || imagePreview
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-700 cursor-not-allowed"
            }`}
            disabled={!text.trim() && !imagePreview}
          >
            ➤
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatContainer;
