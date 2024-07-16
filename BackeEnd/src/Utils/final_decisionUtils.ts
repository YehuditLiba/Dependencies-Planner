import { pool } from '../config/db';

export const getAllDecisions = async () => {
    const client = await pool.connect();
    try {
        const query = `
            SELECT final_decision
            FROM decisions;
        `;
     
        const { rows } = await client.query(query);
        return rows.map((row: any) => row.final_decision);
    } catch (err) {
        console.error('Failed to fetch decisions:', err);
        throw new Error('Failed to fetch decisions');
    } finally {
        client.release();
    }
};
