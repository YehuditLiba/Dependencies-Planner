// productUtils.ts

import { pool } from '../config/db';
import { ProductManager } from '../types/productManagerTypes';
const getProductManagers = async (): Promise<ProductManager[]> => {
    try {
        const client = await pool.connect();
        const sql = `
           SELECT email, name, group_ids
           FROM product_manager;
        `;
        const { rows } = await client.query(sql);
        client.release();
        return rows.map((row: any) => ({
            email: row.email,
            name: row.name,
            group_ids: row.group_ids || []
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

export const updateProductManagerByEmail = async (email: string, newName: string, newGroupIds: number[]) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        // שליפת הערכים הקיימים של group_ids
        const { rows } = await client.query('SELECT group_ids FROM product_manager WHERE email = $1', [email]);
        const currentGroupIds = rows[0].group_ids;
        console.log('Current group_ids:', currentGroupIds);
        // שילוב הערכים הקיימים עם הערכים החדשים תוך מניעת כפילויות
        const updatedGroupIds = Array.from(new Set([...currentGroupIds, ...newGroupIds]));
        console.log('Updated group_ids:', updatedGroupIds);
        // עדכון הערכים
        const updateQuery = 'UPDATE product_manager SET name = $1, group_ids = $2 WHERE email = $3;';
        await client.query(updateQuery, [newName, updatedGroupIds, email]);
        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error updating product manager:', err);
        throw err;
    } finally {
        client.release();
    }
};

const addProductManagerToDb = async (pm: ProductManager): Promise<ProductManager | null> => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const sql = 'INSERT INTO product_manager (email, name, group_ids) VALUES ($1, $2, $3) RETURNING email;';
        const values = [pm.email, pm.name, pm.group_ids];
        const { rows } = await client.query(sql, values);
        const insertedEmail = rows[0].email;
        await client.query('COMMIT');
        const fullRecord = await getProductManagerByEmail(insertedEmail);
        return fullRecord;
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error adding product manager:', err);
        return null;  
    } finally {
        client.release();
    }
};

const getProductManagerByEmail = async (email: string): Promise<ProductManager | null> => {
    const client = await pool.connect();
    try {
        const sql = `
            SELECT email, name, group_ids
            FROM product_manager
            WHERE email = $1;
        `;
        const values = [email];
        const { rows } = await client.query(sql, values);
        return rows.length > 0 ? (rows[0] as ProductManager) : null;
    } catch (err) {
        console.error('Error fetching product manager by email:', err);
        throw err;
    } finally {
        client.release();
    }
};

export const deleteProductManagerByEmail = async (email: string): Promise<void> => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        // const deleteProductManagerGroupsQuery = 'DELETE FROM product_manager_group WHERE product_manager_email = $1;';
        // await client.query(deleteProductManagerGroupsQuery, [email]);
        const deleteProductManagerQuery = 'DELETE FROM product_manager WHERE email = $1;';
        await client.query(deleteProductManagerQuery, [email]);
        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error deleting product manager:', err);
        throw err;
    } finally {
        client.release();
    }
};
  
export { getProductManagers, getRequestsByProductManager, addProductManagerToDb, getProductManagerByEmail };
