import { pool } from '../config/db';
import { Status } from '../types/StatusTypes';

export const fetchAllStatuses = async (): Promise<Status[]> => {
    try {
        const client = await pool.connect();
        const sql = 'SELECT * FROM status;';
        const { rows } = await client.query(sql);
        client.release();
        return rows.map((row: any) => ({
            id: row.id,
            status: row.status,
        })) as Status[];
    } catch (err) {
        console.error('Error fetching statuses:', err);
        throw err;
    }
};
