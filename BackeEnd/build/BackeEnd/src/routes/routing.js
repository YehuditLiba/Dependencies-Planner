"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productManagerCon_1 = require("../Controllers/productManagerCon");
const router = (0, express_1.Router)();
router.get('/requestor-names', productManagerCon_1.getRequestorNames);
exports.default = router;
