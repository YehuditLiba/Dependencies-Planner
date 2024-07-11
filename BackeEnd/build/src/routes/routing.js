"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const GroupCon_1 = require("../Controllers/GroupCon.");
const requestCon_1 = require("../Controllers/requestCon");
const router = express_1.default.Router();
router.get('/groups', GroupCon_1.getAllGroupsController);
router.get('/requests', requestCon_1.getAllRequests);
router.get('/requests/:id', requestCon_1.getRequestByIdController);
exports.default = router;
