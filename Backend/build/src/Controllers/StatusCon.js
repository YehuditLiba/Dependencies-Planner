"use strict";
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
exports.setAllStatus = exports.getAllStatusController = void 0;
const StatusUtils_1 = require("../Utils/StatusUtils");
const getAllStatusController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const statuses = yield (0, StatusUtils_1.fetchAllStatuses)();
        res.json(statuses);
    }
    catch (err) {
        console.error('Error in getAllStatusController:', err);
        res.status(500).json({ error: 'Failed to fetch statuses' });
    }
});
exports.getAllStatusController = getAllStatusController;
const setAllStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const statuses = yield (0, StatusUtils_1.getStatus)();
        res.json(statuses);
    }
    catch (err) {
        console.error('Error in getAllStatusController:', err);
        res.status(500).json({ error: 'Failed to fetch statuses' });
    }
});
exports.setAllStatus = setAllStatus;
