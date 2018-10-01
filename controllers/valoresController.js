const mongoose = require("mongoose");
const Valores = require("../models/valoresModel");

exports.getValoresByLabel = (req, res, next) => {
  Valores.find({ label: req.params.label })
    .exec()
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err,
        message: err.message
      });
    });
};
