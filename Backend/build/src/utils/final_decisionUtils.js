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
exports.getAllDecisions = void 0;
const db_1 = require("../config/db");
const getAllDecisions = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_1.pool.connect();
    try {
        const query = `
            SELECT final_decision
            FROM decisions;
        `;
        const { rows } = yield client.query(query);
        return rows.map((row) => row.final_decision);
    }
    catch (err) {
        console.error('Failed to fetch decisions:', err);
        throw new Error('Failed to fetch decisions');
    }
    finally {
        client.release();
    }
});
exports.getAllDecisions = getAllDecisions;
