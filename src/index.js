const express = require("express");
require('dotenv').config();

const { connectDB } = require("./config/db");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.route");
const profileRouter = require("./routes/profile.route");
const requestRouter = require("./routes/request.route");
const cors = require('cors');
const { Server } = require('socket.io');
const { createServer } = require('node:http');

const allowedOrigins = ['http://localhost:5173', 'http://16.171.193.219']

const app = express();
const server = createServer(app);
const io = new Server(server);
app.use(cors({
  // origin: 'http://localhost:5173',
  origin: (origin, callback) => {
    // Allow requests with
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },

  credentials: true
}))
// 🔥 THIS LINE IS IMPORTANT
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);


connectDB()
  .then(() => {

    console.log('Database Connected Successfully');

    app.listen(5000, () => {
      console.log('Server is running on PORT 5000');
    });

    io.on('connection', (socket) => {
      console.log('a user connected');
    });
  })
  .catch((err) => { console.error("Error While COnnecting ", err) })
