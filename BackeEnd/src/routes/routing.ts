import express from 'express';
import { getAllGroupsController } from '../Controllers/GroupCon.';
import { getAllRequests, getRequestByIdController, deleteRequestByAdmin } from '../Controllers/requestCon';
import { getAllProductManagers, getAllRequestsByProductManager } from '../Controllers/productManagerCon';

const router = express.Router();

//groups routings
router.get('/groups', getAllGroupsController);

//Requests routings
router.get('/requests', getAllRequests);
router.get('/requests/:id', getRequestByIdController);
//router.delete('/requests/group/:groupId', deleteRequestsByGroupIdController);
router.delete('/requests/:id', deleteRequestByAdmin);

//ProductManager routings
router.get('/productManagers', getAllProductManagers);
router.get('/requests/:groupId', getAllRequestsByProductManager);

export default router;
