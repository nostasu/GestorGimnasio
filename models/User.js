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
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    contraseña: {
        type: String,
        required: true,
        match: (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,1024}$/) //special/number/capital
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

    //Indicar el maximo de las reservas
    reservas: [{
        type: mongoose.Types.ObjectId,
        ref: "Class"
    }]
})

module.exports = User = mongoose.model("User", userSchema);
