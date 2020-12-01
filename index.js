require ('dotenv').config();

const express = require('express');
const app =express();
const cors =require('cors');
const morgan=require('morgan');
const port=process.env.PORT;


//MiddleWare
app.use(cors());
app.use(morgan());



//ROUTES
app.get('/',(req,res) =>{

    res.status(200).json(
        {
         message:"Yuppie it's Working..!!!!"   
        })
})

//ServerStart

app.listen(port, ()=> {

    console.log("Server is Running on "+port);
})