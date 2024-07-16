import express from 'express';
import dotenv from 'dotenv';



import { connectToDatabases } from './src/config/db';
import routing from './src/routes/routing';

var cors = require('cors')

dotenv.config();

const app = express();
const port = process.env.EXPRESS_PORT || 3001;

app.use(express.json());
app.use(cors())
connectToDatabases();

app.use('/api', routing);


// app.get('/', (req, res) => {
//   res.send('Welcome to the Dependencies Planner API');
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

