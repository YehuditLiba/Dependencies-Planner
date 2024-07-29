import { pool } from '../config/db'; 
import { Priority } from '../types/priorityTypes';

export const fetchAllPriorities = async (): Promise<Priority[]> => {
    try {
        const client = await pool.connect();
        const sql = 'SELECT * FROM priority;';
        const { rows } = await client.query(sql);
        client.release();
        return rows.map((row: any) => ({
            id: row.id,
            priority: row.priority,
        })) as Priority[];
    } catch (err) {
        console.error('Error fetching priorities:', err);
        throw err;
    }
};

export const updatePriority = async (ID: number, priority: string): Promise<void> => {
    const query = `
      UPDATE request
      SET priority = $1
      WHERE id = $2
    `;

    const values = [priority, ID];

    try {
        await pool.query(query, values);
    } catch (err) {
        console.error('Error updating priority:', err);
        throw err;
    }
};
