import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['student','recruiter'],
        required:true
    },
    profile:{
        bio:{type:String},
        skills:{type:[String]},
        resume:{type:String},
        resumeOriginalName:{type:String},
        company:{type:mongoose.Schema.Types.ObjectId,ref:'Company'},  //is used to create a reference (relationship) to another document in a different MongoDB collection.(here relation with comapany and user)
        profilePhoto:{
            type:String,
            default:""
        }

    },
},{timestamps:true});

export const User=mongoose.model("User",userSchema);