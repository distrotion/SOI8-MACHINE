const express = require("express");
const router = express.Router();

router.use(require("./flow/001/BALANCE"))
router.use(require("./flow/001/DB"))
router.use(require("./flow/001/FP"))
router.use(require("./flow/001/PH"))
router.use(require("./flow/001/SG"))
router.use(require("./flow/001/DENSITY"))

//-----------------------------------------
router.use(require("./flow/testflow/testflow"))

module.exports = router;

