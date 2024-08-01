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

export const getPriorityIdByName = async (priorityName: string): Promise<number | null> => {
    try {
        const client = await pool.connect();
        const sql = 'SELECT id FROM priority WHERE priority = $1;';
        const { rows } = await client.query(sql, [priorityName]);
        client.release();

        if (rows.length === 0) {
            return null;
        }
        return rows[0].id;
    } catch (err) {
        console.error('Error fetching priority ID:', err);
        throw err;
    }
};


export const updatePriority = async (ID: number, /*priority: string*/priorityId: number): Promise<void> => {
    const query = `
      UPDATE request
      SET priority = $1
      WHERE id = $2
    `;

    const values = [/*priority*/priorityId, ID];

    try {
        await pool.query(query, values);
    } catch (err) {
        console.error('Error updating priority:', err);
        throw err;
    }
};
