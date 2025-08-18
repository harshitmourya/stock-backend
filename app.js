const express = require('express');
const dotenv = require('dotenv')
const stockRoutes = require('./routes/stockRoutes');
const connectDB = require('./config/db');
const stockSchema = require('./models/stockSchema')
const cors = require('cors')
const app = express();
dotenv.config();
connectDB()

app.use(cors({
  origin: ["https://stock-frontend-blond.vercel.app", // Vercel frontend
      "http://localhost:5173",                   // Local frontend (Vite)
      "http://localhost:3000", 
      "http://localhost:5000",
    ],

  methods: ["GET", "POST"],
  credentials: true
}));
app.use (express.json());
app.use('/api/stocks',stockRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to StockPulse API');
});


const PORT = process.env.PORT||5000;
app.listen(PORT ,()=>{
console.log(`server is running on PORT ${PORT}`);

})