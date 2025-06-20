import express from 'express';
import cors from 'cors';
import connectDB from './db/connection.js';
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/category.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);

//const PORT = process.env.PORT || 3000;

app.listen(process.env.PORT, () => {
  connectDB();
  console.log('Server is running on http://localhost:3000');
});