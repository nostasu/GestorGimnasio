const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gymSchema = new Schema({
    nombreCentro: {
        type: String,
        required: true,
        unique: true
    },
    direccion: String,
    //logo: img,
    entrenadores: [{
        nombreApellidos: {
            type: String,
            required: true
        },
        edad: Number
    }],
    cuotas: [{
        type: mongoose.Types.ObjectId,
        ref: "Fees"
    }],

    clases: [{
        type: mongoose.Types.ObjectId,
        ref: "Class"
    }],

})

module.exports = Gym = mongoose.model("Gym", gymSchema);
