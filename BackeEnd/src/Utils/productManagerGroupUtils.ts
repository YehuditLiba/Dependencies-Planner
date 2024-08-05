import { pool } from '../config/db';
import { ProductManagerGroup } from '../types/productManagerGroupTypes';

// export const addProductManagerToGroup = async (productManagerGroup: ProductManagerGroup) => {
//     const { product_manager_email, group_id } = productManagerGroup;
//     await pool.query(
//         'INSERT INTO product_manager_group (product_manager_email, group_id) VALUES ($1, $2)',
//         [product_manager_email, group_id]
//     );
// };


export const addProductManagerToGroup = async (params: { product_manager_email: string; group_id: number }): Promise<void> => {
    const { product_manager_email, group_id } = params;

    if (!product_manager_email || !group_id) {
        throw new Error('Missing parameters');
    }

    try {
        await pool.query(
            'INSERT INTO product_manager_group (product_manager_email, group_id) VALUES ($1, $2)',
            [product_manager_email, group_id]
        );
    } catch (error) {
        console.error('Error adding product manager to group:', error);
        throw error;
    };
};

export const getGroupsForProductManager = async (email: string): Promise<number[]> => {
    try {
        const client = await pool.connect();
        const query = `
            SELECT group_id FROM product_manager_group
            WHERE product_manager_email = $1;
        `;
        const { rows } = await client.query(query, [email]);
        client.release();
        return rows.map(row => row.group_id);
    } catch (err) {
        console.error('Error fetching groups for product manager:', err);
        throw err;
    }
};
export const getAllGroupsForProductManagers = async (): Promise<{ email: string, group_ids: number[] }[]> => {
    try {
        const client = await pool.connect();
        const query = `
            SELECT product_manager_email, group_id
            FROM product_manager_group;
        `;
        const { rows } = await client.query(query);
        client.release();
        const result: { [key: string]: number[] } = {};
        rows.forEach(row => {
            if (!result[row.product_manager_email]) {
                result[row.product_manager_email] = [];
            }
            result[row.product_manager_email].push(row.group_id);
        });
        return Object.keys(result).map(email => ({
            email,
            group_ids: result[email]
        }));
    } catch (err) {
        console.error('Error fetching all groups for product managers:', err);
        throw err;
    }
};