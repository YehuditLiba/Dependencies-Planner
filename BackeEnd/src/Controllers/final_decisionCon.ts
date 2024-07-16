import { Request, Response } from 'express';
import { getAllDecisions } from '../Utils/final_decisionUtils';

export const getAllDecisionsController = async (req: Request, res: Response) => {
    try {
        const decisions = await getAllDecisions();
        res.json(decisions);
    } catch (err) {
        console.error('Error in getAllDecisionsController:', err);
        res.status(500).json({ error: 'Failed to fetch decisions' });
    }
};
