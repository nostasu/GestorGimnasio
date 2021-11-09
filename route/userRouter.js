const express = require("express");
const User = require("../models/User"); //requerimos el export
const Gym = require("../models/Gym");
const Class = require("../models/Class");
const userRouter = express.Router();


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
        const existeGym = await Gym.find({
            cuotas: cuota,
        });

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
        const user = await User.findById(id);
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

        const { nombre, apellidos, telefono, email, contraseña, fechaInicio, gimnasio, cuota, reservas } = req.body;  //Pasamos por el body la clase que queremos reservar

        if (usuario.reservas.length > usuario.cuota.clases) {
            return res.status(400).json({
                succes: false,
                message: "Ya has consumido todas las clases!"
            })
        } else {
            console.log(usuario.reservas);
            console.log(reservas[0])
            //Lo primeriiisimo de todo, comprobamos que el usuario no este inscrito a esa clase!
            if (usuario.reservas.includes(reservas[0])) {
                return res.status(400).json({
                    succes: false,
                    message: "Ya te has apuntado a esa clase!"
                })
            }
            //Comprobamos que esa clase la imparte el gimnasio
            let existeClaseGym = false;
            for (let i = 0; i < usuario.gimnasio.clases.length; i++) {
                if (usuario.gimnasio.clases[i] == reservas[0]) {
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

            if (clases.maxAlumnos <= clases.alumnosInscritos.length) {
                console.log(clases.maxAlumnos);
                console.log(clases.alumnosInscritos.length);
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

module.exports = userRouter;