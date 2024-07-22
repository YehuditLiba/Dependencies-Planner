import { pool } from '../config/db';

export const getAllRequestorNames = async ():Promise<string[]> => {
    const client = await pool.connect();
    try {
        const query = `SELECT requestor_name FROM request;`;
     
        const { rows } = await client.query(query);
        return rows.map((row: any) => row.requestor_name);
    } catch (err) {
        console.error('Failed to fetch requestor names:', err);
        throw new Error('Failed to fetch requestor names');
    } finally {
        client.release();
    }
};

