import express from 'express';
import dotenv from 'dotenv';
import routing from './src/routes/routing'

dotenv.config();

const app = express();
const port = process.env.EXPRESS_PORT || 3000;

app.use(express.json());


app.use('/api', routing);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});