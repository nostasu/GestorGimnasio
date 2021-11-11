const express = require("express");
const Class = require("../models/Class"); //requerimos el export
const Gym = require("../models/Gym");
const classRouter = express.Router();


classRouter.post("/", async (req, res) => {

    try {
        let { tipoClase, fechaHora, alumnosInscritos, maxAlumnos, gimnasio } = req.body;

        //Los required, los controlamos
        if (!tipoClase || !fechaHora || !maxAlumnos || !gimnasio) {
            return res.status(403).json({
                sucess: false,
                mensaje: "Es necesario introducir el tipoClase, la fechaHora, y el maxAlumnos!"
            })
        }

        //Ponemos la hora correcta
        if (fechaHora) {
            let horasCorrectas = new Date(fechaHora);
            fechaHora = horasCorrectas.setHours(horasCorrectas.getHours() + 2);
        }


        let clase = new Class({
            tipoClase, fechaHora, alumnosInscritos, maxAlumnos, gimnasio
        });

        //Antes de guardar la clase, comprobar que no esta ya

        const todasClases = await Class.find(); // Nos sacamos todas clases, iteramos por ellas
        const gym = await Gym.findById(gimnasio);

        if (!gym) {
            return res.status(403).json({
                succes: false,
                message: "Hey! No existe este gimnasio! Introduce uno valido"
            });
        }

        let existeClase;
        let encontradoClase = todasClases.find(clase => {
            let horaExistente = Date.now(clase.fechaHora);
            let fecha = new Date(fechaHora);
            if ((clase.tipoClase == tipoClase) && (clase.gimnasio == gimnasio) && (clase.fechaHora.getTime() == fecha.getTime())) {
                existeClase = true;
            }
        });
        if (existeClase) {
            return res.status(403).json({
                succes: false,
                message: "Hey! Ya existe esta clase"
            });
        }
        //Al crear la clase, la tenemos que añadir tambien al arrayList de clases del gimnasio

        const newClass = await clase.save();
        gym.clases.push(newClass._id);
        await gym.save();

        return res.status(201).json({
            success: true,
            newClass
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
        fechaActualMiliseg = horasCorrectas.setHours(horasCorrectas.getHours());

        const hoy = new Date(fechaActualMiliseg);

        clasesOrdenadas.forEach(async clase => {

            if (hoy > clase.fechaHora) {

                let claseCambiar = await Class.findById(clase._id); //Me encuentra la clase a cambiar
                let newDate = new Date(clase.fechaHora);
                newDate = clase.fechaHora.setDate(clase.fechaHora.getDate() + 7);
                claseCambiar.fechaHora = newDate;
                claseCambiar.alumnosInscritos = [];
                await claseCambiar.save();
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

//Borrar clase eliminando la clase tambien del array de Gym MODIIIFICARRR
classRouter.delete("/delete/:id", async (req, res) => {
    try {

        const { id } = req.params;

        //        const claseABorrar = await Class.findByIdAndDelete(id);  
        const claseABorrar = await Class.findByIdAndDelete(id);  //claseABorrar.gimnasio == id del gimnasio.
        const gym = await Gym.findById(claseABorrar.gimnasio);  //me encuentra el gimnasio con esa id
        gym.clases.remove(id); //Aqui tenemos que eliminar en clases la id del parametro
        gym.save();

        if (!claseABorrar) {
            return res.sendStatus(404).json({
                success: false,
                message: "No se ha encontrado la clase que desea borrar"
            });
        }
        return res.send(`Se ha borrado la clase con id ${id}`);
    } catch (err) {
        return res.status(403).json({
            success: false,
            message: err.message
        });
    }
});

module.exports = classRouter;