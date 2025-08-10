import { Request,Response,NextFunction } from "express";
import GlobalError from "../Errors/global_error";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user/user_model";
import { verifySession } from "../utils/session_management";

dotenv.config();

export default async function validateToken(req:Request,_res:Response,next:NextFunction){
    try{
        const token=req.cookies.token;
        
        if (!token) {
          throw new GlobalError("Missing token", "Authorization Error", {
            message: "No Authorization header provided"
          });
        }

        const secretKey=process.env.JWT_SECRET_KEY as string;
        if (!secretKey){
            throw new GlobalError("No Secert Key provided","JWT Token error");
        }
        const decoded=jwt.verify(token,secretKey);
        if (typeof decoded === "string" || !("id" in decoded) || !("jti" in decoded) || typeof decoded.jti!=="string" || typeof decoded.id!=="string") {
          throw new GlobalError("Invalid token payload", "Authorization Error", {
            message: "Expected JWT payload object with an id and jti"
          });
        }


        // check if user is consistent with db
        const user=await User.findOne({_id:decoded.id});
        if (!user){
          throw new GlobalError("User not found", "Authorization Error", {
            message: "User does not exist in the database"
          });
        }

        
        //session verification
        const valid = await verifySession(decoded.id, decoded.jti);
        if (!valid) {
          throw new GlobalError("Session Expired", "Authorization Error", "Session expired, please login again.");
        }
        req.user={
            _id:decoded.id,
            jti:decoded.jti,
            name:user.name,
            email:user.email,
        };
        next();
    }catch(error:any){
      if (error.name === 'TokenExpiredError') {
        throw new GlobalError("Token expired", "Authorization Error", {
          message: "JWT has expired"
        });
      }
    
      if (error.name === 'JsonWebTokenError') {
        throw new GlobalError("Invalid token", "Authorization Error", {
          message: error.message
        });
      }
      throw error;
    }
}