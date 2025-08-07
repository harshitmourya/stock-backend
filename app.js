const express = require('express');
const dotenv = require('dotenv')
const stockRoutes = require('./routes/stockRoutes');
const connectDB = require('./config/db');
const stockSchema = require('./models/stockSchema')
const cors = require('cors')
const app = express();
dotenv.config();
connectDB()

app.use(
  cors({
    origin: "http://localhost:5173", // React app ka origin
  })
);
app.use (express.json());
app.use('/api/stocks',stockRoutes);


const PORT = process.env.PORT||5000;
app.listen(PORT ,()=>{
console.log(`server is running on PORT ${PORT}`);

})