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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFilteredRequestsWithPagination = exports.updatePlannedField = exports.createRequest = exports.updateFinalDecisionController = exports.updateRequestByIdController = exports.updateAffectedGroups = exports.updateRequest = exports.deleteRequestByAdmin = exports.getRequestByIdController = exports.getAllRequests = void 0;
const requestUtils_1 = require("../Utils/requestUtils");
const getAllRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requests = yield (0, requestUtils_1.fetchAllRequests)();
        res.json(requests);
    }
    catch (err) {
        console.error('Error in getAllRequests:', err);
        res.status(500).json({ error: 'Failed to fetch requests' });
    }
});
exports.getAllRequests = getAllRequests;
const getRequestByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid ID supplied' });
        return;
    }
    try {
        const request = yield (0, requestUtils_1.getRequestById)(id);
        if (!request) {
            res.status(404).json({ error: 'Request not found' });
            return;
        }
        res.json(request);
    }
    catch (err) {
        console.error('Error in getRequestByIdController:', err);
        res.status(500).json({ error: 'Failed to fetch request by ID' });
    }
});
exports.getRequestByIdController = getRequestByIdController;
const deleteRequestByAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requestId = parseInt(req.params.id, 10);
    const requestorEmail = req.body.requestorEmail; // שימוש בכתובת הדוא"ל שנשלחת מהלקוח
    console.log("Request ID:", requestId);
    console.log("Requestor Email:", requestorEmail);
    if (isNaN(requestId)) {
        res.status(400).json({ error: 'Invalid request ID' });
        return;
    }
    if (!requestorEmail) {
        res.status(400).json({ error: 'Requestor email is required' });
        return;
    }
    try {
        yield (0, requestUtils_1.deleteRequestById)(requestId, requestorEmail);
        res.json({ message: 'Request deleted successfully' });
    }
    catch (error) {
        if (error.message === 'Unauthorized: Only the requestor can delete this request') {
            res.status(403).json({ error: 'Unauthorized' });
        }
        else {
            console.error('Error in deleteRequestByAdmin:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});
exports.deleteRequestByAdmin = deleteRequestByAdmin;
//עדכון שדות בקשה
const updateRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const updatedFields = req.body;
        const updatedRequest = yield (0, requestUtils_1.updateRequestFields)(id, updatedFields);
        if (updatedRequest) {
            res.json(updatedRequest);
        }
        else {
            res.status(404).json({ error: 'Request not found' });
        }
    }
    catch (err) {
        console.error('Error in updateRequest:', err);
        res.status(500).json({ error: 'Failed to update request' });
    }
});
exports.updateRequest = updateRequest;
const updateAffectedGroups = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const { affectedGroupList } = req.body;
        const updatedRequest = yield (0, requestUtils_1.updateAffectedGroupList)(id, affectedGroupList);
        if (updatedRequest) {
            res.json(updatedRequest);
        }
        else {
            res.status(404).json({ error: 'Request not found' });
        }
    }
    catch (err) {
        console.error('Error in updateAffectedGroups:', err);
        res.status(500).json({ error: 'Failed to update affected group list' });
    }
});
exports.updateAffectedGroups = updateAffectedGroups;
const updateRequestByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requestId = parseInt(req.params.id, 10);
    const _a = req.body, { email } = _a, updateFields = __rest(_a, ["email"]);
    if (isNaN(requestId)) {
        res.status(400).json({ error: 'Invalid request ID' });
        return;
    }
    if (!email) {
        res.status(400).json({ error: 'Email is required' });
        return;
    }
    try {
        const request = yield (0, requestUtils_1.getRequestByIdForUp)(requestId);
        if (!request) {
            res.status(404).json({ error: 'Request not found' });
            return;
        }
        if (request.email !== email) {
            res.status(403).json({ error: 'Unauthorized: Only the requestor can modify this request' });
            return;
        }
        yield (0, requestUtils_1.updateRequestById)(requestId, updateFields);
        res.json({ message: 'Request updated successfully' });
    }
    catch (error) {
        console.error('Error in updateRequestByIdController:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.updateRequestByIdController = updateRequestByIdController;
const updateFinalDecisionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const { finalDecision } = req.body;
        const updatedRequest = yield (0, requestUtils_1.updateFinalDecision)(id, finalDecision);
        if (updatedRequest) {
            res.json(updatedRequest);
        }
        else {
            res.status(404).json({ error: 'Request not found' });
        }
    }
    catch (err) {
        console.error('Error in updateFinalDecision:', err);
        res.status(500).json({ error: 'Failed to update final decision' });
    }
});
exports.updateFinalDecisionController = updateFinalDecisionController;
const createRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = {
            ID: req.body.ID,
            title: req.body.title,
            requestorName: req.body.requestorName,
            requestGroup: req.body.requestGroup,
            description: req.body.description,
            priority: req.body.priority,
            finalDecision: req.body.finalDecision,
            planned: req.body.planned,
            comments: req.body.comments,
            dateTime: new Date(req.body.dateTime),
            affectedGroupList: req.body.affectedGroupList,
            jiraLink: req.body.jiraLink,
            emailRequestor: req.body.emailRequestor
        };
        yield (0, requestUtils_1.addRequest)(request);
        res.status(201).json({ message: 'Request added successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add request' });
    }
});
exports.createRequest = createRequest;
const updatePlannedField = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ID } = req.params;
        const { planned } = req.body;
        yield (0, requestUtils_1.updatePlanned)(Number(ID), planned);
        res.status(200).json({ message: 'Planned field updated successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update planned field' });
    }
});
exports.updatePlannedField = updatePlannedField;
const getAllFilteredRequestsWithPagination = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Controller function called');
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    try {
        const requestorName = req.query.requestorName;
        const requestorGroup = req.query.requestorGroup;
        const affectedGroupList = req.query.affectedGroupList;
        const requests = yield (0, requestUtils_1.filterRequests)(requestorName, requestorGroup, affectedGroupList, limit, offset);
        res.json({
            limit,
            offset,
            requests,
        });
    }
    catch (error) {
        console.error('Error fetching filtered requests with pagination:', error);
        res.status(500).send('Internal Server Error');
    }
});
exports.getAllFilteredRequestsWithPagination = getAllFilteredRequestsWithPagination;
