import { createContext , useContext , useState , useEffect } from "react";
import { verifyMe } from "../services/auth_service";
import socket from "../socket";
import { useNavigate } from "react-router-dom";
import { setTriggerAuthError } from "../utils/auth_error";
import { useLoaderContext } from "./loader_context";
import { useMessageContext } from "./message_context";

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  authChecked:boolean;
  setAuthChecked:React.Dispatch<React.SetStateAction<boolean>>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const navigate=useNavigate();

    const {addNewmessage}=useMessageContext();
    const setLoading=useLoaderContext();
    const [user, setUser] = useState<User | null>(null);
    const [authChecked,setAuthChecked]=useState<boolean>(false);

    const [authError,setAuthError]=useState<boolean>(false);

    useEffect(() => {
      setTriggerAuthError(setAuthError);
    }, []);

    // for auth -error
    useEffect(()=>{
      if (authError){
        navigate("/login");
        setUser(null);
        setLoading(false);
        setAuthError(false)
      }
    },[authError]);

    //initial verify
    useEffect(() => {
        (async () => {
            setLoading(true);
            const res=await verifyMe();
            console.log("verfify",res);
            if(res){
                setUser(res);
            }else{
                setUser(null);
            }
            setLoading(false);
            setAuthChecked(true);
        })();
    }, []); 

    //for socket
    useEffect(()=>{
      if(authChecked){
        socket.connect();
        socket.on('connect', () => {
          console.log('Connected to socket:', socket.id);
        });
        socket.on("message",(msg)=>{
          addNewmessage(msg);
        });
      }else{
        socket.disconnect();
      }
      return ()=>{
        socket.disconnect();
      };
    },[authChecked]);

    return (
      <AuthContext.Provider value={{ user, setUser,authChecked,setAuthChecked}}>
        {children}
        {authError&&<div style={{width:"0px",height:"0px"}}></div>}
      </AuthContext.Provider>
    );
}
