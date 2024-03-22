
import mongoose from "mongoose";


mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://expense:Geetha123@expense-tracker.ow3vquc.mongodb.net/test",function(err,db){
    if (err) throw err;
    var myquery = { method:{name:"Cash",type:"CASH"}};
    var newvalues = {$set:{method:{name:"Cash",type:"CASH",bank:"Cash"}}};
    db.collection("amounts").updateMany(myquery,newvalues,function(err, res) {
      if (err) throw err;
      console.log(" document(s) updated");
      db.close();
    });
});