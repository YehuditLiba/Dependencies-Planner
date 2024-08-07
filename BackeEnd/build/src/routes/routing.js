"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const GroupCon_1 = require("../Controllers/GroupCon.");
const requestCon_1 = require("../Controllers/requestCon");
const productManagerCon_1 = require("../Controllers/productManagerCon"); //, getAllRequestsByProductManager, editProductManagerByAdmin, deleteProductManager,getAllProductManagers,
const StatusCon_1 = require("../Controllers/StatusCon");
const PriorityCon_1 = require("../Controllers/PriorityCon");
// import { getAllTSize } from '../Controllers/T_SizeCon';
// import { getAllDecisionsController } from '../Controllers/final_decisionCon';
const affectedGroupCon_1 = require("../Controllers/affectedGroupCon");
// import {addProductManagerToGroupHandler,getProductManagerGroupsHandler , getAllProductManagerGroupsHandler} from '../Controllers/productManagerGroupCon';
const slackCon_1 = require("../Controllers/slackCon");
const router = express_1.default.Router();
router.post('/send-message', slackCon_1.sendMessageToSlack);
//groups routings
router.get('/groups', GroupCon_1.getAllGroupsController);
router.put('/groups/:groupId', GroupCon_1.editGroupByAdmin);
router.post('/groups', GroupCon_1.addGroup);
router.delete('/groups/:groupId', GroupCon_1.deleteGroup);
//Requests routings
// router.get('/Allrequests', getAllRequests);
router.post('/update-order', requestCon_1.updateOrder);
router.get('/requests/:id', requestCon_1.getRequestByIdController);
router.delete('/deleteRequests/:id', requestCon_1.deleteRequest);
router.put('/requests/:id', requestCon_1.updateRequest);
router.put('/requests/:id', requestCon_1.updateRequestByIdController);
router.put('/requests/updateFinalDecision/:id', requestCon_1.updateFinalDecisionController);
router.post('/requests/createRequest', requestCon_1.createRequest);
router.put('/requests/:ID/planned', requestCon_1.updatePlannedField);
//router.get('/requestsA', getRequestsWithPagination);
//filter:
router.get('/requests', requestCon_1.getAllFilteredRequestsWithPagination);
router.get('/export-requests', requestCon_1.exportRequestsToCSV);
// Affected_Groups:
router.get('/affectedGroups', affectedGroupCon_1.getAllAffectedGroupsController);
router.put('/updateAffectedGroups/status', affectedGroupCon_1.updateAffectedGroupStatus);
router.post('/createAffectedGroup', affectedGroupCon_1.createAffectedGroup);
router.delete('/affectedGroups/:requestId', affectedGroupCon_1.deleteAffectedGroups);
// נתיב לקבלת כל הבקשות עם הסטטוסים שלהן
router.get('/requestsWithStatuses', affectedGroupCon_1.getAllRequestsWithStatusesController);
//routings ProductManager
//router.get('/productManagers', getAllProductManagers);
//router.get('/requests/:groupId', getAllRequestsByProductManager);
//router.put('/editProductManagers/:email', editProductManagerByAdmin);
router.post('/addProductManagers', productManagerCon_1.addProductManager);
router.delete('/productManagers/:email', productManagerCon_1.deleteProductManager);

//routings ProductManagerGroups 
// router.post('/product-manager-group', addProductManagerToGroupHandler);
// router.get('/product-manager-group/:email', getProductManagerGroupsHandler);
// router.get('/all-product-manager-groups', getAllProductManagerGroupsHandler); 
//status routings
router.get('/status', StatusCon_1.getAllStatusController);
router.get('/Getstatus', StatusCon_1.getAllStatus);
router.put('/update-status', StatusCon_1.updateRequestStatus);
//priority routings
router.get('/priority', PriorityCon_1.getAllPrioritiesController);
router.put('/requests/:ID/priority', PriorityCon_1.updatePriorityController);
// router.put('/priority/:id', updatePriorityController);
//T_Size routings
// router.get('/GetTSize', getAllTSize);
//Decisions routings
//router.get('/decisions', getAllFilteredRequestsWithPagination);
exports.default = router;
