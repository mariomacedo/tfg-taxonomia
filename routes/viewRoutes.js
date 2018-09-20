const express = require("express");
const router = express.Router();

const ViewController = require("../controllers/viewController");

router.get("/collapsable-tree", ViewController.collapsableTree);

module.exports = router;