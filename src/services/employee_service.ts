import { _delete, get, post, put } from "./http_service";

export async function getAllEmployees() {
    return await get("/employee/all-employees");
}

export async function addnewEmployee(newEmployee:{
    name: string;
    email: string;
    department: string;
}){
    return await post("/employee/add-new-employee",newEmployee);
}

export async function editEmployee(id:number,employee:{
    name:string;
    email:string;
    department:string;
}) {
    return await put(`/employee/edit-employee/${id}`,employee);
}

export async function deleteEmployee(id:number) {
    return await _delete(`/employee/delete-employee/${id}`);
}