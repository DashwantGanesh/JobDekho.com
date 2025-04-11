import { Job } from "../models/job.model.js";

//posting a job
export const postJob= async (req,res)=>{
    try {
        const {title,descriptions,requirements,salary,location,jobType,experience,position,companyId}=req.body;
        const userId=req.id;

        if(!title || !descriptions || !requirements || !salary || !location || !jobType || !experience || !position || !companyId){
            return res.status(400).json({
                message:"Data incomplete",
                success:false
            })
        }
        const job= await Job.create({
            title,
            descriptions,
            requirements:requirements.split(","),
            salary:Number(salary),
            location,
            jobType,
            experienceLevel:experience,
            position,
            company:companyId,   //getting hold of company from companyId
            created_by:userId
        })

        return res.status(201).json({
            message:"New Job created successfully!",
            job,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

//getting jobs using filter(for students)

export const getAllJobs=async (req,res)=>{
    try {
        const keyword=req.query.keyword || "";
        const query={
            $or:[                                 //or operator since we are filtering by multiple conditions
                {title:{$regex:keyword,$options:"i"}},  //$regex: keyword: This tells MongoDB to match the title field against the provided keyword using a regular expression (Regex). 
                {descriptions:{$regex:keyword,$options:"i"}}, //"i"=makes it case insensitive
                {location:{$regex:keyword,$options:"i"}}
            ]
        };
        //query made
        //finding job based on query
        const jobs=await Job.find(query).populate({  //populate used to replace referenced ObjectIds with actual document data.
            path:"company"
        }).sort({createdAt:-1});  //Sorts the job results by the createdAt field in descending order (-1 means newest first).
        if(!jobs){
            return res.status(400).json({
                message:"Jobs not found",
                success:false
            })
        }
        //if jobs are found
        return res.status(200).json({
            jobs,
            success:true
        })

    } catch (error) {
        console.log(error);
    }
}

//getting job by id(for students)
export const getJobById=async (req,res)=>{
    try {
        const jobId=req.params.id;
    const job=await Job.findById(jobId).populate({
        path:"applications"
    });
    if(!job){
        return res.status(400).json({
            message:"Job not found",
            success:false
        })
    }
    return res.status(200).json({job,success:true})
    } catch (error) {
        console.log(error);
    }
}

//getting jobs created by admin(for admin)
export const getAdminJobs=async(req,res)=>{
    try {
        const adminId=req.id;
        const jobs=await Job.find({created_by:adminId}).populate({
            path:'company',
            createdAt:-1
        })
        if(!jobs){
            return res.status(400).json({
                message:"Jobs not found",
                success:false
            })
        }
        return res.status(200).json({jobs ,success:true})
    } catch (error) {
        console.log(error);
    }
}