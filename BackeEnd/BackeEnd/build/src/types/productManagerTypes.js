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
const db_1 = require("../config/db");
class ProductManagerRepo {
    static getAllProductManagerNames() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Entering getAllProductManagerNames method');
                const result = yield db_1.pool.query('SELECT name FROM productmanager');
                console.log('Query executed successfully, result:', result.rows);
                return result.rows;
            }
            catch (err) {
                console.error('Error executing query in getAllProductManagerNames:', err);
                throw err;
            }
        });
    }
}
exports.default = ProductManagerRepo;
