require("dotenv").config();
const express = require("express");
const connectDB = require("./DB/connection");
const { checkToken, errorHandler } = require("./middleware");

const PORT = process.env.PORT;

var app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/authGym", require("./route/AuthRouterGyms.js"));
app.use("/api/authUser", require("./route/AuthRouterUsers"));
app.use("/api/usuarios", checkToken, require("./route/userRouter"));
app.use("/api/gimnasios", require("./route/gymRouter"));
app.use("/api/clases", require("./route/classRouter"));
app.use("/api/cuotas", require("./route/feesRouter"));

app.use(errorHandler);

app.listen(PORT, () => { console.log(`listening on port ${PORT}`); });
