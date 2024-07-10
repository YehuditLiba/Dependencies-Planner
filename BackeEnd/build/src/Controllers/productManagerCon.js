"use strict";
// import { Request, Response } from 'express';
// import producManagerTyeps from '../types/productManagerTypes';
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
exports.getRequestorNames = void 0;
const productManagerTypes_1 = require("../types/productManagerTypes");
const getRequestorNames = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productManagerNames = yield (0, productManagerTypes_1.getAllProductManagerNames)();
        res.json(productManagerNames);
    }
    catch (error) {
        console.error('Error fetching requestor names:', error);
        res.status(500).send('Internal Server Error');
    }
});
exports.getRequestorNames = getRequestorNames;
