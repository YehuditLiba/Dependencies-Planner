import { Request, Response } from 'express';

import {
  updateRequestFields ,getRequestById, getRequestByIdForUp, 
updateAffectedGroupList, deleteRequestById, updateRequestById,updateFinalDecision,
  addRequest, updatePlanned, filterRequests
} from '../Utils/requestUtils';


import { RequestT } from '../types/requestTypes';




export const getRequestByIdController = async (req: Request, res: Response): Promise<void> => {
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

export const deleteRequest = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { requestorEmail } = req.body;

  if (!id || !requestorEmail) {
    return res.status(400).json({ message: 'Missing requestId or requestorEmail' });
  }

  try {
    await deleteRequestById(Number(id), requestorEmail);
    res.status(200).json({ message: `Request with ID ${id} and its affected groups deleted successfully` });
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return res.status(403).json({ message: error.message });
    }
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error('Error deleting request:', errorMessage);
    res.status(500).json({ message: errorMessage });
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

export const updateRequestByIdController = async (req: Request, res: Response): Promise<void> => {
  const requestId = parseInt(req.params.id, 10);
  const { email, ...updateFields } = req.body;

  if (isNaN(requestId)) {
    res.status(400).json({ error: 'Invalid request ID' });
    return;
  }

  if (!email) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  try {
    const request = await getRequestByIdForUp(requestId);
    if (!request) {
      res.status(404).json({ error: 'Request not found' });
      return;
    }

    if (request.email !== email) {
      res.status(403).json({ error: 'Unauthorized: Only the requestor can modify this request' });
      return;
    }

    await updateRequestById(requestId, updateFields);
    res.json({ message: 'Request updated successfully' });
  } catch (error) {
    console.error('Error in updateRequestByIdController:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateFinalDecisionController = async (req: Request, res: Response): Promise<void> => {
  try {
      const id = parseInt(req.params.id);
      const { finalDecision } = req.body;
      const updatedRequest = await updateFinalDecision(id, finalDecision);
      if (updatedRequest) {
          res.json(updatedRequest);
      } else {
          res.status(404).json({ error: 'Request not found' });
      }
  } catch (err) {
      console.error('Error in updateFinalDecision:', err);
      res.status(500).json({ error: 'Failed to update final decision' });
  }
};
//הוספת בקשה חדשה
interface CustomRequest<T> extends Request {
  body: T;
}

export const createRequest = async (req: CustomRequest<RequestT>, res: Response): Promise<void> => {
  try {
    const request: RequestT = {
      ID: req.body.ID, // כולל את ה-ID
      title: req.body.title,
      requestorName: req.body.requestorName,
      requestGroup: req.body.requestGroup,
      description: req.body.description,
      priority: req.body.priority,
      finalDecision: req.body.finalDecision,
      planned: req.body.planned,
      comments: req.body.comments,
      dateTime: new Date(req.body.dateTime),
      affectedGroupList: req.body.affectedGroupList,
      jiraLink: req.body.jiraLink,
      emailRequestor: req.body.emailRequestor
    };

    await addRequest(request);
    res.status(201).json({ message: 'Request added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add request' });
  }
};


//עדכון רבעון
interface CustomRequest<T> extends Request {
  body: T;
}

interface UpdatePlannedBody {
  planned: string;
}
export const updatePlannedField = async (req: CustomRequest<UpdatePlannedBody>, res: Response): Promise<void> => {
  try {
    const { ID } = req.params;
    const { planned } = req.body;

    await updatePlanned(Number(ID), planned);
    res.status(200).json({ message: 'Planned field updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update planned field' });
  }
};

export const getAllFilteredRequestsWithPagination = async (req: Request, res: Response): Promise<void> => {
  console.log('Controller function called');

  const limit = parseInt(req.query.limit as string) || 0;
  const offset = parseInt(req.query.offset as string) || 0;

  try {
    const requestorName = req.query.requestorName as string | undefined;
    const requestorGroup = req.query.requestorGroup as string | undefined;
    const affectedGroupList = req.query.affectedGroupList as string | undefined;

    const { totalCount, requests } = await filterRequests(
      requestorName,
      requestorGroup,
      affectedGroupList,
      limit,
      offset
    );

    res.json({
      limit,
      offset,
      totalCount,
      requests,
    });
  } catch (error) {
    console.error('Error fetching filtered requests with pagination:', error);
    res.status(500).send('Internal Server Error');
  }
};


