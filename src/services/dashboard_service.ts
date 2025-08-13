import { get } from "./http_service";

export async function getDashboardDetails(){
    return await get("/dashboard/"); 
}