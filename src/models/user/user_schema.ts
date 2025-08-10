import { Schema } from "mongoose";
import IUserSchema from "./i_user_schema";

const UserSchema=new Schema<IUserSchema>({
    _id:{type:String},
    name:{type:String,required:true,trim:true},
    email:{type:String,required:true,trim:true,unique:true},
    password:{type:String,required:true,minlength:8},
},{timestamps:true});

export default UserSchema;