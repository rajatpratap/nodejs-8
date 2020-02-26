const express = require("express");
const router = express.Router();
const path = require("path");
const productControllers = require("../controllers/products");

router.get("/", productControllers.getProducts);

module.exports = router;
