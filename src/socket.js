import { io } from "socket.io-client";

export const socket = io("http://localhost:4500");

console.log("🔥 socket.js chargé");
