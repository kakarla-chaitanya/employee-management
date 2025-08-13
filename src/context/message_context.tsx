import { createContext, useContext, useState } from "react";

interface MessageContextType{
    addNewmessage:(newMessage:string)=>void,
}
const MessageContext=createContext<MessageContextType|undefined>(undefined);

export function useMessageContext(){
    const context=useContext(MessageContext);
    if (!context){
        throw new Error("useMessageContext must be used within an MessageProvider")
    }
    return context;
}

export function MessageProvider({children}:{ children: React.ReactNode }){
    
    const [messages,setMessages]=useState<string[]>([]);
    function addNewmessage(newMessage:string){
      setMessages((prev)=>([...prev,newMessage]));
      setTimeout(() => {
        setMessages((prev) => prev.slice(1));
      }, 4000);
    }
    return (<MessageContext.Provider value={{addNewmessage}}>
        {children}
        <div className="message-container">
          {messages.map((msg,id) => (
            <div key={id} className="message-popup">
              {msg}
            </div>
          ))}
        </div>
    </MessageContext.Provider>);
}