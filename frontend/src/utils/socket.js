// utils/socket.js
import { io } from "socket.io-client";

const socket = io("https://rapidaid-backend-hsn5.onrender.com", {
  transports: ['websocket'],  // Helps with connection stability
  autoConnect: true
});

export default socket;
