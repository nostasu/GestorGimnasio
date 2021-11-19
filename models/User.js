const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        required: true
    },
    telefono: Number,
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, introduzca un email valido']
    },
    password: {
        type: String,
        required: true,
    },
    fechaInicio: {
        type: Date,
        default: Date.now
    },
    gimnasio: {
        type: mongoose.Types.ObjectId,  //sera el id del gym
        ref: "Gym" //Le decimos de donde viene
    },
    cuota: {
        type: mongoose.Types.ObjectId,
        ref: "Fees" //Crear modelo
    },

    reservas: [{
        nombreClase: {
            type: String
        },
        clase: {
            type: mongoose.Types.ObjectId,
            ref: "Class"
        },
        fechaClase: {
            type: Date
        }
    }]
})

module.exports = User = mongoose.model("User", userSchema);
