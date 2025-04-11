import { Company } from "../models/company.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

//registration
export const registerCompany = async(req,res) =>{
    try {
        const{companyName}=req.body;
        if(!companyName ){
            return res.status(400).json({
                message:"Company name is required",
                success:false
            });
        }
        let company= await Company.findOne({name:companyName});
        if(company){
            return res.status(400).json({
                message:"Company already exist.",
                success:false
            })
        }

        //creating company and storing it in the variable

        company= await  Company.create({
            name:companyName,
            userId:req.id
        });

        return res.status(201).json({
            message:"Company registered successfully!",
            company,
            success:true
        })

    } catch (error) {
        console.log(error);
    }
}

//getting all company created by user

export const getCompany=async (req,res)=>{
   try {

    const userId=req._id; //logges in userId 
    const companies= await Company.find(userId);  //so that only the companies created by user are visible to him and not all
    if(!companies){
        return res.status(404).json({
            message:"Companies not found.",
            success:false
        })
    }

    return res.status(200).json({
        companies,
        success:true
    });

   } catch (error) {
    console.log(error);
   }
}

//get company by id
export const getCompanyById=async (req,res)=>{
    try {
 
     const companyId=req.params.id; // of format /:id  for a single company.
     const company= await Company.findById(companyId);  
     if(!company){
         return res.status(404).json({
             message:"Company not found.",
             success:false
         })
     }
     return res.status(200).json({
        company,
        success:true
    })
     
 
    } catch (error) {
     console.log(error);
    }
 }


export const updateCompany=async (req,res)=>{
    try {
        const {name,description,website,location}=req.body;
        const file=req.file //getting hold of file (logo file)
        //idhar cloudinary ayega
        const fileUri=getDataUri(file);
        const cloudResponse=await cloudinary.uploader.upload(fileUri.content);
        const logo=cloudResponse.secure_url;

        const updateData={name,description,website,location,logo};

        const company= await Company.findByIdAndUpdate(req.params.id,updateData,{new:true}); //It updates a Company document by its _id from req.params.id with updateData and returns the updated document(by new:true).

        
        if(!company){
            return res.status(404).json({
                message:"Company not found.",
                success:false
            })
        }

        return res.status(200).json({
            message:"Company Information updated.",
            success:true
        })
    } catch (error) {
     console.log(error);
    }
 }