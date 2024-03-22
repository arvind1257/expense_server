import mongoose from "mongoose";

const bankSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name :{type:String,required:true},
    code :{type:String,required:true},    
})

export default mongoose.model("Bank",bankSchema)