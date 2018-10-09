const mongoose = require("mongoose");

const valoresSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    label: String,
    name: String,
    valores: Array
});

module.exports = mongoose.model("Valores", valoresSchema);
