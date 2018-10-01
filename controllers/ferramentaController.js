const express = require("express");
const mongoose = require("mongoose");

const Ferramenta = require("../models/ferramentaModel");
const Valores = require("../models/valoresModel");

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
  const newFerramenta = new Ferramenta({
    _id: new mongoose.Types.ObjectId()
  });

  Object.keys(req.body).forEach(function(prop) {
    const newValor = new Valores({
      _id: new mongoose.Types.ObjectId(),
      label: prop,
      valores: req.body[prop]
    });
    newFerramenta[prop] = req.body[prop];

    Valores.find({ label: prop })
      .exec()
      .then(result => {
        if (result.length > 0 && !result.includes(req.body[prop])) {
          console.log(result[0] + "@@@@@@@@@");
          Valores.updateOne(
            { label: prop },
            { $push: { valores: [req.body[prop]] } }
          )
            .then(updated => {
              console.log("Succes Update");
            })
            .catch(err => {
              console.log(err);
              res.status(500).json({
                error: err,
                message: err.message
              });
            });
        } else {
          newValor
            .save()
            .then(novo => {
              console.log("VALOR NOVO");
            })
            .catch(err => {
              console.log(err);
              res.status(500).json({
                error: err,
                message: err.message
              });
            });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err,
          message: err.message
        });
      });
  });

  newFerramenta
    .save()
    .then(result => {
      res.status(200).json({
        msg: "Ferramenta Adicionada com sucesso",
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
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err,
        message: err.message
      });
    });
};
