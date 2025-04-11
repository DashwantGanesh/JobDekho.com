//for validations and user register logic

import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "dotenv";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
env.config();


export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    if (!fullname || !email || !phoneNumber || !password || !role) {
      res.status(400).json({
        message: "Data incomplete",
        success: false,
      });
    }
    //cloudinary for photo upload
    const file=req.file;
    const fileUri=getDataUri(file);
    const cloudResponse=await cloudinary.uploader.upload(fileUri.content);

    const user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ message: "User already exist.",success:false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    //all validations and hashing done
    //now creating the user i.e creating dataset
    await User.create({
      fullname,
      email,
      phoneNumber,
      password:hashedPassword,
      role,
      profile:{
        profilePhoto:cloudResponse.secure_url
      }
    });

    return res.status(201).json({
      message: "Account created successfully!",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//user login logic

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Data incomplete",
        success: false,
      });
    }
    //checking if user exist and that the email and password are correct
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email ",
        success: false,
      });
    }

    //checking if password matches or not

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(400).json({
        message: "Incorrect Password",
        success: false,
      });
    }
    //check if the role is correct or not
    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role.",
        success: false,
      });
    }

    //creating token
    const tokenData = {
      userId: user._id,
    };

    const token =  jwt.sign(tokenData, process.env.SECRET_KEY , {
      expiresIn: "1D",
    });
    //creating user so that its data be used for valudation and for tokens and cookies
    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: false,  //for testing in postman make temporary false
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullname}.`,
        user,
        success: true
        
      });
    //This code sets a secure, HTTP-only cookie named "token" with a JWT, expiring in 1 day, to authenticate users while preventing XSS and CSRF attacks.
  } catch (error) {
    console.log(error);
  }
};

//creating logout logic

export const logout= async(req,res) =>{
    try {
        return res.status(200).cookie("token","",{maxAge:0}).json({  //emptied the token hence logged out.
            message:"Logged out successfully!",
            success:true,
        })
    } catch (error) {
        console.log(error);
    }
}

//updating the user

export const updateProfile= async(req,res)=>{
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file=req.file   //from cloudinary
        //cloudinary ayega idhar
        const fileUri=getDataUri(file);
        const cloudResponse=await cloudinary.uploader.upload(fileUri.content)
       
        let skillsArray;
      if(skills){
         skillsArray= skills.split(",")  //skills string converted to array
      }
        
        const userId=req.id;  //middleware authentication //coming from isAuthenticated field
        //getting user by id

        let user=await User.findById(userId);
        //updating the data and can update only single.

      if(fullname) user.fullname=fullname
      if(email) user.email=email
      if(phoneNumber) user.phoneNumber=phoneNumber
      if(bio) user.profile.bio=bio
      if(skills) user.profile.skills=skillsArray

      //resume comes here...
      if (cloudResponse){
        user.profile.resume= cloudResponse.secure_url  //saves the cloudinary url
        user.profile.resumeOriginalName= file.originalname  //saves the name of pdf/file
      }


        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
          };

          return res.status(200).json({
            message:"Profile Updated Successfully!",
            user,
            success:true,
          })

    } catch (error) {
        console.log(error)
    }
}
