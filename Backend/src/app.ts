import express from 'express';
import cors = require("cors");
import itemRoutes from './routes/item.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/items', itemRoutes);

export default app;
