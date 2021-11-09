const express = require("express");
const Class = require("../models/Class"); //requerimos el export
const Gym = require("../models/Gym");
const classRouter = express.Router();


classRouter.post("/", async (req, res) => {

    try {
        let { tipoClase, fechaHora, alumnosInscritos, maxAlumnos } = req.body;

        //Los required, los controlamos
        if (!tipoClase || !fechaHora || !maxAlumnos) {
            return res.status(403).json({
                sucess: false,
                mensaje: "Es necesario introducir el tipoClase, la fechaHora, y el maxAlumnos!"
            })
        }

        //Ponemos la hora correcta
        if (fechaHora) {
            let horasCorrectas = new Date(fechaHora);
            fechaHora = horasCorrectas.setHours(horasCorrectas.getHours() + 1);
        }


        let clase = new Class({
            tipoClase, fechaHora, alumnosInscritos, maxAlumnos
        });

        const newClass = await clase.save();

        return res.status(201).json({
            success: true,
            clase
        })

    } catch (err) {
        console.log(err);
        return res.status(403).json({
            succes: false,
            message: err.message
        });
    };
});


classRouter.get("/", (req, res) => {
    Class.find({}, (err, classes) => {
        if (err) {
            res.status(400).send(err.response.data);
        }
        res.json(classes); //todos las clases
    });
});

//Encuentra todos los usuarios de tooodas las clases
classRouter.get("/todasClasesUsuarios", async (req, res) => {
    Class.find().populate("alumnosInscritos").exec((err, classes) => {

        if (err) {
            res.status(400).send(err.response.data);
        }
        res.json(classes); //todos las clases
    });
});

//Esta se llamara automaticamente cada vez que un user haga login
// si la fecha de la clase es anterior, a la fecha actual, sumarle una semana
classRouter.put("/updateClasses", async (req, res) => {
    try {
        const clasesOrdenadas = await Class.find({}).sort("fechaHora");

        var fechaActualMiliseg = Date.now();
        let horasCorrectas = new Date(fechaActualMiliseg);
        fechaActualMiliseg = horasCorrectas.setHours(horasCorrectas.getHours() + 1);

        const hoy = new Date(fechaActualMiliseg);

        clasesOrdenadas.forEach(async clase => {
            if (hoy > clase.fechaHora) {
                console.log("Es mayor, actualizar");
                clase.fechaHora = clase.fechaHora.setDate(clase.fechaHora.getDate() + 7);
                await clase.save();
                console.log(clase.fechaHora);
            }
        });

        return res.json(clasesOrdenadas);

    } catch (err) {
        console.log(err);
        return res.status(403).json({
            succes: false,
            message: err.message
        });
    };
});


module.exports = classRouter;