const jwt = require("jsonwebtoken")
const { use } = require("../routes/userRoutes")
const token_key = process.env.token_key
const User = require("./../Models/Users")

const verifyToken = (req, res, next) => {
  //read JWT from HTTP Header
  const token = req.headers["x-access-token"]

  //Check tokn is empty
  if (!token) {
    return res.status(404).json({
      status: false,
      message: "JWT Not Found..",
    })
  }
  jwt.verify(token, token_key, function (error, decoded) {
    //Check Error
    if (error) {
      return res.status(401).json({
        status: false,
        message: "JWT Does not decoded...",
        error: error,
      })
    } else {
      //Check User Exists or not in the Database
      User.findById(decoded.id, {
        Password: 0,
        CreatedAt: 0,
        UpdatedAt: 0,
        profile_pic: 0,
      })
        .then((user) => {
          //Check user is empty
          if (!user) {
            return res.status(401).json({
              status: false,
              message: "User not exists..",
            })
          } else {
            //Set User Object in Request Object
            req.user = {
              id: user._id,
              Email: user.Username,
              Username: user.Username,
            }
            return next()
          }
        })
        .catch((error) => {
          return res.status(401).json({
            status: false,
            message: "Database Error",
            error: error,
          })
        })
    }
  })
}
module.exports = verifyToken
