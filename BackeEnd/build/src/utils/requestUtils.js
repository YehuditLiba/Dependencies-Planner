"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRequests = void 0;
const db_1 = require("../config/db");
// פונקציה לשיפור כל הבקשות ממסד הנתונים
const getAllRequests = (callback) => {
    const query = 'SELECT * FROM request'; // עדכון שם הטבלה ל-request
    db_1.pool.query(query, (error, results) => {
        if (error) {
            callback(error);
            return;
        }
        callback(null, results.rows);
    });
};
exports.getAllRequests = getAllRequests;
