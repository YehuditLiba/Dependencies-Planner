import { pool } from '../config/db';
import { Request as DPRequest } from '../types/requestTypes'; // שימוש בטיפוס Request

// פונקציה לשיפור כל הבקשות ממסד הנתונים
export const getAllRequests = (callback: (error: Error | null, results?: DPRequest[]) => void) => {
    const query = 'SELECT * FROM request'; // עדכון שם הטבלה ל-request

    pool.query(query, (error, results) => {
        if (error) {
            callback(error);
            return;
        }
        callback(null, results.rows);
    });
};
