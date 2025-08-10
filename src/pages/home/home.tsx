import "./home.css";

import { useEffect, useRef, useState } from 'react';
import Header from './components/header';
import Footer from './components/footer';
import Content from './components/content';
import Form from './components/form'
import type { Employee } from '../.././models/employee';
import { useLoaderContext } from "../../context/loader_context";
import { deleteEmployee, getAllEmployees } from "../../services/employee_service";
        

export default function Home(){

  const setLoading=useLoaderContext();
  
  const formRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<Employee[]>([]);
  const [editIndex, setEditIndex] = useState<number|null>(null);// NEW
  

  

  useEffect(()=>{
    setLoading(true);
    if (formRef.current) {
      formRef.current.style.visibility = 'hidden';
    }
    (async () => {
      const allEmployees=await getAllEmployees();
      // console.log(allEmployees);
      if (allEmployees){
        setData(allEmployees);
      }
      setLoading(false);
    })();
    
  },[]);

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
      }
      setLoading(false);
  };

  return (
    <div className='home'>
      <Header />
      <Content data={data} onEdit={handleEdit} onDelete={handleDelete} />
      <Footer formRef={formRef} />
      <Form 
        setData={setData} 
        formRef={formRef} 
        data={data} 
        editIndex={editIndex} 
        setEditIndex={setEditIndex}
      />
    </div>
  );
}