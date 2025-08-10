import { createContext, useContext, useState } from "react";
import Loader from "../components/loader";

type LoaderContextType = React.Dispatch<React.SetStateAction<boolean>>;
const LoaderContext=createContext<LoaderContextType|null>(null);

export function useLoaderContext(){
    const context=useContext(LoaderContext);
    if (!context){
        throw new Error("useLoaderContext must be used within a LoaderProvider");
    }
    return context;
}

export function LoaderProvider({children}:{children:React.ReactNode}){
    const [loading,setLoading]=useState<boolean>(false);
    return (
        <LoaderContext.Provider value={setLoading}>
            {children}
            {loading &&<Loader />}
        </LoaderContext.Provider>
    );
}