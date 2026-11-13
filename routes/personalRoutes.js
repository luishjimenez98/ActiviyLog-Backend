import { Router } from 'express';
import { verifyAdmin,verifyToken } from '../middlewares/authmiddleware.js';
import { getPersonal,createPersonal, getPersonalProject, getHorasProyectosPesonal,getPermisos,getPersonalProyectoPermisos,updatePermisosPersonal,crearPermisos } from '../controllers/personalController.js';

const router = Router();

// Ruta exclusiva de Administrador para crear usuarios
router.post('/', createPersonal);

router.get('/', verifyAdmin, getPersonal);
router.post('/proyecto',verifyToken, getPersonalProject);
router.get('/permisos',verifyToken,getPermisos);
router.post('/proyecto/permisos',verifyAdmin,getPersonalProyectoPermisos);
router.post('/proyecto/permisos/actualizar', verifyAdmin,updatePermisosPersonal)
router.post('/horas/proyecto',verifyAdmin,getHorasProyectosPesonal)
router.post('/crear/permisos',crearPermisos);
export default router;