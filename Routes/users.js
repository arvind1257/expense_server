import Express from "express";
import { exchange, login, userDetail} from "../Controllers/users.js"
import { CheckAuth } from "../Middlewares/CheckAuth.js";
const router = Express.Router();

router.post('/login',login)
router.get('/details',CheckAuth,userDetail)
router.patch('/exchange',CheckAuth,exchange)

export default router;