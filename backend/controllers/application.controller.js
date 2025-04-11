import { Application } from "../models/applicant.model.js";
import { Job } from "../models/job.model.js";

//applying for job
export const applyJob=async (req ,res) =>{
    try {
        const userId=req.id;
        const jobId=req.params.id;

        if(!jobId){
            return res.status(400).json({
                message:"Job id is required",
                success:false,
            })
        }
        //checking if the user has already applied for job
        const existingApplication=await Application.findOne({job:jobId,applicant:userId});
        if(existingApplication){
            return res.status(400).json({
                message:"You have already applied for this job.",
                success:false,
            })
        }
        //checking if the job exist
        const job=await Job.findById(jobId);
        if(!job){
            return res.status(400).json({
                message:"Job not found",
                success:false
            })
        }
        //create new application
        const newApplication=await Application.create({
            job:jobId,
            applicant:userId,
        });
        //we have created applications array inside job model ,hence we'll push all application inside that array
        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message:"Job applied successfully!",
            success:true,
        })

    } catch (error) {
        console.log(error);
    }
}
//getting jobs which the particular user has applied for
export const getAppliedJobs=async(req,res)=>{
    try {
        const userId=req.id;
        const application=await Application.find({applicant:userId}).sort({createdAt:-1}).populate({   //finding all application created by this particular user.
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{                     //nested populate since inside application we have job and inside job we have company.
                path:'company',
            options:{sort:{createdAt:-1}},

            }
        });
        if(!application){
            return res.status(400).json({
                message:"No applications",
                success:false,
            })
        }

        return res.status(200).json({
            application,
            success:true,   
        })

    } catch (error) {
        console.log(error);
    }
}
//getting applicants who have applied for jobs posted by admin
export const  getApplicants=async(req,res)=>{
    try {
        const jobId=req.params.id;
        const job=await Job.findById(jobId).populate({
            path:"applications",
            options:{sort:{createdAt:-1}},
            populate:{
                path:"applicant",
                options:{sort:{createdAt:-1}},
            }
        })
        if(!job){
            return res.status(400).json({
                message:"Job not found",
                success:false
            })
        }

        return res.status(200).json({
            job,
            success:true
        })
    } catch (error) {
        console.log(error);
        
    }
}

//updating status of accepted,rejected
export const updateStatus=async(req,res)=>{
    try {
        const {status}=req.body;
        const applicationId=req.params.id;
        if(!status){
            return res.status(400).json({
                message:"Status is required",
                success:false,
            })
        }
        //find application by applicant id
        const application=await Application.findById({_id:applicationId});
        if(!application){
            return res.status(404).json({
                message:"Application not found.",
                success:false,
            })
        }

        //updating the status
        application.status= status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message:"Status updated successfully.",
            success:true,
        })
    } catch (error) {
        console.log(error);
    }
}