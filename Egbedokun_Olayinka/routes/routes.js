const express = require("express");
const router = express.Router();

const welcomeController = require("../controllers/controller");

router.get("/", welcomeController);

module.exports = router;
