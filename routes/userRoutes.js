// include library
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const User = require('./../Models/Users');
const token_key = process.env.TOKEN_KEY;

//#region  //MiddileWare
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
});
//#endregion


router.post(
    '/register',
    [
      // check empty fields
      check('username').not().isEmpty().trim().escape(),
      check('password').not().isEmpty().trim().escape(),
  
      // check email
      check('email').isEmail().normalizeEmail()
    ],
    (req, res) => {
      const errors = validationResult(req);
  
      // check errors is not empty
      if(!errors.isEmpty()){
        return res.status(400).json({
          "status": false,
          "errors": errors.array()
        });
      }
      const salt =bcrypt.genSaltSync(10)
      const hashedPassword = bcrypt.hashSync(req.body.password,salt)
        return res.status(200).json({
        "status": true,
        "data": req.body,
        "hashedPassword":hashedPassword
      });
    }
  );

module.exports=router;