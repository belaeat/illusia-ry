import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db';
import itemRoutes from './routes/item.routes';
import authRoutes from './routes/auth.routes';
import { checkRole, verifyToken } from './middleware/auth.middleware';

dotenv.config();
connectDB();

const app = express();

// ✅ Proper CORS setup

app.use(cors({
  origin: "http://localhost:5173",              // Reflects the request origin
  credentials: true,         // Allows cookies and headers
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'] // Add others if needed
}));
app.use(express.json());           // For parsing application/json
app.use(cookieParser());           // For reading cookies

// ✅ API routes
app.use('/api/items', itemRoutes); 
// If needed, secure the route like this:
// app.use('/api/items', verifyToken, checkRole(['user', 'admin']), itemRoutes);

app.use('/api/auth', authRoutes);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
