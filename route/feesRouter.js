const express = require("express");
const { checkToken } = require("../middleware");
const Fees = require("../models/Fees");
const Gym = require("../models/Gym");
const feeRouter = express.Router();

feeRouter
    .route("/")
    //Crear cuota
    .post(checkToken, async (req, res) => {

        try {

            const { id } = req.user;
            const { precio, clases } = req.body;

            const gym = await Gym.findById(id);

            if (!gym) {
                return res.status(403).json({
                    sucess: false,
                    mensaje: "Debe estar logueado como gym para poder crear sus cuotas!"
                })
            }

            //Los required, los controlamos
            if (!precio || !clases) {
                return res.status(403).json({
                    sucess: false,
                    mensaje: "Los dos campos son obligatorios!"
                })
            }

            let fees = new Fees({
                precio, clases
            });

            const newFee = await fees.save();

            //Al crear la cuota, la tenemos que añadir tambien al arrayList de clases del gimnasio
            gym.cuotas.push(newFee._id);
            await gym.save();

            return res.status(201).json({
                success: true,
                fee: newFee
            })

        } catch (err) {
            console.log(err);
            return res.status(403).json({
                succes: false,
                message: err.message
            });
        };
    })
    //Encuentra todos
    .get(async (req, res) => {
        try {
            Fees.find({}, (err, fees) => {
                if (err) {
                    res.status(400).send(err.response.data);
                }
                res.json(fees);
            });

        } catch (err) {
            console.log(err);
            return res.status(400).json({
                succes: false,
                message: err.message
            })
        }
    });

feeRouter
    .route("/:id")
    //Mostrar 1 cuota por id
    .get(async (req, res) => {
        try {
            const { id } = req.params;
            const cuota = await Fees.findById(id);
            if (!cuota) {
                return res.status(404).json({
                    sucess: false,
                    message: "No existe ninguna cuota con esa id"
                })
            }
            return res.json({
                success: true,
                cuota
            })
        } catch (err) {
            return res.status(403).json({
                success: false,
                message: err.message
            });
        }
    })
    //Eliminar cuota
    .delete(checkToken, async (req, res) => {
        const { idGym } = req.user;
        const { id } = req.params;

        try {
            const gymLogin = await Gym.find(idGym);
            if (!gymLogin) {
                return res.status(403).json({
                    sucess: false,
                    mensaje: "Debe estar logueado como gym para poder eliminar sus cuotas!"
                })
            }
            let fee = await Fees.findById(id);
            if (!fee) {
                return res.status(404).json({
                    sucess: false,
                    message: "No existe ninguna cuota con esta id"
                })
            }
            await Fees.findByIdAndDelete(id);

            const gym = await Gym.find({ cuota: id });

            if (gym) {
                gym.forEach(async cuotaGym => {
                    let i = cuotaGym.cuotas.indexOf(id);
                    if (i > 0) { //No quiero que saque -1 (no encontrado) y borre alguna
                        cuotaGym.cuotas.splice(i, 1);
                        await cuotaGym.save();
                    }
                })
            }

            const foundUser = await User.findOne({ cuota: id });

            if (foundUser) {
                foundUser.cuota = null;
                await foundUser.save();
            }

            return res.send(`Se ha borrado de la BBDD la cuota con id ${id}, avisar al usuario: ${foundUser} para que modifique su cuota`);

        } catch (err) {
            return res.status(403).json({
                success: false,
                message: err.message || message
            });
        }
    })
    //Actualizar cuota
    .put(checkToken, async (req, res) => {
        try {
            const { idGym } = req.user;
            const { id } = req.params;  //La id de la cuota a modificar
            const { precio, clases } = req.body;

            const gymLogin = await Gym.find(idGym);
            if (!gymLogin) {
                return res.status(403).json({
                    sucess: false,
                    mensaje: "Debe estar logueado como gym para poder eliminar sus cuotas!"
                })
            }

            let cuota = await Fees.findById(id);

            if (precio) {
                cuota.precio = precio;
            }
            if (clases) {
                cuota.clases = clases;
            }

            const cuotaUpdate = await cuota.save();
            return res.json({
                sucess: true,
                cuotaUpdate
            })

        } catch (err) {
            return res.status(403).json({
                success: false,
                message: err.message
            });
        }
    })

module.exports = feeRouter;