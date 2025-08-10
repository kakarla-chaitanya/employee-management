import { Schema } from "mongoose";

export default interface IEmployeeSchema extends Schema{
    _id:number;
    name:string,
    department:string,
    email:string,
}