const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project"
    },
    status: { 
        type: String,
        enum: ['Pending', 'In Progress', 'Done'],
        default: 'Pending' 
    },
    priority: { 
        type: String, 
        enum: ['Low', 'Medium', 'High'], 
        default: 'Medium' 
    },
    createdAt: {
         type: Date, 
         default: Date.now 
    }
});

const taskModel = mongoose.model("Task",taskSchema);

module.exports= taskModel ;