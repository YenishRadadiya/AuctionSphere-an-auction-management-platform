import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
config();
// Load environment variable
const PORT = process.env.PORT || 5000;
// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes

// Error handling middleware
app.use((req: Request, res: Response) => {
    console.log(res);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});