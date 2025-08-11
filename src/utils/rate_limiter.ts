import dotenv from "dotenv";
import redisClient from "../config/redis";
dotenv.config();
const windowSizeInSeconds=60;
const maxRequest=10;

export default async function isRateLimited(ip:string) {
    
    const key=`rate_limit:${ip}`;
    const now=Date.now();
    const windowStart=windowSizeInSeconds*1000; // to convert into milliseconds

    await redisClient.zadd(key,now,now.toString());

    await redisClient.zremrangebyscore(key,0,windowStart);

    const cnt=await redisClient.zcard(key);

    await redisClient.expire(key,windowSizeInSeconds);

    return cnt>maxRequest;
}