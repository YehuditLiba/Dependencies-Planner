"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabases = exports.poolG = exports.pool = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log('Database user:', process.env.DB_USER);
console.log('Database host:', process.env.DB_HOST);
console.log('Database name:', process.env.DB_DATABASE);
console.log('Database password:', process.env.DB_PASSWORD);
console.log('Database port:', process.env.DB_PORT);
// First database configuration
const pool = new pg_1.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    idleTimeoutMillis: 0,
    connectionTimeoutMillis: 0,
    ssl: { rejectUnauthorized: false }
});
exports.pool = pool;
// Second database configuration
const poolG = new pg_1.Pool({
    user: process.env.DB_USER_G,
    host: process.env.DB_HOST_G,
    database: process.env.DB_DATABASE_G,
    password: process.env.DB_PASSWORD_G,
    port: Number(process.env.DB_PORT_G),
    idleTimeoutMillis: 0,
    connectionTimeoutMillis: 0,
    ssl: { rejectUnauthorized: false }
});
exports.poolG = poolG;
// Function to connect to both databases
const connectToDatabases = () => {
    // Test connection to first database
    pool.query('SELECT NOW()', (err, res) => {
        if (err) {
            console.error('Error connecting to first PostgreSQL database:', err);
        }
        else {
            console.log('Connected to first PostgreSQL database at:', process.env.DB_HOST);
        }
    });
    // Test connection to second database
    poolG.query('SELECT NOW()', (err, res) => {
        if (err) {
            console.error('Error connecting to second PostgreSQL database:', err);
        }
        else {
            console.log('Connected to second PostgreSQL database at:', process.env.DB_HOST_G);
        }
    });
};
exports.connectToDatabases = connectToDatabases;
