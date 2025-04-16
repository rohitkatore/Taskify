const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  });

const commentModel = mongoose.model("Comment",commentSchema);

module.exports = commentModel ;