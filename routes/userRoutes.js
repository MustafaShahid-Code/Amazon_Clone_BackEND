const router = require('express').Router();
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const {check, validationResult} =require('express');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { model } = require('./../Models/Users');

const User = require('./../Models/Users');
const token_key = process.env.TOKEN_KEY;

//MiddileWare
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended:true
}));
//DefaultRoute
router.get('/',(req,res) =>{
    return res.status(200).json({
        "status":true,
        "message":"This is a Default User Route"
    })
})


module.exports=router;