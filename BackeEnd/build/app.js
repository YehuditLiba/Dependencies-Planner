"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const routing_1 = __importDefault(require("./src/routes/routing"));
const db_1 = require("./src/config/db");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.EXPRESS_PORT || 3000;
app.use(express_1.default.json());
(0, db_1.connectToDatabases)();
app.use('/api', routing_1.default);
app.get('/', (req, res) => {
    res.send('Welcome to the Dependencies Planner API');
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
