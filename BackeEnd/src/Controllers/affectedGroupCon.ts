import { Request, Response } from 'express';
import { getAllAffectedGroups, createAffectedGroupInDB ,updateAffectedGroupStatusInDB} from '../Utils/affectedGroupsUtils';
import { getAllStatuses } from '../Utils/StatusUtils';
// updateAffectedGroupStatus,
export const getAllAffectedGroupsController = async (req: Request, res: Response): Promise<void> => {
    try {
        const affectedGroups = await getAllAffectedGroups();
        res.json(affectedGroups);
    } catch (err) {
        console.error('Error in getAllAffectedGroupsController:', err);
        res.status(500).json({ error: 'Failed to fetch affected groups' });
    }
};


export const createAffectedGroup = async (req: Request, res: Response) => {
    const { requestId, groupId, statusId }: { requestId: number; groupId: number; statusId: number; } = req.body;

    if (!requestId || !groupId || !statusId) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const newAffectedGroup = await createAffectedGroupInDB(requestId, groupId, statusId);
        res.status(201).json(newAffectedGroup);
    } catch (error) {
        console.error('Error creating affected group:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateAffectedGroupStatus = async (req: Request, res: Response) => {
    const { affectedGroupId, statusId }: { affectedGroupId: number; statusId: number; } = req.body;

    if (!affectedGroupId || !statusId) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const updatedAffectedGroup = await updateAffectedGroupStatusInDB(affectedGroupId, statusId);
        res.status(200).json(updatedAffectedGroup);
    } catch (error: unknown) {
        let errorMessage = 'Unknown error';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        console.error('Error updating affected group status:', errorMessage);
        res.status(500).json({ message: errorMessage });
    }
};