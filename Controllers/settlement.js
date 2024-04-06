import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../Modules/user.js";
import date from 'date-and-time';
import { copyUserObject,decrypt,encrypt } from "./security.js";
import amounts from "../Modules/amounts.js";
import bank from "../Modules/bankList.js";

export const addSettlement = async (req, res) => {
    const {_id,amount,date,method} = req.body
    try{
        const user = await User.findOne({_id:req.userData.id})
        const amount1 = await amounts.findOne({_id})
        let temp_user = copyUserObject(user)
        let amt = parseInt(temp_user.method.filter((item)=>item.name===method)[0].amount)
        let met = temp_user.method.filter((item)=>item.name===method)[0]._id
        let test = user.type.filter((item)=>item._id==amount1.type)[0]

        if(test.type==="Settlement Expense")
            amt+=parseInt(amount)
        else if(test.type==="Income")
            amt-=parseInt(amount)

        await amounts.findByIdAndUpdate(_id,{$addToSet:{"payments":[{"amount":encrypt(amount.toString()),"date":new Date(date),"method":met}]}});
        await User.updateOne({_id:req.userData.id,"method.name":method},{$set:{"method.$.amount":encrypt(amt.toString())}})
       
        const user1 = await User.findOne({_id:req.userData.id})
        temp_user = copyUserObject(user1)
        res.status(200).json(temp_user)
    }catch(err){
        console.log(err)
    }
}

export const deleteSettlement = async (req,res) => {
    const {amountId,id} = req.body
    try{
        console.log({amountId,id})

        const user = await User.findOne({_id:req.userData.id})
        const amount1 = await amounts.findOne({_id:amountId})
        let temp_user = copyUserObject(user)
        let met = amount1.payments.filter((pay)=>pay._id==id)[0].method
        let amt = parseInt(temp_user.method.filter((item)=>item._id==met)[0].amount)
        let test = user.type.filter((item)=>item._id==amount1.type)[0]

        if(test.type==="Settlement Expense")
            amt-=parseInt(decrypt(amount1.payments.filter((pay)=>pay._id==id)[0].amount))
        else if(test.type==="Income")
            amt+=parseInt(decrypt(amount1.payments.filter((pay)=>pay._id==id)[0].amount))

        await amounts.updateOne({_id:amountId},{$pull:{"payments":{"_id":id}}})
        await User.updateOne({_id:req.userData.id,"method._id":met},{$set:{"method.$.amount":encrypt(amt.toString())}})
           
        const user1 = await User.findOne({_id:req.userData.id})
        temp_user = copyUserObject(user1)
        res.status(200).json(temp_user)
    }catch(err){
        console.log(err)
    }
}