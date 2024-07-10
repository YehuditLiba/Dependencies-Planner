import { Router } from 'express';
import {getRequestorNames } from '../Controllers/productManagerCon';

const router = Router();
router.get('/requestor-names', getRequestorNames);

export default router;