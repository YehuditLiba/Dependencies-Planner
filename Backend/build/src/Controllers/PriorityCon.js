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
exports.getAllPrioritiesController = void 0;
const prioritUtils_1 = require("../Utils/prioritUtils");
const getAllPrioritiesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const priorities = yield (0, prioritUtils_1.fetchAllPriorities)();
        res.json(priorities);
    }
    catch (err) {
        console.error('Error in getAllPrioritiesController:', err);
        res.status(500).json({ error: 'Failed to fetch priorities' });
    }
});
exports.getAllPrioritiesController = getAllPrioritiesController;
