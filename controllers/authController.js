import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

export const login = async (req, res) => {
  const { Email, Contrasena } = req.body || {};

  if (!Email || !Contrasena) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(Email)) {
    return res.status(400).json({ error: 'El formato del correo electrónico debe incluir "@" y ".".' });
  }

  // 1. Verificar conexión y consulta a MySQL
  let rows;
  try {
    [rows] = await pool.query(
      'SELECT Id_personal, Nombre, Apellido_paterno, Admin, Email, Contrasena FROM personal WHERE Email = ?',
      [Email]
    );
  } catch (dbError) {
    console.error('Error en BD (Login):', dbError);
    return res.status(500).json({
      origen: 'BASE_DE_DATOS',
      error: dbError.message,
      code: dbError.code,
      configLeida: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        tienePassword: Boolean(process.env.DB_PASSWORD)
  }
    });
  }

  if (rows.length === 0) {
    return res.status(401).json({ error: 'Credenciales incorrectas.' });
  }

  const usuario = rows[0];

  // 2. Verificar comparación de contraseña con bcryptjs
  let passwordValida;
  try {
    passwordValida = await bcrypt.compare(Contrasena, usuario.Contrasena);
  } catch (bcryptError) {
    console.error('Error en Bcrypt (Login):', bcryptError);
    return res.status(500).json({
      origen: 'BCRYPT',
      error: bcryptError.message
    });
  }

  if (!passwordValida) {
    return res.status(401).json({ error: 'Credenciales incorrectas.' });
  }

  // 3. Verificar firma del JWT (y que JWT_SECRET exista)
  if (!process.env.JWT_SECRET) {
    console.error('Error crítico: JWT_SECRET no está definido en process.env');
    return res.status(500).json({
      origen: 'ENV_VARIABLES',
      error: 'La variable JWT_SECRET es undefined en el servidor.'
    });
  }

  let token;
  try {
    const isAdmin = Boolean(usuario.Admin);
    token = jwt.sign(
      { 
        id: usuario.Id_personal,
        nombre: usuario.Nombre,
        email: usuario.Email, 
        Admin: isAdmin 
      },
      process.env.JWT_SECRET,
      { expiresIn: '62h' }
    );

    const { Contrasena: _, ...usuarioPayload } = usuario;

    return res.json({
      user: {
        ...usuarioPayload,
        Admin: isAdmin
      },
      token
    });
  } catch (jwtError) {
    console.error('Error en JWT (Login):', jwtError);
    return res.status(500).json({
      origen: 'JWT_SIGN',
      error: jwtError.message
    });
  }
};