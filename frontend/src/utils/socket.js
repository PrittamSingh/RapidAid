// utils/socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:8003", {
  transports: ['websocket'],  // Helps with connection stability
  autoConnect: true
});

export default socket;
