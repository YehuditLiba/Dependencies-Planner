// productUtils.ts

import { pool } from '../config/db';
import { ProductManager } from '../types/productManagerTypes';

const getProductManagers = async (): Promise<ProductManager[]> => {
    try {
        const client = await pool.connect();
        const sql = `
            SELECT pm.email, pm.name, COALESCE(array_agg(pmg.group_id), '{}') AS group_ids
            FROM product_manager pm
            LEFT JOIN product_manager_group pmg ON pm.email = pmg.product_manager_email
            GROUP BY pm.email, pm.name;
        `;
        console.log('Running SQL:', sql);
        const { rows } = await client.query(sql);
        client.release();
        console.log('Fetched Product Managers:', rows);
        return rows.map((row: any) => ({
            email: row.email,
            name: row.name,
            group_ids: row.group_ids.filter((id: number) => id !== null) 
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
// export const updateProductManagerByEmail = async (email: string, newName: string, newGroupIds: number[]) => {
//     const client = await pool.connect();
//     try {
//         const updateQuery = 'UPDATE product_manager SET name = $1 WHERE email = $2;';
//         await client.query(updateQuery, [newName, email]);
//         const deleteQuery = 'DELETE FROM product_manager_group WHERE product_manager_email = $1;';
//         await client.query(deleteQuery, [email]);
//         const insertGroupPromises = newGroupIds.map(group_ids =>
//             client.query(
//                 'INSERT INTO product_manager_group (product_manager_email, group_id) VALUES ($1, $2);',
//                 [email, group_ids]
//             )
//         );

//         await Promise.all(insertGroupPromises);
//     } catch (err) {
//         console.error('Error updating product manager:', err);
//         throw err;
//     } finally {
//         client.release();
//     }
// };
export const updateProductManagerByEmail = async (email: string, newName: string, newGroupIds: number[]) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const updateQuery = 'UPDATE product_manager SET name = $1 WHERE email = $2;';
        await client.query(updateQuery, [newName, email]);
        const deleteQuery = 'DELETE FROM product_manager_group WHERE product_manager_email = $1;';
        await client.query(deleteQuery, [email]);
        const insertGroupPromises = newGroupIds.map(groupId =>
            client.query(
                'INSERT INTO product_manager_group (product_manager_email, group_id) VALUES ($1, $2);',
                [email, groupId]
            )
        );
        await Promise.all(insertGroupPromises);
        await client.query('COMMIT'); // התחייבות לטרנזקציה
    } catch (err) {
        await client.query('ROLLBACK'); // חזרה מטעויות
        console.error('Error updating product manager:', err);
        throw err;
    } finally {
        client.release();
    }
};

const addProductManagerToDb = async (pm: ProductManager): Promise<ProductManager> => {
    try {
        const client = await pool.connect();
        const sql = 'INSERT INTO product_manager (name, email) VALUES ($1, $2) RETURNING *;';
        const values = [pm.name, pm.email];
        const { rows } = await client.query(sql, values);
        const insertGroupPromises = pm.group_ids.map(group_id =>
            client.query(
                'INSERT INTO product_manager_group (product_manager_email, group_id) VALUES ($1, $2);',
                [pm.email, group_id]
            )
        );
        await Promise.all(insertGroupPromises);
        client.release();
        return rows[0] as ProductManager;
    } catch (err) {
        console.error('Error adding product manager:', err);
        throw err;
    }
};
export const deleteProductManagerByEmail = async (email: string): Promise<void> => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const deleteProductManagerGroupsQuery = 'DELETE FROM product_manager_group WHERE product_manager_email = $1;';
        await client.query(deleteProductManagerGroupsQuery, [email]);
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
  
export { getProductManagers, getRequestsByProductManager, addProductManagerToDb };
