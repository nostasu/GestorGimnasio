const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clasesSchema = new Schema({
    tipoClase: {
        type: String,  //Le pasamos la id que sera el tipo de clase
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
    }
})

module.exports = Class = mongoose.model("Class", clasesSchema);