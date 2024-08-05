import { Request, Response } from 'express';
import { addProductManagerToGroup, getGroupsForProductManager ,getAllGroupsForProductManagers} from '../Utils/productManagerGroupUtils';


export const addProductManagerToGroupHandler = async (req: Request, res: Response) => {
    const { product_manager_email, group_id } = req.body;

    try {
        if (!product_manager_email || !group_id) {
            return res.status(400).json({ message: 'Missing parameters' });
        }

        await addProductManagerToGroup({ product_manager_email, group_id });
        res.status(201).json({ message: 'Product manager added to group successfully' });
    } catch (error) {
        console.error('Error in addProductManagerToGroupHandler:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
export const getProductManagerGroupsHandler = async (req: Request, res: Response) => {
    const { email } = req.params;

    try {
        const group_ids = await getGroupsForProductManager(email);
        res.status(200).json({ email, group_ids });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
export const getAllProductManagerGroupsHandler = async (req: Request, res: Response) => {
    try {
        const productManagerGroups = await getAllGroupsForProductManagers();
        res.status(200).json(productManagerGroups);
    } catch (error) {
        console.error('Error fetching all product manager groups:', error);
        res.status(500).json({ message: 'Server error' });
    }
};