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
    console.log(prop + ":" + req.body[prop]);

    if (req.body[prop] != "null" && req.body[prop] != "") {
      newFerramenta[prop] = req.body[prop];
    }

    Valores.find({ name: prop })
      .exec()
      .then(result => {
        if (result.length > 0) {
          var encontrado = true;
          for (var i = 0; i < result[0]["valores"].length; i++) {
            if (
              result[0]["valores"][i] == req.body[prop] &&
              req.body[prop] != null
            ) {
              encontrado = false;
            }
          }
          if (encontrado && req.body[prop] != "null" && req.body[prop] != "") {
            var opt = {};
            if (req.body[prop].constructor === Array) {
              opt = { $addToSet: req.body[prop] };
            } else {
              opt = { $push: [req.body[prop]] };
            }

            Valores.updateOne({ name: prop }, opt)
              .then(updated => {
                console.log(prop + " Successfuly Updated");
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
  Ferramenta.findOne({ name: req.params.name })
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
  console.log("@@@@@@@@@@@@@@@@@@@@ AQUI @@@@@@@@@@@@@@@@@@@@@");
  const filters = { $or: [{ [req.params.name]: { $exists: true } }] };
  /* for (var key in req.body) {
    if (req.body.hasOwnProperty(key)) {
      console.log(req.body[key]);
      filters.$or.push(req.body[key]);
    }
  } */
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

exports.updateFerramenta = async (req, res, next) => {
  var ferramentaToUpdate = await Ferramenta.findOne({ name: req.body.oldName });
  var opt = {};
  await Object.keys(req.body).forEach(function(prop) {
    if (req.body[prop].constructor === Array && prop != "oldName") {
      opt = { $addToSet: req.body[prop] };
    } else {
      opt = { [prop]: req.body[prop] };
    }
  });

  await Ferramenta.updateOne({ name: ferramentaToUpdate.name }, opt)
    .then(result => {
      res
        .status(201)
        .json({
          opt: opt,
          res: result
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            error: err,
            opt: opt,
            message: err.message
          });
        });
    });
};
