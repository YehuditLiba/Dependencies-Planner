// requestCon.ts

import { Request, Priority } from '../types/requestTypes';
import { pool } from '../config/db';

// Function to fetch all requests
const GetAllReq = async () => {
  try {
    const client = await pool.connect();
    const sql = `
      SELECT * FROM requests;
    `;
    const { rows } = await client.query(sql);
    client.release();
    return rows.map((row: any) => ({
      ID: row.id,
      title: row.title,
      requestGroup: row.request_group,
      description: row.description,
      priority: row.priority as Priority, // Assuming row.priority is a string that matches the enum values
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

export { GetAllReq };
