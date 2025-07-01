import express from 'express';
import cors from 'cors';
import uploadRoutes from './routes/uploadRoutes.js';
import connectDB from './db/connection.js';
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/category.js';
import supplierRoutes from './routes/supplier.js';
import productRoutes from './routes/product.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/supplier', supplierRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);

app.listen(process.env.PORT, () => {
  connectDB();
  console.log('Server is running on http://localhost:3000');
});