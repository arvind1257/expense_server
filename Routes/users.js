import Express from "express";
import { exchange, login, updateProfile, userDetail, updatePassword, addDetails, editDetails} from "../Controllers/users.js"
import { CheckAuth } from "../Middlewares/CheckAuth.js";
const router = Express.Router();

router.post('/login',login)
router.get('/details',CheckAuth,userDetail)
router.patch('/exchange',CheckAuth,exchange)
router.patch('/profile',CheckAuth,updateProfile)
router.patch('/password',CheckAuth,updatePassword)
router.patch('/addDetails/:value',CheckAuth,addDetails)
router.patch('/editDetails/:value',CheckAuth,editDetails)

export default router;