import { Router } from 'express';
import { verifyAdmin, verifyToken } from '../middlewares/authmiddleware.js';
import { createProject, getProject, joinProject, getProjectPersonal,updateProject,getEstados,crearEstados } from '../controllers/projectController.js';
const router = Router()

router.post('/crear',verifyAdmin,createProject);
router.post('/', verifyToken, getProject);
router.post('/unirse',verifyToken, joinProject);
router.post('/personal',verifyToken,getProjectPersonal);
router.put('/actualizar',verifyToken,updateProject);
router.get('/estados',verifyToken, getEstados);
router.post('/crear/estadis',crearEstados);

export default router;

