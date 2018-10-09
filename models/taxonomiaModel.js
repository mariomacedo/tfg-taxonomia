const mongoose = require("mongoose");
const tree = require('mongoose-data-tree');

const taxonomiaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  id: { type: String, required: true, unique: true },
  nivel: { type: Number, required: true },
  bloco: { type: String, required: true },
});
taxonomiaSchema.plugin(tree);

module.exports = mongoose.model("Taxonomia", taxonomiaSchema);
