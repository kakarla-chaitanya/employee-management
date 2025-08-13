import "./register.css";
import { useState } from "react";
import { register } from "../../services/auth_service";
import { triggerToast } from "../../utils/toast";
import { useLoaderContext } from "../../context/loader_context";
import { useNavigate } from "react-router-dom";
export default function Register(){

    const navigate=useNavigate();

    const setLoading=useLoaderContext();
    const [formData,setFormData]=useState({
        name:"",
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
        if (formData.name.length===0){
            triggerToast({msg:"Empty Name"});
            return ;
        }
        if (formData.email.length===0 ){
            triggerToast({msg:"Empty Email"});
            return ;
        }        
        if (formData.password.length===0){
            triggerToast({msg:"Empty Password"});
            return ;
        }
        setLoading(true);
        const res=await register(formData.name,formData.email,formData.password);
        if (res){
            triggerToast({msg:"Account created successfully. Try to Login",backgroundColor:"green"});
            navigate("/login");
        }
        setLoading(false);
    }

    return <div className="register">
        <form className="register-form">
            <div className="register-heading register-middle">Sign Up</div>
            <div></div>
            <input type="text" name="name" value={formData.name} placeholder="Name" onChange={handleChange}/>
            <input type="text" name="email" value={formData.email} placeholder="Email" onChange={handleChange}/>
            <input type="password" name="password" value={formData.password} placeholder="Password" onChange={handleChange}/>
            <button className="register-button" onClick={handleClick}>Sign Up</button>
            <></>
            <></>
            <div className="register-middle">Already have an Account.</div>
            <button className="login-button" onClick={(e)=>{
                e.preventDefault();
                navigate("/login");
            }}>Login</button>
        </form>
    </div>;
}