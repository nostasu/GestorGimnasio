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
                message: err.message
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
                const foundEmail = await User.findOne({ email });
                if (foundEmail && (foundEmail.email != email)) {
                    return next({
                        sucess: false,
                        message: "Already exists this email!"
                    })
                }

                usuario.email = email;
            }

            if (contraseña) {
                if (!contraseña.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,1024}$/)) { //special/number/capital/6 characters))
                    return next({
                        sucess: false,
                        message: 'The password must contain 6 dígits, uppercase, lowercase and special characters'
                    })
                }

                const hash = await bcrypt.hash(password, 10);

                usuario.password = hash;
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
                message: "User updated succesfully",
                userUpdate
            });

        } catch (err) {
            return next({
                status: 403,
                message: err.message
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
                let clase = await Class.findById(claseReservada.clase);
                clase.alumnosInscritos.remove(id);
                console.log(clase.alumnosInscritos);
                await clase.save();
            })

            return res.status(201).json({
                sucess: true,
                message: "User has been removed successfully",
            });

        } catch (err) {
            return next({
                status: 403,
                message: err.message
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
            message: err.message
        });
    }
})

userRouter.put("/inscribirse/:id", async (req, res, next) => {
    try {
        const { id } = req.user;

        const usuario = await User.findById(id).populate("gimnasio", "-password").select("-password");

        if (!usuario) {
            return next({
                succes: false,
                message: "You have to login as a user!"
            })
        }
        let reservas = req.params.id;

        let existeClaseGym = await Gym.find({ clases: reservas });

        if (!existeClaseGym) {
            return next({
                succes: false,
                message: "There isn't such class in your gym!"
            })
        }
        console.log(`id de la clase a reservar: ${reservas}`);
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

            if ((clase.clase == reservas) && (año === añoReserva) && (dayClase === dayReserva)) {
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
            message: "Enjoy your trainning!"
        })

    } catch (err) {
        return next({
            status: 403,
            message: err.message
        });
    }
});

userRouter.put("/delete/clase/:id", async (req, res, next) => {
    try {

        const { id } = req.user;
        const claseId = req.params.id;

        const usuario = await User.findById(id);
        if (!usuario) {
            return next({
                succes: false,
                message: "User conecction failed"
            })
        }

        console.log(`id de la clase: ${claseId}`);
        const clase = await Class.findById(claseId);
        if (!clase) {
            return next({
                succes: false,
                message: "This class doesn't exists!"
            })
        }

        //Coger mes y año de la "reservas"

        let indice = usuario.reservas.findIndex(reserva => {
            return reserva.clase.equals(claseId) &&
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
            message: "Your training has been deleted! Enjoy another one!"
        });

    } catch (err) {
        return next({
            status: 403,
            message: err.message
        });
    }
});

//Mostrar mis reservas
userRouter.get("/misReservas", async (req, res, next) => {
    try {

        const { id } = req.user;

        const usuario = await User.findById(id).select("reservas");
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
            message: err.message
        });
    }
});

//Mostrar todas las clases de mi gimnasio
userRouter.get("/clasesGym", async (req, res, next) => {
    try {
        const { id } = req.user;  //La del usuario

        let user = await User.findById(id).select("gimnasio").populate("gimnasio");
        if (!user) {
            return next({
                sucess: false,
                message: `There isn't any user with the id: ${id}`
            })
        }

        return res.status(201).json({
            success: true,
            user
        })

    } catch (err) {
        return next({
            status: 403,
            message: err.message
        });
    }
})

//find user connected
userRouter.get("/myUser", async (req, res, next) => {
    try {
        const { id } = req.user;
        const user = await User.findById(id);
        if (!user) {
            return next({
                sucess: false,
                message: `There isn't any user with this id: ${id}`
            })
        }
        return res.status(201).json({
            success: true,
            user
        })
    } catch (err) {
        return next({
            status: 403,
            message: err.message
        });
    }
})

module.exports = userRouter;