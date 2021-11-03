const express = require("express");
var app = express();

require("dotenv").config();
const PORT = process.env.PORT;
const fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => { console.log(`listening on port ${PORT}`); });

app.get("/", (req, res) => {
    return res.send("Hello World!");
});

app.post("/create", (req, res) => {

    let { nombre, poblacion } = req.body;


    let obj = {
        nombre,
        poblacion
    };

    fs.writeFile(`./data/${Date.now()}.json`, JSON.stringify(obj), (err) => {
        if (err) {
            return res.status(403).send({
                success: false,
                message: err
            });
        }
        return res.status(201).send({
            success: true,
            message: "Creado correctamente"
        });
    });

})


app.get("/info/:ms", (req, res) => {
    let param = req.params.ms;

    fs.readFile(`./data/${param}.json`, "utf8", (err, data) => {
        if (err) {
            return res.status(403).send({
                success: false,
                message: err
            });
        }
        res.send(JSON.parse(data))
        console.log(data);
    })
});
