import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import createOrderHandler from './api/create-order.js';
import verifyPaymentHandler from './api/verify-payment.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Step 1: Create Razorpay Order Endpoint
app.post('/api/create-order', (req, res) => createOrderHandler(req, res));

// Step 3: Verify Razorpay Payment Signature Endpoint
app.post('/api/verify-payment', (req, res) => verifyPaymentHandler(req, res));

// Serve static production frontend if dist exists
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.listen(PORT, () => {
  console.log(`✅ SHUBHAANGI Razorpay Backend Server running on http://localhost:${PORT}`);
});
