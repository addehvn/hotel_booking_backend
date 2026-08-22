const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');
require('dotenv').config();
const db=require('../db.js');
const isAdmin=require('../middleware/isAdmin.js');

router.get('/allHotels',(req,res,next)=>{
const search = req.query.search
const sort=req.query.sort



let sql=`
  SELECT hotel_name,description,location,created_at
  FROM hotels
  WHERE 1=1 
`;


const values=[]
if(search){
  sql+=`AND hotel_name LIKE ? `
  values.push(`%${search}%`)
};


if(sort==='A-Z'){
  sql += `
  ORDER BY hotel_name ASC 
  `;
  values.push(sort);
};

if(sort==='Z-A'){
  sql +=`
  ORDER BY hotel_name DSC 
  `
}

db.query(sql,values,(err,result)=>{
  if(err){
    return next(err)
  };

  if(result.length===0){
      const error = new Error('hotel not found')
      error.status=404;
      return next(error);
    }
  res.status(200).json({
    message:'all Hotels',
    json : result 
  });
});
});

router.get('/:id',(req,res,next)=>{
  const hotel_id=req.params.id;
  
  const sql= `
  SELECT hotel_name,description,location,created_at
  FROM hotels 
  WHERE hotel_id=?
  `;

  db.query(sql,[hotel_id],(err,result)=>{

    if(err){
      return next(err);
    };

    if(result.length===0){
      const error = new Error('hotel does not exists');
      error.status=404;
      return next(error);
    };

    res.status(200).json(result);
  })
});


module.exports=router;
