import Express from "express";
import { login} from "../Controllers/users.js"
import { CheckAuth } from "../Middlewares/CheckAuth.js";
import { addSettlement, deleteSettlement } from "../Controllers/settlement.js";
const router = Express.Router();

router.post('/add',CheckAuth,addSettlement)
router.patch('/delete',CheckAuth,deleteSettlement)

export default router;