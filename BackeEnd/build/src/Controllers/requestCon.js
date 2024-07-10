"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRequestsController = void 0;
const requestUtils_1 = require("../Utils/requestUtils");
//  get all requests
const getAllRequestsController = (req, res) => {
    (0, requestUtils_1.getAllRequests)((err, requests) => {
        if (err) {
            console.error('Error fetching requests:', err);
            return res.status(500).json({ error: 'Failed to fetch requests' });
        }
        res.status(200).json(requests);
    });
};
exports.getAllRequestsController = getAllRequestsController;
