// productManagerCon.ts
import { Request, Response } from 'express';
import { getProductManagers, getRequestsByProductManager,updateProductManagerByEmail, addProductManagerToDb, deleteProductManagerByEmail } from '../Utils/productUtils';
import { ProductManager } from '../types/productManagerTypes';
// import { getGroupsForProductManager } from '../Utils/productManagerGroupUtils';

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
// export const editProductManagerByAdmin = (req: Request, res: Response) => {
//     const email = req.params.email; // Use email as ID
//     const { name, group_ids } = req.body;
  
//     console.log('Received product manager update:', email, name, group_ids);
  
//     if (!Array.isArray(group_ids) || group_ids.some(id => typeof id !== 'number')) {
//         return res.status(400).json({ error: 'Invalid group_ids format' });
//     }

//     updateProductManagerByEmail(email, name, group_ids)
//         .then(() => res.status(200).json({ message: 'Product manager updated successfully' }))
//         .catch((err) => {
//             console.error('Error updating product manager:', err);
//             res.status(500).json({ error: 'Failed to update product manager' });
//         });

//   };

export const editProductManagerByAdmin = (req: Request, res: Response) => {
    const email = req.params.email; // Use email as ID
    const { name, group_ids } = req.body;
  
    console.log('Received product manager update:', email, name, group_ids);
  
    if (!Array.isArray(group_ids) || group_ids.some(id => typeof id !== 'number')) {
        return res.status(400).json({ error: 'Invalid group_ids format' });
    }

    updateProductManagerByEmail(email, name, group_ids)
        .then(() => res.status(200).json({ message: 'Product manager updated successfully' }))
        .catch((err) => {
            console.error('Error updating product manager:', err);
            res.status(500).json({ error: 'Failed to update product manager' });
        });
};

  const addProductManager = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, group_ids }: ProductManager = req.body;

        if (!name || !email) {
            res.status(400).json({ error: 'Name and email are required' });
            return;
        }

        const newProductManager = await addProductManagerToDb({ name, email, group_ids });
        res.status(201).json(newProductManager);
    } catch (err) {
        console.error('Error in addProductManager:', err);
        res.status(500).json({ error: 'Failed to add product manager' });
    }
};
// const getGroupsByProductManager = async (req: Request, res: Response): Promise<void> => {
//     const email = req.params.email;
//     try {
//         const groups = await getGroupsForProductManager(email);
//         res.json(groups);
//     } catch (err) {
//         console.error('Error in getGroupsByProductManager:', err);
//         res.status(500).json({ error: 'Failed to fetch groups for product manager' });
//     }
// };

export const deleteProductManager = async (req: Request, res: Response): Promise<void> => {
    const email = req.params.email;

    try {
        await deleteProductManagerByEmail(email);
        res.status(200).json({ message: 'Product manager deleted successfully' });
    } catch (err) {
        console.error('Error deleting product manager:', err);
        res.status(500).json({ error: 'Failed to delete product manager' });
    }
};



  
export { getAllProductManagers, getAllRequestsByProductManager, addProductManager };
