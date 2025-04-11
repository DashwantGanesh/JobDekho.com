import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { USER_API_END_POINT } from "@/utils/constant.js";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Signup = () => {
   //use of usestate to update value timely
    const[input,setInput]=useState({
      fullname:"",
      email:"",
      phoneNumber:"",
      password:"",
      role:"",
      file:"",
    })

    const {loading,user}=useSelector(store=>store.auth);
    const dispatch=useDispatch();
    const navigate =useNavigate();
  
    //setting up the function which updates
    const changeEventHandler= (e) =>{
      setInput({
        ...input,
        [e.target.name]:e.target.value
      });
    }
  
    //file has different handler
    const changeFileHandler= (e)=>{
      setInput({
        ...input,
        file:e.target.files?.[0]   // used to safely access the first selected file from the input. ?. (Optional Chaining) → Ensures that files is defined before trying to access [0], preventing errors if no file is selected.
      })
    }

    const submitHandler=async (e)=>{
      e.preventDefault();
      try {
        dispatch(setLoading(true));
        const formData= new FormData();  //creates a FormData object, which is used to construct and send key-value pairs,used when file uploads
        formData.append("fullname",input.fullname);
        formData.append("email",input.email);
        formData.append("phoneNumber",input.phoneNumber);
        formData.append("password",input.password);
        formData.append("role",input.role);
        if(input.file){
          formData.append("file",input.file)
        }
        const res= await axios.post(`${USER_API_END_POINT}/register`, formData,{
          headers:{
            "Content-type":"multipart/form-data"                        //This tells the server that the request contains form data.
            
          },
          withCredentials:true,                 //used when making HTTP requests that require cookies, authentication tokens, or cross-origin requests with credentials.

        })    //Api call & have to send data in form data
        //to show toaster 
        if(res.data.success) {
          navigate("/login");
          toast.success(res.data.message);
        } 

      } catch (error) {
        console.log(error);
      toast.error(error.response.data.message);

      }finally{
        dispatch(setLoading(false));

      }
    }
      useEffect(()=>{
        if(user){
          navigate("/")
        }
      },[])
  
  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          action=""
          onSubmit={submitHandler}
          className="w-1/2 border border-gray-200 rounded-md p-4 my-10"
        >
          <h1 className="font-bold text-xl mb-5">Sign Up</h1>
          <div className="my-2">
            <Label>Full Name</Label>
            <Input type="text" value={input.fullname} name="fullname" onChange={changeEventHandler} placeholder="name" className="my-2" />
          </div>
          <div className="my-2">
            <Label>Email</Label>
            <Input type="email" value={input.email} name="email" onChange={changeEventHandler} placeholder="email" className="my-2" />
          </div>
          <div className="my-2">
            <Label>Phone Number</Label>
            <Input type="tel" value={input.phoneNumber} name="phoneNumber" onChange={changeEventHandler} placeholder="phoneno" className="my-2" />
          </div>
          <div className="my-2">
            <Label>Password</Label>
            <Input type="password" value={input.password} name="password" onChange={changeEventHandler} placeholder="password" className="my-2" />
          </div>

          <div className="flex items-center justify-between ">
            <RadioGroup className='flex items-center gap-4 my-5 '>
              <div className="flex items-center space-x-2 ">
                <Input type="radio" name='role' value="student" checked={input.role==="student"} onChange={changeEventHandler} className="cursor-pointer" />
                <Label htmlFor="r1">Student</Label>
              </div>
              <div className="flex items-center space-x-2 ">
              <Input type="radio" name='role' value="recruiter" checked={input.role==="recruiter"} onChange={changeEventHandler} className="cursor-pointer" />
                <Label htmlFor="r2">Recruiter</Label>
              </div>
            </RadioGroup>
            <div className="flex items-center gap-2">
              <Label>Profile</Label>
               <Input accept="image/*" type='file' onChange={changeFileHandler} className="cursor-pointer" />  {/*here the type name should same as name given in multer middlewar */}
            </div>
          </div>
          {
            loading ? <Button className="w-full my-4"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Please Wait </Button> :<Button value="submit" className="w-full cursor-pointer mb-2">SignUp</Button>
          }
          <span className="text-sm ">Already have an account?<Link to="/login" className="text-blue-600">Login</Link></span>
        </form>
      </div>
    </div>
  );
};

export default Signup;
