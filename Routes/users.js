import Express from "express";
import { login, userDetail} from "../Controllers/users.js"
import { CheckAuth } from "../Middlewares/CheckAuth.js";
const router = Express.Router();

router.post('/login',login)
router.get('/:id',CheckAuth,userDetail)

export default router;