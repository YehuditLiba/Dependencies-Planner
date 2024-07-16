import { pool } from '../config/db';

export const getTSize = async () => {
    const client = await pool.connect();
    try {
        const query = `
            SELECT
                t_size
            FROM
                t_size;
        `;

        const { rows } = await client.query(query);
        return rows.map((row: any) => row.t_size);
    } catch (err) {
        console.error('Failed to fetch t_size:', err);
        throw new Error('Failed to fetch t_size'); 
    } finally {
        client.release(); 
    }
};
