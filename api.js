const express = require("express");
const router = express.Router();

router.use(require("./flow/001/BALANCE"))
router.use(require("./flow/001/DB"))

//-----------------------------------------
router.use(require("./flow/testflow/testflow"))

module.exports = router;

