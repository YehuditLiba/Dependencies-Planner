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
exports.getRequestsByGroupId = exports.getRequestById = exports.filterRequests = exports.updatePlanned = exports.addRequest = exports.updateFinalDecision = exports.updateRequestById = exports.getRequestByIdForUp = exports.updateAffectedGroupList = exports.updateRequestFields = exports.deleteRequestById = void 0;
const db_1 = require("../config/db");
const affectedGroupsUtils_1 = require("./affectedGroupsUtils");
const affectedGroupsUtils_2 = require("./affectedGroupsUtils");
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
            jiraLink: row.jira_link,
            requestorName: row.requestorName,
            emailRequestor: row.emailRequestor,
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
            jiraLink: row.jira_link,
            requestorName: row.requestorName,
            emailRequestor: row.emailRequestor,
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
    console.log(requestorEmail + "id" + requestId);
    try {
        yield client.query('BEGIN');
        // Check if the request exists and the requestor matches the provided email
        const checkRequestorQuery = `
            SELECT COUNT(*) FROM request
            WHERE id = $1 AND requestor_email = $2;
        `;
        const { rows } = yield client.query(checkRequestorQuery, [requestId, requestorEmail]);
        const requestorExists = parseInt(rows[0].count, 10) > 0;
        if (!requestorExists) {
            throw new Error('Unauthorized: Only the requestor can delete this request');
        }
        // Delete affected groups first
        yield (0, affectedGroupsUtils_2.deleteAffectedGroupsByRequestId)(requestId);
        // Delete the request
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
const updateFinalDecision = (id, finalDecision) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield db_1.pool.connect();
        const sql = 'UPDATE request SET final_decision = $1 WHERE id = $2 RETURNING *;';
        const { rows } = yield client.query(sql, [finalDecision, id]);
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
        console.error('Error updating final decision:', err);
        throw err;
    }
});
exports.updateFinalDecision = updateFinalDecision;
const addRequest = (request) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
      INSERT INTO request (title, request_group, description, priority, planned, comments, date_time, affected_group_list, jira_link, requestor_name, requestor_email)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id
    `;
    const today = new Date();
    const formattedToday = today.toISOString();
    const values = [
        request.title,
        request.requestGroup,
        request.description,
        request.priority,
        request.planned,
        request.comments,
        formattedToday,
        request.affectedGroupList,
        request.jiraLink,
        request.requestorName,
        request.emailRequestor,
    ];
    // Start a transaction
    yield db_1.pool.query('BEGIN');
    try {
        // Insert the request and get the inserted request's ID
        const result = yield db_1.pool.query(query, values);
        const requestId = result.rows[0].id;
        // Insert each affected group with status 1
        for (const groupId of request.affectedGroupList) {
            yield (0, affectedGroupsUtils_1.createAffectedGroupInDB)(requestId, groupId, 1);
        }
        // Commit the transaction
        yield db_1.pool.query('COMMIT');
    }
    catch (error) {
        // Rollback the transaction in case of an error
        yield db_1.pool.query('ROLLBACK');
        throw error;
    }
});
exports.addRequest = addRequest;
//עידכון רבעון
const updatePlanned = (ID, planned) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
      UPDATE request
      SET planned = $1
      WHERE ID = $2
    `;
    const values = [planned, ID];
    yield db_1.pool.query(query, values);
});
exports.updatePlanned = updatePlanned;
const filterRequests = (requestorName, requestorGroup, affectedGroupList, limit, offset) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Filtering requests with parameters:', requestorName, requestorGroup, affectedGroupList);
    let sql = `
      SELECT 
        r.*, 
        COUNT(*) OVER() AS total_count,
        ag.group_id AS group_id,
        ag.status AS status_id,
        COALESCE(s.id, 0) AS status_id,
        COALESCE(s.status, 'Not Required') AS status_description
      FROM request r
      LEFT JOIN affected_group ag ON r.id = ag.request_id
      LEFT JOIN status s ON ag.status = s.id
      WHERE 1 = 1
    `;
    const values = [];
    if (requestorName) {
        sql += ` AND r.requestor_name ILIKE $${values.length + 1}`;
        values.push(`%${requestorName}%`);
    }
    if (requestorGroup) {
        sql += ` AND r.request_group ILIKE $${values.length + 1}`;
        values.push(`%${requestorGroup}%`);
    }
    if (affectedGroupList) {
        sql += ` AND r.affected_group_list && $${values.length + 1}`;
        values.push(`{${affectedGroupList}}`);
    }
    if (limit > 0) {
        sql += ` ORDER BY r.id LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
        values.push(limit, offset);
    }
    else {
        sql += ` ORDER BY r.id`;
    }
    try {
        const client = yield db_1.pool.connect();
        const { rows } = yield client.query(sql, values);
        client.release();
        const totalCount = rows.length > 0 ? parseInt(rows[0].total_count, 10) : 0;
        console.log(rows);
        // Group statuses by request ID
        const requestMap = {};
        rows.forEach((row) => {
            if (!requestMap[row.id]) {
                requestMap[row.id] = {
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
                    jiraLink: row.jira_link,
                    requestorName: row.requestor_name,
                    emailRequestor: row.requestor_email,
                    statuses: [] // Initialize the statuses array
                };
            }
            requestMap[row.id].statuses.push({
                groupId: row.group_id,
                status: {
                    id: row.status_id,
                    status: row.status_description
                }
            });
        });
        const requests = Object.values(requestMap);
        return { totalCount, requests };
    }
    catch (err) {
        console.error('Error filtering requests:', err);
        throw err;
    }
});
exports.filterRequests = filterRequests;
