const mongoose = require("mongoose");

const completedTaskSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    queueId:String,
    type:String,
    shopOrigin: String,
    editOption: String,
    editValue: Number,
    variantFilterOptions:{},
    variant:{},
    status:String,
    statusText:String,
    created_at: String,
    updated_at: String,
})
module.exports = mongoose.model("completedTasks", completedTaskSchema);