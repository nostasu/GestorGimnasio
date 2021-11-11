const express = require("express");
const Fees = require("../models/Fees");
const feeRouter = express.Router();

//Creacion rutas
feeRouter.post("/", async (req, res) => {

    try {
        const { precio, clases } = req.body;

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
});

//Encuentra todos
feeRouter.get("/", async (req, res) => {
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

// Mostrar 1 por id
feeRouter.get("/find/:id", async (req, res) => {
    try {
        const { id } = req.params
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

// Eliminar cuota.
feeRouter.delete("/delete/:id", async (req, res) => {
    try {

        const { id } = req.params;

        const cuotaBorrada = await Fees.findByIdAndDelete(id);

        if (!cuotaBorrada) {
            return res.sendStatus(404).json({
                success: false,
                message: "No se ha encontrado ninguna cuota con ese id"
            });
        }
        return res.send(`Se ha borrado de la BBDD la cuota con id ${id}`);
    } catch (err) {
        return res.status(403).json({
            success: false,
            message: err.message
        });
    }
});

// Actualizar cuota
feeRouter.put("/update/:id", async (req, res) => {
    try {
        const { id } = req.params  //La id de la cuota a modificar

        const { precio, clases } = req.body;

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