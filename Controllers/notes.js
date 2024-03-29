import User from "../Modules/user.js";
import { copyUserObject } from "./security.js";

export const addMessage = async (req, res) => {
    const {message} = req.body
    try{
        await User.findByIdAndUpdate(req.userData.id,{$addToSet:{"message":[{"mess":message,"postedOn":new Date()}]}});
        const user = await User.findOne({_id:req.userData.id})
        let temp_user = copyUserObject(user);
        res.status(200).json(temp_user);
    }catch(err){
        console.log(err)
    }
}

export const deleteMessage = async (req, res) => {
    const id = req.params.id;
    try{
        await User.updateOne({_id:req.userData.id},{$pull:{"message":{"_id":id}}})
        const user = await User.findOne({_id:req.userData.id})
        let temp_user = copyUserObject(user);
        res.status(200).json(temp_user);
    }catch(err){
        console.log(err)
    }
}