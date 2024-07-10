// import { Router } from 'express';

// import { GetAllReq } from '../Controllers/requestCon';


// const router = Router();

// // Endpoint to fetch all requests
// router.get('/requests', async (req, res) => {
//   try {
//     const requests = await GetAllReq();
//     res.json(requests);
//   } catch (err) {
//     res.status(500).json({ error: 'Error fetching requests' });
//   }
// });

// export default router;

import { Router } from 'express';
import { GetAllReq} from '../Controllers/requestCon';


const router = Router();

// Endpoint to fetch all requests using GetAllReq
router.get('/requests', async (req, res) => {
  try {
    console.log("HI I'm here")
    const requests = await GetAllReq();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching requests' });
  }
});

// Endpoint to fetch all requests using getAllRequests
// router.get('/requests-callback', (req, res) => {
//   getAllRequests((error, results) => {
//     if (error) {
//       res.status(500).json({ error: 'Error fetching requests' });
//     } else {
//       res.json(results);
//     }
//   });
// });

export default router;