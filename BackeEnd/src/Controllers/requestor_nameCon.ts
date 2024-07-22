import { Request, Response } from 'express';
import { getAllRequestorNames } from '../Utils/requestorNameUtils';

export const getAllRequestorNamesController = async (req: Request, res: Response) => {
    try {
        const requestorNames = await getAllRequestorNames();
        res.json(requestorNames);
    } catch (err) {
        console.error('Error in getAllRequestorNamesController:', err);
        res.status(500).json({ error: 'Failed to fetch requestor names' });
    }
};
