import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js'
import userRouter from './routes/userRoutes.js'
import taskRouter from './routes/taskRoutes.js';

const app = express();
const port = process.env.PORT || 4000;

//Connect Database
 await connectDB();

//MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// 👇 ADD THIS LOGGER
app.use((req, res, next) => {
  console.log('--- New Request ---');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Content-Type Header:', req.headers['content-type']);
  console.log('Raw Body (first 100 chars):', req.rawBody ? req.rawBody.toString().substring(0, 100) : 'N/A');
  next(); // Don't forget this!
});

//ROUTES
app.use("/api/user", userRouter)
app.use("/api/tasks", taskRouter)

app.get('/', (req,res) => {
    res.send('API WORKING');
});

app.listen(port, () => {
    console.log(`Server connect at http://localhost:${port}`);
})