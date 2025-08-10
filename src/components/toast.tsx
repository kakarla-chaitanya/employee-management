interface ToastProps{
    message:string,
    color?:string,
    backgroundColor?:string,
}
export default function Toast({message,color,backgroundColor}:ToastProps){
    return <div className="toast" style={{backgroundColor:backgroundColor,color:color}}>
        {message}
    </div>;
}