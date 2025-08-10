import { Request,Response,NextFunction } from "express";
import GlobalError from "../Errors/global_error";

export default async function checkDeviceId(req:Request,res:Response,next:NextFunction) {
    const deviceId = req.headers["x-device-id"];
    if (!deviceId || typeof deviceId!=="string" || deviceId.length==0){
        throw new GlobalError("Missing device Id","Invalid Header");
    }
    next();
}