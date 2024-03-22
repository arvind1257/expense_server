import mongoose from "mongoose";

const amountSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    userId :
        {
            type:String,
            required:true
        },
    note :{
        key:{type:Buffer,required:true},
        iv :{type:String,required:true},
        encode :{type:String,required:true}
    },
    amount :{
        key:{type:Buffer,required:true},
        iv :{type:String,required:true},
        encode :{type:String,required:true}
    },
    type :{type:String,required:true},
    date :{type:Date,required:true},
    method :{
        name:{type:String,required:true},
        type:{type:String,required:true},
        bank:{type:String}  
    },
    category :{type:String,required:true},
    
})

export default mongoose.model("Amounts",amountSchema)