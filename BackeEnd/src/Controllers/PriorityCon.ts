import { Request, Response } from 'express';
import { fetchAllPriorities, updatePriority } from '../Utils/priorityUtils';

export const getAllPrioritiesController = async (req: Request, res: Response): Promise<void> => {
    try {
        const priorities = await fetchAllPriorities();
        res.json(priorities);
    } catch (err) {
        console.error('Error in getAllPrioritiesController:', err);
        res.status(500).json({ error: 'Failed to fetch priorities' });
    }
};
// 



  
//   export const updatePriorityController = async (req: Request, res: Response): Promise<void> => {
//     try {
//       const { ID } = req.params;
//       const { priority } = req.body;
  
//       await updatePriority(Number(ID), priority);
//       res.status(200).json({ message: 'Priority updated successfully' });
//     } catch (error) {
//       console.error('Error in updatePriorityController:', error);
//       res.status(500).json({ message: 'Failed to update priority', error: error.message });
//     }
//   };
  
  export const updatePriorityController = async (req: Request, res: Response): Promise<void> => {
    try {
      const { ID } = req.params;
      const { priority } = req.body;
  
      await updatePriority(Number(ID), priority);
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