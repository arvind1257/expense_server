import Express from "express";
import { customAmounts} from "../Controllers/amount.js"
import {CheckAuth} from "../Middlewares/CheckAuth.js"
const router = Express.Router();

router.post('/custom',CheckAuth,customAmounts)

export default router;