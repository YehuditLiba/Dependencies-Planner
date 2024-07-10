
import { pool } from '../config/db';

// Assuming pool is imported correctly from your db configuration file

export interface ProductManager {
    email: string;
    name: string;
    group_id: number;
}
