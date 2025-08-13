import "./login.css";
import { useState } from "react";
import { login } from "../../services/auth_service";
import { useLoaderContext } from "../../context/loader_context";
import { useAuthContext } from "../../context/auth_context";
import { triggerToast } from "../../utils/toast";
import { useNavigate } from "react-router-dom";
export default function Login(){

    const navigate=useNavigate();
    const {setUser,setAuthChecked}=useAuthContext();
    const setLoading=useLoaderContext();
    
    const [formData,setFormData]=useState({
        email:"",
        password:"",
    });


    function handleChange(e:React.ChangeEvent<HTMLInputElement>){
        const {name,value}=e.target;
        setFormData((prev)=>({
            ...prev,
            [name]:value,
        }));
    }

    async function handleClick(e:React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        
        e.preventDefault();
        if (formData.email.length===0 ){
            triggerToast({msg:"Empty Email"});
            return ;
        }        
        if (formData.password.length===0){
            triggerToast({msg:"Empty Password"});
            return ;
        }
        setLoading(true);
        const res=await login(formData.email,formData.password);
        if (res){
            setUser(res);
            setAuthChecked(true);
            setFormData({
                email:"",
                password:"",
            });
            navigate("/home");
        }
        setLoading(false);
    }
    
    return <div className="login">
        <form className="login-form">
            <div className="login-heading login-middle">Sign In</div>
            <div></div>
            <input type="text" name="email" value={formData.email} placeholder="Email" onChange={handleChange}/>
            <input type="password" name="password" value={formData.password} placeholder="Password" onChange={handleChange}/>
            <button className="login-button" onClick={handleClick}>Login</button>
            <></>
            <></>
            <div className="login-middle">Don't have an Account yet?</div>
            <button className="register-button" onClick={(e)=>{
                e.preventDefault();
                navigate("/register");
            }}>Register</button>
        </form>
    </div>;
}