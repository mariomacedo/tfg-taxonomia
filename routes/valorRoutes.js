const express = require("express");
const router = express.Router();

const ValoresController = require("../controllers/valoresController");

router.get("/:id", ValoresController.getValoresById);

router.get("/autocomplete/all", ValoresController.autocomplete);

router.get("/carga/padrao", ValoresController.loadValores);

router.post("/new", ValoresController.setValor);

module.exports = router;
