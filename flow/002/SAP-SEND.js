const e = require("express");
const express = require("express");
const router = express.Router();
let mongodb = require('../../function/mongodb');
let request = require('request');
var axios = require('axios');

//
let DBins = 'INSdb'
let colection = 'ECmmain'
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
let database = "SAP_MASTER";
let masterdata = "master2";
//

router.post('/sap_test', async (req, res) => {

  let check1 = await mongodb.find(database, masterdata, { MKMNR: { $regex: "20846" } });
  console.log(check1)
  return res.json(check1);
});

router.post('/sap_test_MAT', async (req, res) => {
  //-------------------------------------
  console.log(req.body);
  let input = req.body;
  //-------------------------------------

  let check1 = await mongodb.find(database, masterdata, { MKMNR: { $regex: input['CP'] } });
  console.log(check1)
  return res.json(check1);
});


router.post('/sap_MAT', async (req, res) => {
  //-------------------------------------
  console.log(req.body);
  let input = req.body;
  //-------------------------------------

  let check1 = await mongodb.find(database, masterdata, { Material: { $regex: input['MAT'] } });
  console.log(check1)
  return res.json(check1);
});

router.post('/qc_to_sap', async (req, res) => {
  //-------------------------------------
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let outputdata = {};

  if (input['MAT'] != undefined && input['PO'] != undefined) {
    let check1 = await mongodb.find(database, masterdata, { Material: { $regex: input['MAT'] } });
    // console.log(check1.length)
    if (check1.length > 0) {
      let matdata = check1.reverse();
      let MATCP = input['MAT'];
      // console.log(MATCP);

      let PREMIX = await mongodb.find(PREMIXserver, dbin, { "MATNO": MATCP });
      let COILCOATING = await mongodb.find(COILCOATINGserver, dbin, { "MATNO": MATCP });
      let HYDROPHILIC = await mongodb.find(HYDROPHILICserver, dbin, { "MATNO": MATCP });
      let PLX = await mongodb.find(PLXserver, dbin, { "MATNO": MATCP });
      let TRITRATING = await mongodb.find(TRITRATINGserver, dbin, { "MATNO": MATCP });
      let POWDER = await mongodb.find(POWDERserver, dbin, { "MATNO": MATCP });
      let LIQUID = await mongodb.find(LIQUIDserver, dbin, { "MATNO": MATCP });
      let NOXRUST = await mongodb.find(NOXRUSTserver, dbin, { "MATNO": MATCP });

      let plant = ``;

      if (TRITRATING.length > 0) {
        plant = 'TRITRATING'

      } else if (COILCOATING.length > 0) {
        plant = 'COILCOATING'

      } else if (HYDROPHILIC.length > 0) {
        plant = 'HYDROPHILIC'

      } else if (PLX.length > 0) {
        plant = 'PLX'

      } else if (PREMIX.length > 0) {
        plant = 'PREMIX'

      } else if (POWDER.length > 0) {
        plant = 'POWDER'

      }
      else if (LIQUID.length > 0) {
        plant = 'LIQUID'

      } else if (NOXRUST.length > 0) {
        plant = 'NOXRUST'

      } else {
        return res.json({ "status": "no-data" });
      }

      // console.log(plant);

      let data = await mongodb.find(`${plant}dbMAIN`, 'MAIN', { "POID": `${MATCP + input['PO']}` });
      let matsapdata = [];
      if (data.length > 0) {
        // console.log(data[0]['checklist']);
        outputdata = { "data": data };
        outputdata['checklist'] = data[0]['checklist'];


        for (let i = 0; i < matdata.length; i++) {
          // console.log(matdata[i][`MKMNR`].slice(-2));
          // console.log(matdata[i][`KURZTEXT`].toUpperCase());
          matsapdata.push({ "MKMNR": `0${matdata[i][`MKMNR`].slice(-2)}0`, "KURZTEXT": matdata[i][`KURZTEXT`].toUpperCase(), "qc": matdata[i][`qc`] ?? '' })

          // console.log(matdata[i][`SORTFELD`].toUpperCase());
        }
        outputdata['matsapdata'] = matsapdata;
      }

      outputdata['satatus'] = 'NOK';

      for (let k = 0; k < matsapdata.length; k++) {
        if(matsapdata[k]["qc"] === undefined || matsapdata[k]["qc"] === ""){
      
          break;
        }

        if (k < matsapdata.length - 1) {

          if(matsapdata[k]["KURZTEXT"] ==`COLOR` || matsapdata[k]["KURZTEXT"] ==`APPEARANCE`){
            let outputQ = {
              "BAPI_NAME": "ZPPIN016_OUT",
              "IMP_PRCTR": "1010"+outputdata["data"][0]["PO"],
              "IMP_TEXT01": "AC",
              "IMP_TEXT02": "",
              "IMP_TEXT03": "",
              "IMP_VALUE": 0,
              "IMP_WERKS": matsapdata[k]["MKMNR"],
              "LAST_DATE": "",
              "LAST_TIME": "",
              "TABLE_NAME": ""
            }
            console.log(outputQ);
            // let resp = await axios.post('http://tp-portal.thaiparker.co.th/API_QcReport/ZBAPI_QC_INTERFACE', outputQ);
            // if (resp.status == 200) {
            //     var ret = resp.data
            //     console.log(ret);
            // }
          }else{
            let ans = 0
            if(outputdata["data"][0][matsapdata[k]["qc"]]["T1Stc"] == 'lightgreen'){
              ans = parseFloat(outputdata["data"][0][matsapdata[k]["qc"]]["T1"]);
            }
            if(outputdata["data"][0][matsapdata[k]["qc"]]["T2Stc"] == 'lightgreen'){
              ans = parseFloat(outputdata["data"][0][matsapdata[k]["qc"]]["T2"]);
            }
            if(outputdata["data"][0][matsapdata[k]["qc"]]["T3Stc"] == 'lightgreen'){
              ans = parseFloat(outputdata["data"][0][matsapdata[k]["qc"]]["T3"]);
            }

            let outputQ = {
              "BAPI_NAME": "ZPPIN016_OUT",
              "IMP_PRCTR": "1010"+outputdata["data"][0]["PO"],
              "IMP_TEXT01": "AC",
              "IMP_TEXT02": "",
              "IMP_TEXT03": "",
              "IMP_VALUE": ans,
              "IMP_WERKS": matsapdata[k]["MKMNR"],
              "LAST_DATE": "",
              "LAST_TIME": "",
              "TABLE_NAME": ""
            }
            console.log(outputQ);
            
            // let resp = await axios.post('http://tp-portal.thaiparker.co.th/API_QcReport/ZBAPI_QC_INTERFACE', outputQ);
            // if (resp.status == 200) {
            //     var ret = resp.data
            //     console.log(ret);
            // }
          }

        }else{
          if(matsapdata[k]["KURZTEXT"] ==`COLOR` || matsapdata[k]["KURZTEXT"] ==`APPEARANCE`){
            let outputQ = {
              "BAPI_NAME": "ZPPIN016_OUT",
              "IMP_PRCTR": "1010"+outputdata["data"][0]["PO"],
              "IMP_TEXT01": "AC*",
              "IMP_TEXT02": "",
              "IMP_TEXT03": "",
              "IMP_VALUE": 0,
              "IMP_WERKS": matsapdata[k]["MKMNR"],
              "LAST_DATE": "",
              "LAST_TIME": "",
              "TABLE_NAME": ""
            }
            console.log(outputQ);
            outputdata['satatus'] = 'OK';
            // let resp = await axios.post('http://tp-portal.thaiparker.co.th/API_QcReport/ZBAPI_QC_INTERFACE', outputQ);
            // if (resp.status == 200) {
            //     var ret = resp.data
            //     console.log(ret);
            // }
          }else{
            let ans = 0
            if(outputdata["data"][0][matsapdata[k]["qc"]]["T1Stc"] == 'lightgreen'){
              ans = parseFloat(outputdata["data"][0][matsapdata[k]["qc"]]["T1"]);
            }
            if(outputdata["data"][0][matsapdata[k]["qc"]]["T2Stc"] == 'lightgreen'){
              ans = parseFloat(outputdata["data"][0][matsapdata[k]["qc"]]["T2"]);
            }
            if(outputdata["data"][0][matsapdata[k]["qc"]]["T3Stc"] == 'lightgreen'){
              ans = parseFloat(outputdata["data"][0][matsapdata[k]["qc"]]["T3"]);
            }

            let outputQ = {
              "BAPI_NAME": "ZPPIN016_OUT",
              "IMP_PRCTR": "1010"+outputdata["data"][0]["PO"],
              "IMP_TEXT01": "AC*",
              "IMP_TEXT02": "",
              "IMP_TEXT03": "",
              "IMP_VALUE": ans,
              "IMP_WERKS": matsapdata[k]["MKMNR"],
              "LAST_DATE": "",
              "LAST_TIME": "",
              "TABLE_NAME": ""
            }
            console.log(outputQ);
            outputdata['satatus'] = 'OK';
            // let resp = await axios.post('http://tp-portal.thaiparker.co.th/API_QcReport/ZBAPI_QC_INTERFACE', outputQ);
            // if (resp.status == 200) {
            //     var ret = resp.data
            //     console.log(ret);
            // }
          }
        }


      }



    }
  }

  return res.json(outputdata);
});

router.post('/sap_test_get', async (req, res) => {

  let check1 = await mongodb.find("POWDER_DATA", "MAIN", { POID: "120009151010178871" });
  console.log(check1)
  return res.json(check1);
});

module.exports = router;