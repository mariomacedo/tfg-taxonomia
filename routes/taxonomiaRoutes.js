const express = require("express");
const router = express.Router();

const TaxonomiaController = require("../controllers/taxonomiaController");

router.get("/", TaxonomiaController.taxonomia);

router.get("/raiz", TaxonomiaController.raiz);

router.get("/:nodeName", TaxonomiaController.getNode);

router.post("/createNode", TaxonomiaController.createNode);

router.post("/removeNode", TaxonomiaController.removeNode);

router.post("/edit", TaxonomiaController.editNode);

module.exports = router;
