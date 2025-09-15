// stores/userAuthStore.js
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5001";

export const userAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,  
  isUpdateingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      toast.success("Account created successfully");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },
  
  login: async (data) => {
    set({ isLoggingIn: true });  
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });  
    }
  },
  
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  
  updateProfile: async (data) => {
    set({ isUpdateingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdateingProfile: false });
    }
  },
  
  connectSocket: () => {
    const { authUser, socket } = get();
    
    if (!authUser || socket?.connected) {
      console.log("🚫 Socket connection skipped:", { 
        hasUser: !!authUser, 
        isConnected: socket?.connected 
      });
      return;
    }

    console.log("🔗 Connecting socket for user:", authUser._id);
    console.log("🌐 Connecting to:", SOCKET_URL);

    const newSocket = io(SOCKET_URL, {
      query: {
        userId: authUser._id,
      },
      transports: ['websocket', 'polling'],
      timeout: 5000,
      forceNew: true 
    });

  
    newSocket.on('connect', () => {
      console.log("✅ Socket connected successfully:", newSocket.id);
      set({ socket: newSocket });
    });

 
    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      console.error('Error message:', error.message);
      console.error('Error type:', error.type);
    });


    newSocket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });


    newSocket.on("getOnlineUsers", (userIds) => {
      console.log("👥 Online users received:", userIds);
      set({ onlineUsers: userIds });
    });


    newSocket.on("newMessage", (message) => {
      console.log("💬 New message received:", message);
   
    });

 
    newSocket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 Reconnection attempt ${attemptNumber}`);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log(`✅ Reconnected after ${attemptNumber} attempts`);
    });
  },
  
  disconnectSocket: () => {
    const { socket } = get();
    if (socket?.connected) {
      console.log("❌ Disconnecting socket");
      socket.disconnect();
      set({ socket: null });
    }
  }
}));