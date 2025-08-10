import { syncBuiltinESMExports } from "module";
import redisClient from "../config/redis";

export async function getOrSetCache<T>(
    key:string,
    ttl:number,
    fetch:()=>Promise<T>
) :Promise<T>{
    const cached=await redisClient.get(key);
    if (cached) return JSON.parse(cached);

    const newData=await fetch();
    await redisClient.set(key,JSON.stringify(newData),"EX",ttl);
    return newData;
}

export async function setCache<T>(key:string,value:T,ttl:number) {
    await redisClient.set(key,JSON.stringify(value),"EX",ttl);
}

export async function deleteKey(key:string) {
    await redisClient.del(key);
}