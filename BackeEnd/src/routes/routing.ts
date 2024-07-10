import express from 'express';
import { getAllRequestsController } from '../Controllers/requestCon';
import { getAllGroupsController } from '../Controllers/GroupCon.'; 

const router = express.Router();

router.get('/requests', getAllRequestsController);
router.get('/groups', getAllGroupsController); 
export default router;
