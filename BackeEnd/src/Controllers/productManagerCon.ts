// productManagerCon.ts
import { Request, Response } from 'express';
import { getProductManagers, getRequestsByProductManager,updateProductManagerByEmail } from '../Utils/productUtils';

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
export const editProductManagerByAdmin = (req: Request, res: Response) => {
    const email = req.params.email; // Use email as ID
    const { name, group_id } = req.body;
  
    console.log('Received product manager update:', email, name, group_id);
  
    updateProductManagerByEmail(email, name, group_id, (err) => {
      if (err) {
        console.error('Error updating product manager:', err);
        return res.status(500).json({ error: 'Failed to update product manager' });
      }
      res.status(200).json({ message: 'Product manager updated successfully' });
    });
  };
  
export { getAllProductManagers, getAllRequestsByProductManager };
