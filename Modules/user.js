import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    fname :{type:String, required:true},
    lname :{type:String, required:true},
    gender :{type:String, required:true},
    email :{type:String, required:true},
    password :{type:String, required:true},
    userType :{type:String, default:"Free user"},
    joinedOn :{type:String, default:Date.now}, 
    cashType :{type:String, default:"₹"},
    method :[{
        name:{type:String, required:true},
        type:{type:String,required:true},
        amount:{
            key:{type:Buffer,required:true},
            iv :{type:String,required:true},
            encode :{type:String,required:true}
        },
        Status:{type:String,default:"Active"}
    }],
    type :[{
        name:{type:String},
        type:{type:String},
        Status:{type:String,default:"Active"}
    }],
    message: [{
        mess:{
            key:{type:Buffer,required:true},
            iv :{type:String,required:true},
            encode :{type:String,required:true}
        },
        postedOn:{type:Date,default:new Date()}
    }],
    category: {type:[String]}
})

export default mongoose.model("User",userSchema)