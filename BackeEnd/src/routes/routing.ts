import { Router } from 'express';
import { getAllRequestsController } from '../Controllers/requestCon';

const router = Router();

// Route to fetch all requests
router.get('/requests', getAllRequestsController);

export default router;
