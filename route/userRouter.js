const express = require("express");
const User = require("../models/User"); //requerimos el export
const Gym = require("../models/Gym");
const Class = require("../models/Class");
const userRouter = express.Router();

//Creacion usuario
userRouter.post("/", async (req, res) => {

    try {
        const { nombre, apellidos, telefono, email, contraseña, fechaInicio, gimnasio, cuota, reservas } = req.body;

        if (!nombre || !apellidos || !email || !contraseña) {
            return res.status(403).json({
                sucess: false,
                message: "Te has dejado algun dato importante!"
            })
        }

        //Al meter un usuario nuevo, comprobar que la cuota existe en el gym (gym.cuotas)
        const gymExiste = await Gym.findById(gimnasio);
        if (cuota) {
            if (gymExiste) {
                let existeCuota = gymExiste.cuotas.find(cuotaGym => cuotaGym.equals(cuota));
                if (!existeCuota) {
                    return res.status(403).json({
                        success: false,
                        message: "No se ha encontrado esa cuota para ese gimnasio!"
                    });
                }
            }
        }

        let user = new User({
            nombre, apellidos, telefono, email, contraseña, fechaInicio, gimnasio, cuota, reservas
        })


        const newUser = await user.save();

        return res.status(201).json({
            success: true,
            user: newUser
        })

    } catch (err) {
        const mensaje = err.message;
        console.log(err);

        if (mensaje.includes("User validation failed: contraseña")) {
            return res.status(403).json({
                succes: false,
                message: "La contraseña necesita minimo 1 caracter especial, 1 num, min, mayus, longitud>6"
            });
        } else {
            return res.status(403).json({
                success: false,
                message: err.message
            });
        }
    }
});

//Obtiene todos los usuarios
userRouter.get("/", (req, res) => {
    try {
        let users = User.find({}, (err, user) => {
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
});

//Obtener 1 usuario por id
userRouter.get("/find/:id", async (req, res) => {
    try {
        const { id } = req.params
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
userRouter.put("/inscribirse/:id", async (req, res) => {
    try {
        const { id } = req.params; //Tengo la id del usuario, sacamos su gimnasio

        const usuario = await User.findById(id).populate("gimnasio"); //Asi me saca su usuario.

        if (!usuario) {
            return res.status(400).json({
                succes: false,
                message: "No existe ese usuario!"
            })
        }
        const { reservas } = req.body;  //Pasamos por el body la clase que queremos reservar

        if (usuario.reservas.length > usuario.cuota.clases) {
            return res.status(400).json({
                succes: false,
                message: "Ya has consumido todas las clases!"
            })
        } else {
            //Lo primeriiisimo de todo, comprobamos que el usuario no este inscrito a esa clase!
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

            //De aqui nos da que la clase existe para ese gimnasio
            // ahora podemos guardar la reserva en el usuario, 
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

// Modificar usuario.
userRouter.put("/update/:id", async (req, res) => {
    try {
        const { id } = req.params  //La id de la cuota a modificar

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
});

//Eliminar reserva y eliminar el usuario de clases-> alumnosInscritos
userRouter.put("/delete/clase/:id", async (req, res) => {
    try {

        const { id } = req.params;

        const { reservas } = req.body

        //Van a ser las reservas del usuario que quiero borrar

        const usuario = await User.findById(id);

        let indiceElementoBorrar;
        console.log(usuario.reservas);
        if (usuario.reservas.lenght != 0) {
            usuario.reservas.find((reservaBorrar, i) => {
                if (reservas.includes(reservaBorrar._id)) {
                    indiceElementoBorrar = i;
                }
            });

            if (indiceElementoBorrar != undefined) {
                usuario.reservas.splice(indiceElementoBorrar, 1);
                await usuario.save();
            }
        }

        let reservasClase = await Class.findById(reservas);  //Me encuentra la clase en la que esta
        let indice2;

        reservasClase.alumnosInscritos.find((alumno, i) => {
            if (usuario.id.includes(alumno)) {
                indice2 = i;
            }
        });

        if (indice2 != undefined) {
            reservasClase.alumnosInscritos.splice(indice2, 1);
            await reservasClase.save();

        } else {
            return res.sendStatus(404).json({
                success: false,
                message: "Ese alumno no esta incrito en esa clase"
            });
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

//Borrar usuario. Borrando tambien en el arrayList de clases las clases en las que estuviera inscrito.
userRouter.delete("/delete/", async (req, res) => {
    try {

        const { id } = req.body;

        const usuario = await User.findByIdAndDelete(id);
        if (!usuario) {
            return res.sendStatus(404).json({
                success: false,
                message: "No se ha encontrado el usuario para borrarlo"
            });
        }

        //Si el usuario estaba inscrito en alguna clase, borrarlo.
        let reservasClase = await Class.find({
            alumnosInscritos: id
        }); //Me encuentra todas mis clases
        //Reservas clase es un array
        reservasClase.forEach(async clase => {
            let i = clase.alumnosInscritos.indexOf(id); //Me encuentra el indice de la id
            clase.alumnosInscritos.splice(i, 1);
            await clase.save();
        })

        return res.json({
            sucess: true,
            message: `Se ha borrado de la BBDD el usuario con id ${id}`
        });

    } catch (err) {
        return res.status(403).json({
            success: false,
            message: err.message
        });
    }
});



module.exports = userRouter;