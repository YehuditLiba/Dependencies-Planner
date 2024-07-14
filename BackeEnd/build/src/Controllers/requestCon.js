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
<<<<<<< HEAD
exports.getRequestByIdController = exports.getAllRequests = exports.deleteRequestByAdmin = void 0;
=======
exports.getRequestByIdController = exports.getAllRequests = exports.updateAffectedGroups = exports.updateRequest = exports.deleteRequestsByGroupIdController = void 0;
>>>>>>> 99b82b3c4cfd3875491d13c7e0aaaeb6611ef1aa
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
<<<<<<< HEAD
exports.deleteRequestByAdmin = deleteRequestByAdmin;
=======
exports.deleteRequestsByGroupIdController = deleteRequestsByGroupIdController;
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
//עידכון רשימת מושפעים
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
>>>>>>> 99b82b3c4cfd3875491d13c7e0aaaeb6611ef1aa
