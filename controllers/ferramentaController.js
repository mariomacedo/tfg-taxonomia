const mongoose = require("mongoose");

const Ferramenta = require("../models/ferramentaModel");

exports.findAll = (req, res, next) => {
  Ferramenta.find()
    .exec()
    .then(result => {
      res.status(200).json({
        user: req.user,
        count: result.length,
        ferramentas: result
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err,
        message: err.message
      });
    });
};

exports.createFerramenta = (req, res, next) => {
  console.log(req.body);
  const node = new Ferramenta({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.nameFerramenta,
    abordagem: req.body.abordagem
  });
  node
    .save()
    .then(result => {
      res.status(201).render("pages/home", {
        user: req.user,
        message: "Ferramenta Salva Com Sucesso!"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err,
        message: err.message
      });
    });
};

exports.findAllByFilter = (req, res, next) => {
  const filters = { $or: [] };
  for (var key in req.body) {
    if (req.body.hasOwnProperty(key)) {
      filters.$or.push(req.body[key]);
    }
  }
  for (const ops of req.body) {
    console.log(ops);
  }

  Ferramenta.find(filters)
    .exec()
    .then(result => {
      res.status(200).json({
        busca: filters,
        resposta: result,
        request: req.body
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err,
        message: err.message
      });
    });
};

exports.findByName = (req, res, next) => {
  Ferramenta.find({ name: req.params.name })
    .exec()
    .then(result => {
      res.status(200).json({
        ferramenta: result
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err,
        message: err.message
      });
    });
};
