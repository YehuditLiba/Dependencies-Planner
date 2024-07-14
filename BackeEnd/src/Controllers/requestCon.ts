import { Request, Response } from 'express';
// import { fetchAllRequests, getRequestById,deleteRequestById } from '../Utils/requestUtils';
import { updateRequestFields, fetchAllRequests, getRequestById, updateAffectedGroupList, deleteRequestById } from '../Utils/requestUtils';

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

export const deleteRequestByAdmin = async (req: Request, res: Response): Promise<void> => {
  const requestId = parseInt(req.params.id, 10);
  const requestorEmail = req.body.requestorEmail; // שימוש בכתובת הדוא"ל שנשלחת מהלקוח

  console.log("Request ID:", requestId);
  console.log("Requestor Email:", requestorEmail);

  if (isNaN(requestId)) {
    res.status(400).json({ error: 'Invalid request ID' });
    return;
  }

  if (!requestorEmail) {
    res.status(400).json({ error: 'Requestor email is required' });
    return;
  }

  try {
    await deleteRequestById(requestId, requestorEmail);
    res.json({ message: 'Request deleted successfully' });
  } catch (error: any) {
    if (error.message === 'Unauthorized: Only the requestor can delete this request') {
      res.status(403).json({ error: 'Unauthorized' });
    } else {
      console.error('Error in deleteRequestByAdmin:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
//עדכון שדות בקשה
export const updateRequest = async (req: Request, res: Response): Promise<void> => {
  try {
      const id = parseInt(req.params.id);
      const updatedFields = req.body;
      const updatedRequest = await updateRequestFields(id, updatedFields);
      if (updatedRequest) {
          res.json(updatedRequest);
      } else {
          res.status(404).json({ error: 'Request not found' });
      }
  } catch (err) {
      console.error('Error in updateRequest:', err);
      res.status(500).json({ error: 'Failed to update request' });
  }
};
//עידכון רשימת מושפעים
export const updateAffectedGroups = async (req: Request, res: Response): Promise<void> => {
  try {
      const id = parseInt(req.params.id);
      const { affectedGroupList } = req.body;
      const updatedRequest = await updateAffectedGroupList(id, affectedGroupList);
      if (updatedRequest) {
          res.json(updatedRequest);
      } else {
          res.status(404).json({ error: 'Request not found' });
      }
  } catch (err) {
      console.error('Error in updateAffectedGroups:', err);
      res.status(500).json({ error: 'Failed to update affected group list' });
  }
};


export { getAllRequests, getRequestByIdController };
