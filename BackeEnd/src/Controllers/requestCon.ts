import { Request, Response } from 'express';
import { fetchAllRequests, getRequestById } from '../Utils/requestUtils';

const getAllRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const requests = await fetchAllRequests();
    res.json(requests);
  } catch (err) {
    console.error('Error in getAllRequests:', err);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
};

const getRequestByIdController = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid ID supplied' });
    return;
  }

  try {
    const request = await getRequestById(id);
    if (!request) {
      res.status(404).json({ error: 'Request not found' });
      return;
    }
    res.json(request);
  } catch (err) {
    console.error('Error in getRequestByIdController:', err);
    res.status(500).json({ error: 'Failed to fetch request by ID' });
  }
};




export { getAllRequests, getRequestByIdController };
