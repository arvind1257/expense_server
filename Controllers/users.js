import  jwt  from "jsonwebtoken"
import bcrypt from "bcryptjs"
import User from "../Modules/user.js"
import { copyUserObject, encrypt } from "./security.js"
import { Mongoose } from "mongoose"

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

export const updateProfile = async(req,res) => {
    const details = req.body
    try{
        await User.updateOne({_id:req.userData.id},details)
        const ex = await User.findOne({_id:req.userData.id});
        let ex1 = copyUserObject(ex)
        res.status(200).json(ex1)
    }
    catch(err){
        console.log(err)
    }
}

export const updatePassword = async(req,res) => {
    const {oldPass,newPass} = req.body
    try{
        const ex = await User.findOne({_id:req.userData.id});
        const isPass = await bcrypt.compare(oldPass,ex.password)
        if(!isPass){
            return res.status(401).json({ message:"Invalid Credentials",status:"Error" })
        }
        const pass = await bcrypt.hash(newPass,12)
        await User.updateOne({_id:req.userData.id},{password:pass})
        const ex1 = await User.findOne({_id:req.userData.id})
        let ex2 = copyUserObject(ex1)
        res.status(200).json(ex2)
    }
    catch(err){
        console.log(err)
    }
}

export const addDetails = async(req,res) => {
    const variable = req.params.value;
    const details = req.body
    console.log(details);
    try{
        if(variable==="type")
            await User.findByIdAndUpdate(req.userData.id,{$addToSet:{"type":details}})
        else if(variable==="method"){
            let temp = [];
            details.map((item)=>{
                temp.push({
                    amount:encrypt(item.amount.toString()),
                    name:item.name,
                    type:item.type,
                })
                return true;
            })
            await User.findByIdAndUpdate(req.userData.id,{$addToSet:{"method":temp}})
        }
        else if(variable==="category")
            await User.findByIdAndUpdate(req.userData.id,{$addToSet:{"category":details}})
        const ex1 = await User.findOne({_id:req.userData.id})
        let ex2 = copyUserObject(ex1)
        res.status(200).json(ex2)
    }
    catch(err){
        console.log(err)
    }
}

export const editDetails = async(req,res) => {
    const variable = req.params.value;
    const details = req.body
    try{
        let edit1 = []
        let delete1 = []
        if(variable==="type"){
            edit1 = details.filter((item)=>item.action==="Edit").map((item)=>{return{name:item.name,type:item.type,_id:item._id}})
            delete1 = details.filter((item)=>item.action==="Delete").map((item)=>{return item._id})
        }
        else if(variable==="method"){
            edit1 = details.filter((item)=>item.action==="Edit").map((item)=>{return{name:item.name,type:item.type,amount:encrypt(item.amount.toString()),_id:item._id}})
            delete1 = details.filter((item)=>item.action==="Delete").map((item)=>{return item._id})
        }
        else if(variable==="category"){
            edit1 = details.filter((item)=>item.action==="Edit").map((item)=>{return{name:item.name,index:item.index}})
            delete1 = details.filter((item)=>item.action==="Delete").map((item)=>{return item.name})
        }
        
        if(edit1.length>0){
            const ex1 = await User.findOne({_id:req.userData.id})
            let ex2 = ex1
            if(variable==="type"){
                edit1.map((item1)=>{
                    ex2.type[ex2.type.findIndex(x=>x._id==item1._id)].name=item1.name
                })
                await User.findByIdAndUpdate(req.userData.id,{"type":ex2.type})
            }
            else if(variable==="method"){
                edit1.map((item1)=>{
                    ex2.method[ex2.method.findIndex(x=>x._id==item1._id)].name=item1.name
                    ex2.method[ex2.method.findIndex(x=>x._id==item1._id)].amount=item1.amount
                })
                await User.findByIdAndUpdate(req.userData.id,{"method":ex2.method})
            }
            else if(variable==="category"){
                edit1.map((item1)=>{
                    ex2.category[item1.index]=item1.name
                })
                await User.findByIdAndUpdate(req.userData.id,{"category":ex2.category})
            }
        }
        if(delete1.length>0){
            if(variable==="type")
                await User.updateOne({_id:req.userData.id},{$pull:{"type":{"_id":{$in:delete1}}}})
            if(variable==="method")
                await User.updateOne({_id:req.userData.id},{$pull:{"method":{"_id":{$in:delete1}}}})
            if(variable==="category")
                await User.updateOne({_id:req.userData.id},{$pull:{"category":{$in:delete1}}})
        }
        const ex1 = await User.findOne({_id:req.userData.id})
        let ex2 = copyUserObject(ex1)
        res.status(200).json(ex2)
    }
    catch(err){
        console.log(err)
    }
}
  