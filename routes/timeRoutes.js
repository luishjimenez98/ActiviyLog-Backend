import { Router } from 'express';
import { verifyAdmin, verifyToken } from '../middlewares/authmiddleware.js';
import { addTime, getHorasPersonalProyecto, getRegistrosProyecto} from '../controllers/timeController.js';
const router = Router()

router.post('/',verifyToken,addTime);

router.post('/personal/proyecto',verifyToken,getHorasPersonalProyecto)
router.post('/registros/personal',verifyAdmin,getRegistrosProyecto)
export default router;