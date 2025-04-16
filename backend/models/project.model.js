const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const projectModel = mongoose.model("Project",projectSchema);

module.exports = projectModel ;