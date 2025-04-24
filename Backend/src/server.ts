import dotenv from 'dotenv';
import connectDB from './config/db';import express from 'express';
import cors from 'cors';  // Use `import` for cors as it's an ES module
import cookieParser from 'cookie-parser';
import itemRoutes from './routes/item.routes';
import authRoutes from './routes/auth.routes';
import { checkRole, verifyToken } from './middleware/auth.middleware';

dotenv.config();
connectDB();

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(cookieParser());  // Ensure cookie-parser is added as middleware

// API routes
app.use('/api/items', itemRoutes); 
/* app.use('/api/items', verifyToken, checkRole(['user', 'admin']), itemRoutes); */
app.use('/api/auth', authRoutes);

// export default app;








const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
