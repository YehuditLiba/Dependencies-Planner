import express from 'express';
import dotenv from 'dotenv';
import routing from './src/routes/routing';
import { connectToDatabases } from './src/config/db';

dotenv.config();

const app = express();
const port = process.env.EXPRESS_PORT || 3000;

app.use(express.json());

// Test database connections
connectToDatabases();

app.use('/api', routing);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
