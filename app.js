const express = require('express');
const app =express();
const db =require('./db.js');
require('dotenv').config();
const errorHandler=require('./middleware/ErrorHanddler.js');
const user=require('./routes/users.js');
const hotel= require('./routes/hotel.js');
const room = require('./routes/rooms.js');
const reservation=require('./routes/reservation.js');
const admin= require('./routes/admin.js');
app.use(express.json());
app.use(express.urlencoded({extended:true}));



app.use('/user',user);

app.use('/hotel',hotel);

app.use('/room',room);

app.use('/reservation',reservation);

app.use('/admin',admin);

app.use(errorHandler);

module.exports = app 