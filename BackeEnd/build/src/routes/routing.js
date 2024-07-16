"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const GroupCon_1 = require("../Controllers/GroupCon.");
const requestCon_1 = require("../Controllers/requestCon");
const productManagerCon_1 = require("../Controllers/productManagerCon");
const StatusCon_1 = require("../Controllers/StatusCon");
const PriorityCon_1 = require("../Controllers/PriorityCon");
const T_SizeCon_1 = require("../Controllers/T_SizeCon");
const final_decisionCon_1 = require("../Controllers/final_decisionCon");
const router = express_1.default.Router();
//groups routings
router.get('/groups', GroupCon_1.getAllGroupsController);
//Requests routings
router.get('/Allrequests', requestCon_1.getAllRequests);
router.get('/requests/:id', requestCon_1.getRequestByIdController);
router.delete('/requests/:id', requestCon_1.deleteRequestByAdmin);
router.put('/requests/:id', requestCon_1.updateRequest);
router.put('/requests/:id', requestCon_1.updateRequestByIdController);
router.put('/requests/updateFinalDecision/:id', requestCon_1.updateFinalDecisionController);
router.post('/requests/createRequest', requestCon_1.createRequest);
router.put('/requests/:ID/planned', requestCon_1.updatePlannedField);
router.get('/requests', requestCon_1.getRequestsWithPagination);
//Requests AffectedGroups
router.put('/requests/:id/affectedGroups', requestCon_1.updateAffectedGroups);
//routings ProductManager
router.get('/productManagers', productManagerCon_1.getAllProductManagers);
router.get('/requests/:groupId', productManagerCon_1.getAllRequestsByProductManager);
//status routings
router.get('/status', StatusCon_1.getAllStatusController);
router.get('/Getstatus', StatusCon_1.getAllStatus);
//priority routings
router.get('/priority', PriorityCon_1.getAllPrioritiesController);
//T_Size routings
router.get('/GetTSize', T_SizeCon_1.getAllTSize);
//Decisions routings
router.get('/decisions', final_decisionCon_1.getAllDecisionsController);
exports.default = router;
