import { NextFunction,Request,Response } from "express";
import isRateLimited from "../utils/rate_limiter";
import GlobalError from "../Errors/global_error";

export function extractIp(req: Request): string {
  const xff = req.headers["x-forwarded-for"];

  if (typeof xff === "string") {
    return xff.split(",")[0].trim();
  } else if (Array.isArray(xff)) {
    return xff[0];
  } else if (typeof req.ip === "string") {
    return req.ip;
  } else if (typeof req.socket?.remoteAddress === "string") {
    return req.socket.remoteAddress;
  } else {
    return "unknown";
  }
}

export default async function rateLimiterMiddleware(req:Request,res:Response,next:NextFunction) {
    try{
        const ip=extractIp(req);
        console.log(ip);
        if (await isRateLimited(ip)){
            throw new GlobalError(
                "Rate Limit Exceeded",
                "Authorization Error",
                "You have exceeded your request limit. Please try again later."
            );     
        }
        next();
    }catch(err){
        throw err;
    }
}