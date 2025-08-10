import { Schema } from "mongoose";
import IEmployeeSchema from "./i_employee_schema";

const EmployeeSchema=new Schema<IEmployeeSchema>({
    _id:{
        type:Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    department:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
});

export default EmployeeSchema;