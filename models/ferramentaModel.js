const mongoose = require("mongoose");

const Abordagem = Object.freeze({
  Ambos: "Ambos",
  Vertical: "Vertical",
  Horizontal: "Horizontal"
});

const ferramentaSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  abordagem: { type: String, enum: Object.values(Abordagem) }
});

Object.assign(ferramentaSchema.statics, {
  Abordagem
});

module.exports = mongoose.model("Ferramenta", ferramentaSchema);
