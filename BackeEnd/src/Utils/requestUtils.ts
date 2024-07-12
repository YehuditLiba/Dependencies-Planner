import { pool } from '../config/db';
import { Request } from '../types/requestTypes';

const fetchAllRequests = async (): Promise<Request[]> => {
    try {
        const client = await pool.connect();
        const sql = 'SELECT * FROM request;';
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
            jiraLink: row.jira_link
        } as Request;
    } catch (err) {
        console.error('Error fetching request by ID:', err);
        throw err;
    }
};

const getRequestsByGroupId = async (groupId: number): Promise<Request[]> => {
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
            jiraLink: row.jira_link
        })) as Request[];
    } catch (err) {
        console.error('Error fetching requests by group ID:', err);
        throw err;
    }
};

const deleteRequestsByGroupId = async (groupId: number): Promise<void> => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // התחלת טרנזקציה

        // מחיקת הרשומות מהטבלה התלויה
        await client.query(`
      DELETE FROM affected_group
      WHERE request_id IN (
        SELECT id FROM request
        WHERE $1 = ANY(request_group)
      )
    `, [groupId]);

        // מחיקת הרשומות מהטבלה הראשית
        await client.query(`
      DELETE FROM request
      WHERE $1 = ANY(request_group)
    `, [groupId]);

        await client.query('COMMIT'); // סיום הטרנזקציה בהצלחה
    } catch (error) {
        await client.query('ROLLBACK'); // חזרה למצב הקודם במקרה של שגיאה
        throw error; // זריקת השגיאה כדי לטפל בה ברמה גבוהה יותר
    } finally {
        client.release();
    }
};

//עריכת כותרת ותיאור
export const updateRequestFields = async (id: number, updatedFields: Partial<Pick<Request, 'title' | 'description'>>): Promise<Request | null> => {
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
        } as Request;
    } catch (err) {
        console.error('Error updating request:', err);
        throw err;
    }
};
export const updateAffectedGroupList = async (id: number, affectedGroupList: string[]): Promise<Request | null> => {
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
        } as Request;
    } catch (err) {
        console.error('Error updating affected group list:', err);
        throw err;
    }
};

export { fetchAllRequests, getRequestById, getRequestsByGroupId, deleteRequestsByGroupId };
