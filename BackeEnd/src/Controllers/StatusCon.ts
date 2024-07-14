import { Request, Response } from 'express';
import { fetchAllStatuses } from '../Utils/StatusUtils';

export const getAllStatusController = async (req: Request, res: Response): Promise<void> => {
    try {
        const statuses = await fetchAllStatuses();
        res.json(statuses);
    } catch (err) {
        console.error('Error in getAllStatusController:', err);
        res.status(500).json({ error: 'Failed to fetch statuses' });
    }
};
