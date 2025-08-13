import { useEffect, useState } from "react";
import type { Employee } from "../../../models/employee";
import { useLoaderContext } from "../../../context/loader_context";
import { addnewEmployee, editEmployee } from "../../../services/employee_service";

interface FormProps{
    setSource:React.Dispatch<React.SetStateAction<string>>,
    setData: React.Dispatch<React.SetStateAction<Employee[]>>,
    formRef: React.RefObject<HTMLDivElement | null>, 
    data: Employee[], 
    editIndex: number | null, 
    setEditIndex: React.Dispatch<React.SetStateAction<number | null>>,
}

export default function Form({ setSource,setData, formRef, data, editIndex, setEditIndex}:FormProps) {
   const setLoading=useLoaderContext();
   
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        department: '',
    });

    function handleChange(e:React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function closeForm(){
        if (formRef.current){
            formRef.current.style.visibility = 'hidden';
        }
        setFormData({ name: '', email: '', department: '' });
        setEditIndex(null);
        
    }

    useEffect(() => {
        if (editIndex !== null) {
            setFormData(data[editIndex]);
        }
    }, [editIndex]);

    return (
        <div
            ref={formRef}
            className={`form floating`}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (formRef.current){
                    formRef.current.style.visibility = 'hidden';
                }
                setEditIndex(null); // Reset edit mode on close
            }}
        >
            <div
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                className="form-content"
            >
                <input
                    type="text"
                    value={formData.name}
                    name="name"
                    placeholder="Name"
                    onChange={handleChange}
                />
                <input
                    type="email"
                    value={formData.email}
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                />
                <input
                    type="text"
                    value={formData.department}
                    name="department"
                    placeholder="Department"
                    onChange={handleChange}
                />
                <button
                    onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (
                            formData.name.trim() === "" ||
                            formData.email.trim() === "" ||
                            formData.department.trim() === ""
                        ) {
                            return;
                        }
                        setLoading(true);
                        if (editIndex !== null) {
                            // Update existing entry
                            const res=await editEmployee(data[editIndex]._id,formData);
                            if (res){
                                setData((prev) => {
                                    const updated = [...prev];
                                    updated[editIndex] = res;
                                    return updated;
                                });
                                setSource("Mongo DB");
                                closeForm();
                            }
                        } else {
                            // Add new entry
                            const res=await addnewEmployee(formData);
                            if (res){
                                setData((prev)=>[...prev, res]);
                                setSource("Mongo DB");
                                closeForm();
                            }
                        }
                        setLoading(false);
                    }}
                >
                    {editIndex !== null ? "Update" : "Submit"}
                </button>
            </div>
        </div>
    );
}
