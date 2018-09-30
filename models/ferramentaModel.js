const mongoose = require("mongoose");

const ferramentaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  abordagem: String
});

module.exports = mongoose.model("Ferramenta", ferramentaSchema);
