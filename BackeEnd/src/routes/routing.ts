import express from 'express';
import { getAllGroupsController } from '../Controllers/GroupCon.';
import { getAllRequests, getRequestByIdController } from '../Controllers/requestCon';

const router = express.Router();

router.get('/groups', getAllGroupsController);
router.get('/requests', getAllRequests);
router.get('/requests/:id', getRequestByIdController);

export default router;
