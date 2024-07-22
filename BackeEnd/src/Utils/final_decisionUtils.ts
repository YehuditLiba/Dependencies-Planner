import { pool } from '../config/db';
// import { Decision } from '../types/final_decisionTypes';

export const getAllDecisions = async (): Promise<string[]>  => {
    const client = await pool.connect();
    try {
        const query = `
            SELECT final_decision
            FROM request;
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

