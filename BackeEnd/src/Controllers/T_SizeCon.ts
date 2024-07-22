import { Request, Response } from 'express';
import { getTSize } from '../Utils/T_SizeUtils';

export const getAllTSize = async (req: Request, res: Response): Promise<void> => {
    try {
        const tSizes = await getTSize();
        res.json(tSizes);
    } catch (err) {
        console.error('Error in getAllTSizeController:', err);
        res.status(500).json({ error: 'Failed to fetch t_size' });
    }
};

