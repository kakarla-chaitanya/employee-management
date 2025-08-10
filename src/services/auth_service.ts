import { get, post } from "./http_service";

export async function login(email:string,password:string){
    return await post("/auth/login",{
        email,
        password,
    });
}

export async function register(name:string,email:string,password:string) {
    return await post("/auth/register",{
        name,
        email,
        password
    });
}

export async function logout() {
    return await get("/auth/logout");
}

export async function verifyMe(){
    return await get("/api/me",{handleError:false});
}