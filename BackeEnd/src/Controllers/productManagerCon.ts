
// import { Request, Response } from 'express';

import { pool } from '../config/db';



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
  

