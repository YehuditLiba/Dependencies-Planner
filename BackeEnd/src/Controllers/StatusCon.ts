import { Request, Response } from 'express';
import { fetchAllStatuses, getStatus, updateRequestStatusInDB } from '../Utils/StatusUtils';

export const getAllStatusController = async (req: Request, res: Response): Promise<void> => {
    try {
        const statuses = await fetchAllStatuses();
        res.json(statuses);
    } catch (err) {
        console.error('Error in getAllStatusController:', err);
        res.status(500).json({ error: 'Failed to fetch statuses' });
    }
};

export const getAllStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const statuses = await getStatus();
        res.json(statuses);
    } catch (err) {
        console.error('Error in getAllStatusController:', err);
        res.status(500).json({ error: 'Failed to fetch statuses' });
    }
};
export const updateRequestStatus = async (req: Request, res: Response): Promise<void> => {
    const { requestId, groupId, status } = req.body;

    try {
        const updatedRequest = await updateRequestStatusInDB(requestId, groupId, status);
        res.status(200).json(updatedRequest);
    } catch (err) {
        console.error('Error in updateRequestStatus:', err);
        res.status(500).json({ message: 'Server error' });
    }
};


