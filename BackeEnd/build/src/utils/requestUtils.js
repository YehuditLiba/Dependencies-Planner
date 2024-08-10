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
exports.updateRequestOrder = exports.getRequestsByGroupId = exports.getRequestById = exports.fetchAllRequests = exports.filterRequests = exports.updatePlanned = exports.addRequest = exports.updateFinalDecision = exports.updateRequestById = exports.getRequestByIdForUp = exports.updateAffectedGroupList = exports.updateRequestFields = exports.deleteRequestById = void 0;
const db_1 = require("../config/db");
// import { createAffectedGroupInDB } from './affectedGroupsUtils';
// import { deleteAffectedGroupsByRequestId } from './affectedGroupsUtils';
const affectedGroupsUtils_1 = require("./affectedGroupsUtils");
const updateRequestOrder = (id, orderIndex) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `
            UPDATE request
            SET order_index = $1
            WHERE ID = $2
        `;
        const values = [orderIndex, id];
        yield db_1.pool.query(query, values);
    }
    catch (error) {
        console.error(`שגיאה בעדכון order_index עבור ID ${id}:`, error);
        throw new Error('שגיאה בעדכון order_index');
    }
});
exports.updateRequestOrder = updateRequestOrder;
const getRequestById = (id) => __awaiter(void 0, void 0, void 0, function* () {
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
            order_index: row.order_index
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
    try {
        yield client.query('BEGIN');
        console.log('Starting deletion process for request ID:', requestId);
        const checkRequestorQuery = `
        SELECT COUNT(*) FROM request
        WHERE id = $1 AND requestor_email = $2;
      `;
        const { rows } = yield client.query(checkRequestorQuery, [requestId, requestorEmail]);
        const requestorExists = parseInt(rows[0].count, 10) > 0;
        console.log('Requestor exists:', requestorExists);
        if (!requestorExists) {
            throw new Error('Unauthorized: Only the requestor can delete this request');
        }
        console.log('Deleting affected groups');
        yield (0, affectedGroupsUtils_1.deleteAffectedGroupsByRequestId)(requestId);
        console.log('Affected groups deleted');
        console.log('Deleting request');
        const deleteRequestQuery = `
        DELETE FROM request
        WHERE id = $1;
      `;
        const deleteResult = yield client.query(deleteRequestQuery, [requestId]);
        console.log('Request deleted, rows affected:', deleteResult.rowCount);
        yield client.query('COMMIT');
        console.log('Deletion process completed successfully');
    }
    catch (error) {
        console.error('Error during deletion:', error);
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
        const { title, description, comments } = updatedFields;
        const sql = 'UPDATE request SET title = $1, description = $2, comments = $3 WHERE id = $4 RETURNING *;';
        const { rows } = yield client.query(sql, [title, description, comments, id]);
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
      INSERT INTO request (title, request_group, description, priority, planned,
      comments, date_time, affected_group_list, jira_link, requestor_name, requestor_email)
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
    try {
        yield db_1.pool.query('BEGIN');
        const result = yield db_1.pool.query(query, values);
        const requestId = result.rows[0].id;
        for (const groupId of request.affectedGroupList) {
            yield (0, affectedGroupsUtils_1.createAffectedGroupInDB)(requestId, groupId, 1);
        }
        yield db_1.pool.query('COMMIT');
    }
    catch (error) {
        yield db_1.pool.query('ROLLBACK');
        console.error('Error in addRequest:', error);
        throw new Error('Failed to add request');
    }
});
exports.addRequest = addRequest;
//עידכון רבעון
const updatePlanned = (planned, ID) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
      UPDATE request
      SET planned = $1
      WHERE ID = $2
    `;
    const values = [planned, ID];
    yield db_1.pool.query(query, values);
});
exports.updatePlanned = updatePlanned;
const filterRequests = (requestorName, requestorGroup, affectedGroupList, sortBy, sortDirection, limit, offset) => __awaiter(void 0, void 0, void 0, function* () {
    let sql = `
    WITH affected_groups AS (
        SELECT
            ag.request_id,
            json_agg(json_build_object(
                'groupId', ag.group_id,
                'status', json_build_object(
                    'id', COALESCE(s.id, 0),
                    'status', COALESCE(s.status, 'Not Required')
                )
            )) AS statuses,
            ARRAY_AGG(ag.group_id) AS affected_group_list
        FROM
            affected_group ag
        LEFT JOIN
            status s ON ag.status = s.id
        GROUP BY
            ag.request_id
    )
    SELECT
        r.*,
        COUNT(*) OVER() AS total_count,
        COALESCE(ag.affected_group_list, '{}') AS affected_group_list,
        COALESCE(ag.statuses, '[]'::json) AS statuses
    FROM
        request r
    LEFT JOIN
        affected_groups ag ON r.id = ag.request_id
    WHERE
        1 = 1
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
        const groupIds = affectedGroupList.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id));
        if (groupIds.length > 0) {
            sql += ` AND r.id IN (
                SELECT ag.request_id FROM affected_group ag WHERE ag.group_id = ANY($${values.length + 1})
            )`;
            values.push(groupIds);
        }
        else {
            // If no valid group IDs, handle the case as needed
            sql += ` AND FALSE`; // Ensures no results are returned
        }
    }
    sql += ` ORDER BY ${sortBy} ${sortDirection}`;
    if (limit > 0) {
        sql += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
        values.push(limit);
        values.push(offset);
    }
    let client;
    try {
        client = yield db_1.pool.connect();
        const { rows } = yield client.query(sql, values);
        const totalCount = rows.length > 0 ? parseInt(rows[0].total_count, 10) : 0;
        const requests = rows.map((row) => ({
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
            statuses: row.statuses,
            jiraLink: row.jira_link,
            requestorName: row.requestor_name,
            emailRequestor: row.requestor_email,
            order_index: row.order_index
        }));
        //  console.log('Processed Requests:', requests);
        return { totalCount, requests };
    }
    catch (err) {
        console.error('Error filtering requests:', err);
        throw err;
    }
    finally {
        if (client)
            client.release();
    }
});
exports.filterRequests = filterRequests;
const fetchAllRequests = () => __awaiter(void 0, void 0, void 0, function* () {
    const sql = `
    WITH affected_groups AS (
      SELECT
        ag.request_id,
        json_agg(json_build_object(
          'groupId', ag.group_id,  -- ודא שהעמודה הזו קיימת
          'status', json_build_object(
            'id', COALESCE(s.id, 0),
            'status', COALESCE(s.status, 'Not Required')
          )
        )) AS statuses,
        ARRAY_AGG(ag.group_id) AS affected_group_list  -- ודא שהעמודה הזו קיימת
      FROM
        affected_group ag
      LEFT JOIN
        status s ON ag.status = s.id
      GROUP BY
        ag.request_id
    )
    SELECT
      r.id,
      r.title,
      r.request_group,
      r.description,
      r.priority,
      r.final_decision,
      r.planned,
      r.comments,
      r.date_time,
      COALESCE(ag.affected_group_list, '{}') AS affected_group_list,
      COALESCE(ag.statuses, '[]'::json) AS statuses,
      r.jira_link,
      r.requestor_name,
      r.requestor_email
    FROM
      request r
    LEFT JOIN
      affected_groups ag ON r.id = ag.request_id
    ORDER BY r.id;
  `;
    let client;
    try {
        client = yield db_1.pool.connect();
        const { rows } = yield client.query(sql);
        return rows;
    }
    catch (err) {
        console.error('Error fetching requests:', err);
        throw err;
    }
    finally {
        if (client)
            client.release();
    }
});
exports.fetchAllRequests = fetchAllRequests;
