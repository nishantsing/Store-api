require("dotenv").config();
//async errors
require('express-async-errors') // try catch handler as well as error handler

const express = require("express");
const notFound = require("./middlewares/notFound");
const app = express();

const connectDB = require("./db/connect");
const product = require("./routes/productRoute.js");

const PORT = process.env.PORT || 5000;

// middlewares
app.use(express.json());

app.get("/", (req, res) => {
    res.send('<h1>Store API<a href="/api/v1/products">products route</a></h1>');
});

app.use("/api/v1/products", product);

// overriding express middlewares
app.use(notFound);

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT, console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.log(err);
    }
};

start();
