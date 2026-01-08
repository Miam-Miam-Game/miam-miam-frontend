import { io } from "socket.io-client";

//export const socket = io("http://localhost:4500");

const API_URL = import.meta.env.VITE_API_URL; 
export const socket = io(API_URL, { transports: ["websocket"], });

console.log("🔥 socket.js chargé");
