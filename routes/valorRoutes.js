const express = require("express");
const router = express.Router();

const ValoresController = require("../controllers/valoresController");

router.get("/:label", ValoresController.getValoresByLabel);

module.exports = router;