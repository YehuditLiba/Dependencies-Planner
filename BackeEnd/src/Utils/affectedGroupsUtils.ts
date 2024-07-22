

import { pool } from '../config/db';
import { AffectedGroup } from '../types/affectedGroupsTypes';

export const getAllAffectedGroups = async (): Promise<AffectedGroup[]> => {
    try {
        const client = await pool.connect();
        const sql = 'SELECT * FROM affected_group;';
        const { rows } = await client.query(sql);
        client.release();
        return rows.map((row: any) => ({
            requestId: row.request_id,
            groupId: row.group_id,
            status: row.status,
            id: row.id,
        })) as AffectedGroup[];
    } catch (err) {
        console.error('Error fetching affected groups:', err);
        throw err;
    }
};

export const updateAffectedGroupStatus = async (id: number, status: string): Promise<AffectedGroup | null> => {
    try {
        const client = await pool.connect();
        const sql = 'UPDATE affected_group SET status = $1 WHERE id = $2 RETURNING *;';
        const { rows } = await client.query(sql, [status, id]);
        client.release();
        if (rows.length === 0) {
            return null;
        }
        const row = rows[0];
        return {
            requestId: row.request_id,
            groupId: row.group_id,
            status: row.status,
            id: row.id,
        } as AffectedGroup;
    } catch (err) {
        console.error('Error updating affected group status:', err);
        throw err;
    }
};
