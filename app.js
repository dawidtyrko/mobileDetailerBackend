require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors")
const app = express();
const userRoutes = require("./routes/userRoutes");
const detailerRoutes = require("./routes/detailerRoutes");
app.use(cors({
  origin: "*",
  method: ["GET", "POST", "PUT", "PATCH"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));

app.use('/api/user',userRoutes)
app.use('/api/detailer',detailerRoutes)


// Start Server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed.");
  process.exit(0);
});