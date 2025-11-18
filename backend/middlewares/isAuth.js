import jwt from "jsonwebtoken";
const isAuth=async(req,res,next)=>{
    try {
        const token=req.cookies?.token;
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Unauthorized ! No token provided"
            });
        }
        const verifyToken=await jwt.verify(token,process.env.JWT_SECRET);
        req.userId=verifyToken.id;
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        });
    }
}
export default isAuth;