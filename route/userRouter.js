const express = require("express");
const User = require("../models/User"); //requerimos el export
const Gym = require("../models/Gym");
const Class = require("../models/Class");
const userRouter = express.Router();

userRouter.route("/")
    //Obtiene todos los usuarios
    .get(async (req, res) => {
        try {
            let users = await User.find({}, (err, user) => {
                if (err) {
                    res.status(400).send(err.response.data);
                }
                res.json(user);
            });

        } catch (err) {
            console.log(err);
            return res.status(400).json({
                succes: false,
                message: err.message
            })
        }
    })
    // Modificar usuario.
    .put(async (req, res) => {
        try {
            const { id } = req.user;  //La id de la cuota a modificar

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
                return res.status(403).json({
                    success: false,
                    message: "El email es tu acceso y no se puede cambiar!"
                });
            }
            if (contraseña) {
                var regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
                if (!regularExpression.test(contraseña)) {
                    return res.status(403).json({
                        success: false,
                        message: "La contraseña debe contener entre 6 y 16 caracteres, un caracter especial y un numero!"
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
                    return res.status(403).json({
                        success: false,
                        message: "No existe ese gimnasio, introduce un gimnasio valido!"
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
                        return res.status(403).json({
                            success: false,
                            message: "No se ha encontrado esa cuota para ese gimnasio!"
                        });
                    }
                }
            }

            const userUpdate = await usuario.save();
            return res.json({
                sucess: true,
                userUpdate
            });

        } catch (err) {
            return res.status(403).json({
                success: false,
                message: err.message
            });
        }
    })
    //Eliminar usuario
    .delete(async (req, res) => {
        try {

            const { id } = req.user;

            const usuario = await User.findByIdAndDelete(id);
            if (!usuario) {
                return res.sendStatus(404).json({
                    success: false,
                    message: "el token no pertenece a ningun usuario"
                });
            }

            usuario.reservas.forEach(async claseReservada => {
                let clase = await Class.findById(claseReservada);
                console.log(clase);
                clase.alumnosInscritos.remove(id);
                await clase.save();
            })

            return res.json({
                sucess: true,
                usuario
            });

        } catch (err) {
            return res.status(403).json({
                success: false,
                message: err.message
            });
        }
    });

//Obtener 1 usuario por id
userRouter.get("/find/", async (req, res) => {
    try {
        const { id } = req.body;
        const user = await User.findById(id).populate("gimnasio", "nombreCentro").populate("reservas");
        if (!user) {
            return res.status(404).json({
                sucess: false,
                message: "No existe ningun usuario con esta id"
            })
        }
        return res.json({
            success: true,
            user
        })
    } catch (err) {
        return res.status(403).json({
            success: false,
            message: err.message
        });
    }
})

//Inscribirse a una clase
userRouter.put("/inscribirse/", async (req, res) => {
    try {
        const { id } = req.user;

        const usuario = await User.findById(id).populate("gimnasio");

        if (!usuario) {
            return res.status(400).json({
                succes: false,
                message: "No existe ese usuario!"
            })
        }
        const { reservas } = req.body;

        if (usuario.reservas.length > usuario.cuota.clases) {
            return res.status(400).json({
                succes: false,
                message: "Ya has consumido todas las clases!"
            })
        } else {
            //Lo primerisimo de todo, comprobamos que el usuario no este inscrito a esa clase!
            if (usuario.reservas.includes(reservas)) {
                return res.status(400).json({
                    succes: false,
                    message: "Ya te has apuntado a esa clase!"
                })
            }
            //Comprobamos que esa clase la imparte el gimnasio
            let existeClaseGym = false;
            for (let i = 0; i < usuario.gimnasio.clases.length; i++) {
                if (usuario.gimnasio.clases[i] == reservas) {
                    existeClaseGym = true;
                }
            }

            if (!existeClaseGym) {
                return res.status(400).json({
                    succes: false,
                    message: "No existe esa clase en tu gimnasio!"
                })
            }

            //De aqui nos da que la clase existe para ese gimnasio ahora podemos guardar la reserva en el usuario, 
            // y ademas en clases metemos la id del alumno inscrito.

            const clases = await Class.findById(reservas);
            if (!clases) {
                return res.send({
                    succes: false,
                    message: "No existe esa clase"
                })
            }
            if (clases.maxAlumnos <= clases.alumnosInscritos.length) {
                return res.status(400).json({
                    succes: false,
                    message: "No te puedes apuntar a la clase, esta llena!"
                })
            } else if (existeClaseGym) {
                usuario.reservas.push(reservas);
                clases.alumnosInscritos.push(usuario.id);
            }
            const userUpdate = await usuario.save();
            const classUpdate = await clases.save();
            return res.json({
                sucess: true,
                userUpdate,
                classUpdate
            })
        }

    } catch (err) {
        console.log(err);
        return res.status(400).json({
            succes: false,
            message: err.message
        })
    }
});

//Eliminar reserva en el usuario.reservas y eliminar el usuario de clases.alumnosInscritos
userRouter.put("/delete/clase/", async (req, res) => {
    try {

        const { id } = req.user;

        const { reservas } = req.body;

        //Van a ser las reservas del usuario que quiero borrar

        const usuario = await User.findById(id);
        if (!usuario) {
            return res.status(401).json({
                succes: false,
                message: "El token proporcionado no es de un usuario!"
            })
        }

        //La reserva a eliminar es la de {reservas}

        const clase = await Class.findById(reservas);
        if (!clase) {
            return res.status(401).json({
                succes: false,
                message: "No existe esa clase!"
            })
        }

        console.log(usuario.reservas);

        let indice = usuario.reservas.findIndex(reserva => reserva.equals(reservas));
        if (indice < 0) {
            return res.status(401).json({
                succes: false,
                message: "El usuario no estaba inscrito a esa clase!"
            })
        } else {
            usuario.reservas.splice(indice, 1);
            await usuario.save();
            //ahora en clases, borramos clases.reservas el id del usario
            let indiceAlumno = clase.alumnosInscritos.findIndex(alumno => alumno.equals(id));
            clase.alumnosInscritos.splice(indiceAlumno, 1);
            clase.save();
        }

        return res.json({
            sucess: true,
            usuario
        });

    } catch (err) {
        return res.status(403).json({
            success: false,
            message: err.message
        });
    }
});

module.exports = userRouter;