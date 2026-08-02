const express = require('express');
const app =express();
const db =require('./db.js');
require('dotenv').config();
const errorHandler=require('./middleware/ErrorHanddler.js');
const user=require('./routes/users.js');
app.use(express.json());
app.use(express.urlencoded({extended:true}));



app.use('/user',user)


app.use(errorHandler);

module.exports = app 