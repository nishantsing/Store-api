const mongoose = require("mongoose");

const connectDB = async (URI) => {
    return mongoose.connect(URI);
};

module.exports = connectDB;
