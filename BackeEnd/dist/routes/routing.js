"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const requestCon_1 = require("../Controllers/requestCon");
const router = (0, express_1.Router)();
// Route to fetch all requests
router.get('/api/requests', requestCon_1.getAllRequestsController);
exports.default = router;
