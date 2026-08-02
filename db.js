const express = require ('express');
const mysql = require('mysql2');
require('dotenv').config()
const db = mysql.createConnection({
  host:process.env.host,
  user:process.env.user,
  password:process.env.password,
  database:process.env.database,
});              

db.connect((err , result)=>{
  if(err){
    throw err 
  }
  console.log("database connected ")

})

module.exports=db;