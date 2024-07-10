import { pool } from '../config/db';
import { Request as DPRequest } from '../types/requestTypes'; // שימוש בגשר לטיפוס Request

// פונקציה לשיפור כל הבקשות ממסד הנתונים
export const GetAllReq = (callback: (error: Error | null, results?: DPRequest[]) => void) => {
    console.log("DPRequest");
    const query = 'SELECT * FROM request';

    pool.query(query, (error, results) => {
        if (error) {
            callback(error);
            return;
        }
        callback(null, results.rows);
    });
};
