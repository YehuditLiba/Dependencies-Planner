"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRequests = void 0;
const db_1 = require("../config/db");
// פונקציה לשיפור כל הבקשות ממסד הנתונים
const getAllRequests = (callback) => {
    console.log("DPRequest");
    const query = 'SELECT * FROM requests';
    db_1.pool.query(query, (error, results) => {
        if (error) {
            callback(error);
            return;
        }
        callback(null, results.rows);
    });
};
exports.getAllRequests = getAllRequests;
