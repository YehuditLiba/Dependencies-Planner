// import { pool } from '../config/db';
// import { RequestT } from '../types/requestTypes';
// import { AffectedGroup } from '../types/affectedGroupsTypes'


// export const getAllAffectedGroups = async (): Promise<AffectedGroup[]> => {
//      try {
//         const client = await pool.connect();
//         const sql = 'SELECT * FROM affected_group;';
//         const { rows } = await client.query(sql);
//         client.release();
//         return rows.map((row: any) => ({
//             requestId: row.requestId,
//             groupId: row.groupId,
//             status: row.status,
//             id: row.id,
//         })) as AffectedGroup[];
//     } catch (err) {
//         console.error('Error fetching AffectedGroup:', err);
//         throw err;
//     }
// };


// export const updateAffectedGroupList = async (id: number, affectedGroupList: string[]): Promise<RequestT | null> => {
//     try {
//         const client = await pool.connect();
//         const sql = 'UPDATE request SET affected_group_list = $1 WHERE id = $2 RETURNING *;';
//         const { rows } = await client.query(sql, [affectedGroupList, id]);
//         client.release();
//         if (rows.length === 0) {
//             return null;
//         }
//         const row = rows[0];
//         return {
//             ID: row.id,
//             title: row.title,
//             requestGroup: row.request_group,
//             description: row.description,
//             priority: row.priority,
//             finalDecision: row.final_decision,
//             planned: row.planned,
//             comments: row.comments,
//             dateTime: row.date_time,
//             affectedGroupList: row.affected_group_list,
//             jiraLink: row.jira_link
//         } as RequestT;
//     } catch (err) {
//         console.error('Error updating affected group list:', err);
//         throw err;
//     }
// };

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
