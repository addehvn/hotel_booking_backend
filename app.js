const express = require('express');
const app =express();
const db =require('./db.js');
require('dotenv').config();
app.use(express.json());
app.use(express.urlencoded({extended:true}))
const errorHandler=require('./middleware/ErrorHanddler.js')

app.use(errorHandler);

module.exports = app 