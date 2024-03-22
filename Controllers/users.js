import  jwt  from "jsonwebtoken"
import bcrypt from "bcryptjs"
import User from "../Modules/user.js"
import { copyUserObject } from "./security.js"

export const login = async(req,res) => {
    const { email , password } = req.body;
    console.log({ email , password })
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
    const id  = req.params.id;
    try{
        const ex = await User.findOne({_id:id});
        if(!ex)
        {
            return res.status(401).json({ message:"User Doesn't Exists.",status:"Error"})
        }
        let ex1 = copyUserObject(ex)
        res.status(200).json(ex1)
    }
    catch(err){
        console.log(err)
    }
}