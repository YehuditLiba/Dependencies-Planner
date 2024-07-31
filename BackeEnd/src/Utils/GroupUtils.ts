import { poolG } from '../config/db';
import { Group } from '../types/groupTypes'; //Group


export const getAllGroups = (callback: (error: Error | null, results?: Group[]) => void) => {
    const query = 'SELECT * FROM groups'; // groups

    poolG.query(query, (error, results) => {
        if (error) {
            callback(error);
            return;
        }
        callback(null, results.rows);
    });
};
export const updateGroupById = (groupId: number, newName: string, callback: (error: Error | null) => void) => {
    const query = 'UPDATE groups SET name = $1 WHERE id = $2';

    poolG.query(query, [newName, groupId], (error) => {
        if (error) {
            console.error('Database query error:', error);
            callback(error);
            return;
        }
        callback(null);
    });
};
