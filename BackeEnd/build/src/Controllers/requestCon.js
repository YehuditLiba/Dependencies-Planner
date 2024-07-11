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
exports.getRequestByIdController = exports.getAllRequests = exports.deleteRequestsByGroupIdController = void 0;
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
const deleteRequestsByGroupIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = parseInt(req.params.groupId, 10);
    if (isNaN(groupId)) {
        res.status(400).json({ error: 'Invalid group ID' });
    }
    try {
        const requests = yield (0, requestUtils_1.getRequestsByGroupId)(groupId);
        if (requests.length === 0) {
            res.status(404).json({ error: 'No requests found for this group ID' });
        }
        yield (0, requestUtils_1.deleteRequestsByGroupId)(groupId);
        res.json({ message: 'Requests deleted successfully' });
    }
    catch (error) {
        console.error('Error in deleteRequestsByGroupId:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.deleteRequestsByGroupIdController = deleteRequestsByGroupIdController;
