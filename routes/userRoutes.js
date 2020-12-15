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
  extended: true
}));
//DefaultRoute
router.get('/', (req, res) => {
  return res.status(200).json({
    "status": true,
    "message": "This is a Default User Route"
  })
});
//#endregion

 //#region // RegisterUserMethod
// router.post(
//   '/register',
//   [
//     // check empty fields
//     check('Username').not().isEmpty().trim().escape(),
//     check('Password').not().isEmpty().trim().escape(),

//     // check email
//     check('Email').isEmail().normalizeEmail()
//   ],
//   (req, res) => {
//     const errors = validationResult(req);

//     // check errors is not empty
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         "status": false,
//         "errors": errors.array()
//       });
//     }

//   //   //CheckingTheEMAIL
//     User.findOne({ Email: req.body.Email }).then((user) => {
//       if (user) {
//         return res.status(409).json({
//           "status": false,
//           message: "This Email is already taken.."
//         });
//       }
//       else {

//         //PassswordIsHashingNOW
//         const salt = bcrypt.genSaltSync(10)
//         const hashedPassword = bcrypt.hashSync(req.body.Password, salt)

//         const newUser = new User({
//           Username: req.body.Username,
//           Email: req.body.Email,
//           Password: req.body.hashedPassword
//         });
//         newUser.save(User).then((result) => {
//           return res.status(200).json({
//             "status": true,
//             message: "User Registered Successfully..!!",
//             "userData": result
//           });
//         }).catch((error) => {
//           return res.status(502).json({
//             "status": false,
//             "error": error
//           });
//         })
//       }
//     }).catch((error) => {
//       return res.status(502).json({
//         "status": false,
//         "error": error
//       });
//     })

//    }
// );
 //#endregion

// user register route
// Access: public
// url: http://localhost:500/api/users/register
// method: POST
router.post(
  '/register',
  [
    // check empty fields
    check('Username').not().isEmpty().trim().escape(),
    check('Password').not().isEmpty().trim().escape(),

    // check email
    check('Email').isEmail().normalizeEmail()
  ],
  (req, res) => {
    const errors = validationResult(req);

    // check errors is not empty
    if (!errors.isEmpty()) {
      return res.status(400).json({
        "status": false,
        "errors": errors.array()
      });
    }

    // check email already exists or not
    User.findOne({ Email: req.body.Email }).then(user => {
      
      // check user
      if (user) {

        return res.status(409).json({
          "status": false,
          "message": "This Email is already Taken!"
        });

      } else {

        // hash user password
        const salt = bcrypt.genSaltSync(10)
        const hashedPasssword = bcrypt.hashSync(req.body.Password, salt);

        // create user object from user model
        const newUser = new User({
          Email: req.body.Email,
          Username: req.body.Username,
          Password: hashedPasssword
        });

        // insert new user
        newUser.save().then(result => {

          return res.status(200).json({
            "status": true,
            "user": result
          });

        }).catch(error => {

          return res.status(502).json({
            "status": false,
            "error": error
          });

        });
      }
    }).catch(error => {
      return res.status(502).json({
        "status": false,
        "error": error
      });
    });

  }
);


module.exports = router;