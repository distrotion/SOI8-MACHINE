const e = require("express");
const express = require("express");
const router = express.Router();
let mongodb = require('../../function/mongodb');
var request = require('request');


let DBinsBALANCH = 'BALANCEdb'
let colectionBALANCH  = 'main'


router.post('/findBALANCH', async (req, res) => {
  console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let data = await mongodb.find(DBinsBALANCH, colectionBALANCH, input);

    return res.json(data);
});

module.exports = router;