"use strict";
// import { pool } from '../config/db';
// import { RequestT } from '../types/requestTypes';
// import { AffectedGroup } from '../types/affectedGroupsTypes'
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
exports.updateAffectedGroupStatus = exports.getAllAffectedGroups = void 0;
// export const getAllAffectedGroups = async (): Promise<AffectedGroup[]> => {
//      try {
//         const client = await pool.connect();
//         const sql = 'SELECT * FROM affected_group;';
//         const { rows } = await client.query(sql);
//         client.release();
//         return rows.map((row: any) => ({
//             requestId: row.requestId,
//             groupId: row.groupId,
//             status: row.status,
//             id: row.id,
//         })) as AffectedGroup[];
//     } catch (err) {
//         console.error('Error fetching AffectedGroup:', err);
//         throw err;
//     }
// };
// export const updateAffectedGroupList = async (id: number, affectedGroupList: string[]): Promise<RequestT | null> => {
//     try {
//         const client = await pool.connect();
//         const sql = 'UPDATE request SET affected_group_list = $1 WHERE id = $2 RETURNING *;';
//         const { rows } = await client.query(sql, [affectedGroupList, id]);
//         client.release();
//         if (rows.length === 0) {
//             return null;
//         }
//         const row = rows[0];
//         return {
//             ID: row.id,
//             title: row.title,
//             requestGroup: row.request_group,
//             description: row.description,
//             priority: row.priority,
//             finalDecision: row.final_decision,
//             planned: row.planned,
//             comments: row.comments,
//             dateTime: row.date_time,
//             affectedGroupList: row.affected_group_list,
//             jiraLink: row.jira_link
//         } as RequestT;
//     } catch (err) {
//         console.error('Error updating affected group list:', err);
//         throw err;
//     }
// };
const db_1 = require("../config/db");
const getAllAffectedGroups = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield db_1.pool.connect();
        const sql = 'SELECT * FROM affected_group;';
        const { rows } = yield client.query(sql);
        client.release();
        return rows.map((row) => ({
            requestId: row.request_id,
            groupId: row.group_id,
            status: row.status,
            id: row.id,
        }));
    }
    catch (err) {
        console.error('Error fetching affected groups:', err);
        throw err;
    }
});
exports.getAllAffectedGroups = getAllAffectedGroups;
const updateAffectedGroupStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield db_1.pool.connect();
        const sql = 'UPDATE affected_group SET status = $1 WHERE id = $2 RETURNING *;';
        const { rows } = yield client.query(sql, [status, id]);
        client.release();
        if (rows.length === 0) {
            return null;
        }
        const row = rows[0];
        return {
            requestId: row.request_id,
            groupId: row.group_id,
            status: row.status,
            id: row.id,
        };
    }
    catch (err) {
        console.error('Error updating affected group status:', err);
        throw err;
    }
});
exports.updateAffectedGroupStatus = updateAffectedGroupStatus;
