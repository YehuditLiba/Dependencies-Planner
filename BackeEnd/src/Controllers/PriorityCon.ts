import { Request, Response } from 'express';
import { fetchAllPriorities } from '../Utils/prioritUtils';

export const getAllPrioritiesController = async (req: Request, res: Response): Promise<void> => {
    try {
        const priorities = await fetchAllPriorities();
        res.json(priorities);
    } catch (err) {
        console.error('Error in getAllPrioritiesController:', err);
        res.status(500).json({ error: 'Failed to fetch priorities' });
    }
};
