const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');
require('dotenv').config();
const db=require('../db.js');

router.get('/allHotels',(req,res,next)=>{
const search = req.query.search

let sql=`
  SELECT *
  FROM hotels
  WHERE 1=1 
`;

const values=[]
if(search){
  sql+=`AND hotel_name LIKE ? `
  values.push(`%${search}%`)
};


db.query(sql,values,(err,result)=>{
  if(err){
    return next(err)
  };

  res.status(200).json({
    message:'all Hotels',
    json : result 
  });
});
}) 
module.exports=router;