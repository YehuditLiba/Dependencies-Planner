// import { Request, Response } from 'express';
// import { getAllAffectedGroups } from '../Utils/affectedGroupsUtils';
// import { updateAffectedGroupList } from '../Utils/affectedGroupsUtils';


// export const getAllAffectedGroupsController = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const affected_group = await getAllAffectedGroups();
//         res.json(affected_group);
//     } catch (err) {
//         console.error('Error in getAllAffectedGroupsController:', err);
//         res.status(500).json({ error: 'Failed to fetch affected_group' });
//     }
// };

// export const updateAffectedGroups = async (req: Request, res: Response): Promise<void> => {
//     try {
//       const id = parseInt(req.params.id);
//       const { affectedGroupList } = req.body;
//       const updatedRequest = await updateAffectedGroupList(id, affectedGroupList);
//       if (updatedRequest) {
//         res.json(updatedRequest);
//       } else {
//         res.status(404).json({ error: 'Request not found' });
//       }
//     } catch (err) {
//       console.error('Error in updateAffectedGroups:', err);
//       res.status(500).json({ error: 'Failed to update affected group list' });
//     }
//   };

import { Request, Response } from 'express';
import { getAllAffectedGroups, updateAffectedGroupStatus } from '../Utils/affectedGroupsUtils';

export const getAllAffectedGroupsController = async (req: Request, res: Response): Promise<void> => {
    try {
        const affectedGroups = await getAllAffectedGroups();
        res.json(affectedGroups);
    } catch (err) {
        console.error('Error in getAllAffectedGroupsController:', err);
        res.status(500).json({ error: 'Failed to fetch affected groups' });
    }
};

export const updateAffectedGroupStatusController = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        const { status } = req.body;
        const updatedGroup = await updateAffectedGroupStatus(id, status);
        if (updatedGroup) {
            res.json(updatedGroup);
        } else {
            res.status(404).json({ error: 'Affected group not found' });
        }
    } catch (err) {
        console.error('Error in updateAffectedGroupStatusController:', err);
        res.status(500).json({ error: 'Failed to update affected group status' });
    }
};


