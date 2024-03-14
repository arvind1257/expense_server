import  Express  from "express";
import mongoose from "mongoose";
import morgan from "morgan"
import Cors from "cors";
import bodyParser from "body-parser";
import userRoutes from "./Routes/users.js"
import amountRoutes from "./Routes/amount.js"
import groupRoutes from "./Routes/gpamount.js"
import noteRoutes from "./Routes/notes.js"
import reportRoutes from "./Routes/reports.js"

const app = Express();
app.use(morgan("dev")); 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(Express.json({limit:"30mb",extended:true}))
app.use(Express.urlencoded({limit:"30mb",extended:true}))
app.use(Cors());

app.get('/',(req,res) => {
    res.send("This is a Expense Tracker Server111 ")
})

app.use('/user',userRoutes)
app.use('/amount',amountRoutes)
app.use('/note',noteRoutes)
app.use('/groupamount',groupRoutes)
app.use('/report',reportRoutes)

app.use((req, res, next) => {
    var error = new Error("Not Found");
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://expense:Geetha123@expense-tracker.ow3vquc.mongodb.net/test",{useNewUrlParser: true,useUnifiedTopology:true})
.then(() => app.listen(5000,() => console.log("successfully Connected")))
.catch((err) => console.log(err.message))
