"use strict";
// src/Utils/testDatabaseConnection.ts
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
const testDatabaseConnection = () => {
    // Test connection to first database
    db_1.pool.query('SELECT NOW()', (err, res) => {
        if (err) {
            console.error('Error connecting to first PostgreSQL database:', err);
        }
        else {
            console.log('Connected to first PostgreSQL database at:', process.env.DB_HOST);
            console.log('First database current time:', res.rows[0].now);
        }
    });
    // Test connection to second database
    db_1.poolG.query('SELECT NOW()', (err, res) => {
        if (err) {
            console.error('Error connecting to second PostgreSQL database:', err);
        }
        else {
            console.log('Connected to second PostgreSQL database at:', process.env.DB_HOST_G);
            console.log('Second database current time:', res.rows[0].now);
        }
    });
};
// Export the function to be used elsewhere
exports.default = testDatabaseConnection;
