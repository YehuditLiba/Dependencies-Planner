import express from 'express';
import { getAllGroupsController } from '../Controllers/GroupCon.';
import { getAllRequests, getRequestByIdController, updateRequest, updateAffectedGroups, deleteRequestByAdmin, updateRequestByIdController } from '../Controllers/requestCon';
import { getAllProductManagers, getAllRequestsByProductManager } from '../Controllers/productManagerCon';
import { getAllStatusController } from '../Controllers/StatusCon';
import { getAllPrioritiesController } from '../Controllers/PriorityCon';

const router = express.Router();
//groups routings
router.get('/groups', getAllGroupsController);

//Requests routings
router.get('/requests', getAllRequests);
router.get('/requests/:id', getRequestByIdController);
router.delete('/requests/:id', deleteRequestByAdmin);
router.put('/requests/:id', updateRequest);
router.put('/requests/:id', updateRequestByIdController);

//Requests AffectedGroups
router.put('/requests/:id/affectedGroups', updateAffectedGroups);

//routings ProductManager
router.get('/productManagers', getAllProductManagers);
router.get('/requests/:groupId', getAllRequestsByProductManager);

//status routings
router.get('/status', getAllStatusController);

//priority routings
router.get('/priority', getAllPrioritiesController);

export default router;
