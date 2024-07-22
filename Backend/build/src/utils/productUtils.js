"use strict";
// productUtils.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequestsByProductManager = exports.getProductManagers = void 0;
const db_1 = require("../config/db");
const getProductManagers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield db_1.pool.connect();
        const sql = `
            SELECT * FROM product_manager;
        `;
        const { rows } = yield client.query(sql);
        client.release();
        return rows.map((row) => ({
            email: row.email,
            name: row.name,
            group_id: row.group_id
        }));
    }
    catch (err) {
        console.error('Error fetching product managers:', err);
        throw err;
    }
});
exports.getProductManagers = getProductManagers;
const getRequestsByProductManager = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_1.pool.connect();
    try {
        const res = yield client.query(`
            SELECT r.*
            FROM requests r
            JOIN product_manager pm ON pm.group_id = ANY (r.request_group)
            WHERE pm.group_id = $1;
        `, [groupId]);
        return res.rows;
    }
    catch (err) {
        console.error('Error in getRequestsByProductManager:', err);
        throw err;
    }
    finally {
        client.release();
    }
});
exports.getRequestsByProductManager = getRequestsByProductManager;
