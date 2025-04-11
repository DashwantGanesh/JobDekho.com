import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./updateProfileDialog";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "./hooks/useGetAppliedJobs";


// const skills=["HTML","CSS","Javascript","ReactJs"];
const Profile = () => {
    useGetAppliedJobs();
    const [open,setOpen]=useState(false);
    const {user}=useSelector(store=>store.auth);

    const isResume=true;

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto shadow-md bg-white border border-gray-200 rounded-2xl my-5 p-8">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={user?.profile?.profilePhoto} alt="image" />
            </Avatar>
            <div>
              <h1 className="font-medium text-xl">{user?.fullname}</h1>
              <p>
              {user?.profile?.bio}
              </p>
            </div>
          </div>
          <Button
            onClick={()=> setOpen(true)}
            className="text-right rounded-full cursor-pointer"
            size="icon"
            variant="outline"
          >
            <Pen />
          </Button>
        </div>
        <div className="my-5">
            <div className="flex items-center gap-3 my-2 ">
               <Mail />
            <span className="text-gray-600">{user?.email}</span>
 
            </div>
            <div className="flex items-center gap-3 my-2">
                 <Contact />
            <span className="text-gray-600">{user?.phoneNumber}</span>
            </div>  
        </div>
        <div className="my-5">
            <h1>Skills</h1>
            {
                user?.profile?.skills.length !== 0 ? user?.profile?.skills.map((item,index)=><Badge variant='outline' className='ml-1 shadow-xl border border-gray-300' key={index}>{item}</Badge>) : <span>NA</span>
            }
        </div>
        <div className="grid w-full max-w-sm item-center gap-1">
            <Label className='text-md font-bold '>Resume</Label>
            
            {
                isResume ? <a href={user?.profile?.resume} target="blank" className="text-blue-500 w-full hover:underline cursor-pointer">{user?.profile?.resumeOriginalName}</a> : <span>NA</span>
            }

        </div>
      </div>

       <div className="max-w-4xl mx-auto bg-white rounded-2xl">
            <h1 className="font-bold text-lg my-5 mt-5">Applied Jobs</h1>
            {/* AppliedJob table */}
            <AppliedJobTable />
        </div>

      {/* form update component */}
          
      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
