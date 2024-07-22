// src/Utils/testDatabaseConnection.ts
import { pool, poolG } from '../../config/db';

const testDatabaseConnection = () => {
    // Test connection to first database
    pool.query('SELECT NOW()', (err, res) => {
        if (err) {
            console.error('Error connecting to first PostgreSQL database:', err);
        } else {
            console.log('Connected to first PostgreSQL database at:', process.env.DB_HOST);
            console.log('First database current time:', res.rows[0].now);
        }
    });

    // Test connection to second database
    poolG.query('SELECT NOW()', (err, res) => {
        if (err) {
            console.error('Error connecting to second PostgreSQL database:', err);
        } else {
            console.log('Connected to second PostgreSQL database at:', process.env.DB_HOST_G);
            console.log('Second database current time:', res.rows[0].now);
        }
    });
};

// Export the function to be used elsewhere
export default testDatabaseConnection;
