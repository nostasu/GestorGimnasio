const express = require("express");
const Class = require("../models/Class"); //requerimos el export
const Gym = require("../models/Gym");
const classRouter = express.Router();
const { checkToken } = require("../middleware");
const User = require("../models/User");

classRouter
    .route("/")

    //Crear clase, privada, solo puede crear las clases un gym conectado
    .post(checkToken, async (req, res) => {

        try {
            const { id } = req.user;
            const gym = await Gym.findById(id);
            if (!gym) {
                return res.status(403).json({
                    succes: false,
                    message: "Hey! Debes conectarte como gym para acceder a esta seccion!"
                });
            }

            let { tipoClase, fechaHora, alumnosInscritos, maxAlumnos, gimnasio } = req.body;

            gimnasio = id;
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
                tipoClase, fechaHora, alumnosInscritos, maxAlumnos, gimnasio
            });

            //Antes de guardar la clase, comprobar que no esta ya

            const todasClases = await Class.find(); // Nos sacamos todas clases, iteramos por ellas

            let encontradoClase = todasClases.find(clase => {
                let fecha = new Date(fechaHora);
                if ((clase.tipoClase == tipoClase) && (clase.gimnasio == gimnasio) && (clase.fechaHora.getTime() == fecha.getTime())) {
                    return clase;
                }
            });
            if (encontradoClase) {
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
    })

    //Mostrar todas clases
    .get(async (req, res) => {
        try {
            let classes = await Class.find({});

            res.json(classes); //todos las clases

        } catch (err) {
            console.log(err);
            return res.status(403).json({
                succes: false,
                message: err.message
            });
        };
    })

    //Update a existing class. The gym that creates the class is the only one that can modify it.
    .put(checkToken, async (req, res) => {
        try {
            const { id } = req.user;

            const gymLogin = await Gym.findById(id);
            if (!gymLogin) {
                return res.status(403).json({
                    succes: false,
                    message: "Hey! Debes conectarte como gym para acceder a esta seccion!"
                });
            }

            const { classType, dateHour, users, maxUsers, gym } = req.body;

            let changeClass = await Class.findById(id);

            if (classType) {
                return res.status(403).json({
                    success: false,
                    message: "Hey! You can't modify it! Only the date and max.User!"
                });
            }
            if (dateHour) {
                changeClass.fechaHora = fechaHora;
            }
            if (users) {
                return res.status(403).json({
                    success: false,
                    message: "Hey! You can't modify it! Only the date and max.User!"
                });
            }

            if (maxUsers) {
                changeClass.maxAlumnos = maxAlumnos;
            }

            if (gym) {
                return res.status(403).json({
                    success: false,
                    message: "Hey! El gimnasio asociado no se puede modificar! Solo la fechaHora"
                });
            }

            const newClass = await changeClass.save();
            return res.json({
                sucess: true,
                newClass
            })

        } catch (err) {
            return res.status(403).json({
                success: false,
                message: err.message
            });
        }
    })
    //Borrar clase eliminando la clase tambien del array de Gym MODIIIFICARRR y del Array de Usuarios.reservas
    .delete(checkToken, async (req, res) => {
        try {

            const { idGym } = req.user;
            const { id } = req.body;

            const claseABorrar = await Class.findByIdAndDelete(id);  //me encuentra la clase que quiero borrar
            const gym = await Gym.findById(idGym);
            if (!gym) {
                return res.status(403).json({
                    succes: false,
                    message: "Hey! Debes conectarte como gym para acceder a esta seccion!"
                });
            }
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
//Encuentra todos los usuarios de tooodas las clases
classRouter.get("/todasClasesUsuarios", (req, res) => {
    Class.find().populate("alumnosInscritos", "nombre").exec((err, classes) => {

        if (err) {
            res.status(400).send(err.response.data);
        }
        res.json(classes);
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

                claseCambiar.alumnosInscritos.forEach(async alumn => {
                    const alumno = await User.findById(alumn._id); //Encuentrame al alumno por su id
                    alumno.reservas.remove(claseCambiar._id); //me encuentra en el array de clases la clase con esa id y la elimina
                    await alumno.save();
                });


                claseCambiar.alumnosInscritos = [];
                await claseCambiar.save();
            }
        });

        return res.json({
            success: true,
            clasesOrdenadas

        })

    } catch (err) {
        console.log(err);
        return res.status(403).json({
            succes: false,
            message: err.message
        });
    };
});

//Mostrar 1 clase por id
classRouter.get("/find/:id", async (req, res) => {
    try {
        const { id } = req.params
        const clase = await Class.findById(id).populate("gimnasio", "nombreCentro");
        if (!clase) {
            return res.status(404).json({
                sucess: false,
                message: "No existe ningun clase con esta id"
            })
        }
        return res.json({
            success: true,
            clase
        })
    } catch (err) {
        console.log(err);
        return res.status(403).json({
            success: false,
            message: err.message
        });
    }
})
module.exports = classRouter;