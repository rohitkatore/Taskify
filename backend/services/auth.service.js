const UserModel = require("../models/user.model");

const createUser = async({fullname,email,password,role}) =>{
    if(!fullname || !email || !password){
        throw new Error("All fields are required.");
    }
    // if(role != "user" || role!="admin"){
    //     throw new Error("Invalid role.");
    // }
    const user = await UserModel.create({
        fullname,
        email,
        password,
        role
    });

    return user;
}

module.exports = createUser;