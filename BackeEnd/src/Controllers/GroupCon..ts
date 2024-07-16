import { Request, Response } from 'express';
import { getAllGroups } from '../Utils/GroupUtils';

// Controller function to get all groups
export const getAllGroupsController = (req: Request, res: Response) => {
    getAllGroups((err, groups) => {
        if (err) {
            console.error('Error fetching groups:', err);
            return res.status(500).json({ error: 'Failed to fetch groups' });
        }
        res.status(200).json(groups);
    });
};
