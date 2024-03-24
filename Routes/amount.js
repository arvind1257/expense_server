import Express from "express";
import { customAmounts,addAmounts, editAmounts, deleteAmounts} from "../Controllers/amount.js"
import {CheckAuth} from "../Middlewares/CheckAuth.js"
const router = Express.Router();

router.post('/custom',CheckAuth,customAmounts)
router.post('/add',CheckAuth,addAmounts)
router.patch('/edit/:id',CheckAuth,editAmounts)
router.delete('/delete/:id',CheckAuth,deleteAmounts)
export default router;