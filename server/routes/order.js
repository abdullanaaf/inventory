import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getOrders, addOrder, updateOrder, deleteOrder } from '../controllers/orderController.js';

const router = express.Router();

router.post('/add',authMiddleware, addOrder);
router.get('/', authMiddleware, getOrders);
router.put('/:id', authMiddleware, updateOrder); 
router.delete('/:id', authMiddleware, deleteOrder);

export default router;