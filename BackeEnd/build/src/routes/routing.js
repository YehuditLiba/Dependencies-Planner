"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const GroupCon_1 = require("../Controllers/GroupCon.");
const requestCon_1 = require("../Controllers/requestCon");
const productManagerCon_1 = require("../Controllers/productManagerCon");
const router = express_1.default.Router();
//groups routings
router.get('/groups', GroupCon_1.getAllGroupsController);
//Requests routings
router.get('/requests', requestCon_1.getAllRequests);
router.get('/requests/:id', requestCon_1.getRequestByIdController);
router.delete('/requests/group/:groupId', requestCon_1.deleteRequestsByGroupIdController);
//ProductManager routings
router.get('/productManagers', productManagerCon_1.getAllProductManagers);
router.get('/requests/:groupId', productManagerCon_1.getAllRequestsByProductManager);
exports.default = router;
