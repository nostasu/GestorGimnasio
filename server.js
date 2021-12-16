require("dotenv").config();
const express = require("express");
const cors = require("cors");

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

app.use("/api/authGym", require("./route/AuthRouterGyms.js"));
app.use("/api/authUser", require("./route/AuthRouterUsers"));
app.use("/api/usuarios", checkToken, require("./route/userRouter"));
app.use("/api/gimnasios", require("./route/gymRouter"));
app.use("/api/clases", require("./route/classRouter"));
app.use("/api/cuotas", require("./route/feesRouter"));

app.use(errorHandler);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(PORT, () => { console.log(`listening on port ${PORT}`); });
