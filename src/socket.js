import { io } from "socket.io-client";

const socket = io("https://inventory-system-server.onrender.com");

export default socket;
