const moment = require('moment');
const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({

    Username:{
        type:String,
        required: true
    },
    Email:{
        type:String,
        required:true
        // unique:true
    },
    Password:{
        type:String,
        required:true
    },
    Profile_Pic:{
        type:String,
        default:"empty-avatar.jpg"
    },
    CreatedAt:{
        type:String,
        default: moment().format("DD/MM/YYYY") + ";"+ moment().format("hh:mm:ss")
    },
    UpdatedAt:{
        type:String,
        default: moment().format("DD/MM/YYYY") + ";"+ moment().format("hh:mm:ss")
    }
})

//CreateUserModel

mongoose.model("users",UserSchema);

//ExportUserModel
module.exports=mongoose.model("users")

