import { pool } from '../config/db';
import { RequestT } from '../types/requestTypes';
import { format } from 'date-fns';
const fetchAllRequests = async (): Promise<RequestT[]> => {
    try {
        const client = await pool.connect();
        const sql = 'SELECT * FROM request;';
        const { rows } = await client.query(sql);
        client.release();

        // Mapping rows to RequestT type
        return rows.map((row: any) => ({
            ID: row.id,
            title: row.title,
            requestorName: row.requestorName,
            requestGroup: row.request_group,
            description: row.description,
            priority: row.priority,
            finalDecision: row.final_decision,
            planned: row.planned,
            comments: row.comments,
            dateTime: row.date_time,
            affectedGroupList: row.affected_group_list,
            jiraLink: row.jira_link,
            emailRequestor: row.emailRequestor,
        })) as RequestT[];
    } catch (err) {
        console.error('Error fetching requests:', err);
        throw err;
    }
};

const getRequestById = async (id: number): Promise<RequestT | null> => {
    console.log({ id });
    try {
        const client = await pool.connect();
        const sql = 'SELECT * FROM request WHERE id = $1;';
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
            jiraLink: row.jira_link,
            requestorName: row.requestorName,
            emailRequestor: row.emailRequestor,
        } as RequestT;
    } catch (err) {
        console.error('Error fetching request by ID:', err);
        throw err;
    }
};

const getRequestsByGroupId = async (groupId: number): Promise<RequestT[]> => {
    try {
        const client = await pool.connect();
        const sql = `
      SELECT * FROM request
      WHERE $1 = ANY(request_group);
    `;
        const { rows } = await client.query(sql, [groupId]);
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
            jiraLink: row.jira_link,
            requestorName: row.requestorName,
            emailRequestor: row.emailRequestor,
        })) as RequestT[];
    } catch (err) {
        console.error('Error fetching requests by group ID:', err);
        throw err;
    }
};

export const deleteRequestById = async (requestId: number, requestorEmail: string): Promise<void> => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Check if the requestor exists and matches the provided email
        const checkRequestorQuery = `
            SELECT COUNT(*) FROM product_manager
            WHERE email = $1;
        `;
        const { rows } = await client.query(checkRequestorQuery, [requestorEmail]);
        const requestorExists = parseInt(rows[0].count, 10) > 0;

        if (!requestorExists) {
            throw new Error('Unauthorized: Only the requestor can delete this request');
        }

        // Delete request by ID
        const deleteRequestQuery = `
            DELETE FROM request
            WHERE id = $1;
        `;
        await client.query(deleteRequestQuery, [requestId]);

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

//עריכת כותרת ותיאור
export const updateRequestFields = async (id: number, updatedFields: Partial<Pick<RequestT, 'title' | 'description'>>): Promise<RequestT | null> => {
    try {
        const client = await pool.connect();
        const { title, description } = updatedFields;
        const sql = 'UPDATE request SET title = $1, description = $2 WHERE id = $3 RETURNING *;';
        const { rows } = await client.query(sql, [title, description, id]);
        client.release();
        if (rows.length === 0) {
            return null;
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
        } as RequestT;
    } catch (err) {
        console.error('Error updating request:', err);
        throw err;
    }
};
export const updateAffectedGroupList = async (id: number, affectedGroupList: string[]): Promise<RequestT | null> => {
    try {
        const client = await pool.connect();
        const sql = 'UPDATE request SET affected_group_list = $1 WHERE id = $2 RETURNING *;';
        const { rows } = await client.query(sql, [affectedGroupList, id]);
        client.release();
        if (rows.length === 0) {
            return null;
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
        } as RequestT;
    } catch (err) {
        console.error('Error updating affected group list:', err);
        throw err;
    }
};
export const getRequestByIdForUp = async (id: number): Promise<any> => {
    const query = 'SELECT * FROM requests WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
};

export const updateRequestById = async (id: number, updateFields: any): Promise<void> => {
    const setString = Object.keys(updateFields).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const query = `UPDATE requests SET ${setString} WHERE id = $1`;
    const values = [id, ...Object.values(updateFields)];

    await pool.query(query, values);
};

export const updateFinalDecision = async (id: number, finalDecision: boolean): Promise<RequestT | null> => {
    try {
        const client = await pool.connect();
        const sql = 'UPDATE request SET final_decision = $1 WHERE id = $2 RETURNING *;';
        const { rows } = await client.query(sql, [finalDecision, id]);
        client.release();
        if (rows.length === 0) {
            return null;
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
        } as RequestT;
    } catch (err) {
        console.error('Error updating final decision:', err);
        throw err;
    }
};

//הוספת בקשה חדשה
export const addRequest = async (request: RequestT): Promise<void> => {
    const query = `
      INSERT INTO request ( title, request_group, description, priority, planned, comments, date_time, affected_group_list, jira_link, requestor_name,requestor_email)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11 )
    `;
    const today = new Date();
    const formattedToday = today.toISOString();

    const values = [
        request.title,
        request.requestGroup,
        request.description,
        request.priority,
        request.planned,
        request.comments,
        formattedToday,
        request.affectedGroupList,
        request.jiraLink,
        request.requestorName,
        request.emailRequestor,
    ];

    await pool.query(query, values);
};

//עידכון רבעון
export const updatePlanned = async (ID: number, planned: string): Promise<void> => {
    const query = `
      UPDATE request
      SET planned = $1
      WHERE ID = $2
    `;

    const values = [planned, ID];

    await pool.query(query, values);
};

// Function to fetch requests with limit and offset
export const fetchRequests = async (limit: number, offset: number): Promise<RequestT[]> => {
    try {
        const client = await pool.connect();
        const sql = 'SELECT * FROM request ORDER BY id LIMIT $1 OFFSET $2;';
        const { rows } = await client.query(sql, [limit, offset]);
        client.release();

        // Mapping rows to RequestT type
        return rows.map((row: any) => ({
            ID: row.id,
            title: row.title,
            requestorName: row.requestor_name,
            requestGroup: row.request_group,
            description: row.description,
            priority: row.priority,
            finalDecision: row.final_decision,
            planned: row.planned,
            comments: row.comments,
            dateTime: row.date_time,
            affectedGroupList: row.affected_group_list,
            jiraLink: row.jira_link,
            emailRequestor: row.email_requestor,
        })) as RequestT[];
    } catch (err) {
        console.error('Error fetching requests with limit and offset:', err);
        throw err;
    }
};
export { fetchAllRequests, getRequestById, getRequestsByGroupId };
