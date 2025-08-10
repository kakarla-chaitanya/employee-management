import { createContext , useContext , useState , useEffect } from "react";
import { verifyMe } from "../services/auth_service";

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  authChecked:boolean;
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

    const [user, setUser] = useState<User | null>(null);
    const [authChecked,setAuthChecked]=useState<boolean>(false);

    useEffect(() => {
        (async () => {
            const res=await verifyMe();
            console.log("verfify",res);
            if(res){
                setUser(res);
            }else{
                setUser(null);
            }
            setAuthChecked(true);
        })();
    }, []); 
    return (
      <AuthContext.Provider value={{ user, setUser,authChecked}}>
        {children}
      </AuthContext.Provider>
    );
}
