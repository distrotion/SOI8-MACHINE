const e = require("express");
const express = require("express");
const router = express.Router();
let mongodb = require('../../function/mongodb');
let request = require('request');
var axios = require('axios');


//
let DBins = 'INSdb'
let colection = 'FPmain'
//
let PREMIXserver = 'PREMIX_MASTER';
let COILCOATINGserver = 'COILCOATING_MASTER';
let HYDROPHILICserver = 'HYDROPHILIC_MASTER';
let PLXserver = 'PLX_MASTER';
let TRITRATINGserver = 'TRITRATING_MASTER';
let POWDERserver = 'POWDER_MASTER';
let LIQUIDserver = 'LIQUID_MASTER';
let NOXRUSTserver = 'NOXRUST_MASTER'
let dbin = 'specification';
//


router.post('/register_FP', async (req, res) => {

  //-------------------------------------
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let output = `NOK`;
  //InstrumentID

  if (input['Barcode'] != undefined && input['UserID'] != undefined && input['InstrumentID'] != undefined) {

      input['PO'] = input['Barcode'];

      let MATCP = input['PO'].substring(0, 8);
      let PO = input['PO'].substring(12, 18);

      let PREMIX = await mongodb.find(PREMIXserver, dbin, { "MATNO": MATCP });
      let COILCOATING = await mongodb.find(COILCOATINGserver, dbin, { "MATNO": MATCP });
      let HYDROPHILIC = await mongodb.find(HYDROPHILICserver, dbin, { "MATNO": MATCP });
      let PLX = await mongodb.find(PLXserver, dbin, { "MATNO": MATCP });
      let TRITRATING = await mongodb.find(TRITRATINGserver, dbin, { "MATNO": MATCP });
      let POWDER = await mongodb.find(POWDERserver, dbin, { "MATNO": MATCP });
      let LIQUID = await mongodb.find(LIQUIDserver, dbin, { "MATNO": MATCP });
      let NOXRUST = await mongodb.find(NOXRUSTserver, dbin, { "MATNO": MATCP });

      let data = {
          "PLANT": "NOdata",
          "STATUS": "ORDER AGAIN"
      };

      if (TRITRATING.length > 0) {
          data = {
              "MATCP": MATCP,
              "PO": PO,
              "PLANT": "TRITRATING",
              "MASTERdb": TRITRATINGserver,
              "MATDATA": TRITRATING[0],
              "ProductName": TRITRATING[0]['ProductName'],
          };
      } else if (COILCOATING.length > 0) {
          data = {
              "MATCP": MATCP,
              "PO": PO,
              "PLANT": "COILCOATING",
              "MASTERdb": COILCOATINGserver,
              "MATDATA": COILCOATING[0],
              "ProductName": COILCOATING[0]['ProductName'],
          };
      } else if (HYDROPHILIC.length > 0) {
          data = {
              "MATCP": MATCP,
              "PO": PO,
              "PLANT": "HYDROPHILIC",
              "MASTERdb": HYDROPHILICserver,
              "MATDATA": HYDROPHILIC[0],
              "ProductName": HYDROPHILIC[0]['ProductName'],
          };
      } else if (PLX.length > 0) {
          data = {
              "MATCP": MATCP,
              "PO": PO,
              "PLANT": "PLX",
              "MASTERdb": PLXserver,
              "MATDATA": PLX[0],
              "ProductName": PLX[0]['ProductName'],
          };
      } else if (PREMIX.length > 0) {
          data = {
              "MATCP": MATCP,
              "PO": PO,
              "PLANT": "PREMIX",
              "MASTERdb": PREMIXserver,
              "MATDATA": PREMIX[0],
              "ProductName": PREMIX[0]['ProductName'],
          };
      } else if (POWDER.length > 0) {
          data = {
              "MATCP": MATCP,
              "PO": PO,
              "PLANT": "POWDER",
              "MASTERdb": POWDERserver,
              "MATDATA": POWDER[0],
              "ProductName": POWDER[0]['ProductName'],
          };
      } else if (LIQUID.length > 0) {
          data = {
              "MATCP": MATCP,
              "PO": PO,
              "PLANT": "LIQUID",
              "MASTERdb": LIQUIDserver,
              "MATDATA": LIQUID[0],
              "ProductName": LIQUID[0]['ProductName'],
          };
      } else if (NOXRUST.length > 0) {
          data = {
              "MATCP": MATCP,
              "PO": PO,
              "PLANT": "NOXRUST",
              "MASTERdb": NOXRUSTserver,
              "MATDATA": NOXRUST[0],
              "ProductName": NOXRUST[0]['ProductName'],
          };
      } else {
          output = 'The MAT NO. Incorrect';
      }

      let neworder = {
          "POID": input['PO'],
          "MATNO": MATCP,
          "PO": PO,
          "PLANT": data["PLANT"],
          "MASTERdb": data["MASTERdb"],
          "ProductName": data["ProductName"],
          "UserID": input['UserID'],
          "InstrumentID": input['InstrumentID'],
          "Barcode": input['Barcode'],
          "STATUS": "ACTIVE",
          "SEND": "",
          "timestamp": Date.now(),

      };

      if (data["PLANT"] !== "NOdata") {
          neworder["SPEC"] = data["MATDATA"]["SPEC"][`NVC`];
          neworder["BDATA"] = {
              "Result": "",
          }
      }

      let check = await mongodb.find(`${neworder['PLANT']}dbMAIN`, 'MAIN', { "POID": neworder['POID'] });

      if (check.length === 0) {
          output = 'NOK-NOPO'
          return res.json(output);
      } else {
          let check2 = await mongodb.find(DBins, colection, { "POID": neworder['POID'] });
          neworder['ED'] = check2.length;
          if (check2.length > 0) {
              let check3 = await mongodb.find(DBins, colection, { "POID": neworder['POID'], "STATUS": "ACTIVE" });
              if (check3.length === 0) {
                  let ins2 = await mongodb.insertMany(DBins, colection, [neworder]);
              } else {
                  output = 'OK'
                  return res.json(output);
              }
          } else {
              let ins2 = await mongodb.insertMany(DBins, colection, [neworder]);
          }

          output = 'OK'
      }

  }

  return res.json(output);
});

router.post('/FP_REJ', async (req, res) => {

  console.log("--FP_REJ--");
  //-------------------------------------
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  output = 'NOK'
  if (input['Barcode'] != undefined) {

      let ins = await mongodb.update(DBins, colection, { "POID": input['Barcode'], "STATUS": "ACTIVE" }, { $set: { "STATUS": "REJECT" } });
      output = 'OK'

  }

  return res.json(output);
});


router.post('/FP_SEND_DATA', async (req, res) => {

  console.log("--SEND_DATA--");
  //-------------------------------------
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  output = 'NOK';
  if (input['Barcode'] != undefined && input['Barcode'] != '') {

      let check1 = await mongodb.find(DBins, colection, { "POID": input['Barcode'], "STATUS": "ACTIVE" });

      if (check1[0][`BDATA`][`Result`] !== '') {
          outputQ = {
              poid: input['Barcode'],
              plant: check1[0][`PLANT`],
              item: "FP",
              value: check1[0][`BDATA`][`Result`],
          }

          let resp = await axios.post('http://172.23.10.34:15000/valueinput', outputQ);
   
          if (resp.status == 200) {
              var ret = resp.data
             output = ret[`return`]
             if(ret[`return`] === 'OK'){
              let ins = await mongodb.update(DBins, colection, { "POID": input['Barcode'], "STATUS": "ACTIVE" }, { $set: { "SEND": "SEND" } });
             }
          }
      }

  }

  return res.json(output);
});


router.post('/FP_Result', async (req, res) => {

    console.log("--Result--");
    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    output = 'NOK';
    if (input['Barcode'] != undefined && input['Barcode'] != ''&& input['Result'] != undefined) {
  
        let check1 = await mongodb.find(DBins, colection, { "POID": input['Barcode'], "STATUS": "ACTIVE" });
  
        if(check1.length > 0){
            let ins = await mongodb.update(DBins, colection, { "POID": input['Barcode'], "STATUS": "ACTIVE" }, { $set: { "BDATA.Result": input['Result'] } });
            output = 'OK';
        }
  
    }
  
    return res.json(output);
  });








module.exports = router;