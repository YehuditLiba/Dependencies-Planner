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

export const getStatus = async () => {
    const client = await pool.connect();
    try {
        const query = `
            SELECT
                status
            FROM
                status;
        `;

        const { rows } = await client.query(query);
        return rows.map((row: any) => row.status);
    } catch (err) {
        console.error('Failed to fetch statuses:', err);
        throw new Error('Failed to fetch statuses'); // זריקת שגיאה כאשר יש בעיה
    } finally {
        client.release(); // שחרור הקליינט לאחר השאילתה
    }
};
export const getAllStatuses = async (): Promise<Status[]> => {
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
export const updateRequestStatusInDB = async (requestId: number, groupId: number, status: string): Promise<any> => {
    try {
        const result = await pool.query(
            'UPDATE affected_group SET status = $1 WHERE request_id = $2 AND group_id = $3 RETURNING *',
            [status, requestId, groupId]
        );

        if (result.rows.length === 0) {
            throw new Error('Request or group not found');
        }

        return result.rows[0];
    } catch (err) {
        console.error('Error in updateRequestStatusInDB:', err);
        throw err;
    }
};