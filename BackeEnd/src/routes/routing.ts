import express from 'express';
import { getAllGroupsController, editGroupByAdmin, addGroup , deleteGroup} from '../Controllers/GroupCon.';
import {  getRequestByIdController, updateRequest, 
    deleteRequest, updateRequestByIdController,updateFinalDecisionController ,
    createRequest, updatePlannedField, getAllFilteredRequestsWithPagination, exportRequestsToCSV
} from '../Controllers/requestCon';
import { getAllProductManagers, getAllRequestsByProductManager, editProductManagerByAdmin,addProductManager, getGroupsByProductManager , deleteProductManager } from '../Controllers/productManagerCon';
import { getAllStatusController, getAllStatus } from '../Controllers/StatusCon';
import { getAllPrioritiesController, updatePriorityController } from '../Controllers/PriorityCon';
// import { getAllTSize } from '../Controllers/T_SizeCon';
// import { getAllDecisionsController } from '../Controllers/final_decisionCon';
import { getAllAffectedGroupsController, createAffectedGroup, updateAffectedGroupStatus, deleteAffectedGroups, getAllRequestsWithStatusesController} from '../Controllers/affectedGroupCon';
import {addProductManagerToGroupHandler,getProductManagerGroupsHandler , getAllProductManagerGroupsHandler} from '../Controllers/productManagerGroupCon';
import { sendMessageToSlack } from '../Controllers/slackCon';
const router = express.Router();
router.post('/send-message', sendMessageToSlack);

//groups routings
router.get('/groups', getAllGroupsController);
router.put('/groups/:groupId', editGroupByAdmin);
router.post('/groups', addGroup);
router.delete('/groups/:groupId', deleteGroup);

//Requests routings
// router.get('/Allrequests', getAllRequests);
router.get('/requests/:id', getRequestByIdController);
router.delete('/deleteRequests/:id', deleteRequest);
router.put('/requests/:id', updateRequest);
router.put('/requests/:id', updateRequestByIdController);
router.put('/requests/updateFinalDecision/:id', updateFinalDecisionController);
router.post('/requests/createRequest', createRequest);
router.put('/requests/:ID/planned', updatePlannedField);
//router.get('/requestsA', getRequestsWithPagination);
//filter:
router.get('/requests', getAllFilteredRequestsWithPagination);
router.get('/export-requests', exportRequestsToCSV);

// Affected_Groups:
router.get('/affectedGroups', getAllAffectedGroupsController);
router.put('/updateAffectedGroups/status', updateAffectedGroupStatus);
router.post('/createAffectedGroup', createAffectedGroup);
router.delete('/affectedGroups/:requestId', deleteAffectedGroups);
// נתיב לקבלת כל הבקשות עם הסטטוסים שלהן
router.get('/requestsWithStatuses', getAllRequestsWithStatusesController);

//routings ProductManager
router.get('/productManagers', getAllProductManagers);
router.get('/requests/:groupId', getAllRequestsByProductManager);
router.put('/editProductManagers/:email', editProductManagerByAdmin);
router.post('/addProductManagers', addProductManager);
router.get('/product-managers/:email/groups', getGroupsByProductManager);
router.delete('/productManagers/:email', deleteProductManager);

//routings ProductManagerGroups 
router.post('/product-manager-group', addProductManagerToGroupHandler);
router.get('/product-manager-group/:email', getProductManagerGroupsHandler);
router.get('/all-product-manager-groups', getAllProductManagerGroupsHandler); 
//status routings
router.get('/status', getAllStatusController);
router.get('/Getstatus', getAllStatus);


//priority routings
router.get('/priority', getAllPrioritiesController);
router.put('/requests/:ID/priority', updatePriorityController);
// router.put('/priority/:id', updatePriorityController);


//T_Size routings
// router.get('/GetTSize', getAllTSize);

//Decisions routings
//router.get('/decisions', getAllFilteredRequestsWithPagination);

export default router;
