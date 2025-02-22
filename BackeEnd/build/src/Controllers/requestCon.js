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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportRequestsToCSV = exports.getAllFilteredRequestsWithPagination = exports.updatePlannedField = exports.createRequest = exports.updateFinalDecisionController = exports.updateRequestByIdController = exports.updateAffectedGroups = exports.updateRequest = exports.deleteRequest = exports.getRequestByIdController = exports.updateOrder = void 0;
const path_1 = __importDefault(require("path"));
const requestUtils_1 = require("../Utils/requestUtils");
const csv_writer_1 = require("csv-writer");
//עידכון סדר
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedRows = req.body;
        // בדוק אם הקלט הוא מערך
        if (!Array.isArray(updatedRows)) {
            res.status(400).json({ message: 'פורמט קלט לא תקין' });
            return;
        }
        // עיבוד כל שורה ועדכון ה-order_index במסד הנתונים
        for (const row of updatedRows) {
            if (row.ID && row.order_index !== undefined) {
                yield (0, requestUtils_1.updateRequestOrder)(row.ID, row.order_index);
            }
            else {
                res.status(400).json({ message: 'חסר ID או order_index באחת השורות' });
                return;
            }
        }
        res.status(200).json({ message: 'הסדר עודכן בהצלחה' });
    }
    catch (error) {
        console.error('שגיאה בעדכון הסדר:', error);
        res.status(500).json({ message: 'שגיאה בעדכון הסדר' });
    }
});
exports.updateOrder = updateOrder;
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
const deleteRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { requestorEmail } = req.body;
    console.log('REQUEST ID:', id);
    console.log('REQUESTOR EMAIL:', requestorEmail);
    console.log('FULL REQUEST BODY:', req.body); // הוספת לוג נוסף לבדיקה
    if (!id || !requestorEmail) {
        return res.status(400).json({ message: 'Missing requestId or requestorEmail' });
    }
    try {
        yield (0, requestUtils_1.deleteRequestById)(Number(id), requestorEmail);
        res.status(200).json({ message: `Request with ID ${id} and its affected groups deleted successfully` });
    }
    catch (error) {
        let errorMessage = 'Unknown error';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        console.error('Error deleting request:', errorMessage);
        res.status(500).json({ message: errorMessage });
    }
});
exports.deleteRequest = deleteRequest;
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
            emailRequestor: req.body.emailRequestor,
            statuses: req.body.statuses // כולל את הסטטוסים
        };
        yield (0, requestUtils_1.addRequest)(request); // להוסיף את הבקשה
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
        yield (0, requestUtils_1.updatePlanned)(planned, Number(ID));
        res.status(200).json({ message: 'Planned field updated successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update planned field' });
    }
});
exports.updatePlannedField = updatePlannedField;
const getAllFilteredRequestsWithPagination = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = parseInt(req.query.limit) || 0;
    const offset = parseInt(req.query.offset) || 0;
    // קבלת פרמטרי המיון מתוך הבקשה, אם קיימים
    const sortBy = req.query.sortBy || 'r.id'; // ערך ברירת מחדל הוא 'r.id'
    const sortDirection = req.query.sortDirection || 'DESC'; // ערך ברירת מחדל הוא 'DESC'
    try {
        const requestorName = req.query.requestorName;
        const requestorGroup = req.query.requestorGroup;
        const affectedGroupList = req.query.affectedGroupList;
        const { totalCount, requests } = yield (0, requestUtils_1.filterRequests)(requestorName, requestorGroup, affectedGroupList, sortBy, // הוסף את פרמטר המיון לפי עמודה
        sortDirection, // הוסף את פרמטר כיוון המיון
        limit, offset);
        res.json({
            limit,
            offset,
            totalCount,
            requests,
        });
    }
    catch (error) {
        console.error('Error fetching filtered requests with pagination:', error);
        res.status(500).send('Internal Server Error');
    }
});
exports.getAllFilteredRequestsWithPagination = getAllFilteredRequestsWithPagination;
const exportRequestsToCSV = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // שליפת כל הבקשות
        const rows = yield (0, requestUtils_1.fetchAllRequests)();
        // המרת הנתונים לפורמט שמתאים ל-CSV
        const formattedRows = rows.map(row => ({
            id: row.id,
            title: row.title,
            request_group: row.request_group,
            description: row.description,
            priority: row.priority,
            final_decision: row.final_decision,
            planned: row.planned,
            comments: row.comments,
            date_time: row.date_time,
            affected_group_list: row.affected_group_list.join(','),
            statuses: JSON.stringify(row.statuses),
            jira_link: row.jira_link,
            requestor_name: row.requestor_name,
            requestor_email: row.requestor_email
        }));
        // יצירת שם קובץ עם תאריך ושעה כדי להבטיח ייחודיות
        const timestamp = new Date().toISOString().replace(/:/g, '-'); // שינוי תווי ':' ל'-' שיהיה מתאים לשם קובץ
        const fileName = `requests_${timestamp}.csv`;
        const absolutePath = path_1.default.resolve(__dirname, fileName);
        //console.log(`Writing CSV file to ${absolutePath}`);
        // יצירת קובץ CSV
        const csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
            path: 'absolutePath',
            header: [
                { id: 'id', title: 'ID' },
                { id: 'title', title: 'Title' },
                { id: 'request_group', title: 'Request Group' },
                { id: 'description', title: 'Description' },
                { id: 'priority', title: 'Priority' },
                { id: 'final_decision', title: 'Final Decision' },
                { id: 'planned', title: 'Planned' },
                { id: 'comments', title: 'Comments' },
                { id: 'date_time', title: 'Date Time' },
                { id: 'affected_group_list', title: 'Affected Group List' },
                { id: 'statuses', title: 'Statuses' },
                { id: 'jira_link', title: 'Jira Link' },
                { id: 'requestor_name', title: 'Requestor Name' },
                { id: 'requestor_email', title: 'Requestor Email' }
            ]
        });
        // כתיבת הנתונים לקובץ CSV
        yield csvWriter.writeRecords(formattedRows);
        //console.log(`CSV file written successfully to ${absolutePath}`);
        // שליחת הקובץ למשתמש להורדה
        res.download(absolutePath);
    }
    catch (error) {
        console.error('Error exporting requests to CSV:', error);
        res.status(500).send('Internal Server Error');
    }
});
exports.exportRequestsToCSV = exportRequestsToCSV;
