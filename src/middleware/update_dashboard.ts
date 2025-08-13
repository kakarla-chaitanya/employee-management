import { Request, Response, NextFunction } from "express";
import redisClient from "../config/redis";
import GlobalError from "../Errors/global_error";

export default async function updateDashboard(req: Request, res: Response, next: NextFunction) {
    try {
        const method = req.method.toUpperCase();

        await redisClient.incr('apiRequest');

        switch (method) {
            case 'GET':
                await redisClient.incr('getRequests');
                break;
            case 'POST':
                await redisClient.incr('postRequests');
                break;
            case 'PUT':
                await redisClient.incr('putRequests');
                break;
            case 'PATCH':
                await redisClient.incr('patchRequests');
                break;
            case 'DELETE':
                await redisClient.incr('deleteRequests');
                break;
        }

        if (req.path.includes('/auth/login')) {
            await redisClient.incr('loginRequest');
        }
        next();
    } catch (err: any) {
        throw new GlobalError(err.message, "Reddis Error");
    }

}