import Logout from "../assets/svg/logout";
import { useAuthContext } from "../context/auth_context"
import { logout } from "../services/auth_service";
import { triggerToast } from "../utils/toast";
import dashboardImage from "../assets/dashboard-image.png";
import { useNavigate } from "react-router-dom";

export default function Header(props:{message:string,includeDashboard?:boolean}){
    const navigate=useNavigate();
    const {setUser,setAuthChecked}=useAuthContext();
    async function handleCLick(e:React.MouseEvent<HTMLButtonElement, MouseEvent>){
        e.preventDefault();
        const res=await logout();
        if (res){
            setUser(null);
            setAuthChecked(false);
            navigate("/login");
            triggerToast({msg:res,backgroundColor:"green"});
        }
    }
    return <div className="header">
        {props.message}
        <div>
            <button onClick={(e)=>{
                e.preventDefault();
                navigate("/dashboard");
            }}><img height={20} width={20} src={dashboardImage}/></button>
            <button onClick={handleCLick}><Logout /></button>
        </div>
    </div>
}