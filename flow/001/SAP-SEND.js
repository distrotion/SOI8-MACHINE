const e = require("express");
const express = require("express");
const router = express.Router();
let mongodb = require('../../function/mongodb');
let request = require('request');
var axios = require('axios');

router.post('/sap_test', async (req, res) => {

  let check1 = await mongodb.find("SAP_MASTER", "master", {MKMNR: {$regex:"20846"} });
  console.log(check1)
  return res.json(check1);
});

router.post('/sap_test_MAT', async (req, res) => {
  //-------------------------------------
  console.log(req.body);
  let input = req.body;
  //-------------------------------------

  let check1 = await mongodb.find("SAP_MASTER", "master", {MKMNR: {$regex:input['CP']} });
  console.log(check1)
  return res.json(check1);
});

router.post('/sap_test_get', async (req, res) => {

  let check1 = await mongodb.find("POWDER_DATA", "MAIN", {POID: "120009151010178871" });
  console.log(check1)
  return res.json(check1);
});

module.exports = router;