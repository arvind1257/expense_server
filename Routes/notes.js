import Express from "express";
import {CheckAuth} from "../Middlewares/CheckAuth.js"
import {addMessage, deleteMessage} from "../Controllers/notes.js"
const router = Express.Router();

router.post('/new',CheckAuth,addMessage)
router.delete('/delete/:id',CheckAuth,deleteMessage)

export default router;