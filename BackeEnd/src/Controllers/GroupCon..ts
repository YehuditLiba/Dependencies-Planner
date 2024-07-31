import { Request, Response } from 'express';
import { getAllGroups,updateGroupById } from '../Utils/GroupUtils';

export const getAllGroupsController = (req: Request, res: Response) => {
    getAllGroups((err, groups) => {
        if (err) {
            console.error('Error fetching groups:', err);
            return res.status(500).json({ error: 'Failed to fetch groups' });
        }
        res.status(200).json(groups);
    });
};
export const editGroupByAdmin = (req: Request, res: Response) => {
    const groupId = parseInt(req.params.groupId, 10);
    const { name } = req.body;

    console.log('Received groupId:', groupId);
    console.log('Received name:', name);

    updateGroupById(groupId, name, (err) => {
        if (err) {
            console.error('Error updating group:', err);
            return res.status(500).json({ error: 'Failed to update group' });
        }
        res.status(200).json({ message: 'Group updated successfully' });
    });
};
