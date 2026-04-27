import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { OrderService } from '../services/OrderService';
import { SupabaseOrderRepository } from '../repositories/SupabaseOrderRepository';

const router = Router();

// Dependency Injection
const orderRepo = new SupabaseOrderRepository();
const orderService = new OrderService(orderRepo);
const orderController = new OrderController(orderService);

// Routes
router.get('/', orderController.getAllOrders);
router.post('/', orderController.createOrder);
router.patch('/:id/status', orderController.updateStatus);
router.delete('/:id', orderController.deleteOrder);

export default router;
