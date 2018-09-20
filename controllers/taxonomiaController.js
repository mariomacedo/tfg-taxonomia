const mongoose = require("mongoose");

const Taxonomia = require("../models/taxonomiaModel");

exports.taxonomia = (req, res, next) => {
  res.render("pages/taxonomia", { user: req.user });
};

exports.raiz = (req, res, next) => {
  Taxonomia.find()
    .select("name nivel")
    .exec()
    .then(docs => {
      docs[0].getChildren(function(err, nodes) {
        // users is an array of with the bob document
        console.log(nodes);
      });
      res.status(200).json(docs);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err,
        message: err.message
      });
    });
};

exports.getNode = (req, res, next) => {
  Taxonomia.find({ name: req.params.nodeName })
    .exec()
    .then(result => {
      res.status(200).json({
        count: result.length,
        nodes: result
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

exports.createNode = (req, res, next) => {
  //TODO: Validacao dos campos
  const node = new Taxonomia({
    name: req.body.name,
    nivel: req.body.nivel,
    bloco: req.body.bloco
  });
  if (req.body.nivel == 0) {
    node
      .save()
      .then(result => {
        res.status(201).json({
          message: "Raiz Criada com Sucesso!"
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err,
          message: err.message
        });
      });
  } else {
    Taxonomia.findOne({ name: req.body.nodePai })
      .exec()
      .then(pai => {
        if (pai) {
          node.parent = pai;
          node
            .save()
            .then(result => {
              res.status(201).json({
                message: "Node created!",
                node: node
              });
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
  }
};

exports.removeNode = (req, res, next) => {
  //TODO: Validacao dos campos
  Taxonomia.findOne({ name: req.body.name })
    .exec()
    .then(node => {
      node.remove();
      res.status(200).json({
        message: "Node deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(404).json({
        error: err,
        message: err.message
      });
    });
};
