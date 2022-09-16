const e = require("express");
const express = require("express");
const router = express.Router();
let mongodb = require('../../function/mongodb');
let request = require('request');
var axios = require('axios');


//
let DBins = 'INSdb'
let colection = 'BALANCEmain'
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


router.post('/register_BALANCH01', async (req, res) => {

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
                "W11": "",
                "W12": "",
                "W13": "",
                "A01": "",
                "W21": "",
                "W22": "",
                "W23": "",
                "A02": "",
                "W31": "",
                "W32": "",
                "W33": "",
                "A03": "",
                "Result": "",
                "dip1-2": "",
                "dip1-3": "",
                "dip2-3": "",
                "mean12": "",
                "mean13": "",
                "mean23": "",
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

router.post('/w1_input', async (req, res) => {

    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    output = 'NOK';

    if (input['Barcode'] != undefined && input['UserID'] != undefined && input['InstrumentID'] != undefined && input['DataPreview'] != undefined && input['DataPreview'] != '') {
        let check1 = await mongodb.find(DBins, colection, { "POID": input['Barcode'] });
        if (check1.length > 0) {

            if (check1[0]['BDATA']['W11'] == '') {
                let ins2 = await mongodb.update(DBins, colection, { "POID": input['Barcode'], "STATUS": "ACTIVE" }, { $set: { "BDATA.W11": input['DataPreview'] } });
                output = 'OK';
            } else if (check1[0]['BDATA']['W12'] == '') {
                let ins2 = await mongodb.update(DBins, colection, { "POID": input['Barcode'], "STATUS": "ACTIVE" }, { $set: { "BDATA.W12": input['DataPreview'] } });
                output = 'OK';
            } else if (check1[0]['BDATA']['W13'] == '') {
                let ins2 = await mongodb.update(DBins, colection, { "POID": input['Barcode'], "STATUS": "ACTIVE" }, { $set: { "BDATA.W13": input['DataPreview'] } });
                output = 'OK';
            }

        }
    }


    return res.json(output);
});

router.post('/w1_back', async (req, res) => {

    console.log("--w1_back--");
    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    output = 'NOK';

    if (input['Barcode'] != undefined && input['UserID'] != undefined && input['InstrumentID'] != undefined && input['DataPreview'] != undefined && input['DataPreview'] != '') {
        let check1 = await mongodb.find(DBins, colection, { "POID": input['Barcode'] });
        if (check1.length > 0) {

            if (check1[0]['BDATA']['W13'] !== '') {
                let ins2 = await mongodb.update(DBins, colection, { "POID": input['Barcode'], "STATUS": "ACTIVE" }, { $set: { "BDATA.W13": "", "BDATA.A01": "", "BDATA.dip1-2": "", "BDATA.dip1-3": "", "BDATA.dip2-3": "", "BDATA.mean12": "", "BDATA.mean13": "", "BDATA.mean23": "", "BDATA.Result": "" } });
                output = 'OK';
            } else if (check1[0]['BDATA']['W12'] !== '') {
                let ins2 = await mongodb.update(DBins, colection, { "POID": input['Barcode'], "STATUS": "ACTIVE" }, { $set: { "BDATA.W12": "" } });
                output = 'OK';
            } else if (check1[0]['BDATA']['W11'] !== '') {
                let ins2 = await mongodb.update(DBins, colection, { "POID": input['Barcode'], "STATUS": "ACTIVE" }, { $set: { "BDATA.W11": "" } });
                output = 'OK';
            }

        }
    }


    return res.json(output);
});

router.post('/w2_input', async (req, res) => {

    console.log("--w2_input--");
    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    output = 'NOK';

    if (input['Barcode'] != undefined && input['UserID'] != undefined && input['InstrumentID'] != undefined && input['DataPreview'] != undefined && input['DataPreview'] != '') {
        let check1 = await mongodb.find(DBins, colection, { "POID": input['Barcode'] });
        if (check1.length > 0) {

            if (check1[0]['BDATA']['W21'] == '') {
                let ins2 = await mongodb.update(DBins, colection, { "POID": input['Barcode'], "STATUS": "ACTIVE" }, { $set: { "BDATA.W21": input['DataPreview'] } });
                output = 'OK';
            } else if (check1[0]['BDATA']['W22'] == '') {
                let ins2 = await mongodb.update(DBins, colection, { "POID": input['Barcode'], "STATUS": "ACTIVE" }, { $set: { "BDATA.W22": input['DataPreview'] } });
                output = 'OK';
            } else if (check1[0]['BDATA']['W23'] == '') {
                let ins2 = await mongodb.update(DBins, colection, { "POID": input['Barcode'], "STATUS": "ACTIVE" }, { $set: { "BDATA.W23": input['DataPreview'] } });
                output = 'OK';
            }

        }
    }


    return res.json(output);
});

router.post('/w2_back', async (req, res) => {

    console.log("--w2_back--");
    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    output = 'NOK';

    if (input['Barcode'] != undefined && input['UserID'] != undefined && input['InstrumentID'] != undefined && input['DataPreview'] != undefined && input['DataPreview'] != '') {
        let check1 = await mongodb.find(DBins, colection, { "POID": input['Barcode'] });
        if (check1.length > 0) {

            if (check1[0]['BDATA']['W23'] !== '') {
                let ins2 = await mongodb.update(DBins, colection, { "POID": input['Barcode'], "STATUS": "ACTIVE" }, { $set: { "BDATA.W23": "", "BDATA.A02": "", "BDATA.dip1-2": "", "BDATA.dip1-3": "", "BDATA.dip2-3": "", "BDATA.mean12": "", "BDATA.mean13": "", "BDATA.mean23": "", "BDATA.Result": "" } });
                output = 'OK';
            } else if (check1[0]['BDATA']['W22'] !== '') {
                let ins2 = await mongodb.update(DBins, colection, { "POID": input['Barcode'], "STATUS": "ACTIVE" }, { $set: { "BDATA.W22": "" } });
                output = 'OK';
            } else if (check1[0]['BDATA']['W21'] !== '') {
                let ins2 = await mongodb.update(DBins, colection, { "POID": input['Barcode'], "STATUS": "ACTIVE" }, { $set: { "BDATA.W21": "" } });
                output = 'OK';
            }

        }
    }


    return res.json(output);
});

router.post('/w3_input', async (req, res) => {
    console.log("--w3_input--");
    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    output = 'NOK';

    if (input['Barcode'] != undefined && input['UserID'] != undefined && input['InstrumentID'] != undefined && input['DataPreview'] != undefined && input['DataPreview'] != '') {
        let check1 = await mongodb.find(DBins, colection, { "POID": input['Barcode'] });
        if (check1.length > 0) {

            if (check1[0]['BDATA']['W31'] == '') {
                let ins2 = await mongodb.update(DBins, colection, { "POID": input['Barcode'], "STATUS": "ACTIVE" }, { $set: { "BDATA.W31": input['DataPreview'] } });
                output = 'OK';
            } else if (check1[0]['BDATA']['W32'] == '') {
                let ins2 = await mongodb.update(DBins, colection, { "POID": input['Barcode'], "STATUS": "ACTIVE" }, { $set: { "BDATA.W32": input['DataPreview'] } });
                output = 'OK';
            } else if (check1[0]['BDATA']['W33'] == '') {
                let ins2 = await mongodb.update(DBins, colection, { "POID": input['Barcode'], "STATUS": "ACTIVE" }, { $set: { "BDATA.W33": input['DataPreview'] } });
                output = 'OK';
            }

        }
    }


    return res.json(output);
});

router.post('/w3_back', async (req, res) => {

    console.log("--w3_back--");
    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    output = 'NOK';

    if (input['Barcode'] != undefined && input['UserID'] != undefined && input['InstrumentID'] != undefined && input['DataPreview'] != undefined && input['DataPreview'] != '') {
        let check1 = await mongodb.find(DBins, colection, { "POID": input['Barcode'] });
        if (check1.length > 0) {

            if (check1[0]['BDATA']['W33'] !== '') {
                let ins2 = await mongodb.update(DBins, colection, { "POID": input['Barcode'], "STATUS": "ACTIVE" }, { $set: { "BDATA.W33": "", "BDATA.A03": "", "BDATA.dip1-2": "", "BDATA.dip1-3": "", "BDATA.dip2-3": "", "BDATA.mean12": "", "BDATA.mean13": "", "BDATA.mean23": "", "BDATA.Result": "" } });
                output = 'OK';
            } else if (check1[0]['BDATA']['W32'] !== '') {
                let ins2 = await mongodb.update(DBins, colection, { "POID": input['Barcode'], "STATUS": "ACTIVE" }, { $set: { "BDATA.W32": "" } });
                output = 'OK';
            } else if (check1[0]['BDATA']['W31'] !== '') {
                let ins2 = await mongodb.update(DBins, colection, { "POID": input['Barcode'], "STATUS": "ACTIVE" }, { $set: { "BDATA.W31": "" } });
                output = 'OK';
            }

        }
    }


    return res.json(output);
});

router.post('/cal_data', async (req, res) => {

    console.log("--cal_data--");
    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    output = 'NOK';
    if (input['Barcode'] != undefined) {
        let check1 = await mongodb.find(DBins, colection, { "POID": input['Barcode'], "STATUS": "ACTIVE" });
        if (check1.length > 0) {
            if (check1[0]['BDATA']['W11'] !== '' && check1[0]['BDATA']['W12'] !== '' && check1[0]['BDATA']['W13'] !== '') {
                let nv1 = 0.0;
                nv = ((parseFloat(check1[0]['BDATA']['W13']) - parseFloat(check1[0]['BDATA']['W11'])) / (parseFloat(check1[0]['BDATA']['W12']) - parseFloat(check1[0]['BDATA']['W11']))) * 100
                console.log(nv);
                let ins = await mongodb.update(DBins, colection, { "POID": input['Barcode'], "STATUS": "ACTIVE" }, { $set: { "BDATA.A01": `${nv.toFixed(4)}` } });
            }
            if (check1[0]['BDATA']['W21'] !== '' && check1[0]['BDATA']['W22'] !== '' && check1[0]['BDATA']['W23'] !== '') {
                let nv2 = 0.0;
                nv = ((parseFloat(check1[0]['BDATA']['W23']) - parseFloat(check1[0]['BDATA']['W21'])) / (parseFloat(check1[0]['BDATA']['W22']) - parseFloat(check1[0]['BDATA']['W21']))) * 100
                let ins = await mongodb.update(DBins, colection, { "POID": input['Barcode'], "STATUS": "ACTIVE" }, { $set: { "BDATA.A02": `${nv.toFixed(4)}` } });
            }
            if (check1[0]['BDATA']['W31'] !== '' && check1[0]['BDATA']['W32'] !== '' && check1[0]['BDATA']['W33'] !== '') {
                let nv3 = 0.0;
                nv = ((parseFloat(check1[0]['BDATA']['W33']) - parseFloat(check1[0]['BDATA']['W31'])) / (parseFloat(check1[0]['BDATA']['W32']) - parseFloat(check1[0]['BDATA']['W31']))) * 100
                let ins = await mongodb.update(DBins, colection, { "POID": input['Barcode'], "STATUS": "ACTIVE" }, { $set: { "BDATA.A03": `${nv.toFixed(4)}` } });
            }
        }
        let check2 = await mongodb.find(DBins, colection, { "POID": input['Barcode'], "STATUS": "ACTIVE" });
        if (check2.length > 0) {
            if (check2[0]['BDATA']['A01'] != '' && check2[0]['BDATA']['A02'] != '') {
                let dip = 0.0;
                let mean = (parseFloat(check2[0]['BDATA']['A01']) + parseFloat(check2[0]['BDATA']['A02'])) / 2
                dip = Math.abs(parseFloat(check2[0]['BDATA']['A01']) - parseFloat(check2[0]['BDATA']['A02'])) / mean
                let ins = await mongodb.update(DBins, colection, { "POID": input['Barcode'], "STATUS": "ACTIVE" }, { $set: { "BDATA.dip1-2": `${(dip * 100).toFixed(4)}`, "BDATA.mean12": `${mean.toFixed(4)}` } });
            }
            if (check2[0]['BDATA']['A01'] != '' && check2[0]['BDATA']['A03'] != '') {
                let dip = 0.0;
                let mean = (parseFloat(check2[0]['BDATA']['A01']) + parseFloat(check2[0]['BDATA']['A03'])) / 2
                dip = Math.abs(parseFloat(check2[0]['BDATA']['A01']) - parseFloat(check2[0]['BDATA']['A03'])) / mean
                let ins = await mongodb.update(DBins, colection, { "POID": input['Barcode'], "STATUS": "ACTIVE" }, { $set: { "BDATA.dip1-3": `${(dip * 100).toFixed(4)}`, "BDATA.mean13": `${mean.toFixed(4)}` } });
            }
            if (check2[0]['BDATA']['A02'] != '' && check2[0]['BDATA']['A03'] != '') {
                let dip = 0.0;
                let mean = (parseFloat(check2[0]['BDATA']['A02']) + parseFloat(check2[0]['BDATA']['A03'])) / 2
                dip = Math.abs(parseFloat(check2[0]['BDATA']['A02']) - parseFloat(check2[0]['BDATA']['A03'])) / mean
                let ins = await mongodb.update(DBins, colection, { "POID": input['Barcode'], "STATUS": "ACTIVE" }, { $set: { "BDATA.dip2-3": `${(dip * 100).toFixed(4)}`, "BDATA.mean23": `${mean.toFixed(4)}` } });

            }

        }
        let check3 = await mongodb.find(DBins, colection, { "POID": input['Barcode'], "STATUS": "ACTIVE" });
        if (check3.length > 0) {
            if (check3[0]['BDATA']['dip1-3'] === '' && check3[0]['BDATA']['dip2-3'] === '') {
                let ins = await mongodb.update(DBins, colection, { "POID": input['Barcode'], "STATUS": "ACTIVE" }, { $set: { "BDATA.Result": check3[0]['BDATA']['mean12'] } });
            } else {
                if (parseFloat(check3[0]['BDATA']['dip1-2']) < parseFloat(check3[0]['BDATA']['dip1-3']) && parseFloat(check3[0]['BDATA']['dip1-2']) < parseFloat(check3[0]['BDATA']['dip2-3'])) {
                    let ins = await mongodb.update(DBins, colection, { "POID": input['Barcode'], "STATUS": "ACTIVE" }, { $set: { "BDATA.Result": check3[0]['BDATA']['mean12'] } });
                } else if (parseFloat(check3[0]['BDATA']['dip1-3']) < parseFloat(check3[0]['BDATA']['dip1-2']) && parseFloat(check3[0]['BDATA']['dip1-3']) < parseFloat(check3[0]['BDATA']['dip2-3'])) {
                    let ins = await mongodb.update(DBins, colection, { "POID": input['Barcode'], "STATUS": "ACTIVE" }, { $set: { "BDATA.Result": check3[0]['BDATA']['mean13'] } });
                } else if (parseFloat(check3[0]['BDATA']['dip2-3']) < parseFloat(check3[0]['BDATA']['dip1-2']) && parseFloat(check3[0]['BDATA']['dip2-3']) < parseFloat(check3[0]['BDATA']['dip1-3'])) {
                    let ins = await mongodb.update(DBins, colection, { "POID": input['Barcode'], "STATUS": "ACTIVE" }, { $set: { "BDATA.Result": check3[0]['BDATA']['mean23'] } });
                }
            }
        }
    }


    return res.json(output);
});


router.post('/WBA_REJ', async (req, res) => {

    console.log("--WBA_REJ--");
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

router.post('/WBA_SEND_DATA', async (req, res) => {

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
                item: "NVC",
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

router.post('/WBA_SEND_DATA_ADJ', async (req, res) => {

    console.log("--WBA_SEND_DATA_ADJ--");
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
                item: "NVC",
                value: check1[0][`BDATA`][`Result`],
            }
 
            let resp = await axios.post('http://172.23.10.34:15000/valueinputadj', outputQ);
     
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

module.exports = router;