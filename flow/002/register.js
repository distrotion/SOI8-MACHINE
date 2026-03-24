const express = require("express");
const router = express.Router();
let mongodb = require('../../function/mongodb');
let mssql = require('./../../function/mssql');
let mssqlR = require('./../../function/mssqlR');

let PREMIXserver = 'PREMIX_MASTER';
let COILCOATINGserver = 'COILCOATING_MASTER';
let HYDROPHILICserver = 'HYDROPHILIC_MASTER';
let PLXserver = 'PLX_MASTER';
let TRITRATINGserver = 'TRITRATING_MASTER';
let POWDERserver = 'POWDER_MASTER';
let LIQUIDserver = 'LIQUID_MASTER';
let NOXRUSTserver = 'NOXRUST_MASTER'
let dbin = 'specification';

let PREMIXdbMAIN = 'PREMIXdbMAIN';
let COILCOATINGdbMAIN = 'COILCOATINGdbMAIN';
let HYDROPHILICdbMAIN = 'HYDROPHILICdbMAIN';
let PLXdbMAIN = 'PLXdbMAIN';
let TRITRATINGdbMAIN = 'TRITRATINGdbMAIN';
let POWDERdbMAIN = 'POWDERdbMAIN';
let LIQUIDdbMAIN = 'LIQUIDdbMAIN';
let NOXRUSTdbMAIN = 'NOXRUSTdbMAIN';
let dbinMAIN = 'MAIN'

// let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
// let day = d;

router.post('/CHECKPO', async (req, res) => {
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
    let day = d;
    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = [];

    try {

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
            output = [];
        }

        let neworder = {
            "POID": input['PO'],
            "MATNO": MATCP,
            "PO": PO,
            "PLANT": data["PLANT"],
            "MASTERdb": data["MASTERdb"],
            "ProductName": data["ProductName"],
            "SumStatus": "IP",
            "DEP": "STAFF"
        };

        output = [];

        // console.log(data)


        if (data["PLANT"] !== "NOdata") {
            let query = '';
            if (data["PLANT"] == 'TRITRATING') {
                // query = `SELECT *  FROM [ScadaReport].[dbo].[LQprocessinfo] where NumOrder= '212575'`
                output = {

                    "recordsets": [
                        [
                            {
                                "ID": "",
                                "RecordTimeStart": "",
                                "NumOrder": "212779",
                                "NumTank": 0,
                                "NumMode": 0,
                                "StrChemical": "END",
                                "StrLotNum": "RT11",
                                "StrBarcode": "END",
                                "NumModeOper": 0,
                                "NumStep": 0,
                                "NumSp": "coming",
                                "NumAct": "soon",
                                "NumTemp": 0,
                                "dtDate": "2023-07-25T00:00:00.000Z"
                            },

                        ]
                    ],

                    "output": {},
                    "rowsAffected": [
                        1
                    ]
                }
            } else if (data["PLANT"] == 'COILCOATING') {

                query = `SELECT *  FROM [ScadaReport].[dbo].[CoilProcessinfo] where NumOrder= '${PO}' order by RecordTimeStart asc`
                let db = await mssql.qurey(query);



                output = db;
                if (db['recordsets'][0].length == 0) {
                    output = {

                        "recordsets": [
                            [
                                {
                                    "ID": "",
                                    "RecordTimeStart": "",
                                    "NumOrder": "212779",
                                    "NumTank": 0,
                                    "NumMode": 0,
                                    "StrChemical": "END",
                                    "StrLotNum": "RT11",
                                    "StrBarcode": "END",
                                    "NumModeOper": 0,
                                    "NumStep": 0,
                                    "NumSp": "Lot",
                                    "NumAct": "Repack",
                                    "NumTemp": 0,
                                    "dtDate": "2023-07-25T00:00:00.000Z"
                                },

                            ]
                        ],

                        "output": {},
                        "rowsAffected": [
                            1
                        ]
                    }
                } else {

                    output['recordsets'][0].push(
                        {
                            "ID": "",
                            "RecordTimeStart": "",
                            "NumOrder": "",
                            "NumTank": 0,
                            "NumMode": 0,
                            "StrChemical": "END",
                            "StrLotNum": "",
                            "StrBarcode": "END",
                            "NumModeOper": 0,
                            "NumStep": 0,
                            "NumSp": "ADD",
                            "NumAct": "END",
                            "NumTemp": 0,
                            "dtDate": "2023-07-25T00:00:00.000Z"
                        },
                    )

                }
            } else if (data["PLANT"] == 'HYDROPHILIC') {

                query = `SELECT *  FROM [ScadaReport].[dbo].[HydroProcessinfo] where NumOrder= '${PO}' order by RecordTimeStart asc`
                let db = await mssql.qurey(query);

                output = db;
                if (db['recordsets'][0].length == 0) {
                    output = {

                        "recordsets": [
                            [
                                {
                                    "ID": "",
                                    "RecordTimeStart": "",
                                    "NumOrder": "212779",
                                    "NumTank": 0,
                                    "NumMode": 0,
                                    "StrChemical": "END",
                                    "StrLotNum": "RT11",
                                    "StrBarcode": "END",
                                    "NumModeOper": 0,
                                    "NumStep": 0,
                                    "NumSp": "Lot",
                                    "NumAct": "Repack",
                                    "NumTemp": 0,
                                    "dtDate": "2023-07-25T00:00:00.000Z"
                                },

                            ]
                        ],

                        "output": {},
                        "rowsAffected": [
                            1
                        ]
                    }
                } else {

                    output['recordsets'][0].push(
                        {
                            "ID": "",
                            "RecordTimeStart": "",
                            "NumOrder": "",
                            "NumTank": 0,
                            "NumMode": 0,
                            "StrChemical": "END",
                            "StrLotNum": "",
                            "StrBarcode": "END",
                            "NumModeOper": 0,
                            "NumStep": 0,
                            "NumSp": "ADD",
                            "NumAct": "END",
                            "NumTemp": 0,
                            "dtDate": "2023-07-25T00:00:00.000Z"
                        },
                    )

                }
            } else if (data["PLANT"] == 'PLX') {

                query = `SELECT *  FROM [ScadaReport].[dbo].[PLXprocessinfo] where NumOrder= '${PO}' order by RecordTimeStart asc`
                let db = await mssql.qurey(query);

                output = db;
                if (db['recordsets'][0].length == 0) {
                    output = {

                        "recordsets": [
                            [
                                {
                                    "ID": "",
                                    "RecordTimeStart": "",
                                    "NumOrder": "212779",
                                    "NumTank": 0,
                                    "NumMode": 0,
                                    "StrChemical": "END",
                                    "StrLotNum": "RT11",
                                    "StrBarcode": "END",
                                    "NumModeOper": 0,
                                    "NumStep": 0,
                                    "NumSp": "Lot",
                                    "NumAct": "Repack",
                                    "NumTemp": 0,
                                    "dtDate": "2023-07-25T00:00:00.000Z"
                                },

                            ]
                        ],

                        "output": {},
                        "rowsAffected": [
                            1
                        ]
                    }
                } else {

                    output['recordsets'][0].push(
                        {
                            "ID": "",
                            "RecordTimeStart": "",
                            "NumOrder": "",
                            "NumTank": 0,
                            "NumMode": 0,
                            "StrChemical": "END",
                            "StrLotNum": "",
                            "StrBarcode": "END",
                            "NumModeOper": 0,
                            "NumStep": 0,
                            "NumSp": "ADD",
                            "NumAct": "END",
                            "NumTemp": 0,
                            "dtDate": "2023-07-25T00:00:00.000Z"
                        },
                    )

                }
            } else if (data["PLANT"] == 'PREMIX') {

                query = `SELECT *  FROM [ScadaReport].[dbo].[PMIXProcessinfo] where NumOrder= '${PO}' order by RecordTimeStart asc`
                let db = await mssql.qurey(query);



                output = db;

                console.log(output);
                if (db['recordsets'][0].length == 0) {
                    output = {

                        "recordsets": [
                            [
                                {
                                    "ID": "",
                                    "RecordTimeStart": "",
                                    "NumOrder": "212779",
                                    "NumTank": 0,
                                    "NumMode": 0,
                                    "StrChemical": "END",
                                    "StrLotNum": "RT11",
                                    "StrBarcode": "END",
                                    "NumModeOper": 0,
                                    "NumStep": 0,
                                    "NumSp": "Lot",
                                    "NumAct": "Repack",
                                    "NumTemp": 0,
                                    "dtDate": "2023-07-25T00:00:00.000Z"
                                },

                            ]
                        ],

                        "output": {},
                        "rowsAffected": [
                            1
                        ]
                    }
                } else {

                    output['recordsets'][0].push(
                        {
                            "ID": "",
                            "RecordTimeStart": "",
                            "NumOrder": "",
                            "NumTank": 0,
                            "NumMode": 0,
                            "StrChemical": "END",
                            "StrLotNum": "",
                            "StrBarcode": "END",
                            "NumModeOper": 0,
                            "NumStep": 0,
                            "NumSp": "ADD",
                            "NumAct": "END",
                            "NumTemp": 0,
                            "dtDate": "2023-07-25T00:00:00.000Z"
                        },
                    )

                }

            } else if (data["PLANT"] == 'POWDER') {

                query = `SELECT *  FROM [ScadaReport].[dbo].[PMProcessinfo] where NumOrder= '${PO}' order by RecordTimeStart asc`
                let db = await mssql.qurey(query);

                output = db;

                if (db['recordsets'][0].length == 0) {
                    output = {

                        "recordsets": [
                            [
                                {
                                    "ID": "",
                                    "RecordTimeStart": "",
                                    "NumOrder": "212779",
                                    "NumTank": 0,
                                    "NumMode": 0,
                                    "StrChemical": "END",
                                    "StrLotNum": "RT11",
                                    "StrBarcode": "END",
                                    "NumModeOper": 0,
                                    "NumStep": 0,
                                    "NumSp": "Lot",
                                    "NumAct": "Repack",
                                    "NumTemp": 0,
                                    "dtDate": "2023-07-25T00:00:00.000Z"
                                },

                            ]
                        ],

                        "output": {},
                        "rowsAffected": [
                            1
                        ]
                    }
                } else {

                    output['recordsets'][0].push(
                        {
                            "ID": "",
                            "RecordTimeStart": "",
                            "NumOrder": "",
                            "NumTank": 0,
                            "NumMode": 0,
                            "StrChemical": "END",
                            "StrLotNum": "",
                            "StrBarcode": "END",
                            "NumModeOper": 0,
                            "NumStep": 0,
                            "NumSp": "ADD",
                            "NumAct": "END",
                            "NumTemp": 0,
                            "dtDate": "2023-07-25T00:00:00.000Z"
                        },
                    )

                }
            } else if (data["PLANT"] == 'LIQUID') {

                query = `SELECT *  FROM [ScadaReport].[dbo].[LQprocessinfo] where NumOrder= '${PO}' order by RecordTimeStart asc`
                let db = await mssql.qurey(query);

                output = db;
                if (db['recordsets'][0].length == 0) {
                    output = {

                        "recordsets": [
                            [
                                {
                                    "ID": "",
                                    "RecordTimeStart": "",
                                    "NumOrder": "212779",
                                    "NumTank": 0,
                                    "NumMode": 0,
                                    "StrChemical": "END",
                                    "StrLotNum": "RT11",
                                    "StrBarcode": "END",
                                    "NumModeOper": 0,
                                    "NumStep": 0,
                                    "NumSp": "Lot",
                                    "NumAct": "Repack",
                                    "NumTemp": 0,
                                    "dtDate": "2023-07-25T00:00:00.000Z"
                                },

                            ]
                        ],

                        "output": {},
                        "rowsAffected": [
                            1
                        ]
                    }
                } else {

                    output['recordsets'][0].push(
                        {
                            "ID": "",
                            "RecordTimeStart": "",
                            "NumOrder": "",
                            "NumTank": 0,
                            "NumMode": 0,
                            "StrChemical": "END",
                            "StrLotNum": "",
                            "StrBarcode": "END",
                            "NumModeOper": 0,
                            "NumStep": 0,
                            "NumSp": "ADD",
                            "NumAct": "END",
                            "NumTemp": 0,
                            "dtDate": "2023-07-25T00:00:00.000Z"
                        },
                    )

                }
            } else if (data["PLANT"] == 'NOXRUST') {

                query = `SELECT *  FROM [ScadaReport].[dbo].[NoxProcessinfo] where NumOrder= '${PO}' order by RecordTimeStart asc`
                let db = await mssql.qurey(query);

                output = db;
                if (db['recordsets'][0].length == 0) {
                    output = {

                        "recordsets": [
                            [
                                {
                                    "ID": "",
                                    "RecordTimeStart": "",
                                    "NumOrder": "212779",
                                    "NumTank": 0,
                                    "NumMode": 0,
                                    "StrChemical": "END",
                                    "StrLotNum": "RT11",
                                    "StrBarcode": "END",
                                    "NumModeOper": 0,
                                    "NumStep": 0,
                                    "NumSp": "Lot",
                                    "NumAct": "Repack",
                                    "NumTemp": 0,
                                    "dtDate": "2023-07-25T00:00:00.000Z"
                                },

                            ]
                        ],

                        "output": {},
                        "rowsAffected": [
                            1
                        ]
                    }
                } else {

                    output['recordsets'][0].push(
                        {
                            "ID": "",
                            "RecordTimeStart": "",
                            "NumOrder": "",
                            "NumTank": 0,
                            "NumMode": 0,
                            "StrChemical": "END",
                            "StrLotNum": "",
                            "StrBarcode": "END",
                            "NumModeOper": 0,
                            "NumStep": 0,
                            "NumSp": "ADD",
                            "NumAct": "END",
                            "NumTemp": 0,
                            "dtDate": "2023-07-25T00:00:00.000Z"
                        },
                    )

                }
            }
            //[][][][][][]


        } else {

        }

    }
    catch (err) {
        output = {};
    }



    res.json(output);
});

router.post('/RegisterPO', async (req, res) => {
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
    let day = d;
    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = '';
    if (input['wegiht'] != undefined) {
        try {

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
                "SumStatus": "IP",
                "DEP": "STAFF"
            };

            output = 'The MAT NO. Incorrect';

            if (data["PLANT"] !== "NOdata") {
                // console.log(Object.keys(data["MATDATA"]["SPEC"]))
                let INSlist = Object.keys(data["MATDATA"]["SPEC"]);
                let checklist = [];
                for (let i = 0; i < INSlist.length; i++) {

                    if (INSlist[i] === 'COLOR') {
                        checklist.push(INSlist[i]);
                        neworder['COLOR'] = {
                            "SPEC": data["MATDATA"]["SPEC"]["COLOR"],
                            "T1": "",
                            "T1St": "",
                            "T1Stc": "orange",
                            "T2": "",
                            "T2St": "",
                            "T2Stc": "orange",
                            "T3": "",
                            "T3St": "",
                            "T3Stc": "orange",
                            "AllSt": "IP",
                            "T1Stc_comment": "",
                            "T2Stc_comment": "",
                            "T3Stc_comment": "",
                        }
                    } else if (INSlist[i] === 'APPEARANCE') {
                        checklist.push(INSlist[i])
                        neworder['APPEARANCE'] = {
                            "SPEC": data["MATDATA"]["SPEC"]["APPEARANCE"],
                            "T1": "",
                            "T1St": "",
                            "T1Stc": "orange",
                            "T2": "",
                            "T2St": "",
                            "T2Stc": "orange",
                            "T3": "",
                            "T3St": "",
                            "T3Stc": "orange",
                            "AllSt": "IP",
                            "T1Stc_comment": "",
                            "T2Stc_comment": "",
                            "T3Stc_comment": "",
                        }
                    } else {
                        if ((data["MATDATA"]["SPEC"][`${INSlist[i]}`]["HI"] !== "") && (data["MATDATA"]["SPEC"][`${INSlist[i]}`]["LOW"] !== "")) {
                            checklist.push(INSlist[i])
                            neworder[`${INSlist[i]}`] = {
                                "SPEC": data["MATDATA"]["SPEC"][`${INSlist[i]}`],
                                "T1": "",
                                "T1St": "",
                                "T1Stc": "orange",
                                "T2": "",
                                "T2St": "",
                                "T2Stc": "orange",
                                "T3": "",
                                "T3St": "",
                                "T3Stc": "orange",
                                "AllSt": "IP",
                                "T1Stc_comment": "",
                                "T2Stc_comment": "",
                                "T3Stc_comment": "",
                            }
                        }
                    }
                }

                let check = await mongodb.find(`${neworder['PLANT']}dbMAIN`, 'MAIN', { "POID": neworder['POID'] });

                if (check.length === 0) {
                    console.log("<<<<<<<")
                    neworder['time'] = check.length + 1;
                    neworder['date'] = day;
                    neworder['checklist'] = checklist;
                    var ins = await mongodb.insertMany(`${neworder['PLANT']}dbMAIN`, 'MAIN', [neworder]);
                    await mssqlR.qureyRP(
                        `INSERT INTO [SOI8LOG].[dbo].[confirmweightrecore] ([order],[weight],[tank],[plant],[seq]) VALUES (@order, @weight, '', @plant, '1')`,
                        { order: input['PO'], weight: input['wegiht'], plant: data["PLANT"] }
                    );
                    output = `The order have added to PLANT:${data["PLANT"]}`;
                } else {
                    let check2 = await mongodb.find(`${neworder['PLANT']}dbMAIN`, 'MAIN', { $and: [{ "POID": neworder['POID'] }, { $or: [{ "DEP": "MANA" }, { "DEP": "STAFF" }] }] });
                    if (check2.length === 0) {
                        neworder['time'] = check.length + 1;
                        neworder['date'] = day;
                        neworder['checklist'] = checklist;
                        var ins2 = await mongodb.insertMany(`${neworder['PLANT']}dbMAIN`, 'MAIN', [neworder]);
                        await mssqlR.qureyRP(
                            `INSERT INTO [SOI8LOG].[dbo].[confirmweightrecore] ([order],[weight],[tank],[plant],[seq]) VALUES (@order, @weight, '', @plant, '1')`,
                            { order: input['PO'], weight: input['wegiht'], plant: data["PLANT"] }
                        );
                        console.log(">>>>>>>")
                        output = `The order have added to PLANT:${data["PLANT"]}`;

                    } else {
                        output = `The order have already had in DB`;
                    }

                }

            } else {

            }
        }


        catch (err) {
            console.error(err);
            output = '';
        }
    }


    res.json(output);
});

router.post('/rejectitem', async (req, res) => {
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
    let day = d;
    ///-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = { "return": 'NOK' };

    try {

        let poid = `${input['PO']}`
        let ID = `${input['ID']}`
        let plant = '';


        let PREMIX = await mongodb.find(PREMIXdbMAIN, dbinMAIN, { $and: [{ "POID": poid }, { "DEP": "STAFF" }] }); //{ "SumStatus": "IP" }, { "DEP": "STAFF" }
        if (PREMIX.length > 0) {
            plant = 'PREMIX';
        }
        let COILCOATING = await mongodb.find(COILCOATINGdbMAIN, dbinMAIN, { $and: [{ "POID": poid }, { "DEP": "STAFF" }] });
        if (COILCOATING.length > 0) {
            plant = 'COILCOATING';
        }
        let HYDROPHILIC = await mongodb.find(HYDROPHILICdbMAIN, dbinMAIN, { $and: [{ "POID": poid }, { "DEP": "STAFF" }] });
        if (HYDROPHILIC.length > 0) {
            plant = 'HYDROPHILIC';
        }
        let PLX = await mongodb.find(PLXdbMAIN, dbinMAIN, { $and: [{ "POID": poid }, { "DEP": "STAFF" }] });
        if (PLX.length > 0) {
            plant = 'PLX';
        }
        let TRITRATING = await mongodb.find(TRITRATINGdbMAIN, dbinMAIN, { $and: [{ "POID": poid }, { "DEP": "STAFF" }] });
        if (TRITRATING.length > 0) {
            plant = 'TRITRATING';
        }

        let POWDER = await mongodb.find(POWDERdbMAIN, dbinMAIN, { $and: [{ "POID": poid }, { "DEP": "STAFF" }] });
        if (POWDER.length > 0) {
            plant = 'POWDER';
        }
        let LIQUID = await mongodb.find(LIQUIDdbMAIN, dbinMAIN, { $and: [{ "POID": poid }, { "DEP": "STAFF" }] });
        if (LIQUID.length > 0) {
            plant = 'LIQUID';
        }
        let NOXRUST = await mongodb.find(NOXRUSTdbMAIN, dbinMAIN, { $and: [{ "POID": poid }, { "DEP": "STAFF" }] });
        if (NOXRUST.length > 0) {
            plant = 'NOXRUST';
        }

        console.log(plant);

        let find01 = await mongodb.find(`${plant}dbMAIN`, 'MAIN', { $and: [{ "POID": poid }] });

        let upd = await mongodb.update(`${plant}dbMAIN`, 'MAIN', { $and: [{ "POID": poid }, { $or: [{ "DEP": "MANA" }, { "DEP": "STAFF" }] }] }, { $set: { "time": find01.length, "SumStatus": "REJECT", "DEP": "REJECT", "STAFF-REJECT": ID } });

        let find = await mongodb.find(`${plant}dbMAIN`, 'MAIN', { $and: [{ "POID": poid }, { "SumStatus": "REJECT" }] });
        if (find.length > 0) {
            output = { "return": 'OK' }
        }

    }
    catch (err) {
        output = { "return": 'NOK' }
    }


    res.json(output);
});


router.post('/RegisterPOAP', async (req, res) => {
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
    let day = d;
    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = '';

    if (input['wegiht'] != undefined) {

        try {

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
                "SumStatus": "IP",
                "DEP": "STAFF"
            };

            output = 'The MAT NO. Incorrect';

            if (data["PLANT"] !== "NOdata") {
                // console.log(Object.keys(data["MATDATA"]["SPEC"]))
                let INSlist = Object.keys(data["MATDATA"]["SPEC"]);
                let checklist = [];
                for (let i = 0; i < INSlist.length; i++) {

                    if (INSlist[i] === 'COLOR') {
                        checklist.push(INSlist[i]);
                        neworder['COLOR'] = {
                            "SPEC": data["MATDATA"]["SPEC"]["COLOR"],
                            "T1": "",
                            "T1St": "",
                            "T1Stc": "orange",
                            "T2": "",
                            "T2St": "",
                            "T2Stc": "orange",
                            "T3": "",
                            "T3St": "",
                            "T3Stc": "orange",
                            "AllSt": "IP",
                            "T1Stc_comment": "",
                            "T2Stc_comment": "",
                            "T3Stc_comment": "",
                        }
                    } else if (INSlist[i] === 'APPEARANCE') {
                        checklist.push(INSlist[i])
                        neworder['APPEARANCE'] = {
                            "SPEC": data["MATDATA"]["SPEC"]["APPEARANCE"],
                            "T1": "",
                            "T1St": "",
                            "T1Stc": "orange",
                            "T2": "",
                            "T2St": "",
                            "T2Stc": "orange",
                            "T3": "",
                            "T3St": "",
                            "T3Stc": "orange",
                            "AllSt": "IP",
                            "T1Stc_comment": "",
                            "T2Stc_comment": "",
                            "T3Stc_comment": "",
                        }
                    } else {
                        if ((data["MATDATA"]["SPEC"][`${INSlist[i]}`]["HI"] !== "") && (data["MATDATA"]["SPEC"][`${INSlist[i]}`]["LOW"] !== "")) {
                            checklist.push(INSlist[i])
                            neworder[`${INSlist[i]}`] = {
                                "SPEC": data["MATDATA"]["SPEC"][`${INSlist[i]}`],
                                "T1": "",
                                "T1St": "",
                                "T1Stc": "orange",
                                "T2": "",
                                "T2St": "",
                                "T2Stc": "orange",
                                "T3": "",
                                "T3St": "",
                                "T3Stc": "orange",
                                "AllSt": "IP",
                                "T1Stc_comment": "",
                                "T2Stc_comment": "",
                                "T3Stc_comment": "",
                            }
                        }
                    }
                }

                // "PLANT": data["PLANT"],
                // "MASTERdb": data["MASTERdb"],
                // "ProductName": data["ProductName"],

                let check = await mongodb.find(`${neworder['PLANT']}dbMAIN`, 'MAIN', { "POID": neworder['POID'] });

                if (check.length === 0) {
                    console.log("<<<<<<<")
                    neworder['time'] = check.length + 1;
                    neworder['date'] = day;
                    neworder['checklist'] = checklist;
                    var ins = await mongodb.insertMany(`${neworder['PLANT']}dbMAIN`, 'MAIN', [neworder]);
                    output = `The order have added to PLANT:${data["PLANT"]}`;
                    await mssqlR.qureyRP(
                        `INSERT INTO [SOI8LOG].[dbo].[qcbypass_weight] ([POID],[COMMENT],[STATUS],[USERID],[PLANT],[ProductName]) VALUES (@poid, @comment, 'NEW', @userid, @plant, @productname)`,
                        { poid: input['PO'], comment: input['COMMENT'], userid: input['ID'], plant: data["PLANT"], productname: data["ProductName"] }
                    );
                    await mssqlR.qureyRP(
                        `INSERT INTO [SOI8LOG].[dbo].[confirmweightrecore] ([order],[weight],[tank],[plant],[seq]) VALUES (@order, @weight, '', @plant, '1')`,
                        { order: input['PO'], weight: input['wegiht'], plant: data["PLANT"] }
                    );
                } else {
                    let check2 = await mongodb.find(`${neworder['PLANT']}dbMAIN`, 'MAIN', { $and: [{ "POID": neworder['POID'] }, { $or: [{ "DEP": "MANA" }, { "DEP": "STAFF" }] }] });
                    if (check2.length === 0) {
                        neworder['time'] = check.length + 1;
                        neworder['date'] = day;
                        neworder['checklist'] = checklist;
                        var ins2 = await mongodb.insertMany(`${neworder['PLANT']}dbMAIN`, 'MAIN', [neworder]);
                        console.log(">>>>>>>")
                        output = `The order have added to PLANT:${data["PLANT"]}`;
                        await mssqlR.qureyRP(
                            `INSERT INTO [SOI8LOG].[dbo].[qcbypass_weight] ([POID],[COMMENT],[STATUS],[USERID],[PLANT],[ProductName]) VALUES (@poid, @comment, 'NEW', @userid, @plant, @productname)`,
                            { poid: input['PO'], comment: input['COMMENT'], userid: input['ID'], plant: data["PLANT"], productname: data["ProductName"] }
                        );
                        await mssqlR.qureyRP(
                            `INSERT INTO [SOI8LOG].[dbo].[confirmweightrecore] ([order],[weight],[tank],[plant],[seq]) VALUES (@order, @weight, '', @plant, '1')`,
                            { order: input['PO'], weight: input['wegiht'], plant: data["PLANT"] }
                        );

                    } else {
                        await mssqlR.qureyRP(
                            `INSERT INTO [SOI8LOG].[dbo].[qcbypass_weight] ([POID],[COMMENT],[STATUS],[USERID],[PLANT],[ProductName]) VALUES (@poid, @comment, 'HAVE', @userid, @plant, @productname)`,
                            { poid: input['PO'], comment: input['COMMENT'], userid: input['ID'], plant: data["PLANT"], productname: data["ProductName"] }
                        );
                        output = `The order have already had in DB`;
                    }

                }

            } else {

            }

        }
        catch (err) {
            console.error(err);
            output = '';
        }

    }


    res.json(output);
});



router.post('/RegisterPOAP-getplant-name', async (req, res) => {
    let d = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
    let day = d;
    //-------------------------------------
    console.log(req.body);
    let input = req.body;
    //-------------------------------------
    let output = '';

    try {

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
            "ProductName": data["ProductName"],

            // "MASTERdb": data["MASTERdb"],
            // "SumStatus": "IP",
            // "DEP": "STAFF"
        };

        output = neworder;



    }
    catch (err) {
        output = '';
    }


    res.json(output);
});
module.exports = router;