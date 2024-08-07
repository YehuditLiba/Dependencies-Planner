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
            statusId: row.status,
            id: row.id,
        })) as AffectedGroup[];
    } catch (err) {
        console.error('Error fetching affected groups:', err);
        throw err;
    }
};

export const updateAffectedGroupStatusInDB = async (affectedGroupId: number, statusId: number) => {
    // בדיקה אם הסטטוס קיים
    const statusResult = await pool.query('SELECT * FROM status WHERE id = $1', [statusId]);
    if (statusResult.rowCount === 0) {
        throw new Error('Status not found');
    }

    // עדכון הסטטוס של ה-AffectedGroup
    const updatedAffectedGroup = await pool.query(
        'UPDATE affected_group SET status = $1 WHERE id = $2 RETURNING *',
        [statusId, affectedGroupId]
    );

    if (updatedAffectedGroup.rowCount === 0) {
        throw new Error('AffectedGroup not found');
    }

    return updatedAffectedGroup.rows[0];
};
//create new
export const createAffectedGroupInDB = async (requestId: number, groupId: number, statusId: number) => {
    const statusResult = await pool.query('SELECT * FROM status WHERE id = $1', [statusId]);
    if (statusResult.rowCount === 0) {
        throw new Error('Status not found');
    }

    const newAffectedGroup = await pool.query(
        'INSERT INTO affected_group (request_id, group_id, status) VALUES ($1, $2, $3) RETURNING *',
        [requestId, groupId, statusId]
    );

    return newAffectedGroup.rows[0];
};
//delete
export const deleteAffectedGroupsByRequestId = async (requestId: number): Promise<void> => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
  
      console.log('Deleting affected groups for request ID:', requestId);
  
      const deleteAffectedGroupsQuery = `
        DELETE FROM affected_group
        WHERE request_id = $1;
      `;
      const deleteResult = await client.query(deleteAffectedGroupsQuery, [requestId]);
      console.log('Affected groups deleted, rows affected:', deleteResult.rowCount);
  
      await client.query('COMMIT');
      console.log('Affected groups deletion completed successfully');
    } catch (error) {
      console.error('Error during affected groups deletion:', error);
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  };
  
  
export const getAllRequestsWithStatusesFromDB = async () => {
    const client = await pool.connect();
    try {
        const sql = `
            SELECT 
                r.id AS request_id, 
                ag.group_id AS group_id, 
                ag.status AS status_id, 
                s.status AS status_description
            FROM 
                affected_group ag
                JOIN request r ON ag.request_id = r.id
                JOIN status s ON ag.status = s.id
        `;
        const { rows } = await client.query(sql);
        return rows;
    } catch (err) {
        console.error('Error fetching requests with statuses:', err);
        throw err;
    } finally {
        client.release(); // שחרור הקונקשן לאחר סיום השימוש
    }
};

