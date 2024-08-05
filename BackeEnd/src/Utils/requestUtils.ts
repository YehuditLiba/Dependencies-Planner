import { pool } from '../config/db';
import { RequestT } from '../types/requestTypes';
// import { createAffectedGroupInDB } from './affectedGroupsUtils';
// import { deleteAffectedGroupsByRequestId } from './affectedGroupsUtils';
import { createAffectedGroupInDB, deleteAffectedGroupsByRequestId } from './affectedGroupsUtils';


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
  
      // בדיקת הרשאה
      const checkRequestorQuery = `
        SELECT COUNT(*) FROM request
        WHERE id = $1 AND requestor_email = $2;
      `;
      const { rows } = await client.query(checkRequestorQuery, [requestId, requestorEmail]);
      const requestorExists = parseInt(rows[0].count, 10) > 0;
  
      if (!requestorExists) {
        throw new Error('Unauthorized: Only the requestor can delete this request');
      }

        // Delete affected groups first
        await deleteAffectedGroupsByRequestId(requestId);

        // Delete the request
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
export const updateRequestFields = async (id: number, updatedFields: Partial<Pick<RequestT, 'title' | 'description' | 'comments'>>): Promise<RequestT | null> => {
    try {
        const client = await pool.connect();
        const { title, description, comments } = updatedFields;
        const sql = 'UPDATE request SET title = $1, description = $2, comments = $3 WHERE id = $4 RETURNING *;';
        const { rows } = await client.query(sql, [title, description, comments, id]);
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

export const addRequest = async (request: RequestT): Promise<void> => {
    const query = `
      INSERT INTO request (title, request_group, description, priority, planned, comments, date_time, affected_group_list, jira_link, requestor_name, requestor_email)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id
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
    
    // Start a transaction
    await pool.query('BEGIN');

    try {
        // Insert the request and get the inserted request's ID
        const result = await pool.query(query, values);
        const requestId = result.rows[0].id;

        // Insert each affected group with status 1
        for (const groupId of request.affectedGroupList) {
            await createAffectedGroupInDB(requestId, groupId, 1);
        }

        // Commit the transaction
        await pool.query('COMMIT');
    } catch (error) {
        // Rollback the transaction in case of an error
        await pool.query('ROLLBACK');
        throw error;
    }
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


export const filterRequests = async (
    requestorName: string | undefined,
    requestorGroup: string | undefined,
    affectedGroupList: string | undefined,
    sortBy: string,
    sortDirection: 'ASC' | 'DESC',
    limit: number,
    offset: number
): Promise<{ totalCount: number; requests: RequestT[] }> => {
    console.log('Filtering requests with parameters:', requestorName, requestorGroup, affectedGroupList);

    let sql = `
    WITH affected_groups AS (
        SELECT
            ag.request_id,
            json_agg(json_build_object(
                'groupId', ag.group_id,
                'status', json_build_object(
                    'id', COALESCE(s.id, 0),
                    'status', COALESCE(s.status, 'Not Required')
                )
            )) AS statuses,
            ARRAY_AGG(ag.group_id) AS affected_group_list
        FROM
            affected_group ag
        LEFT JOIN
            status s ON ag.status = s.id
        GROUP BY
            ag.request_id
    )
    SELECT
        r.*,
        COUNT(*) OVER() AS total_count,
        COALESCE(ag.affected_group_list, '{}') AS affected_group_list,
        COALESCE(ag.statuses, '[]'::json) AS statuses
    FROM
        request r
    LEFT JOIN
        affected_groups ag ON r.id = ag.request_id
    WHERE
        1 = 1
  `;

    const values: any[] = [];

    if (requestorName) {
        sql += ` AND r.requestor_name ILIKE $${values.length + 1}`;
        values.push(`%${requestorName}%`);
    }

    if (requestorGroup) {
        sql += ` AND r.request_group ILIKE $${values.length + 1}`;
        values.push(`%${requestorGroup}%`);
    }

    if (affectedGroupList) {
        const groupIds = affectedGroupList.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id));

        if (groupIds.length > 0) {
            sql += ` AND r.id IN (
                SELECT ag.request_id FROM affected_group ag WHERE ag.group_id = ANY($${values.length + 1})
            )`;
            values.push(groupIds);
        } else {
            // If no valid group IDs, handle the case as needed
            sql += ` AND FALSE`; // Ensures no results are returned
        }
    }

    sql += ` ORDER BY ${sortBy} ${sortDirection}`;

    if (limit > 0) {
        sql += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
        values.push(limit);
        values.push(offset);
    }

    console.log('Generated SQL:', sql);
    console.log('SQL Values:', values);

    let client;
    try {
        client = await pool.connect();
        const { rows } = await client.query(sql, values);

        console.log('Rows returned from query:', rows.length);

        const totalCount = rows.length > 0 ? parseInt(rows[0].total_count, 10) : 0;
        console.log('Total count:', totalCount);
        console.log('Rows:', rows);

        const requests = rows.map((row: any) => ({
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
            statuses: row.statuses,
            jiraLink: row.jira_link,
            requestorName: row.requestor_name,
            emailRequestor: row.requestor_email,
        }));

        console.log('Processed Requests:', requests);

        return { totalCount, requests };
    } catch (err) {
        console.error('Error filtering requests:', err);
        throw err;
    } finally {
        if (client) client.release();
    }
};





export { getRequestById, getRequestsByGroupId };
