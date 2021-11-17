const express = require("express");
const { checkToken } = require("../middleware");
const Fees = require("../models/Fees");
const Gym = require("../models/Gym");
const feeRouter = express.Router();

feeRouter
    .route("/")
    .post(checkToken, async (req, res, next) => {

        try {

            const { id } = req.user;
            const { precio, clases } = req.body;

            const gym = await Gym.findById(id);

            if (!gym) {
                return next({
                    sucess: false,
                    mensaje: "You have to login as a Gym if you want to create a new fee!"
                })
            }

            if (!precio || !clases) {
                return next({
                    sucess: false,
                    mensaje: "Fields required: precio, clases"
                })
            }

            let fees = new Fees({
                precio, clases
            });

            const newFee = await fees.save();

            //Al crear la cuota, la tenemos que añadir tambien al arrayList de cuotas del gimnasio
            gym.cuotas.push(newFee._id);
            await gym.save();

            return res.status(201).json({
                success: true,
                fee: newFee
            })

        } catch (err) {
            return next({
                status: 403,
                message: err
            });
        }
    })
    //Encuentra todos
    .get(async (req, res, next) => {
        try {
            const fees = await Fees.find({});
            if (!fees) {
                return next({
                    success: false,
                    message: "There isn't any fee yet"
                })
            }

            return res.status(201).json({
                success: true,
                fees
            })

        } catch (err) {
            return next({
                status: 403,
                message: err
            });
        }
    });

feeRouter
    .route("/:id")
    .get(async (req, res, next) => {
        try {
            const { id } = req.params;
            const cuota = await Fees.findById(id);
            if (!cuota) {
                return next({
                    success: false,
                    message: `There isn't any fee with the id: ${id}`
                })
            }
            return res.status(201).json({
                success: true,
                cuota
            })
        } catch (err) {
            next({
                status: 403,
                message: "Something went wrong...!"
            });
        }
    })
    //Eliminar cuota
    .delete(checkToken, async (req, res, next) => {
        const idGym = req.user.id;
        const { id } = req.params;

        try {
            const gymLogin = await Gym.findById(idGym);
            const gym = await Gym.find({ cuotas: id });
            if (gym.length == 0) {
                return next({
                    sucess: false,
                    message: `Your gym doesn't have a fee with id: ${id}`
                })
            }
            if (gym[0].nombreCentro != gymLogin.nombreCentro) {
                return next({
                    sucess: false,
                    mensaje: "You have to login as a gym to delete one of your fees!"
                })
            }

            let fee = await Fees.findById(id);
            if (!fee) {
                return next({
                    sucess: false,
                    message: `There isn't any fee with the id ${id}`
                })
            }
            await Fees.findByIdAndDelete(id);

            if (gym) {
                gym.forEach(async cuotaGym => {
                    let i = cuotaGym.cuotas.indexOf(id);
                    if (i > -1) {
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

            return res.status(201).json({
                success: true,
                message: `The fee with the id: ${id} is deleted, warn the user: ${foundUser}, had to modify the cuote!`
            })

        } catch (err) {
            return next({
                status: 403,
                message: err
            });
        }
    })
    //Actualizar cuota
    .put(checkToken, async (req, res, next) => {
        try {
            const idGym = req.user.id;
            const { id } = req.params;
            const { precio, clases } = req.body;

            const gymLogin = await Gym.findById(idGym);
            const cuotaExisteGym = await Gym.find({ cuotas: id });

            if (cuotaExisteGym[0].nombreCentro != gymLogin.nombreCentro) {
                return next({
                    sucess: false,
                    mensaje: "It must be connected as a gym and it neccesary be one of your fees!"
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
            return res.status(200).json({
                sucess: true,
                cuotaUpdate
            })

        } catch (err) {
            return next({
                status: 403,
                message: err
            });
        }
    })

module.exports = feeRouter;