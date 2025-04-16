const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
    fullname:{
        type:String,
        required:true,
        minlength:[3,"fullname be atleast 3 character."]
    },
    email:{
        type:String,
        required:true,
        unique:true,
        minlength:[5,"email must be 5 character long."]
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user",
        required:true
    }
})

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id},process.env.SECRET_KEY,{expiresIn:"12h"});
    return token ;
}

userSchema.methods.comparePassword =async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password,10);
}

const UserModel = mongoose.model("User",userSchema);

module.exports = UserModel ;