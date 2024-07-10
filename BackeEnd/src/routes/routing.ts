import express from 'express';
import { getAllGroupsController } from '../Controllers/GroupCon.'; 
import { GetAllReq } from '../Controllers/requestCon';
// import { getRequestorNames } from '../Controllers/productManagerCon';

const router = express.Router();

router.get('/groups', getAllGroupsController); 
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
// router.get('/requestor-names', getRequestorNames);


export default router;
