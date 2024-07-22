"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllGroups = void 0;
const db_1 = require("../config/db");
const getAllGroups = (callback) => {
    const query = 'SELECT * FROM groups'; // groups
    db_1.poolG.query(query, (error, results) => {
        if (error) {
            callback(error);
            return;
        }
        callback(null, results.rows);
    });
};
exports.getAllGroups = getAllGroups;
