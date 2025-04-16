const mongoose = require("mongoose");

const connectToDB = async()=>{
        await mongoose.connect(process.env.DATABASE_URL).then(()=>{
            console.log("Connected to DB.");
        }).catch((err)=>{
            console.log(err);
            process.exit(1);
        });
};

module.exports = connectToDB ;