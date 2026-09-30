import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import createOrderHandler from './api/create-order.js';
import verifyPaymentHandler from './api/verify-payment.js';

// Custom Vite plugin to serve Razorpay backend API routes (/api/create-order & /api/verify-payment) during dev/preview
function razorpayApiPlugin() {
  const attachMiddleware = (middlewares) => {
    middlewares.use(async (req, res, next) => {
      if (req.url === '/api/create-order' || req.url === '/api/verify-payment') {
        let bodyData = '';
        req.on('data', (chunk) => {
          bodyData += chunk.toString();
        });
        req.on('end', async () => {
          try {
            req.body = bodyData ? JSON.parse(bodyData) : {};
          } catch {
            req.body = {};
          }

          // Express-compatible response wrapper for Node http.ServerResponse
          res.status = (statusCode) => {
            res.statusCode = statusCode;
            return res;
          };
          res.json = (data) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return res;
          };

          if (req.url === '/api/create-order') {
            await createOrderHandler(req, res);
          } else if (req.url === '/api/verify-payment') {
            await verifyPaymentHandler(req, res);
          }
        });
        return;
      }
      next();
    });
  };

  return {
    name: 'razorpay-api-middleware',
    configureServer(server) {
      attachMiddleware(server.middlewares);
    },
    configurePreviewServer(server) {
      attachMiddleware(server.middlewares);
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  process.env.RAZORPAY_KEY_ID = env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
  process.env.RAZORPAY_KEY_SECRET = env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET;

  return {
    plugins: [react(), razorpayApiPlugin()],
    server: {
      host: true,
      port: 5174,
      allowedHosts: true,
    },
  };
});
