import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useDispatch, useSelector } from "react-redux";
import { setAllJobs, setFilteredJobs, setSearchedQuery } from "@/redux/jobSlice";
import { motion } from 'framer-motion'


// const jobsArray = [1, 2, 3, 4, 5, 6, 7, 8];
const Jobs = () => {
    const {allJobs,searchedQuery,filteredJobs=[]}=useSelector(store=>store.job);
    const [filterJobs,setFilterJobs]=useState( allJobs);
    const dispatch=useDispatch();

    useEffect(()=>{
        if(searchedQuery){
            const filteredJobsList= allJobs.filter((job)=>{
                return job?.title.toLowerCase().includes(searchedQuery.toLowerCase()) || 
                job?.location.toLowerCase().includes(searchedQuery.toLowerCase()) 
                // String(job?.salary).toLowerCase().includes(searchedQuery.toLowerCase())
            })
            dispatch(setFilteredJobs(filteredJobsList));
        }else{
            dispatch(setFilteredJobs(allJobs));

        }
    },[allJobs,searchedQuery,dispatch])
     useEffect(()=>{
            return ()=>{     //for cleanup return arrow function
                dispatch(setSearchedQuery(""));
                dispatch(setFilteredJobs(allJobs))

            }
        },[allJobs, dispatch])
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-25 mt-5">
        <div className="flex gap-5">
            <div className="w-[20%]">
                <FilterCard />
            </div>
            {
                filteredJobs.length === 0 ?<span>Job not found</span> : (
                    <div className="flex-1 h-[88vh] overflow-y-auto pb-5">
                        <div className="grid grid-cols-3 gap-4">
                            {
                                filteredJobs.map((job)=>(
                                    <motion.div 
                                    initial={{opacity:0,x:100}}
                                    animate={{opacity:1,x:0}}
                                    exit={{opacity:0,x:-100}}
                                    transition={{duration:0.3}}
                                    key={job?._id}>
                                        <Job job={job} />
                                    </motion.div>
                                ) )
                            }
                        </div>    
                    </div>
                )
                
            }     
        </div> 
      </div>
    </div>
  );
};

export default Jobs;
