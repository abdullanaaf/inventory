import express from 'express';
import cors from 'cors';
import connectDB from './db/connection.js';

const app = express();
app.use(cors());
app.use(express.json());

//const PORT = process.env.PORT || 3000;

app.listen(process.env.PORT, () => {
  connectDB();
  console.log('Server is running on http://localhost:3000');
});