import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../Modules/user.js";
import date from 'date-and-time';
import { copyUserObject,decrypt } from "./security.js";
import amounts from "../Modules/amounts.js";

export const customAmounts = async (req, res) => {
  const {from,to,userId} = req.body;
    const fromDate = new Date(from);
    const toDate = new Date(to);
    fromDate.setHours(0,0,0,0);
    toDate.setHours(0,0,0,0);
    console.log({from,to,userId})
    try{
        const ex = await amounts.find({userId:userId,date:{$gte:fromDate,$lte:toDate}}).sort({date:-1});
        const user = await User.findOne({_id:userId});
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
                        bank: items.method.bank ,
                        displayName: items.method.type==="BANK" ? items.method.bank+"-"+items.method.name : items.method.name,
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
