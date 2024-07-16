import express from 'express';
import { getAllGroupsController } from '../Controllers/GroupCon.';
import { getAllRequests, getRequestByIdController, updateRequest, updateAffectedGroups, deleteRequestByAdmin, updateRequestByIdController,updateFinalDecisionController ,createRequest} from '../Controllers/requestCon';
import { getAllProductManagers, getAllRequestsByProductManager } from '../Controllers/productManagerCon';
import { getAllStatusController, getAllStatus } from '../Controllers/StatusCon';
import { getAllPrioritiesController } from '../Controllers/PriorityCon';
import { getAllTSize } from '../Controllers/T_SizeCon';
import { getAllDecisionsController } from '../Controllers/final_decisionCon'

const router = express.Router();
//groups routings
router.get('/groups', getAllGroupsController);

//Requests routings
router.get('/requests', getAllRequests);
router.get('/requests/:id', getRequestByIdController);
router.delete('/requests/:id', deleteRequestByAdmin);
router.put('/requests/:id', updateRequest);
router.put('/requests/:id', updateRequestByIdController);
router.put('/requests/updateFinalDecision/:id', updateFinalDecisionController);
router.post('/requests/createRequest', createRequest);
//Requests AffectedGroups
router.put('/requests/:id/affectedGroups', updateAffectedGroups);

//routings ProductManager
router.get('/productManagers', getAllProductManagers);
router.get('/requests/:groupId', getAllRequestsByProductManager);

//status routings
router.get('/status', getAllStatusController);
router.get('/Getstatus', getAllStatus);

//priority routings
router.get('/priority', getAllPrioritiesController);

//T_Size routings
router.get('/GetTSize', getAllTSize);

//Decisions routings
router.get('/decisions', getAllDecisionsController);

export default router;
