import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { USER_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { toast } from "sonner";
import { setUser } from "@/redux/authSlice";

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading,setLoading]=useState(false);
    const {user}=useSelector(store=>store.auth);

    const [input,setInput]=useState({
        fullname:user?.fullname,         //?. means inside
        email:user?.email,
        phoneNumber:user?.phoneNumber,
        bio:user?.profile?.bio,
        skills:user?.profile?.skills?.map(skill=>skill),
        file:user?.profile?.resume
    });

    const dispatch=useDispatch();

    const changeEventHandler = (e) =>{
        setInput({...input,[e.target.name]:e.target.value });
    }

    const fileChangeHandler=(e) =>{
        const file=e.target.files?.[0];
        setInput({...input,file})
    }

    const submitHandler = async (e) =>{
        e.preventDefault();
        const formData= new FormData();                        //api call through send karna hai isliye form file mai convert karre
        formData.append("fullname",input.fullname);
        formData.append("email",input.email);
        formData.append("phoneNumber",input.phoneNumber);
        formData.append("bio",input.bio);
        formData.append("skills",input.skills);
        if(input.file){
            formData.append("file",input.file);
        }
        //API call

        try {
          setLoading(true);
            const res=await axios.post(`${USER_API_END_POINT}/profile/update`,formData,{
                headers:{
                    'Content-Type':'multipart/form-data'
                },
                withCredentials:true
            });
            if(res.data.success){
                dispatch(setUser (res.data.user));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            // toast.error(error.response.data.message);
        }finally{
          setLoading(false);
        }
        setOpen(false);

        console.log(input);
    }

  return (
    <div>
      <Dialog open={open}>
        <DialogContent className='sm:max-w-[425px]' onInteractOutside={()=>setOpen(false)}>
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitHandler}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right ml-8">Name</Label>
                <Input id="name" className="col-span-3" name="name" type='name' onChange={changeEventHandler} value={input.fullname} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right ml-8" ml-8>Email</Label>
                <Input id="email" className="col-span-3" name="email" type='email' onChange={changeEventHandler} value={input.email}/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="number" className="text-right ml-8 ">Number</Label>
                <Input id="number" className="col-span-3" name="number" onChange={changeEventHandler} value={input.phoneNumber}/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bio" className="text-right ml-8">Bio</Label>
                <Input id="bio" className="col-span-3" name="bio" onChange={changeEventHandler} value={input.bio}/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="skills" className="text-right ml-8">Skills</Label>
                <Input id="skills" className="col-span-3" onChange={changeEventHandler} value={input.skills} name="skills" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="file" className="text-right ml-8">Resume</Label>
                <Input id="file" className="col-span-3" name="file" type='file' onChange={fileChangeHandler} accept='application/pdf' />
              </div>
            </div>
            <DialogFooter>
            {
            loading ? <Button className="w-full my-4"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Please Wait </Button> :<Button value="submit" className="w-full cursor-pointer mb-2">Update</Button>
          }
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateProfileDialog;
