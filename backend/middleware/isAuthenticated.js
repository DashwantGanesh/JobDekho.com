import jwt from "jsonwebtoken";

const isAuthenticated= async (req,res,next)=>{  //next passes us onto the next route
    try {
        const token=req.cookies.token;
        //seeing if the token exist
        if(!token){ 
            return res.status(401).json({    //401=unauthorized
                message:"User not authorized",
                success:false,
            })
        }
        //if token exist ,verify it
        const decode=await jwt.verify(token,process.env.SECRET_KEY);
        if(!decode){
            return res.status(401).json({
                message:"Invalid token.",
                success:false
            })
        }
        //after decoding we get the data stored in token

        req.id=decode.userId; //checking if both id are same
        next();

    } catch (error) {
        console.log(error);
    }
}
export default isAuthenticated;