import  jwt  from "jsonwebtoken"
import bcrypt from "bcryptjs"
import User from "../Modules/user.js"
import { copyUserObject, encrypt } from "./security.js"

export const login = async(req,res) => {
    const { email , password } = req.body;
    try{
       const ex = await User.findOne({email});
        if(!ex)
        {
            return res.status(401).json({ message:"User Doesn't Exists.",status:"Error"})
        }
        const isPass = await bcrypt.compare(password,ex.password)
        if(!isPass){
            return res.status(401).json({ message:"Invalid Credentials",status:"Error" })
        }
        let ex1 = copyUserObject(ex);
        const token = jwt.sign({ email:ex.email,id:ex._id},"test",{expiresIn:"24h"})
        res.status(200).json({result:ex1,token})
    }
    catch(err){
        console.log(err)
    }
} 



export const userDetail = async(req,res) => {
    try{
        const ex = await User.findOne({_id:req.userData.id});
        let ex1 = copyUserObject(ex)
        res.status(200).json(ex1)
    }
    catch(err){
        console.log(err)
    }
}

export const exchange = async(req,res) => {
    const {from,to,amount} = req.body
    try{
        const ex = await User.findOne({_id:req.userData.id});
        let temp_user = copyUserObject(ex)
        
        let fAmt = parseInt(temp_user.method.filter((item)=>item.name===from).map((item)=>{return item.amount}))-parseInt(amount);
        let tAmt = parseInt(temp_user.method.filter((item)=>item.name===to).map((item)=>{return item.amount}))+parseInt(amount);
        
        await User.updateOne({_id:req.userData.id,"method.name":from},{"method.$.amount":encrypt(fAmt.toString())})
        await User.updateOne({_id:req.userData.id,"method.name":to},{"method.$.amount":encrypt(tAmt.toString())})
        
        const ex1 = await User.findOne({_id:req.userData.id})
        temp_user = copyUserObject(ex1)
        res.status(200).json(temp_user)
    }
    catch(err){
        console.log(err)
    }
}