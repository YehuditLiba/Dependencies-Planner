"use strict";


Object.defineProperty(exports, "__esModule", { value: true });

exports.getAllProductManagerNames = void 0;

const db_1 = require("../config/db");
const getAllProductManagerNames = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Entering getAllProductManagerNames method');
        const result = yield db_1.pool.query('SELECT name FROM productmanager');
        console.log('Query executed successfully, result:', result.rows);
        return result.rows;
    }
    catch (err) {
        console.error('Error executing query in getAllProductManagerNames:', err);
        throw err;
    }
});
exports.getAllProductManagerNames = getAllProductManagerNames;



