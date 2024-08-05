import { Request, Response } from 'express';
import path from 'path';
import {
  updateRequestFields ,getRequestById, getRequestByIdForUp, 
  updateAffectedGroupList, deleteRequestById, updateRequestById, updateFinalDecision, fetchAllRequests,
  addRequest, updatePlanned, filterRequests
} from '../Utils/requestUtils';
import { RequestT } from '../types/requestTypes';
import { createObjectCsvWriter } from 'csv-writer';

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
    return res.status(400).json({ message: 'Missing requestId or requestorEmail' });
  }

  try {
    await deleteRequestById(Number(id), requestorEmail);
    res.status(200).json({ message: `Request with ID ${id} and its affected groups deleted successfully` });
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
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return res.status(403).json({ message: error.message });
    }
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
      emailRequestor: req.body.emailRequestor,
      statuses: req.body.statuses // כולל את הסטטוסים
    };

    await addRequest(request); // להוסיף את הבקשה
    await addRequest(request); // להוסיף את הבקשה
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

  // קבלת פרמטרי המיון מתוך הבקשה, אם קיימים
  const sortBy = req.query.sortBy as string || 'r.id'; // ערך ברירת מחדל הוא 'r.id'
  const sortDirection: 'ASC' | 'DESC' = (req.query.sortDirection as 'ASC' | 'DESC') || 'DESC'; // ערך ברירת מחדל הוא 'DESC'

  try {
    const requestorName = req.query.requestorName as string | undefined;
    const requestorGroup = req.query.requestorGroup as string | undefined;
    const affectedGroupList = req.query.affectedGroupList as string | undefined;

    console.log('Query parameters:', { requestorName, requestorGroup, affectedGroupList, sortBy, sortDirection, limit, offset });

    const { totalCount, requests } = await filterRequests(
      requestorName,
      requestorGroup,
      affectedGroupList,
      sortBy,           // הוסף את פרמטר המיון לפי עמודה
      sortDirection,    // הוסף את פרמטר כיוון המיון
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
export const exportRequestsToCSV = async (req: Request, res: Response): Promise<void> => {
  try {
    // שליפת כל הבקשות
    const rows = await fetchAllRequests();

    // המרת הנתונים לפורמט שמתאים ל-CSV
    const formattedRows = rows.map(row => ({
      id: row.id,
      title: row.title,
      request_group: row.request_group,
      description: row.description,
      priority: row.priority,
      final_decision: row.final_decision,
      planned: row.planned,
      comments: row.comments,
      date_time: row.date_time,
      affected_group_list: row.affected_group_list.join(','), // המרת המערך לשרשרת
      statuses: JSON.stringify(row.statuses), // המרת JSON לשרשרת טקסט
      jira_link: row.jira_link,
      requestor_name: row.requestor_name,
      requestor_email: row.requestor_email
    }));
    
    // יצירת שם קובץ עם תאריך ושעה כדי להבטיח ייחודיות
    const timestamp = new Date().toISOString().replace(/:/g, '-'); // שינוי תווי ':' ל'-' שיהיה מתאים לשם קובץ
    const fileName = `requests_${timestamp}.csv`;
    const absolutePath = path.resolve(__dirname, fileName);

    console.log(`Writing CSV file to ${absolutePath}`);

    // יצירת קובץ CSV
    const csvWriter = createObjectCsvWriter({
      path: 'absolutePath',
      header: [
        { id: 'id', title: 'ID' },
        { id: 'title', title: 'Title' },
        { id: 'request_group', title: 'Request Group' },
        { id: 'description', title: 'Description' },
        { id: 'priority', title: 'Priority' },
        { id: 'final_decision', title: 'Final Decision' },
        { id: 'planned', title: 'Planned' },
        { id: 'comments', title: 'Comments' },
        { id: 'date_time', title: 'Date Time' },
        { id: 'affected_group_list', title: 'Affected Group List' },
        { id: 'statuses', title: 'Statuses' },
        { id: 'jira_link', title: 'Jira Link' },
        { id: 'requestor_name', title: 'Requestor Name' },
        { id: 'requestor_email', title: 'Requestor Email' }
      ]
    });

    // כתיבת הנתונים לקובץ CSV
    await csvWriter.writeRecords(formattedRows);
    console.log(`CSV file written successfully to ${absolutePath}`);

    // שליחת הקובץ למשתמש להורדה
    res.download(absolutePath);

  } catch (error) {
    console.error('Error exporting requests to CSV:', error);
    res.status(500).send('Internal Server Error');
  }
};