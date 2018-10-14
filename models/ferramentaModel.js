const mongoose = require("mongoose");

const Abordagem = Object.freeze({
  Ambos: "Ambos",
  Vertical: "Vertical",
  Horizontal: "Horizontal"
});

const Esfera_Governamental = Object.freeze({
  Municipal: "Municipal",
  Estadual: "Estadual",
  Federal: "Federal",
  Regional: "Regional"
});

Tipo_de_Participacao = Object.freeze({
  Voluntário: "Voluntária",
  Involuntário: "Involuntária",
  Ambos: "Ambos"
});

const Plataforma = Object.freeze({
  Mobile: "Mobile",
  Web: "Web",
  Ambos: "Ambos"
});

const Dados_Abertos = Object.freeze({
  Consome: "Consome",
  Disponibiliza: "Disponibiliza",
  Nenhuma_das_Opcoes: "Nenhuma das Opções",
  Ambos: "Ambos"
});

const ferramentaSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true, unique: true },
  //Sustentacao
  abordagem: { type: String, enum: Object.values(Abordagem) },
  autoria: { type: String },
  engajamento_tecnica: { type: String },
  engajamento_estrategia: { type: String },
  //Dominio
  area: { type: String },
  localizacao: { type: String },
  esfera_governamental: { type: [String], default: undefined },
  idioma: { type: [String], default: undefined },
  publico_alvo: { type: String },
  tipo_de_participacao: {
    type: String,
    enum: Object.values(Tipo_de_Participacao)
  },
  //Tecnologia
  plataforma: {
    type: String,
    enum: Object.values(Plataforma)
  },
  hardware: { type: String },
  bando_de_dados: { type: [String], default: undefined },
  servidor_web: { type: [String], default: undefined },
  linguagens_de_programacao: { type: [String], default: undefined },
  bibliotecas: { type: [String], default: undefined },
  api: { type: [String], default: undefined },
  //Funcionalidades
  vis_tecnica: { type: [String], default: undefined },
  informacao: { type: String },
  tipo_de_dados: { type: [String], default: undefined },
  estrategia: { type: [String], default: undefined },
  processamento_de_dados: { type: [String], default: undefined },
  dados_abertos: {
    type: String,
    enum: Object.values(Dados_Abertos)
  },
  tipo_de_informacao: { type: String },
  objetivo: { type: String },
  interacao_tecnica: { type: [String], default: undefined },
  moderacao: { type: String },
  relacionamento: { type: Boolean },
  autenticacao: { type: Boolean }
});

Object.assign(ferramentaSchema.statics, {
  Abordagem,
  Esfera_Governamental,
  Tipo_de_Participacao,
  Plataforma,
  Dados_Abertos
});

module.exports = mongoose.model("Ferramenta", ferramentaSchema);
