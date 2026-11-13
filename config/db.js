import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// override: true obliga a que el archivo .env pise las variables que GoDaddy mete por defecto
const envResult = dotenv.config({ override: true });

console.log('--- DIAGNÓSTICO DE VARIABLES DB ---');
console.log('Archivo .env cargado:', envResult.error ? `ERROR: ${envResult.error.message}` : 'OK');
console.log({
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
  TIENE_PASSWORD: Boolean(process.env.DB_PASSWORD) // true/false para no exponer la clave en logs
});
console.log('-----------------------------------');

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});