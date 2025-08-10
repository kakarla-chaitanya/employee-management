import axios from "axios";
import { triggerToast } from "../utils/toast";
import api from "./api";
import getOrCreateDeviceId from "../utils/device_id";

const defaultHeaders={
    "Content-Type":"application/json",
    "x-device-id":getOrCreateDeviceId(),
}

function _includeDefaultHeaders(headers:{}){
    return {...headers,...defaultHeaders};
}

async function get(path:string,{params={},headers={},handleError=true}={}){
    headers=_includeDefaultHeaders(headers);
    try{
        const res=await api.get(path,{
            headers:headers,
            params:params,
        });
        return res.data;    
    }catch(error){
        if(handleError){
            _handleError(error);
        }
    }
}

async function post(path:string,body:any,{params={},headers={}}={}){
    headers=_includeDefaultHeaders(headers);
    try{
        const res=await api.post(path,body,{
            headers:headers,
            params:params,
        });
        if (res.status==200){
            return res.data;
        }
    }
    catch(error){
        _handleError(error);
    }
}

async function put(path:string,body:any,{params={},headers={}}={}){
    headers=_includeDefaultHeaders(headers);
    try{
        const res= await api.put(path,body,{
            headers:headers,
            params:params,
        });
        if (res.status==200){
            return res.data;
        }
    }catch(error){
        _handleError(error);
    }
}

async function _delete(path:string,{data={},params={},headers={}}={}){
    headers=_includeDefaultHeaders(headers);
    try{
        const res=await api.delete(path,{
            headers:headers,
            params:params,
            data:{
                source:data,
            }
        });
        if (res.status==200){
            return res.data;
        }
    }catch(error){
        _handleError(error);
    }
}

function _handleError(error:any){
    if (axios.isAxiosError(error) && error.response) {
        console.log(error.response);
        if (typeof error.response.data==="string"){
            triggerToast({msg:error.response.data});
            return;
        }
        if (typeof error.response.data==="object"){
            if(!("name" in error.response.data) || !("message" in error.response.data)){
                triggerToast({msg:error.response.data.toString()});
                return ;
            }
            if (!("details" in error.response.data)){
                triggerToast({msg:`${error.response.data.name} :- ${error.response.data.message}`});
                return;
            }
            console.log(typeof error.response.data.details);
            if (typeof error.response.data.details==="object"){
                if ("errors" in error.response.data.details){
                    triggerToast({msg:error.response.data.details.errors[0].msg});
                    return;
                }
                triggerToast({msg:`${error.response.data.message} :- ${error.response.data.details.message}`});
                return;
            }
            triggerToast({msg:`${error.response.data.message} :- ${error.response.data.details}`});
            return ;
        }
        
    }
    
    triggerToast({msg:"Unexpected error"+" "+error.data.toString()});
    
}
export {get,post,put,_delete};