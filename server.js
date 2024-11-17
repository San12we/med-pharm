const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");

dotenv.config();

const app = express();
const port = 3000;

// Create HTTP server
const server = http.createServer(app);

app.use(cors());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("MongoDB connected");
}).catch((error) => {
    console.log("Error connecting to MongoDB", error);
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});