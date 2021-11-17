const express = require("express");
const User = require("../models/User");
const Gym = require("../models/Gym");
const Class = require("../models/Class");
const userRouter = express.Router();

userRouter.route("/")
    .get(async (req, res, next) => {
        try {
            let users = await User.find({});
            if (!users) {
                return next({
                    success: false,
                    message: `There isn't any user with this id!`
                })
            }
            res.status(201).json({
                success: true,
                users
            });

        } catch (err) {
            return next({
                status: 403,
                message: err
            });
        }
    })

    .put(async (req, res, next) => {
        try {
            const { id } = req.user;

            const { nombre, apellidos, telefono, email, contraseña, fechaInicio, gimnasio, cuota, reservas } = req.body;

            const gymExiste = await Gym.findById(gimnasio);

            let usuario = await User.findById(id);

            if (nombre) {
                usuario.nombre = nombre;
            }
            if (apellidos) {
                usuario.apellidos = apellidos;
            }
            if (telefono) {
                usuario.telefono = telefono;
            }
            if (email) {
                return next({
                    success: false,
                    message: "Your email is your nick and you can't modify it!"
                });
            }
            if (contraseña) {
                var regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
                if (!regularExpression.test(contraseña)) {
                    return next({
                        success: false,
                        message: "The password have to contain 6 characters, uppercase, lowercase and a number!"
                    });
                } else {
                    usuario.contraseña = contraseña;
                }
            }

            //Fecha inicio
            if (fechaInicio) {
                usuario.fechaInicio = fechaInicio;
            }

            //gimnasio
            if (gimnasio) {
                //Primero, comprobamos que el gimnasio existe
                if (gymExiste) {
                    usuario.gimnasio = gimnasio;
                } else {
                    return next({
                        success: false,
                        message: `There isn't any gym with the id: ${gimnasio}`
                    });
                }
            }

            //cuota, tenemos el gym en gym en gymExiste, comprobar si tiene esa cuota
            if (cuota) {
                if (gymExiste) {
                    let existeCuota = gymExiste.cuotas.find(cuotaGym => cuotaGym.equals(cuota));
                    if (existeCuota) {
                        usuario.cuota = cuota;
                    } else {
                        return next({
                            success: false,
                            message: ` The gym ${gymExiste.nombre} doesn't have this fee!`
                        });
                    }
                }
            }

            const userUpdate = await usuario.save();
            return res.status(201).json({
                sucess: true,
                userUpdate
            });

        } catch (err) {
            return next({
                status: 403,
                message: err
            });
        }
    })
    //Eliminar usuario
    .delete(async (req, res, next) => {
        try {

            const { id } = req.user;

            const usuario = await User.findByIdAndDelete(id);
            if (!usuario) {
                return next({
                    success: false,
                    message: "The user doesn't exists, check that you're login as a user"
                });
            }

            usuario.reservas.forEach(async claseReservada => {
                let clase = await Class.findById(claseReservada);
                console.log(clase);
                clase.alumnosInscritos.remove(id);
                await clase.save();
            })

            return res.status(201).json({
                sucess: true,
                usuario
            });

        } catch (err) {
            return next({
                status: 403,
                message: err
            });
        }
    });

//Show a user by id
userRouter.get("/find/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).populate("gimnasio", "nombreCentro").populate("reservas");
        if (!user) {
            return next({
                sucess: false,
                message: "There isn't any user with this id"
            })
        }
        return res.status(201).json({
            success: true,
            user
        })
    } catch (err) {
        return next({
            status: 403,
            message: err
        });
    }
})

userRouter.put("/inscribirse", async (req, res, next) => {
    try {
        const { id } = req.user;

        const usuario = await User.findById(id).populate("gimnasio");

        if (!usuario) {
            return next({
                succes: false,
                message: "User validation failed!"
            })
        }
        const { reservas } = req.body;

        if (usuario.reservas.length > usuario.cuota.clases) {
            return next({
                succes: false,
                message: "You have already wasted all your classes!"
            })
        } else {
            if (usuario.reservas.includes(reservas)) {
                return next({
                    succes: false,
                    message: "You have already signed up in that class!"
                })
            }

            let existeClaseGym = false;
            for (let i = 0; i < usuario.gimnasio.clases.length; i++) {
                if (usuario.gimnasio.clases[i] == reservas) {
                    existeClaseGym = true;
                }
            }

            if (!existeClaseGym) {
                return next({
                    succes: false,
                    message: "There isn't such class in your gym!"
                })
            }

            const clases = await Class.findById(reservas);
            if (!clases) {
                return next({
                    succes: false,
                    message: "That class doesn't exists"
                })
            }
            if (clases.maxAlumnos <= clases.alumnosInscritos.length) {
                return next({
                    succes: false,
                    message: "You can't join that class, it's full!"
                })
            } else if (existeClaseGym) {
                usuario.reservas.push(reservas);
                clases.alumnosInscritos.push(usuario.id);
            }
            const userUpdate = await usuario.save();
            const classUpdate = await clases.save();
            return res.status(201).json({
                sucess: true,
                userUpdate,
                classUpdate
            })
        }

    } catch (err) {
        return next({
            status: 403,
            message: err
        });
    }
});

userRouter.put("/delete/clase/", async (req, res, next) => {
    try {

        const { id } = req.user;

        const { reservas } = req.body;

        const usuario = await User.findById(id);
        if (!usuario) {
            return next({
                succes: false,
                message: "User conecction failed"
            })
        }

        const clase = await Class.findById(reservas);
        if (!clase) {
            return next({
                succes: false,
                message: "This class doesn't exists!"
            })
        }

        console.log(usuario.reservas);

        let indice = usuario.reservas.findIndex(reserva => reserva.equals(reservas));
        if (indice < 0) {
            return next({
                succes: false,
                message: "The user isn't enrolled in that class!"
            })
        } else {
            usuario.reservas.splice(indice, 1);
            await usuario.save();
            //ahora en clases, borramos clases.reservas el id del usario
            let indiceAlumno = clase.alumnosInscritos.findIndex(alumno => alumno.equals(id));
            clase.alumnosInscritos.splice(indiceAlumno, 1);
            clase.save();
        }

        return res.status(201).json({
            sucess: true,
            usuario
        });

    } catch (err) {
        return next({
            status: 403,
            message: err
        });
    }
});

module.exports = userRouter;