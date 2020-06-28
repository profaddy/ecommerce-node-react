const mongoose = require("mongoose");

const queuedTask = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    type:String,
    shopOrigin: String,
    editOption: String,
    editValue: Number,
    variantFilterOptions:{},
    variants:[{}],
    status:String,
    created_at: String,
    updated_at: String,
})
module.exports = mongoose.model("queuedTasks", queuedTask);