import mongoose from "mongoose";

const amountSchema = mongoose.Schema({
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
    method :{type:String,required:true},
    category :{type:String,required:true},
    payments:[{
        date:{type:Date},
        method:{type:String},
        amount :{
            key:{type:Buffer,required:true},
            iv :{type:String,required:true},
            encode :{type:String,required:true}
        }
    }],
    PostedOn :{type:Date,default:new Date()},
    
})

export default mongoose.model("Amounts",amountSchema,"new_amounts")