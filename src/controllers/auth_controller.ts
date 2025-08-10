import GlobalError from "../Errors/global_error";
import User from "../models/user/user_model";
import {v5 as uuid} from "uuid";
import bcrypt from "bcrypt";
import { logoutSession } from "../utils/session_management";

export async function registerUser(name:string,email:string,password:string){
    let existingUser=await User.findOne({email});
    if (existingUser){
        throw new GlobalError("Existing Email","In-consistent Data");
    }
    let _id=uuid(email,uuid.URL);
    await User.create({
        _id,
        name,
        email,
        password,
    })
    return {_id,name,email};
}

export async function login(email:string,password:string){
    let existingUser=await User.findOne({email});
    if (!existingUser){
        throw new GlobalError("No user exists with this email","Authentication Error");
    }
    if (!await bcrypt.compare(password,existingUser.password)){
        throw new GlobalError("Invalid Password","Authentication Error",{messsage:"Password didn't match"});
    }
    return existingUser;
}

export async function logout(id:string,deviceId:string) {
    await logoutSession(id,deviceId);
}