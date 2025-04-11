import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { APPLICATION_API_END_POINT } from "@/utils/constant";

const shortListingStatus=['Accepted','Rejected'];

const statusHandler = async (status,id)=>{
  try {
    const res=await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`,{status},{
      withCredentials:true
    });
    if(res.data.success){
      toast.success(res.data.message)
    }
  } catch (error) {
    toast.error(error.res.data.message);
  }
}

const ApplicantsTable = () => {
  const {applicants}=useSelector((store)=>store.application);
  return (
    <div>
      <Table>
        <TableCaption>List of applicants</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            applicants &&  applicants.applications.map((item)=>(
              <tr key={item._id}>
                <TableCell>{item?.applicant?.fullname}</TableCell>
                <TableCell>{item?.applicant?.email}</TableCell>
                <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                <TableCell >
                  {
                  item?.applicant?.profile?.resume ? <a className='text-blue-600 cursor-pointer' href={item?.applicant?.profile?.resume}>{item?.applicant?.profile?.resumeOriginalName}</a> : <span>NA</span> 
                  }
                </TableCell>
                <TableCell>{item?.applicant?.createdAt.split("T")[0]}</TableCell>
                <TableCell className='float-right cursor-pointer'>
                    <Popover>
                        <PopoverTrigger>
                            <MoreHorizontal className="cursor-pointer" />
                        </PopoverTrigger>
                        <PopoverContent className='w-32'>
                            {
                                shortListingStatus.map((status,index)=>{
                                    return(
                                        <div onClick={()=> statusHandler(status,item?._id)} className="cursor-pointer" key={index}>
                                            <span>{status}</span>
                                        </div>
                                    )
                                })
                            }
                        </PopoverContent>
                    </Popover>
                </TableCell>
            </tr>
            ))
          }
            
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicantsTable;
