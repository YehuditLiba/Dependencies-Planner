// productUtils.ts

import { pool } from '../config/db';
import { ProductManager } from '../types/productManagerTypes';

const getProductManagers = async (): Promise<ProductManager[]> => {
    try {
        const client = await pool.connect();
        const sql = `
            SELECT * FROM product_manager;
        `;
        const { rows } = await client.query(sql);
        client.release();

        return rows.map((row: any) => ({
            email: row.email,
            name: row.name,
            group_id: row.group_id
        })) as ProductManager[];
    } catch (err) {
        console.error('Error fetching product managers:', err);
        throw err;
    }
};
 const getRequestsByProductManager = async (groupId: number) => {
    const client = await pool.connect();
    try {
        const res = await client.query(`
            SELECT r.*
            FROM requests r
            JOIN product_manager pm ON pm.group_id = ANY (r.request_group)
            WHERE pm.group_id = $1;
        `, [groupId]);
        return res.rows;
    } catch (err) {
        console.error('Error in getRequestsByProductManager:', err);
        throw err;
    } finally {
        client.release();
    }
};

export { getProductManagers, getRequestsByProductManager };
