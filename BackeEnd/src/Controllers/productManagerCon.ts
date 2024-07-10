// import { Request, Response } from 'express';
// import producManagerTyeps from '../types/productManagerTypes';



// export const getRequestorNames = async (req: Request, res: Response): Promise<void> => {
//     console.log('controller')
//     try {
//       const productManagerNames = await producManagerTyeps.getAllProductManagerNames();
//       res.json(productManagerNames);
//     } catch (error) {
//       console.error('Error fetching requestor names:', error);
//       res.status(500).send('Internal Server Error');
//     }
//   };
  

import { Request, Response } from 'express';
import { getAllProductManagerNames } from '../types/productManagerTypes';

export const getRequestorNames = async (req: Request, res: Response): Promise<void> => {
  try {
    const productManagerNames = await getAllProductManagerNames();
    res.json(productManagerNames);
  } catch (error) {
    console.error('Error fetching requestor names:', error);
    res.status(500).send('Internal Server Error');
  }
};
