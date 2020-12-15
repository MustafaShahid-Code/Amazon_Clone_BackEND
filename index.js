require ('dotenv').config();

const express = require('express');
const app =express();
const cors =require('cors');
const morgan=require('morgan');
const port=process.env.PORT;
const databse = require('./database')


//UserRoutes
const UserRoutes = require('./routes/userRoutes');

//MiddleWare
app.use(cors());
app.use(morgan('dev'));
app.use("/api/users", UserRoutes);






//ServerStart

app.listen(port, ()=> {

    console.log("Server is Running on "+port);
})