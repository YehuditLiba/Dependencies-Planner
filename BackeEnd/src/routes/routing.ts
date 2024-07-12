import express from 'express';
import { getAllGroupsController } from '../Controllers/GroupCon.';
import { getAllRequests, getRequestByIdController, deleteRequestsByGroupIdController,updateRequest } from '../Controllers/requestCon';
import { getAllProductManagers, getAllRequestsByProductManager } from '../Controllers/productManagerCon';

const router = express.Router();

//groups routings
router.get('/groups', getAllGroupsController);

//Requests routings
router.get('/requests', getAllRequests);
router.get('/requests/:id', getRequestByIdController);
router.delete('/requests/group/:groupId', deleteRequestsByGroupIdController);
router.put('/requests/:id', updateRequest);

//ProductManager routings
router.get('/productManagers', getAllProductManagers);
router.get('/requests/:groupId', getAllRequestsByProductManager);

export default router;
