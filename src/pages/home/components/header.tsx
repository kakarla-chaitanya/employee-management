import { useNavigate } from "react-router-dom";
import Logout from "../../../assets/svg/logout";
import { useAuthContext } from "../../../context/auth_context"
import { logout } from "../../../services/auth_service";
import { triggerToast } from "../../../utils/toast";

export default function Header(){
    const {user,setUser}=useAuthContext();
    const navigate=useNavigate();
    async function handleCLick(e:React.MouseEvent<HTMLButtonElement, MouseEvent>){
        e.preventDefault();
        const res=await logout();
        if (res){
            console.log("logged out success fully");
            setUser(null);
            navigate("/login");
            triggerToast({msg:res,backgroundColor:"green"});
        }
    }
    return <div className="header">
        Welcome! {user?.name}
        <button onClick={handleCLick}><Logout /></button>
    </div>
}