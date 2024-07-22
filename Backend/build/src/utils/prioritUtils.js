"use strict";
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
exports.fetchAllPriorities = void 0;
const db_1 = require("../config/db");
const fetchAllPriorities = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield db_1.pool.connect();
        const sql = 'SELECT * FROM priority;';
        const { rows } = yield client.query(sql);
        client.release();
        return rows.map((row) => ({
            id: row.id,
            priority: row.priority,
        }));
    }
    catch (err) {
        console.error('Error fetching priorities:', err);
        throw err;
    }
});
exports.fetchAllPriorities = fetchAllPriorities;
