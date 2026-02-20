const express = require("express");
const { connectDB } = require("./config/db");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.route");
const profileRouter = require("./routes/profile.route");
const requestRouter = require("./routes/request.route");
const cors = require('cors');
const { Server } = require('socket.io');
const { createServer } = require('node:http');

const app = express();
const server = createServer(app);
const io = new Server(server);
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
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
