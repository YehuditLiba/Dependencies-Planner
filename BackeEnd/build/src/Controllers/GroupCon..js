"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllGroupsController = void 0;
const GroupUtils_1 = require("../Utils/GroupUtils");
// Controller function to get all groups
const getAllGroupsController = (req, res) => {
    (0, GroupUtils_1.getAllGroups)((err, groups) => {
        if (err) {
            console.error('Error fetching groups:', err);
            return res.status(500).json({ error: 'Failed to fetch groups' });
        }
        res.status(200).json(groups);
    });
};
exports.getAllGroupsController = getAllGroupsController;
