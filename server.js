import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors'; // Keep this line
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  'http://localhost:3000', // Development
  'https://job-board-fe-pwmj.onrender.com', // Production
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // Allow the origin
    } else {
      callback(new Error('Not allowed by CORS')); // Reject the origin
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};

app.use(cors(corsOptions)); // Use the CORS configuration

app.use(express.json());

const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.get('/', (req, res) => res.send('Welcome to the API!'));

app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/job', jobRoutes);
app.use('/api/id', profileRoutes);

const buildPath = path.join(__dirname, 'client', 'build');
app.use(express.static(buildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
