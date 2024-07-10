// src/Controllers/requestCon.ts
import { Request, Response } from 'express';
import { getAllRequests } from '../Utils/requestUtils';

//  get all requests
export const getAllRequestsController = (req: Request, res: Response) => {
    getAllRequests((err, requests) => {
        if (err) {
            console.error('Error fetching requests:', err);
            return res.status(500).json({ error: 'Failed to fetch requests' });
        }
        res.status(200).json(requests);
    });
};
