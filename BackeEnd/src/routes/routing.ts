import express from 'express';
import { getAllGroupsController, editGroupByAdmin } from '../Controllers/GroupCon.';
import {  getRequestByIdController, updateRequest, 
    deleteRequest, updateRequestByIdController,updateFinalDecisionController ,
    createRequest, updatePlannedField, getAllFilteredRequestsWithPagination} from '../Controllers/requestCon';
import { getAllProductManagers, getAllRequestsByProductManager, editProductManagerByAdmin } from '../Controllers/productManagerCon';
import { getAllStatusController, getAllStatus } from '../Controllers/StatusCon';
import { getAllPrioritiesController, updatePriorityController } from '../Controllers/PriorityCon';
// import { getAllTSize } from '../Controllers/T_SizeCon';
// import { getAllDecisionsController } from '../Controllers/final_decisionCon';
import { getAllAffectedGroupsController, createAffectedGroup, updateAffectedGroupStatus, deleteAffectedGroups, getAllRequestsWithStatusesController 
    
} from '../Controllers/affectedGroupCon';

const router = express.Router();
//groups routings
router.get('/groups', getAllGroupsController);
router.put('/groups/:groupId', editGroupByAdmin);


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
router.put('/productManagers/:email', editProductManagerByAdmin);
//status routings
router.get('/status', getAllStatusController);
router.get('/Getstatus', getAllStatus);


//priority routings
router.get('/priority', getAllPrioritiesController);
// router.put('/priority/:id', updatePriorityController);
router.put('/requests/:ID/priority', updatePriorityController);


//T_Size routings
// router.get('/GetTSize', getAllTSize);

//Decisions routings
//router.get('/decisions', getAllFilteredRequestsWithPagination);

export default router;
