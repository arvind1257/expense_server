import Express from "express";
import { login} from "../Controllers/users.js"
const router = Express.Router();

router.post('/login',login)

export default router;