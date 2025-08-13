let authError:React.Dispatch<React.SetStateAction<boolean>>|null=null;

export function setTriggerAuthError(setter:React.Dispatch<React.SetStateAction<boolean>>){
    // console.log("Setting auth Error");
    authError=setter;
}

export function triggerAuthError(){
    
    if (!authError){
        console.warn("Auth Error is not intialized");
        return;
    }
    // console.log("Calling trigger auth error");
    authError(true);
}