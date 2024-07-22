"use strict";
// productManagerCon.ts
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
exports.getAllRequestsByProductManager = exports.getAllProductManagers = void 0;
const productUtils_1 = require("../Utils/productUtils");
const getAllProductManagers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productManagers = yield (0, productUtils_1.getProductManagers)();
        res.json(productManagers);
    }
    catch (err) {
        console.error('Error in getAllProductManagers:', err);
        res.status(500).json({ error: 'Failed to fetch product managers' });
    }
});
exports.getAllProductManagers = getAllProductManagers;
const getAllRequestsByProductManager = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupId } = req.params;
    try {
        const requests = yield (0, productUtils_1.getRequestsByProductManager)(Number(groupId));
        res.json(requests);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch requests' });
    }
});
exports.getAllRequestsByProductManager = getAllRequestsByProductManager;
