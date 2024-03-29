import mongoose from "mongoose";

const bankSchema = mongoose.Schema({
    name :{type:String,required:true},
    code :{type:String,required:true},    
})

export default mongoose.model("bankList",bankSchema,"bankList")