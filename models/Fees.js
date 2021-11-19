const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feesSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },

    clases: {
        type: Number,
        required: true
    },
})

module.exports = Fees = mongoose.model("Fees", feesSchema);
