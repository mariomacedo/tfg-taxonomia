const mongoose = require("mongoose");

const Taxonomia = require("../models/taxonomiaModel");

exports.taxonomia = (req, res, next) => {
  res.render("pages/taxonomia", { user: req.user });
};

exports.raiz = (req, res, next) => {
  Taxonomia.find()
    .exec()
    .then(docs => {
      var args = {
        recursive: true
      };
      docs[0].getChildrenTree(args, function(err, nodes) {
        res.status(200).json(nodes);
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

exports.getNode = (req, res, next) => {
  Taxonomia.find({ name: req.params.nodeName })
    .exec()
    .then(result => {
      var args = {
        fields: "_id name nivel bloco parent",
        recursive: true
      };
      result[0].getChildrenTree(args, function(err, nodes) {
        console.log(nodes);
        res.status(200).json(result);
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
    id: req.body.id,
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

exports.editNode = (req, res, next) => {
  Taxonomia.findOne({ name: req.body.name })
    .exec()
    .then(node => {
      Taxonomia.findById(node.parent)
        .exec()
        .then(buscaPai => {
          res.status(200).json({
            pai: buscaPai,
            filho: node
          });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            error: err,
            message: err.message
          });
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
