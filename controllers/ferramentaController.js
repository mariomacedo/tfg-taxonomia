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

exports.createFerramenta = async (req, res, next) => {
  const newFerramenta = new Ferramenta({
    _id: new mongoose.Types.ObjectId()
  });

  console.log("=================================");

  Object.keys(req.body).forEach(function(prop) {
    const newValor = new Valores({
      _id: new mongoose.Types.ObjectId()
    });

    console.log(prop + ":" + req.body[prop]);

    if (
      req.body[prop] != "null" &&
      req.body[prop] != "" &&
      req.body[prop] != []
    ) {
      newValor.name = prop;
      newValor.label = prop.toLocaleUpperCase();
      newValor.valores = req.body[prop];
      newFerramenta[prop] = req.body[prop];
    }

    Valores.find({ name: prop })
      .exec()
      .then(result => {
        if (result.length > 0) {
          var encontrado = true;
          for (var i = 0; i < result[0]["valores"].length; i++) {
            if (result[0]["valores"][i] == req.body[prop]) {
              encontrado = false;
            }
          }
          if (encontrado) {
            Valores.updateOne(
              { name: prop },
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
            next;
          }
        } else if (newValor.valores.length > 0) {
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
        } else {
          next;
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

exports.findByValor = (req, res, next) => {
  const filters = { $or: [] };
  for (var key in req.body) {
    if (req.body.hasOwnProperty(key)) {
      filters.$or.push(req.body[key]);
    }
  }
  Ferramenta.find(filters)
    .exec()
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err,
        message: err.message
      });
    });
};
