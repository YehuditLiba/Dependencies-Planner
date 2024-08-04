import { Request, Response } from 'express';
import { getAllGroups,updateGroupById, addGroupToDatabase,deleteGroupById  } from '../Utils/GroupUtils';

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
export const addGroup = (req: Request, res: Response) => {
    const { name } = req.body;

    console.log('Received new group:', name);

    addGroupToDatabase(name, (err) => {
        if (err) {
            console.error('Error adding group:', err);
            return res.status(500).json({ error: 'Failed to add group' });
        }
        res.status(201).json({ message: 'Group added successfully' });
    });
};
export const deleteGroup = async (req: Request, res: Response): Promise<void> => {
    const groupId = req.params.groupId;

    try {
        await deleteGroupById(groupId);
        res.status(200).json({ message: 'Group deleted successfully' });
    } catch (err) {
        console.error('Error deleting group:', err);
        res.status(500).json({ error: 'Failed to delete group' });
    }
};