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

exports.findAllLabels = (req, res, next) => {
  Valores.find()
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
    desc_label: "",
    valores: req.body.newValor
  });

  const encontrado = (await buscaName) != null ? true : false;

  if (!encontrado) {
    Valores.updateOne(
      { name: req.body.name },
      { $push: { desc_label: "", valores: [req.body["newValor"]] } }
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
          name: {
            label: "Nome",
            desc_label: "",
            valores: []
          },
          //Sustentação
          abordagem: {
            label: "Abordagem",
            desc_label:
              "Vertical: Do governo para os cidadãos / Horizontal: Dos cidadãos para o Governo.",
            valores: ["Ambos", "Vertical", "Horizontal"]
          },
          autoria: {
            label: "Autoria",
            desc_label: "",
            valores: []
          },
          engajamento_tecnica: {
            label: "Engajamento",
            desc_label: "",
            valores: ["Gamificação"]
          },
          engajamento_estrategia: {
            label: "Estratégia",
            desc_label: "",
            valores: []
          },
          //Dominio
          area: {
            label: "Área",
            desc_label: "",
            valores: ["Orçamento Participativo", "Geral", "Planejamento Urbano"]
          },
          localizacao: {
            label: "Localização",
            desc_label: "",
            valores: []
          },
          esfera_governamental: {
            label: "Esfera Governamental",
            desc_label: "",
            valores: ["Municipal", "Estadual", "Federal", "Regional"]
          },
          idioma: {
            label: "Idioma",
            desc_label: "",
            valores: ["Inglês", "Português", "Espanhol", "Russo"]
          },
          publico_alvo: {
            label: "Público Alvo",
            desc_label: "",
            valores: []
          },
          tipo_de_participacao: {
            label: "Tipo de Participação",
            desc_label: "",
            valores: ["Voluntária", "Involuntária", "Ambos"]
          },
          //Tecnologias
          plataforma: {
            label: "Plataforma",
            desc_label: "",
            valores: ["Mobile", "Web", "Ambos"]
          },
          hardware: { label: "Hardware", desc_label: "", valores: ["Arduíno"] },
          banco_de_dados: {
            label: "Banco de Dados",
            desc_label: "",
            valores: ["PostgreSQL", "MySQL", "SQLServer", "MongoDB"]
          },
          servidor_web: {
            label: "Servidor Web",
            desc_label: "",
            valores: ["Apache", "Nginx"]
          },
          linguagens_de_programacao: {
            label: "Linguagens de Programação",
            desc_label: "",
            valores: ["Java", "Javascript", "PHP"]
          },
          bibliotecas: {
            label: "Bibliotecas",
            desc_label: "",
            valores: ["Jquery", "D3.js"]
          },
          api: { label: "API", desc_label: "", valores: ["GeoKey"] },
          //Funcionalidades
          vis_tecnica: {
            label: "Técnica",
            desc_label: "",
            valores: ["Mapa", "Mapa de Calor", "Gráfico de Pizza"]
          },
          informacao: {
            label: "Informação",
            desc_label: "",
            valores: []
          },
          tipo_de_dados: {
            label: "Tipo de Dados",
            desc_label: "",
            valores: ["Vídeo", "Imagem", "Localização", "Texto", "Links"]
          },
          estrategia: {
            label: "Estratégia",
            desc_label: "",
            valores: ["Formulários", "Apps"]
          },
          processamento_de_dados: {
            label: "Processamento de Dados",
            desc_label: "",
            valores: ["Mineração de Dados", "OLAP"]
          },
          dados_abertos: {
            label: "Dados Abertos",
            desc_label: "",
            valores: ["Consome", "Disponibiliza", "Nenhuma das Opções", "Ambos"]
          },
          tipo_de_informacao: {
            label: "Tipo de Informação",
            desc_label: "",
            valores: ["Problemas", "Petições"]
          },
          objetivo: { label: "Objetivo", desc_label: "", valores: [] },
          interacao_tecnica: {
            label: "Técnica",
            desc_label: "",
            valores: ["Voto", "Discussão"]
          },
          moderacao: {
            label: "Moderação",
            desc_label: "",
            valores: ["Administrador", "Usuário Responsável"]
          },
          direcionamento: {
            label: "Direcionamento",
            desc_label: "",
            valores: [true, false]
          },
          autenticacao: {
            label: "Autenticação",
            desc_label: "",
            valores: [true, false]
          }
        };

        Object.keys(padrao).forEach(function(prop) {
          const newValor = new Valores({
            _id: new mongoose.Types.ObjectId(),
            name: prop,
            label: padrao[prop].label,
            desc_label: padrao[prop].desc_label,
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
