"use strict";
// import { Router } from 'express';
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
// import { GetAllReq } from '../Controllers/requestCon';
// const router = Router();
// // Endpoint to fetch all requests
// router.get('/requests', async (req, res) => {
//   try {
//     const requests = await GetAllReq();
//     res.json(requests);
//   } catch (err) {
//     res.status(500).json({ error: 'Error fetching requests' });
//   }
// });
// export default router;
const express_1 = require("express");
const requestCon_1 = require("../Controllers/requestCon");
const router = (0, express_1.Router)();
// Endpoint to fetch all requests using GetAllReq
router.get('/requests', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("HI I'm here");
        const requests = yield (0, requestCon_1.GetAllReq)();
        res.json(requests);
    }
    catch (err) {
        res.status(500).json({ error: 'Error fetching requests' });
    }
}));
// Endpoint to fetch all requests using getAllRequests
// router.get('/requests-callback', (req, res) => {
//   getAllRequests((error, results) => {
//     if (error) {
//       res.status(500).json({ error: 'Error fetching requests' });
//     } else {
//       res.json(results);
//     }
//   });
// });
exports.default = router;
