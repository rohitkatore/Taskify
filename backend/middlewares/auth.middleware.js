const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
module.exports.authenticate = async(req,res,next)=>{
    const token = req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({message:"You are not logged In."});
    }

   try{
    const decoded = jwt.verify(token,process.env.SECRET_KEY);
    const user = await UserModel.findById(decoded._id);
    if(!user){
        return res.status(401).json({message:"user not exists."});
    }
    req.user = user ;
    console.log(req.user) ;
    next();
   }catch(err){
        console.log(err);
        return res.status(501).json({message:err.message});
   }
}

module.exports.checkRole = (roles)=>{
        return (req,res,next)=>{
            if(!roles.includes(req.user.role)){
                return res.status(401).json({message:"User is not authorized."})
            }
            next();
        }    
}
