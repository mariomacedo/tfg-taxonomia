const mongoose = require("mongoose");
const Valores = require("../models/valoresModel");

exports.getValoresById = (req, res, next) => {
  Valores.findOne({ name: req.params.id })
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

exports.setValor = async (req, res, next) => {
  const buscaName = await Valores.findOne({
    name: req.body.name,
    valores: req.body.newValor
  });

  const encontrado = (await buscaName) != null ? true : false;

  if (!encontrado) {
    Valores.updateOne(
      { name: req.body.name },
      { $push: { valores: [req.body["newValor"]] } }
    )
      .then(updated => {
        res.status(201).json({
          msg:
            "Valor: " +
            req.body.newValor +
            " adicionado com sucesso! -> " +
            req.body.name
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
    res.status(404).json({
      msg: "Erro!"
    });
  }
};

exports.autocomplete = (req, res, next) => {
  Valores.find()
    .select("-_id label valores name")
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

exports.loadValores = (req, res, next) => {
  Valores.find()
    .exec()
    .then(result => {
      if (!result) {
        res.status(403).json({
          message: "Proibido! Dados não serão sobrescritos!"
        });
      } else {
        var padrao = {
          engajamento_tecnica: {
            name: "Engajamento",
            valores: ["Gamificação"]
          },
          area: {
            name: "Área",
            valores: ["Orçamento Participativo", "Geral", "Planejamento Urbano"]
          },
          idioma: {
            name: "Idioma",
            valores: ["Inglês", "Português", "Espanhol", "Russo"]
          },
          hardware: { name: "Hardware", valores: ["Arduíno"] },
          banco_de_dados: {
            name: "Banco de Dados",
            valores: ["PostgreSQL", "MySQL", "SQLServer", "MongoDB"]
          },
          servidor_web: { name: "Servidor Web", valores: ["Apache", "Nginx"] },
          linguagens_de_programacao: {
            name: "Linguagens de Programação",
            valores: ["Java", "Javascript", "PHP"]
          },
          bibliotecas: { name: "Bibliotecas", valores: ["Jquery", "D3.js"] },
          api: { name: "API", valores: ["GeoKey"] },
          vis_tecnica: {
            name: "Técnica",
            valores: ["Mapa", "Mapa de Calor", "Gráfico de Pizza"]
          },
          tipo_de_dado: {
            name: "Tipo de Dados",
            valores: ["Vídeo", "Imagem", "Localização", "Texto", "Links"]
          },
          estrategia: { name: "Estratégia", valores: ["Formulários", "Apps"] },
          processamento_de_dados: {
            name: "Processamento de Dados",
            valores: ["Mineração de Dados", "OLAP"]
          },
          tipo_de_informacao: {
            name: "Tipo de Informação",
            valores: ["Problemas", "Petições"]
          },
          interacao_tecnica: {
            name: "Técnica",
            valores: ["Voto", "Discussão"]
          },
          moderacao: {
            name: "Moderação",
            valores: ["Administrador", "Usuário Responsável"]
          }
        };

        Object.keys(padrao).forEach(function(prop) {
          const newValor = new Valores({
            _id: new mongoose.Types.ObjectId(),
            name: prop,
            label: padrao[prop].name,
            valores: padrao[prop].valores
          });
          newValor.save();
        });

        res.status(201).json({
          msg: "Carga realizada com sucesso!"
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
};
