const express = require("express");
const router = express.Router();

const FerramentaController = require("../controllers/ferramentaController");

router.post("/new", FerramentaController.createFerramenta);

router.post("/find", FerramentaController.findAllByFilter);

router.get("/all", FerramentaController.findAll);

router.get("/:name", FerramentaController.findByName);

router.get("/findByValor/:name", FerramentaController.findByValor);

router.post("/update", FerramentaController.updateFerramenta);

module.exports = router;
