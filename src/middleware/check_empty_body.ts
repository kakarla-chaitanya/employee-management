import { NextFunction,Request,Response } from "express";
import GlobalError from "../Errors/global_error";

export default function checkEmptyBody(req:Request,res:Response,next:NextFunction){
    if (!req.body || Object.keys(req.body).length==0){
        throw new GlobalError("Empty request Body","Invalid Request",req.body);
    }
    next();
}