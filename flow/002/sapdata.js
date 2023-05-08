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
//


router.post('/SAENTOSAP', async (req, res) => {

  console.log("--SAENTOSAP--");
  //-------------------------------------
  console.log(req.body);
  let input = req.body;
  //-------------------------------------
  let output = { "return": 'NOK' }
  try {



    let MATCP = input['poid'].substring(0, 8);
    let PO = input['poid'].substring(12, 18);
    let poid = `${input['poid']}`

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
      res.json(output);
    }



    let data = await mongodb.find(`${plant}dbMAIN`, 'MAIN', { "POID": poid });
    if (data.length > 0) {
      console.log(data[0]);
    }
    let ListkeyAll = [];
    let ListkeyAllg = [];
    let matcp = await mongodb.find(`${plant}_MASTER`, 'specification', { "MATNO": MATCP });
    if (matcp.length > 0) {
      // console.log(matcp[0]['SPEC'])
      ListkeyAll = Object.keys(matcp[0]['SPEC']);
      for (let i = 0; i < ListkeyAll.length; i++) {
        if (ListkeyAll[i] != 'COLOR' && ListkeyAll[i] != 'APPEARANCE') {
          if (matcp[0]['SPEC'][ListkeyAll[i]]['HI'] != '') {
            ListkeyAllg.push(ListkeyAll[i]);
          }
        } else if (ListkeyAll[i] == 'COLOR') {
          ListkeyAllg.push('COLOR');
        } else if (ListkeyAll[i] == 'APPEARANCE') {
          ListkeyAllg.push('APPEARANCE');
        }
      }
    }

    let listout = {};

    if (ListkeyAllg.length > 0 && data.length > 0) {
      for (let i = 0; i < ListkeyAllg.length; i++) {
        if(data[0][ListkeyAllg[i]] != undefined){
          if(data[0][ListkeyAllg[i]]['T1Stc'] == 'lightgreen'){
            listout[ListkeyAllg[i]] = data[0][ListkeyAllg[i]]['T1'];
          }
          if(data[0][ListkeyAllg[i]]['T2Stc'] == 'lightgreen'){
            listout[ListkeyAllg[i]] = data[0][ListkeyAllg[i]]['T2'];
          }
          if(data[0][ListkeyAllg[i]]['T3Stc'] == 'lightgreen'){
            listout[ListkeyAllg[i]] = data[0][ListkeyAllg[i]]['T3'];
          }
        }
      }
    }


    output = { "key": ListkeyAllg , "listout": listout }
  }
  catch (err) {
    output = { "return": 'NOK' }
  }



  return res.json(output);
});





module.exports = router;