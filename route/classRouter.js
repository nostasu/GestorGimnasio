const express = require("express");
const Class = require("../models/Class"); //requerimos el export
const Gym = require("../models/Gym");
const classRouter = express.Router();
const { checkToken } = require("../middleware");
const User = require("../models/User");

classRouter
    .route("/")

    //Create a class. Only a gym login can create a class.
    .post(checkToken, async (req, res, next) => {

        try {
            const { id } = req.user;
            const gym = await Gym.findById(id);
            if (!gym) {
                return next({
                    succes: false,
                    message: "Hey! You have to login as a gym to create a class!"
                });
            }

            let { tipoClase, fechaHora, alumnosInscritos, maxAlumnos, gimnasio } = req.body;

            gimnasio = id;
            if (!tipoClase || !fechaHora || !maxAlumnos) {
                return next({
                    sucess: false,
                    message: "Fields required:tipoClase, fechaHora, maxAlumnos, check it and try again"
                })
            }

            if (fechaHora) {
                let horasCorrectas = new Date(fechaHora);
                fechaHora = horasCorrectas.setHours(horasCorrectas.getHours() + 1);
            }

            let clase = new Class({
                tipoClase, fechaHora, alumnosInscritos, maxAlumnos, gimnasio
            });

            const todasClases = await Class.find();

            let encontradoClase = todasClases.find(clase => {
                let fecha = new Date(fechaHora);
                if ((clase.tipoClase == tipoClase) && (clase.gimnasio == gimnasio) && (clase.fechaHora.getTime() == fecha.getTime())) {
                    return clase;
                }
            });
            if (encontradoClase) {
                return next({
                    succes: false,
                    message: "Hey! The class already exists in your classes, create a new one"
                });
            }

            const newClass = await clase.save();
            gym.clases.push(newClass._id);
            await gym.save();

            return res.status(200).json({
                sucess: true,
                newClass
            })

        } catch (err) {
            return next({
                status: 403,
                message: err
            });
        }
    })

    //Show all the classes.
    .get(async (req, res, next) => {
        try {
            const classes = await Class.find({}).populate("alumnosInscritos", "nombre apellidos");

            return res.status(200).json({
                sucess: true,
                classes
            })

        } catch (err) {
            return next({
                status: 403,
                message: err
            });
        }
    })

    //This is will be called automatically every time a user logs in.
    // If the date of the class is earlier than the current date, the earlier class will postponed one week.
    .put(async (req, res, next) => {
        try {
            const clasesOrdenadas = await Class.find({}).sort("fechaHora");

            var fechaActualMiliseg = Date.now();
            let horasCorrectas = new Date(fechaActualMiliseg);
            fechaActualMiliseg = horasCorrectas.setHours(horasCorrectas.getHours() + 1);

            const hoy = new Date(fechaActualMiliseg);

            clasesOrdenadas.forEach(async clase => {

                if (hoy > clase.fechaHora) {

                    let claseCambiar = await Class.findById(clase._id);
                    let newDate = new Date(clase.fechaHora);
                    newDate = clase.fechaHora.setDate(clase.fechaHora.getDate() + 7);
                    claseCambiar.fechaHora = newDate;


                    claseCambiar.alumnosInscritos = [];
                    await claseCambiar.save();
                }
            });

            return res.status(200).json({
                success: true,
                message: "Las clases se han actualizado correctamente, ya puede realizar sus reservas"
            })

        } catch (err) {
            return next({
                status: 403,
                message: err
            });
        };
    });

//Update a existing class. The gym that creates the class is the only one that can modify it.
classRouter.put("/update/:id", checkToken, async (req, res, next) => {
    try {
        const idGym = req.user.id;
        const { id } = req.params;

        const gymLogin = await Gym.findById(idGym);
        if (!gymLogin) {
            return next({
                succes: false,
                message: "Hey! You have to login as a Gym yo update a class!"
            });
        }

        const { tipoClase, fechaHora, alumnosInscritos, maxAlumnos, gimnasio } = req.body;

        let changeClass = await Class.findById(id);

        if (!changeClass) {
            return next({
                success: false,
                message: "Hey! That class doesn't exists!"
            });
        }

        if (tipoClase) {
            return next({
                success: false,
                message: "Hey! You can't modify it! Only the date and max.User!"
            });
        }
        if (fechaHora) {
            changeClass.fechaHora = fechaHora;
        }
        if (alumnosInscritos) {
            return next({
                success: false,
                message: "Hey! You can't modify it! Only the date and max.User!"
            });
        }

        if (maxAlumnos) {
            changeClass.maxAlumnos = maxAlumnos;
        }

        if (gimnasio) {
            return next({
                success: false,
                message: "Hey! You can't modify the gym! It's your class!"
            });
        }

        const newClass = await changeClass.save();
        return res.status(200).json({
            sucess: true,
            newClass
        })

    } catch (err) {
        return next({
            status: 403,
            message: err
        });
    }
})
//Delete a class and all dependencies
classRouter.delete("/delete/:id", checkToken, async (req, res, next) => {
    try {

        const idGym = req.user.id;
        const { id } = req.params;

        const claseABorrar = await Class.findByIdAndDelete(id);
        if (!claseABorrar) {
            return next({
                success: false,
                message: "There isn't any class with this id"
            });
        }
        const gym = await Gym.findById(idGym);
        if (!gym) {
            return next({
                succes: false,
                message: "Hey! You have to login as a gym to delete one of your classes!"
            });
        }

        gym.clases.remove(id);
        gym.save();

        if (claseABorrar.alumnosInscritos.length != 0) {
            //hay alumnos inscritos en esa clase, borrar de su array de reservas la clase
            claseABorrar.alumnosInscritos.forEach(async alumno => {
                const usuario = await User.findById(alumno);
                let indice = usuario.reservas.findIndex(reserva => {
                    return reserva.clase.equals(claseABorrar) &&
                        claseABorrar.fechaHora.getTime() == reserva.fechaClase.getTime()
                });
                usuario.reservas.splice(indice, 1);
                await usuario.save();
            })
        }

        //buscar si hay algun alumno con esa clase y borrarlo

        return res.status(200).json({
            success: true,
            message: `The class with id: ${id} is deleted`
        });

    } catch (err) {
        return next({
            status: 403,
            message: err
        });
    }
});
//Finds all users of all classes.
classRouter.get("/todasClasesUsuarios", (req, res, next) => {
    try {
        let classes = Class.find().populate("alumnosInscritos", "nombre");
        if (!classes) {
            return next({
                status: 403,
                message: "There isn't any class in the BBDD"
            });
        }
        return res.status(200).json({
            success: true,
            classes
        })
    } catch (err) {
        return next({
            status: 403,
            message: err
        });
    }
});

//Show a class.
classRouter.get("/find/:id", async (req, res, next) => {
    try {
        const { id } = req.params
        const clase = await Class.findById(id).populate("gimnasio", "nombreCentro");
        if (!clase) {
            return next({
                status: 404,
                message: "There isn't any class with this id"
            });

        }
        return res.status(200).json({
            success: true,
            clase
        })
    } catch (err) {
        return next({
            status: 403,
            message: err
        });
    }
})
module.exports = classRouter;