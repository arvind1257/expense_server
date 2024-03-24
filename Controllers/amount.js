import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../Modules/user.js";
import date from 'date-and-time';
import { copyUserObject,decrypt,encrypt } from "./security.js";
import amounts from "../Modules/amounts.js";

export const customAmounts = async (req, res) => {
  const {from,to} = req.body;
    const fromDate = new Date(from);
    const toDate = new Date(to);
    fromDate.setHours(0,0,0,0);
    toDate.setHours(0,0,0,0);
    try{
        const ex = await amounts.find({userId:req.userData.id,date:{$gte:fromDate,$lte:toDate}}).sort({date:-1});
        const user = await User.findOne({_id:req.userData.id});
        var ex1 = [];
        ex.map((items) => {
            ex1.push(
                {
                    _id:items._id,
                    userId:items.userId,
                    note:decrypt(items.note),
                    amount:{
                        amount:decrypt(items.amount),
                        display:user.cashType+decrypt(items.amount)
                    },
                    type:items.type,
                    date:date.format(items.date, 'ddd, MMM DD YYYY'),
                    method:{
                        name: items.method.name,
                        type: items.method.type,
                    },
                    category:items.category
                }
            )
        })
        
        res.status(200).json(ex1)
    }catch(err){
        console.log(err)
    }
};


export const addAmounts = async (req, res) => {
    const {item,amount,date,category,method,type} = req.body;
      try{
        await amounts.create({
            userId:req.userData.id,
            note:encrypt(item.toString()),
            amount:encrypt(amount.toString()),
            date:new Date(date),
            category:category,
            method:{
                name:method,
                type:method!=="Cash"?"Bank":"Cash"
                },
            type:type
        });
        
        const user = await User.findOne({_id:req.userData.id});
        let temp_user = copyUserObject(user);
        let index = 0;

        temp_user.method.map((item,i)=>{
            if(item.name===method)
                index=i;
            return true;
        })

        let amt = 0;
        if(type!=="Income") amt = parseInt(temp_user.method[index].amount)-parseInt(amount)
        else amt = parseInt(temp_user.method[index].amount)+parseInt(amount)
        
        await User.updateOne({_id:req.userData.id,"method.name":method},{$set:{"method.$.amount":encrypt(amt.toString())}})
        const user1 = await User.findOne({_id:req.userData.id});
        temp_user = copyUserObject(user1);
        res.status(200).json(temp_user)

    }catch(err){
        console.log(err)
    }
};

export const editAmounts = async (req, res) => {
    const id = req.params.id;
    const {item,amount,date,category,method,type} = req.body;
    try{
        const ex = await amounts.findOne({_id:id})
        let amt = parseInt(amount);
        if(parseInt(decrypt(ex.amount))!==parseInt(amount)){
            const user = await User.findOne({_id:req.userData.id})
            let temp_user = copyUserObject(user);
            amt = parseInt(temp_user.method.filter((item)=>item.name===method).map((item)=>{return item.amount})[0]) + parseInt(decrypt(ex.amount)) - amt
            await User.updateOne({_id:req.userData.id,"method.name":method},{"method.$.amount":encrypt(amt.toString())})
        }
        await amounts.updateOne({_id:id},{note:encrypt(item),amount:encrypt(amount.toString()),date:new Date(date),category:category,type:type})
        const user = await User.findOne({_id:req.userData.id})
        let temp_user = copyUserObject(user);
        res.status(200).json(temp_user);

    }catch(err){
        console.log(err)
    }
}

export const deleteAmounts = async (req, res) => {
    const id = req.params.id;
    try{
        const ex = await amounts.findOne({_id:id})
        const user = await User.findOne({_id:req.userData.id})
        let temp_user = copyUserObject(user);
        let amt = parseInt(temp_user.method.filter((item)=>item.name===ex.method.name).map((item)=>{return item.amount})[0]) + parseInt(decrypt(ex.amount))
        await User.updateOne({_id:req.userData.id,"method.name":ex.method.name},{"method.$.amount":encrypt(amt.toString())})
        await amounts.deleteOne({_id:id})
        const user1 = await User.findOne({_id:req.userData.id})
        temp_user = copyUserObject(user1);
        res.status(200).json(temp_user);

    }catch(err){
        console.log(err)
    }
}