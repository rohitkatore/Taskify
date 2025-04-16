const { validationResult } = require("express-validator");
const UserModel =require("../models/user.model");
const  createUser = require("../services/auth.service");

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res 
 */
 const register = async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {fullname,email,password,role} = req.body;

    try{
        const isExist = await UserModel.findOne({email});
    if(isExist){
        return res.status(400).json({message:"User already exist."});
    }

    const hashPassword = await UserModel.hashPassword(password);

    const user = await createUser({fullname,email,password:hashPassword,role});

    const token = user.generateAuthToken();
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    await user.save() ;
    return res.status(201).json({message:"user register successfully.",token:token});
    }catch(err){
        console.log(err) ;
        res.status(501).json({message:err.message});
    }
}

 const login = async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {email,password} = req.body ;
    if(!email || !password){
        return res.status(404).json({error:"email and password is required."});
    }

    try{
        const user = await UserModel.findOne({email}).select("+password");
    if(!user){
        return res.status(401).json({error:"Invalid email or password."});
    }

    const isMatch = await user.comparePassword(password);
    if(!isMatch){
        return res.status(401).json({error:"Invalid credentials."});
    }

    const token = user.generateAuthToken();

    if(!token){
        return res.status(401).json({error:"login failed."});
    }
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    return res.status(201).json({message:"user login successfully.",token});
    }catch(err){
        console.log(err);
        res.status(501).json({error:"Internal server error."});
    }
}

const getAllUsers = async(req,res)=>{
    try{
        const users = await UserModel.find({});
        if(!users){
            return res.status(404).json({message:"user not found."});
        }
        return res.status(200).json(users);
    }catch(err){
        console.log(err);
        return res.status(501).json({message:err.message});
    }
}

const userData = async(req,res)=>{
    return res.status(200).json(req.user) ;
}

module.exports = {register,login,getAllUsers,userData};