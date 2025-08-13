import { Server } from "socket.io";
import cors from "cors";
import http from 'http';
import app from "./app";

const server=http.createServer(app);

const io=new Server(server,{
  cors: {
    origin: process.env.FRONTEND_URL, 
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection",(socket)=>{
    console.log("Connected to Socket successfully",socket.id);

    socket.on("disconnect",()=>{
        console.log("Disconnected to Socket",socket.id);
    });
});

export {io};
export default server;