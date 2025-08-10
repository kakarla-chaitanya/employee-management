import Employee from "../models/employee/employee";
import IEmployeeSchema from "../models/employee/i_employee_schema";
import { deleteKey } from "../utils/cache";


async function getUid(){
    let result=await Employee.aggregate([
        {
            $group:{
                _id:null,
                maxId:{$max:"$_id"}
            }
        }
    ]);
    if (result.length===0){
        return 0;
    }
    return result[0].maxId+1;
}

async function checkExistingMail(email:string):Promise<boolean>{
    const existingEmployees=await Employee.aggregate([
        {$match:{email:email}},
    ]);
    if (existingEmployees.length>0){
        return true;
    }
    return false;
}

async function checkExistingMailWithOtherId(_id:number,email:string):Promise<boolean>{
    const existingEmployees=await Employee.aggregate([
        {$match:{
            email:email,
            _id:{$ne:_id},
        }},
    ]);
    if (existingEmployees.length>0){
        return true;
    }
    return false;
}

async function addEmployee(name:string,email:string,department:string):Promise<IEmployeeSchema>{
    if (await checkExistingMail(email)){
        throw new Error("Already existing email");
    }
    const _id=await getUid();
    await deleteKey("employees");
    return await Employee.create({
        _id,
        name,
        email,
        department,
    });
}

async function updateEmployee(_id:number,name:string,email:string,department:string):Promise<IEmployeeSchema>{
    if (await checkExistingMailWithOtherId(_id,email)){
        throw new Error("Already existing email");
    }
    let employee= await Employee.findOneAndReplace(
        {_id:_id},
        {
            _id,
            name,
            email,
            department,
        },
        {returnDocument:"after"},
    );
    if (!employee){
        throw new Error(`Invalid id:- ${_id}`);
    }
    await deleteKey("employees");
    return employee;
}
async function deleteEmployee(_id:number){
    let employee=await Employee.findOneAndDelete({_id:_id});
    if (!employee){
        throw new Error(`Invalid id:- ${_id}`);
    }
    await deleteKey("employees");
}

async function getAllEmployees():Promise<IEmployeeSchema[]>{
    let allEmployees=await Employee.find({});
    return allEmployees;
}

export {addEmployee,updateEmployee,deleteEmployee,getAllEmployees};