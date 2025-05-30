import React from "react";
import LatestJobCards from "./LatestJobCards";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// const randomJobs = [1, 2, 3, 4, 5, 6, 7, 8]; //array of jobs available currently
const LatestJobs = () => {
  const {allJobs}=useSelector(store=>store.job);
  const navigate=useNavigate();


  return (
    <div>
      <div className="max-w-7xl   mx-25 my-20">
        <h1 className="text-4xl font-bold">
          <span className="text-[#6A38C2]">Latest & Top </span>Job Openings
        </h1>
        <div className="grid grid-cols-3 gap-4 my-5">
          {allJobs.length === 0 ? <span>No Job Available</span> : allJobs?.slice(0,6).map((job) => (                       //since we hav written top & latest we'll use slice to show only 6,no matter how much job openings we have
            <LatestJobCards  key={job._id} job={job} />  //ek ek job pass kar rahe hai
          ))}
        </div>
      </div>
    </div>
  );
};

export default LatestJobs;
