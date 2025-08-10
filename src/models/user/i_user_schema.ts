import { Schema } from "mongoose"

export default interface IUserSchema extends Schema{
    _id:string,
    name:string,
    email:string,
    password:string,
}