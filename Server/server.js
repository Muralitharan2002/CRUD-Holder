require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const userRouter = require("./Routers/router")
const port = process.env.PORT;

app.use(cors({
    origin: "https://darling-raindrop-60b36b.netlify.app",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.DATABASE_URL);

const db = mongoose.connection;

db.on("connected", () => {
    console.log("Database connected");
});

db.on("error", (err) => {
    console.error(err);
});



app.use('/router', userRouter);

app.listen(port, () => {
    console.log("Server Running sucessfully")
})

