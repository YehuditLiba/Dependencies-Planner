"use strict";
// import { Request, Response } from 'express';
// import { getAllAffectedGroups } from '../Utils/affectedGroupsUtils';
// import { updateAffectedGroupList } from '../Utils/affectedGroupsUtils';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAffectedGroupStatusController = exports.getAllAffectedGroupsController = void 0;
const affectedGroupsUtils_1 = require("../Utils/affectedGroupsUtils");
const getAllAffectedGroupsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const affectedGroups = yield (0, affectedGroupsUtils_1.getAllAffectedGroups)();
        res.json(affectedGroups);
    }
    catch (err) {
        console.error('Error in getAllAffectedGroupsController:', err);
        res.status(500).json({ error: 'Failed to fetch affected groups' });
    }
});
exports.getAllAffectedGroupsController = getAllAffectedGroupsController;
const updateAffectedGroupStatusController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const { status } = req.body;
        const updatedGroup = yield (0, affectedGroupsUtils_1.updateAffectedGroupStatus)(id, status);
        if (updatedGroup) {
            res.json(updatedGroup);
        }
        else {
            res.status(404).json({ error: 'Affected group not found' });
        }
    }
    catch (err) {
        console.error('Error in updateAffectedGroupStatusController:', err);
        res.status(500).json({ error: 'Failed to update affected group status' });
    }
});
exports.updateAffectedGroupStatusController = updateAffectedGroupStatusController;
