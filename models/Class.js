const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clasesSchema = new Schema({
    tipoClase: {
        type: String,
        enum: ["Tacfit", "Clase en Grupo", "Entrenamiento Personal"],
        required: true
    },
    fechaHora: {
        type: Date,
        required: true
    },
    alumnosInscritos: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }],
    maxAlumnos: {
        type: Number,
        required: true
    },

    gimnasio: {
        type: mongoose.Types.ObjectId,
        ref: "Gym"
    }
})

module.exports = Class = mongoose.model("Class", clasesSchema);