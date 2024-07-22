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
exports.getAllDecisionsController = void 0;
const final_decisionUtils_1 = require("../Utils/final_decisionUtils");
const getAllDecisionsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decisions = yield (0, final_decisionUtils_1.getAllDecisions)();
        res.json(decisions);
    }
    catch (err) {
        console.error('Error in getAllDecisionsController:', err);
        res.status(500).json({ error: 'Failed to fetch decisions' });
    }
});
exports.getAllDecisionsController = getAllDecisionsController;
