import "./home.css";

import { useEffect, useRef, useState } from 'react';
import Header from '../../components/header';
import Footer from './components/footer';
import Content from './components/content';
import Form from './components/form'
import type { Employee } from '../.././models/employee';
import { useLoaderContext } from "../../context/loader_context";
import { deleteEmployee, getAllEmployees } from "../../services/employee_service";
import { useAuthContext } from "../../context/auth_context";
        

export default function Home(){

  const setLoading=useLoaderContext();
  const {user,authChecked}=useAuthContext();
  
  const formRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<Employee[]>([]);
  const [source,setSource]=useState<string>("");
  const [editIndex, setEditIndex] = useState<number|null>(null);// NEW  

  

  useEffect(()=>{
    if(authChecked){
      setLoading(true);
      if (formRef.current) {
        formRef.current.style.visibility = 'hidden';
      }
      (async () => {
        const allEmployees=await getAllEmployees();
        if (allEmployees){
          // console.log(allEmployees);
          setData(allEmployees.employees);
          setSource(allEmployees.source);
        }
        setLoading(false);
      })();
    }  
  },[authChecked]);

  const handleEdit = (index:number) => {
    setEditIndex(index);
    if (formRef.current){
      formRef.current.style.visibility = 'visible';
    }
  };

  const handleDelete = async(index:number) => {
    setLoading(true);
    const res=await deleteEmployee(data[index]._id);
    if (res){
      setData((prev)=>prev.filter((_x,id)=>id!==index));
      setSource("Mongo DB");
    }
    setLoading(false);
  };

  return (
    <div className='home'>
      <Header message={`Welcome ${user?.name}!`}/>
      <Content source={source} data={data} onEdit={handleEdit} onDelete={handleDelete} />
      <Footer formRef={formRef} />
      <Form 
        setSource={setSource}
        setData={setData} 
        formRef={formRef} 
        data={data} 
        editIndex={editIndex} 
        setEditIndex={setEditIndex}
      />
    </div>
  );
}