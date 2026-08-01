const express = require ('express');
const mysql = require('mysql2');

const db = mysql.createConnection({
  host:"127.0.0.1",
  user:"root",
  password:"Adde1928",
  database:"hotel_bookingdb",
});

db.connect((err , result)=>{
  if(err){
    throw err 
  }
  console.log("database connected ")

})

module.exports=db;