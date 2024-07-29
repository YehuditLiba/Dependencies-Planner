import express from 'express';
import { getAllGroupsController } from '../Controllers/GroupCon.';

import {  getRequestByIdController, updateRequest, 
    deleteRequest, updateRequestByIdController,updateFinalDecisionController ,
    createRequest, updatePlannedField, getAllFilteredRequestsWithPagination} from '../Controllers/requestCon';
import { getAllProductManagers, getAllRequestsByProductManager } from '../Controllers/productManagerCon';
import { getAllStatusController, getAllStatus } from '../Controllers/StatusCon';
import { getAllPrioritiesController } from '../Controllers/PriorityCon';
// import { getAllTSize } from '../Controllers/T_SizeCon';
// import { getAllDecisionsController } from '../Controllers/final_decisionCon';
import { getAllAffectedGroupsController,createAffectedGroup,updateAffectedGroupStatus,deleteAffectedGroups } from '../Controllers/affectedGroupCon';

const router = express.Router();
//groups routings
router.get('/groups', getAllGroupsController);

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

//routings ProductManager
router.get('/productManagers', getAllProductManagers);
router.get('/requests/:groupId', getAllRequestsByProductManager);

//status routings
router.get('/status', getAllStatusController);
router.get('/Getstatus', getAllStatus);

//priority routings
router.get('/priority', getAllPrioritiesController);

//T_Size routings
// router.get('/GetTSize', getAllTSize);

//Decisions routings
//router.get('/decisions', getAllFilteredRequestsWithPagination);

export default router;
