import { pool } from '../config/db';
import { Request } from '../types/requestTypes';

const fetchAllRequests = async (): Promise<Request[]> => {
    try {
        const client = await pool.connect();
        const sql = `
            SELECT * FROM request;
        `;
        const { rows } = await client.query(sql);
        client.release();
        return rows.map((row: any) => ({
            ID: row.id,
            title: row.title,
            requestGroup: row.request_group,
            description: row.description,
            priority: row.priority,
            finalDecision: row.final_decision,
            planned: row.planned,
            comments: row.comments,
            dateTime: row.date_time,
            affectedGroupList: row.affected_group_list,
            jiraLink: row.jira_link
        })) as Request[];
    } catch (err) {
        console.error('Error fetching requests:', err);
        throw err;
    }
};

const getRequestById = async (id: number): Promise<Request | null> => {
    console.log({ id });
    try {
        const client = await pool.connect();
        const sql = `
            SELECT * FROM request
            WHERE id = $1;
        `;
        const { rows } = await client.query(sql, [id]);
        client.release();

        if (rows.length === 0) {
            return null; // If no request found with that ID
        }

        const row = rows[0];
        return {
            ID: row.id,
            title: row.title,
            requestGroup: row.request_group,
            description: row.description,
            priority: row.priority,
            finalDecision: row.final_decision,
            planned: row.planned,
            comments: row.comments,
            dateTime: row.date_time,
            affectedGroupList: row.affected_group_list,
            jiraLink: row.jira_link
        } as Request;
    } catch (err) {
        console.error('Error fetching request by ID:', err);
        throw err;
    }
};

export { fetchAllRequests, getRequestById };
