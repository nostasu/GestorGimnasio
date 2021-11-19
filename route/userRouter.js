const express = require("express");
const User = require("../models/User");
const Gym = require("../models/Gym");
const Class = require("../models/Class");
const userRouter = express.Router();

userRouter.route("/")
    //show all users
    .get(async (req, res, next) => {
        try {
            let users = await User.find({}).select("-password");;
            if (!users) {
                return next({
                    success: false,
                    message: `There isn't any user!`
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
    //Update a user
    .put(async (req, res, next) => {
        try {
            const { id } = req.user;

            const { nombre, apellidos, telefono, email, contraseña, fechaInicio, gimnasio, cuota, reservas } = req.body;

            const gymExiste = await Gym.findById(gimnasio);

            let usuario = await User.findById(id).select("-password");

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

            if (fechaInicio) {
                usuario.fechaInicio = fechaInicio;
            }

            if (gimnasio) {
                if (gymExiste) {
                    usuario.gimnasio = gimnasio;
                } else {
                    return next({
                        success: false,
                        message: `There isn't any gym with the id: ${gimnasio}`
                    });
                }
            }

            if (cuota) {
                if (gymExiste) {
                    let existeCuota = gymExiste.cuotas.find(cuotaGym => cuotaGym.equals(cuota));
                    if (existeCuota) {
                        usuario.cuota = cuota;
                    } else {
                        return next({
                            success: false,
                            message: ` The gym ${gymExiste.nombreCentro} doesn't have this fee!`
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
    //Delete user
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
                message: "User has been removed successfully",
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

        const usuario = await User.findById(id).populate("gimnasio", "-password").select("-password");

        if (!usuario) {
            return next({
                succes: false,
                message: "You have to login as a user!"
            })
        }
        const { reservas } = req.body;

        let existeClaseGym = await Gym.find({ clases: reservas });
        console.log(existeClaseGym);

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
        }

        let fechaActual = new Date();
        let mes = fechaActual.getMonth() + 1;
        let año = fechaActual.getFullYear();
        let fechaClase = new Date(clases.fechaHora);
        let mesClase = fechaClase.getMonth() + 1;
        let yearClase = fechaClase.getFullYear();
        let dayClase = fechaClase.getDay();  //Si la fecha de la clase COINCIDE con el dia de la reserva

        let reservasMes = 0;
        //Calcular las reservas que tiene el usuario ESE MES de ESE AÑO
        usuario.reservas.forEach(clase => {
            let añoReserva = fechaActual.getFullYear();
            let mesReserva = clase.fechaClase.getMonth() + 1;
            let dayReserva = clase.fechaClase.getDay();
            if (clase.clase === reservas && año === añoReserva && dayClase === dayReserva) {
                return next({
                    succes: false,
                    message: "You have already signed up in that class!"
                })
            }
            if (mes === mesReserva && año === añoReserva) {
                reservasMes++;
            }
        });

        let cuotaUser = await Fees.findById(usuario.cuota);

        console.log(`mes : ${mesClase} año ${yearClase}`);

        if (reservasMes >= cuotaUser.clases && mes == mesClase && año == yearClase) {
            return next({
                succes: false,
                message: "You have already wasted all your classes!"
            })
        }

        let reservaUsuario = {
            clase: clases.id,
            fechaClase: clases.fechaHora
        }
        usuario.reservas.push(reservaUsuario);
        clases.alumnosInscritos.push(id);

        const userUpdate = await usuario.save();
        const classUpdate = await clases.save();

        return res.status(201).json({
            sucess: true,
            userUpdate
        })

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
        //Coger mes y año de la "reservas"

        let indice = usuario.reservas.findIndex(reserva => {
            return reserva.clase.equals(reservas) &&
                clase.fechaHora.getTime() == reserva.fechaClase.getTime()
        });
        if (indice < 0) {
            return next({
                succes: false,
                message: "The user isn't enrolled in that class!"
            })
        } else {
            usuario.reservas.splice(indice, 1);
            await usuario.save();
            let indiceAlumno = clase.alumnosInscritos.findIndex(alumno => alumno.equals(id));
            clase.alumnosInscritos.splice(indiceAlumno, 1);
            clase.save();
        }

        return res.status(201).json({
            sucess: true,
            message: "Your class has been deleted!"
        });

    } catch (err) {
        return next({
            status: 403,
            message: err
        });
    }
});

//Mostrar mis reservas
userRouter.get("/misReservas", async (req, res, next) => {
    try {

        const { id } = req.user;

        const usuario = await User.findById(id).select("-password").sort();
        if (!usuario) {
            return next({
                succes: false,
                message: "User conecction failed"
            })
        }

        if (usuario.reservas.length == 0) {
            return next({
                succes: false,
                message: "El usuario todavia no tiene reservas!"
            })
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