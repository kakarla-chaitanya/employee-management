import dotenv from 'dotenv';
dotenv.config();

import "./config/db";
import "./config/redis";
import server from  "./config/socket_io";

const port=process.env.PORT;

if(!port){
    throw new Error("Invalid port number");
}

server.listen(port,()=>{
    console.log(`API running on port ${port}`);
})