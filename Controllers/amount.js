import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../Modules/user.js";
import date from 'date-and-time';
import { copyUserObject,decrypt,encrypt } from "./security.js";
import amounts from "../Modules/amounts.js";
import bank from "../Modules/bankList.js";

export const customAmounts = async (req, res) => {
  const {from,to} = req.body;
    const fromDate = new Date(from);
    const toDate = new Date(to);
    try{
        const ex = await amounts.find({userId:req.userData.id,date:{$gte:fromDate,$lte:toDate}}).sort({date:-1,PostedOn:-1});
        const user = await User.findOne({_id:req.userData.id});
        var ex1 = [];
        ex.map((items) => {
            let sum = 0;
            let type1 = items.type;
            let amt = parseInt(decrypt(items.amount))
            if(items.payments.length>0){
                items.payments.map((pay)=>{
                    sum+=parseInt(decrypt(pay.amount))
                })
            }
            if(sum===amt){
                type1=user.type.filter((item1)=>item1.name==="Paid" && item1.Status===null)[0]._id
            }
            if(sum>0 && sum<amt){
                amt-=sum;
            }
            ex1.push(
                {
                    _id:items._id,
                    userId:items.userId,
                    note:decrypt(items.note),
                    amount:{
                        amount:amt,
                        display:user.cashType+amt
                    },
                    type:user.type.filter((item1)=>item1._id==type1).map((item1)=>{return {name:item1.name,type:item1.type,_id:item1._id}})[0],
                    date:date.format(items.date, 'ddd, MMM DD YYYY'),
                    method:user.method.filter((item1)=>item1._id==items.method).map((item1)=>{return {name:item1.name,type:item1.type}})[0],
                    category:items.category,
                    payments:items.payments.map((pay)=>{
                        return{ 
                            date:date.format(pay.date, 'ddd, MMM DD YYYY'),
                            method:user.method.filter((item1)=>item1._id==pay.method).map((item1)=>{return {name:item1.name,type:item1.type,_id:item1._id}})[0],
                            amount:decrypt(pay.amount),
                            _id:pay._id,
                        }
                    })
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
        const user = await User.findOne({_id:req.userData.id})
        let temp_user = copyUserObject(user);
        await amounts.create({
            userId:req.userData.id,
            note:encrypt(item.toString()),
            amount:encrypt(amount.toString()),
            date:new Date(date),
            category:category,
            method:user.method[user.method.findIndex((x)=>x.name===method && x.Status==="Active")]._id,
            type:user.type[user.type.findIndex((x)=>x.name===type && x.Status!=="Inactive")]._id,
            PostedOn:new Date(),
        });
    
        let index = 0;

        temp_user.method.map((item,i)=>{
            if(item.name===method)
                index=i;
            return true;
        })

        let amt = 0;
        let test = user.type.filter((item)=>item.name===type)[0]
        console.log(test)
        if(test.type==="Expense" || test.type==="Settlement Expense" || test.name==="Pay Out") amt = parseInt(temp_user.method[index].amount)-parseInt(amount)
        else amt = parseInt(temp_user.method[index].amount)+parseInt(amount)
        console.log(amt)
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
        const user = await User.findOne({_id:req.userData.id})
        let temp_user = copyUserObject(user);
        let amt = parseInt(amount);
        if(parseInt(decrypt(ex.amount))!==parseInt(amount)){
            if(temp_user.type[temp_user.type.findIndex((x)=>x.name===type)].type!=="Income")
                amt = parseInt(temp_user.method.filter((item)=>item.name===method).map((item)=>{return item.amount})[0]) + parseInt(decrypt(ex.amount)) - amt
            else
                amt = parseInt(temp_user.method.filter((item)=>item.name===method).map((item)=>{return item.amount})[0]) - parseInt(decrypt(ex.amount)) + amt
            await User.updateOne({_id:req.userData.id,"method.name":method},{"method.$.amount":encrypt(amt.toString())})
        }
        await amounts.updateOne({_id:id},{
            note:encrypt(item),
            amount:encrypt(amount.toString()),
            date:new Date(date),
            category:category,
            type:temp_user.type[temp_user.type.findIndex((x)=>x.name===type)]._id,
        })
        const user1 = await User.findOne({_id:req.userData.id})
        temp_user = copyUserObject(user1);
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
        let test = temp_user.type.filter((item)=>item._id==ex.type)[0]
        let amt = parseInt(temp_user.method.filter((item)=>item._id==ex.method).map((item)=>{return item.amount})[0])
        if(test.type==="Expense" || test.type==="Settlement Expense")
            amt += parseInt(decrypt(ex.amount))
        else if(test.type==="Income")
            amt -= parseInt(decrypt(ex.amount))
        await User.updateOne({_id:req.userData.id,"method.name":temp_user.method.filter((item)=>item._id==ex.method)[0].name},{"method.$.amount":encrypt(amt.toString())})
        console.log(amt)
        await amounts.deleteOne({_id:id})
        const user1 = await User.findOne({_id:req.userData.id})
        temp_user = copyUserObject(user1);
        res.status(200).json(temp_user);

    }catch(err){
        console.log(err)
    }
}

export const bankList = async(req,res) =>{
    try{
        const list = await bank.find();
        res.status(200).json(list)
    }
    catch(err){
        console.log(err)
    }
}

export const settlement = async(req,res) => {
    const {_id,item,amount,type,date,method,category} = req.body
    try{
        const user = await User.findOne({_id:req.userData.id})
        const Amounts = await amounts.findOne({_id});
        console.log({_id,item,amount,type,date,method,category})
        console.log(Amounts)
        let temp_note=decrypt(Amounts.note)+"(paid on "+date+")";
        await amounts.updateOne({_id},{
            note:encrypt(temp_note),
            type:user.type[user.type.findIndex((x)=>x.name==="Paid" && x.Status===null)]._id,
        })
        addAmounts(req,res)
    }catch(err){
        console.log(err)
    }
}