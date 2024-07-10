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
