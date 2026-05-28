const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const orderRoutes = require("./routes/orderRoutes");

const app = express();

connectDB();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running");
});

app.use("/api/order", orderRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
