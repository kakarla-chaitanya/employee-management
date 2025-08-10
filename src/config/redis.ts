import Redis from "ioredis";
import dotenv from "dotenv";
import GlobalError from "../Errors/global_error";

dotenv.config();

const redisurl=process.env.REDIS_URL;
if (!redisurl){
    throw new GlobalError("Invalid Redis URL","Redis Error");
}
const redisClient=new Redis(redisurl);
console.log("Connected to redis");
export default redisClient;