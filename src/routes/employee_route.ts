import express from "express";
import asyncHandler from "../utils/async_handler";
import { addEmployee, deleteEmployee, getAllEmployees, updateEmployee } from "../controllers/employee_controller";
import { getOrSetCache } from "../utils/cache";
import validateToken from "../middleware/validate_token";
import IEmployeeSchema from "../models/employee/i_employee_schema";
import { io } from "../config/socket_io";

const router=express.Router();

router.use(validateToken);

router.get("/all-employees",asyncHandler(async (_req,res)=>{
    
    const allEmployees=await getOrSetCache<IEmployeeSchema[]>("employees",3600,async ()=>{
        return await getAllEmployees();
    });
    return res.status(200).json(allEmployees);
}));

router.post("/add-new-employee",asyncHandler(async (req,res)=>{
    const {name,email,department}=req.body;
    if (!name||!email||!department){
        throw new Error("Missing required fields {name,email,department}");
    }
    const newEmployee=await addEmployee(name,email,department);
    io.emit("message",`${req.user?.name} added a new employee named :- ${newEmployee.name}`);
    return res.status(200).send(newEmployee);
}));

router.put("/edit-employee/:id",asyncHandler(async(req,res)=>{
    const _id=req.params.id;
    if(!_id){
        throw new Error("Invalid url or id");
    }
    const {name,email,department}=req.body;
    if (!name||!email||!department){
        throw new Error("Missing required fields {name,email,department}");
    }
    const updEmployee=await updateEmployee(Number(_id),name,email,department);
    io.emit("message",`${req.user?.name} updated a employee named :- ${updEmployee.name}`);
    return res.status(200).send(updEmployee);
}));

router.delete("/delete-employee/:id",asyncHandler(async(req,res)=>{
    const _id=req.params.id;
    if(!_id){
        throw new Error("Invalid url or id");
    }
    const deletedEmployee=await deleteEmployee(Number(_id));
    io.emit("message",`${req.user?.name} deleted employee named :- ${deletedEmployee.name}`);
    return res.status(200).send("Deleted sucessfully");
}));

export default router;