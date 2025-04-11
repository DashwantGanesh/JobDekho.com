import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import env from "dotenv";
import bodyParser from "body-parser";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.routes.js"
import companyRoute from "./routes/company.routes.js";
import jobRoute from "./routes/job.routes.js";
import applicationRoute from "./routes/application.routes.js";
import path from "path";

env.config();

const app=express();
const port=3000;

const _dirname=path.resolve();

//db connextion
connectDB();


//middlewares
app.use(express.json());  //very important for data when sent from frontend as json to be read as string in backend and saved.
app.use(bodyParser.urlencoded({extended:true}));  //make the data available on req.body.
app.use(cookieParser());  // used to parse cookies attached to the incoming requests.

const corsOptions={   //allows you to control which domains can access resources on your server.
    origin:"http://localhost:5173", //domain of vite+react
    credentials:true
}
 app.use(cors(corsOptions));

//api's which comes from userRoute (login/register/profileUpdate);middleware function
app.use("/api/v1/user",userRoute);  //"/api/v1/user": This is the base URL path where userRoute will be applied. Any request that starts with this path will be handled by userRoute.
app.use("/api/v1/company",companyRoute); 
app.use("/api/v1/job",jobRoute); 
app.use("/api/v1/application",applicationRoute); 

// serve all frontend files
app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get("*",(_,res)=>{
    res.sendFile(path.resolve(_dirname,"frontend","dist","index.html"));
}); 


app.listen(port,()=>{
    console.log(`Server running at port ${port}`);
})