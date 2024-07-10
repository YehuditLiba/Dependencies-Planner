
import { pool } from '../config/db';

// Assuming pool is imported correctly from your db configuration file

export interface ProductManager {
  email: string;
  name: string;
  groupID: number[];
}


export const getAllProductManagerNames = async (): Promise<{ name: string }[]> => {
  try {
    console.log('Entering getAllProductManagerNames method');
    const result = await pool.query('SELECT name FROM productmanager');
    console.log('Query executed successfully, result:', result.rows);
    return result.rows;
  } catch (err) {
    console.error('Error executing query in getAllProductManagerNames:', err);
    throw err;
  }
};

