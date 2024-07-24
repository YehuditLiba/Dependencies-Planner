import { Request, Response } from 'express';
import { getAllAffectedGroups, updateAffectedGroupStatus } from '../Utils/affectedGroupsUtils';
import { getAllStatuses } from '../Utils/StatusUtils';

export const getAllAffectedGroupsController = async (req: Request, res: Response): Promise<void> => {
    try {
        const affectedGroups = await getAllAffectedGroups();
        res.json(affectedGroups);
    } catch (err) {
        console.error('Error in getAllAffectedGroupsController:', err);
        res.status(500).json({ error: 'Failed to fetch affected groups' });
    }
};

export const updateAffectedGroupStatusController = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        const { status } = req.body;
        const updatedGroup = await updateAffectedGroupStatus(id, status);
        if (updatedGroup) {
            res.json(updatedGroup);
        } else {
            res.status(404).json({ error: 'Affected group not found' });
        }
    } catch (err) {
        console.error('Error in updateAffectedGroupStatusController:', err);
        res.status(500).json({ error: 'Failed to update affected group status' });
    }
};
export const editStatusAffectedGroupController = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        const { status } = req.body;

        // בדוק אם הסטטוס שנשלח קיים בטבלת הסטטוסים
        const statuses = await getAllStatuses();
        const statusExists = statuses.some(s => s.status === status);

        if (!statusExists) {
            res.status(400).json({ error: 'Invalid status' });
            return;
        }

        const updatedGroup = await updateAffectedGroupStatus(id, status);
        if (updatedGroup) {
            res.json(updatedGroup);
        } else {
            res.status(404).json({ error: 'Affected group not found' });
        }
    } catch (err) {
        console.error('Error in editStatusAffectedGroupController:', err);
        res.status(500).json({ error: 'Failed to update affected group status' });
    }
};
