import { Request, Response } from 'express';
import { fetchAllPriorities, getPriorityIdByName, updatePriority } from '../Utils/priorityUtils';

export const getAllPrioritiesController = async (req: Request, res: Response): Promise<void> => {
    try {
        const priorities = await fetchAllPriorities();
        res.json(priorities);
    } catch (err) {
        console.error('Error in getAllPrioritiesController:', err);
        res.status(500).json({ error: 'Failed to fetch priorities' });
    }
};


  
  export const updatePriorityController = async (req: Request, res: Response): Promise<void> => {
    try {
      const { ID } = req.params;
      const { priority } = req.body;
  
      // קבלת ה-ID של ה-priority לפי שמו
      const priorityId = await getPriorityIdByName(priority);

      if (priorityId === null) {
        res.status(404).json({ message: 'Priority not found' });
        return;
    }
      await updatePriority(Number(ID), /*priority*/priorityId);
      res.status(200).json({ message: 'Priority updated successfully' });
    } catch (error) {
      console.error('Error in updatePriorityController:', error);
  
      let errorMessage = 'Failed to update priority';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
  
      res.status(500).json({ message: errorMessage, error });
    }
  };