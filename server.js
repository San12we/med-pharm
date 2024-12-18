const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io"); // Uncommented

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Import Routes
const drugRoutes = require("./routes/drugRoutes");
const salesRoutes = require("./routes/salesRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");

// Create HTTP server
const server = http.createServer(app);

// Enable Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust this to match your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.json());

// Routes
app.use("/api/drugs", drugRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/deliveries", deliveryRoutes);

// Default error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: "Something went wrong. Please try again later.",
    details: err.message,
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit if the database connection fails
  });

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Example of listening for events
  socket.on("message", (data) => {
    console.log("Message received:", data);
    // Broadcast message to all connected clients
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
