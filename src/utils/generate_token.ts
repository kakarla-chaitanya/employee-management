import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { createSession } from "./session_management";
import GlobalError from "../Errors/global_error";

dotenv.config();
const secretKey=process.env.JWT_SECRET_KEY as string;
const ttl=60*60;
const generateToken=async (id:string,deviceId:string)=>{
    if (!secretKey){
        throw new GlobalError("Empty JWT Secret key","Invalid JWT Format");
    }
    const jti=uuidv4(); 
    let token= jsonwebtoken.sign({
        id,
    },secretKey,{
        expiresIn:ttl,
        jwtid:jti,
    });
    await createSession(id,deviceId,jti,ttl);
    return token;
};

export default generateToken;