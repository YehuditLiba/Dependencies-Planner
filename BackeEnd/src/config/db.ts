

import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

console.log('Database user:', process.env.DB_USER);
console.log('Database host:', process.env.DB_HOST);
console.log('Database name:', process.env.DB_DATABASE);
console.log('Database password:', process.env.DB_PASSWORD); 
console.log('Database port:', process.env.DB_PORT);

// First database configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 0,

   ssl:{ rejectUnauthorized: false }

});

// Second database configuration
const poolG = new Pool({
  user: process.env.DB_USER_G,
  host: process.env.DB_HOST_G,
  database: process.env.DB_DATABASE_G,

  password: process.env.DB_PASSWORD_G,
  port: Number(process.env.DB_PORT_G),
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 0,
  ssl: { rejectUnauthorized: false } 

});

// Function to connect to both databases
const connectToDatabases = () => {
  // Test connection to first database
  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Error connecting to first PostgreSQL database:', err);
    } else {
      console.log('Connected to first PostgreSQL database at:', process.env.DB_HOST);
    }
  });

  // Test connection to second database
  poolG.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Error connecting to second PostgreSQL database:', err);
    } else {
      console.log('Connected to second PostgreSQL database at:', process.env.DB_HOST_G);
    }
  });
};

// Exporting pools and connection function
export { pool, poolG, connectToDatabases };
