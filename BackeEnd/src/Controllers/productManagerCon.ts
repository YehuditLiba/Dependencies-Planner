// productManagerCon.ts
import { Request, Response } from 'express';
import { getProductManagers, getRequestsByProductManager } from '../Utils/productUtils';

const getAllProductManagers = async (req: Request, res: Response): Promise<void> => {
    try {
        const productManagers = await getProductManagers();
        res.json(productManagers);
    } catch (err) {
        console.error('Error in getAllProductManagers:', err);
        res.status(500).json({ error: 'Failed to fetch product managers' });
    }
};
 const getAllRequestsByProductManager = async (req: Request, res: Response) => {
    const { groupId } = req.params;
    try {
        const requests = await getRequestsByProductManager(Number(groupId));
        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch requests' });
    }
};

export { getAllProductManagers, getAllRequestsByProductManager };
