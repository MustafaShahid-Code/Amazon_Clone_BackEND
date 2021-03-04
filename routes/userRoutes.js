// include library
const router = require("express").Router()
const bcrypt = require("bcryptjs")
const bodyParser = require("body-parser")
const { check, validationResult } = require("express-validator")
const jwt = require("jsonwebtoken")
const moment = require("moment")
const storage = require("./storage")
const verifyToken = require("../middleware/verify_token")
const User = require("./../Models/Users")
const { default: getProfilePicUpload } = require("./storage")
const token_key = process.env.TOKEN_KEY

//#region  //MiddileWare
router.use(bodyParser.json())
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
//#region  //DefaultRoute
router.get("/", (req, res) => {
  return res.status(200).json({
    status: true,
    message: "This is a Default User Route",
  })
})
//#endregion

//#region  // user register route
// Access: public
// url: http://localhost:500/api/users/register
// method: POST

router.post(
  "/register",
  [
    // check empty fields
    check("Username").not().isEmpty().trim().escape(),
    check("Password").not().isEmpty().trim().escape(),

    // check email
    check("Email").isEmail().normalizeEmail(),
  ],
  (req, res) => {
    const errors = validationResult(req)

    // check errors is not empty
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        errors: errors.array(),
      })
    }

    // check email already exists or not
    User.findOne({
      Email: req.body.Email,
    })
      .then((user) => {
        // check user
        if (user) {
          return res.status(409).json({
            status: false,
            message: "This Email is already Taken!",
          })
        } else {
          // hash user password
          const salt = bcrypt.genSaltSync(10)
          const hashedPasssword = bcrypt.hashSync(req.body.Password, salt)

          // create user object from user model
          const newUser = new User({
            Email: req.body.Email,
            Username: req.body.Username,
            Password: hashedPasssword,
          })

          // insert new user
          newUser
            .save()
            .then((result) => {
              return res.status(200).json({
                status: true,
                user: result,
              })
            })
            .catch((error) => {
              return res.status(502).json({
                status: false,
                error: error,
              })
            })
        }
      })
      .catch((error) => {
        return res.status(502).json({
          status: false,
          error: error,
        })
      })
  }
)
// user register route
// Access: public
// url: http://localhost:500/api/users/UploadProfilePic
// method: POST

router.post("/uploadProfilePic", (req, res) => {
  let upload = storage.getProfilePicUpload()
  upload(req, res, (error) => {
    console.log(req.file)
    if (error) {
      return res.status(400).json({
        status: false,
        error: error,
        message: "Failed to Upload Profile Pic",
      })
    } else {
      return res.status(200).json({
        status: true,
        error: error,
        message: "File Uploaded Successfullyy..!!",
      })
    }
  })
})
//#endregion

//#region // user Login Route
// Access: public
// url: http://localhost:500/api/users/login
// method: POST

router.post(
  "/login",
  [
    // check empty fields
    check("Password").not().isEmpty().trim().escape(),

    // check email
    check("Email").isEmail().normalizeEmail(),
  ],
  (req, res) => {
    const errors = validationResult(req)

    // check errors is not empty
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        errors: errors.array(),
        message: "Form validation error...",
      })
    }

    User.findOne({ Email: req.body.Email })
      .then((user) => {
        // if user dont exist
        if (!user) {
          return res.status(404).json({
            status: false,
            message: "User don't exists",
          })
        } else {
          // match user password
          let isPasswordMatch = bcrypt.compareSync(
            req.body.Password,
            user.Password
          )

          // check is not password match
          if (!isPasswordMatch) {
            return res.status(401).json({
              status: false,
              message: "Password don't match...",
            })
          }

          // JSON Web Token Generate
          let token = jwt.sign(
            {
              id: user._id,
              email: user.Email,
            },
            token_key,
            {
              expiresIn: 3600,
            }
          )

          // if login success
          return res.status(200).json({
            status: true,
            message: "User login success",
            token: token,
            user: user,
          })
        }
      })
      .catch((error) => {
        return res.status(502).json({
          status: false,
          message: "Database error...",
        })
      })
  }
)

//#endregion

// router.get("/testJWT", verifyToken, (req, res) => {
//   console.log(req.user)
//   return res.status(200).json({
//     status: true,
//     message: "JWT Tokens are working.",
//   })
// })

module.exports = router
