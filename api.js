const express = require("express");
const router = express.Router();
//-----------------------------------------
router.use(require("./flow/001/BALANCE"));
router.use(require("./flow/001/DB"));
router.use(require("./flow/001/FP"));
router.use(require("./flow/001/PH"));
router.use(require("./flow/001/SG"));
router.use(require("./flow/001/FA"));
router.use(require("./flow/001/TA"));
router.use(require("./flow/001/DENSITY"));
router.use(require("./flow/001/KARL"));
router.use(require("./flow/001/BALANCEa"));
router.use(require("./flow/001/AUTOTITRATE"));
router.use(require("./flow/001/MINIAV"));
router.use(require("./flow/001/PARTICLESIZE"));
router.use(require("./flow/001/ECm"));
router.use(require("./flow/001/BOOKFEILD"));
router.use(require("./flow/001/PENETROMETER"));
//-----------------------------------------
router.use(require("./flow/002/SAP-SEND"));
router.use(require("./flow/002/sapdata"));
//-----------------------------------------
//SAP-SEND
//-----------------------------------------
router.use(require("./flow/testflow/testflow"))

module.exports = router;

