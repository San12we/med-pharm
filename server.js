// server.js
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Import Routes
const drugRoutes = require('./routes/drugRoutes');
/* const salesRoutes = require('./routes/salesRoutes');
 */
// Create HTTP server
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.json());

// Routes
app.use('/api', drugRoutes);
/* app.use('/api', salesRoutes);
 */
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("Error connecting to MongoDB", error));

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
