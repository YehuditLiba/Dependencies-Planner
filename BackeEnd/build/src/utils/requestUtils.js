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
exports.getRequestsByGroupId = exports.getRequestById = exports.fetchAllRequests = exports.updateRequestById = exports.getRequestByIdForUp = exports.updateAffectedGroupList = exports.updateRequestFields = exports.deleteRequestById = void 0;
const db_1 = require("../config/db");
const fetchAllRequests = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield db_1.pool.connect();
        const sql = 'SELECT * FROM request;';
        const { rows } = yield client.query(sql);
        client.release();
        return rows.map((row) => ({
            ID: row.id,
            title: row.title,
            requestGroup: row.request_group,
            description: row.description,
            priority: row.priority,
            finalDecision: row.final_decision,
            planned: row.planned,
            comments: row.comments,
            dateTime: row.date_time,
            affectedGroupList: row.affected_group_list,
            jiraLink: row.jira_link
        }));
    }
    catch (err) {
        console.error('Error fetching requests:', err);
        throw err;
    }
});
exports.fetchAllRequests = fetchAllRequests;
const getRequestById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({ id });
    try {
        const client = yield db_1.pool.connect();
        const sql = 'SELECT * FROM request WHERE id = $1;';
        const { rows } = yield client.query(sql, [id]);
        client.release();
        if (rows.length === 0) {
            return null; // If no request found with that ID
        }
        const row = rows[0];
        return {
            ID: row.id,
            title: row.title,
            requestGroup: row.request_group,
            description: row.description,
            priority: row.priority,
            finalDecision: row.final_decision,
            planned: row.planned,
            comments: row.comments,
            dateTime: row.date_time,
            affectedGroupList: row.affected_group_list,
            jiraLink: row.jira_link
        };
    }
    catch (err) {
        console.error('Error fetching request by ID:', err);
        throw err;
    }
});
exports.getRequestById = getRequestById;
const getRequestsByGroupId = (groupId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield db_1.pool.connect();
        const sql = `
      SELECT * FROM request
      WHERE $1 = ANY(request_group);
    `;
        const { rows } = yield client.query(sql, [groupId]);
        client.release();
        return rows.map((row) => ({
            ID: row.id,
            title: row.title,
            requestGroup: row.request_group,
            description: row.description,
            priority: row.priority,
            finalDecision: row.final_decision,
            planned: row.planned,
            comments: row.comments,
            dateTime: row.date_time,
            affectedGroupList: row.affected_group_list,
            jiraLink: row.jira_link
        }));
    }
    catch (err) {
        console.error('Error fetching requests by group ID:', err);
        throw err;
    }
});
exports.getRequestsByGroupId = getRequestsByGroupId;
const deleteRequestById = (requestId, requestorEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_1.pool.connect();
    try {
        yield client.query('BEGIN');
        // Check if the requestor exists and matches the provided email
        const checkRequestorQuery = `
            SELECT COUNT(*) FROM product_manager
            WHERE email = $1;
        `;
        const { rows } = yield client.query(checkRequestorQuery, [requestorEmail]);
        const requestorExists = parseInt(rows[0].count, 10) > 0;
        if (!requestorExists) {
            throw new Error('Unauthorized: Only the requestor can delete this request');
        }
        // Delete request by ID
        const deleteRequestQuery = `
            DELETE FROM request
            WHERE id = $1;
        `;
        yield client.query(deleteRequestQuery, [requestId]);
        yield client.query('COMMIT');
    }
    catch (error) {
        yield client.query('ROLLBACK');
        throw error;
    }
    finally {
        client.release();
    }
});
exports.deleteRequestById = deleteRequestById;
//עריכת כותרת ותיאור
const updateRequestFields = (id, updatedFields) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield db_1.pool.connect();
        const { title, description } = updatedFields;
        const sql = 'UPDATE request SET title = $1, description = $2 WHERE id = $3 RETURNING *;';
        const { rows } = yield client.query(sql, [title, description, id]);
        client.release();
        if (rows.length === 0) {
            return null;
        }
        const row = rows[0];
        return {
            ID: row.id,
            title: row.title,
            requestGroup: row.request_group,
            description: row.description,
            priority: row.priority,
            finalDecision: row.final_decision,
            planned: row.planned,
            comments: row.comments,
            dateTime: row.date_time,
            affectedGroupList: row.affected_group_list,
            jiraLink: row.jira_link
        };
    }
    catch (err) {
        console.error('Error updating request:', err);
        throw err;
    }
});
exports.updateRequestFields = updateRequestFields;
const updateAffectedGroupList = (id, affectedGroupList) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield db_1.pool.connect();
        const sql = 'UPDATE request SET affected_group_list = $1 WHERE id = $2 RETURNING *;';
        const { rows } = yield client.query(sql, [affectedGroupList, id]);
        client.release();
        if (rows.length === 0) {
            return null;
        }
        const row = rows[0];
        return {
            ID: row.id,
            title: row.title,
            requestGroup: row.request_group,
            description: row.description,
            priority: row.priority,
            finalDecision: row.final_decision,
            planned: row.planned,
            comments: row.comments,
            dateTime: row.date_time,
            affectedGroupList: row.affected_group_list,
            jiraLink: row.jira_link
        };
    }
    catch (err) {
        console.error('Error updating affected group list:', err);
        throw err;
    }
});
exports.updateAffectedGroupList = updateAffectedGroupList;
const getRequestByIdForUp = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = 'SELECT * FROM requests WHERE id = $1';
    const { rows } = yield db_1.pool.query(query, [id]);
    return rows[0];
});
exports.getRequestByIdForUp = getRequestByIdForUp;
const updateRequestById = (id, updateFields) => __awaiter(void 0, void 0, void 0, function* () {
    const setString = Object.keys(updateFields).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const query = `UPDATE requests SET ${setString} WHERE id = $1`;
    const values = [id, ...Object.values(updateFields)];
    yield db_1.pool.query(query, values);
});
exports.updateRequestById = updateRequestById;
