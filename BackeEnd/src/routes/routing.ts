import { Router } from 'express';
import { GetAllReq } from '../Controllers/requestCon';
import { getRequestorNames } from '../Controllers/productManagerCon';

const router = Router();

// Endpoint to fetch all requests
router.get('/requests', async (req, res) => {
  try {
    const requests = await GetAllReq();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching requests' });
  }
});

// Endpoint to fetch product manager names
router.get('/requestor-names', getRequestorNames);

export default router;
