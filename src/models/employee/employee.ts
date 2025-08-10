import { model } from "mongoose";
import EmployeeSchema from "./employee_schema";

const Employee=model("employee",EmployeeSchema);

export default Employee;