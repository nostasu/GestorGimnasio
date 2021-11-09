const express = require("express");
const connectDB = require("./DB/connection");
const PORT = process.env.PORT;

var app = express();
require("dotenv").config();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/usuarios", require("./route/userRouter"));
app.use("/api/gimnasios", require("./route/gymRouter"));
app.use("/api/clases", require("./route/classRouter"));
app.use("/api/cuotas", require("./route/feesRouter"));

app.listen(PORT, () => { console.log(`listening on port ${PORT}`); });
