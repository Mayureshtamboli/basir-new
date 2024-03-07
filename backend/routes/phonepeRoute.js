import { newPayment, checkStatus } from '../controller/phonepe/paymentController.js';
import express from 'express';

const router = express.Router();

router.post('/payment', newPayment);
router.post('/status/:txnId', checkStatus);

export default router;
