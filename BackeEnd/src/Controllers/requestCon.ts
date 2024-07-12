import { Request, Response } from 'express';
import { updateRequestFields ,fetchAllRequests, getRequestById, deleteRequestsByGroupId, getRequestsByGroupId ,updateAffectedGroupList} from '../Utils/requestUtils';

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

export const deleteRequestsByGroupIdController = async (req: Request, res: Response): Promise<void> => {
  const groupId = parseInt(req.params.groupId, 10);

  if (isNaN(groupId)) {
     res.status(400).json({ error: 'Invalid group ID' });
  }

  try {
    const requests = await getRequestsByGroupId(groupId);
    if (requests.length === 0) {
       res.status(404).json({ error: 'No requests found for this group ID' });
    }

    await deleteRequestsByGroupId(groupId);
     res.json({ message: 'Requests deleted successfully' });
  } catch (error) {
    console.error('Error in deleteRequestsByGroupId:', error);
     res.status(500).json({ error: 'Internal server error' });
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
