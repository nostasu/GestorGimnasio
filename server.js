require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

require('cloudinary').config();
const CLOUDINARY_URL = process.env.CLOUDINARY_URL;

const connectDB = require("./DB/connection");
const { checkToken, errorHandler } = require("./middleware");

const PORT = process.env.PORT;

var app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use("/api/authGym", require("./routes/AuthRouterGyms.js"));
app.use("/api/authUser", require("./routes/AuthRouterUsers"));
app.use("/api/usuarios", checkToken, require("./routes/userRouter"));
app.use("/api/gimnasios", require("./routes/gymRouter"));
app.use("/api/clases", require("./routes/classRouter"));
app.use("/api/cuotas", require("./routes/feesRouter"));

app.use(errorHandler);

app.use(express.static(path.join(__dirname, "client", "build")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(PORT, () => { console.log(`listening on port ${PORT}`); });
