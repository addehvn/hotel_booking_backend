const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');
require('dotenv').config();
const db=require('../db.js');
const newHotelValidation=require('../middleware/newHotelValidation.js');
const updateHotelValidation=require('../middleware/updateHotelValidation.js')


router.get('/allHotels',auth,(req,res,next)=>{
const search = req.query.search

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


db.query(sql,values,(err,result)=>{
  if(err){
    return next(err)
  };

  if(result.length===0){
      const error = new Error('hotel did not found')
      error.status=404;
      return next(error);
    }
  res.status(200).json({
    message:'all Hotels',
    json : result 
  });
});
});

router.get('/:id',auth,(req,res,next)=>{
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
      const error= new Error('hotel did not found')
      error.status=404;
      return next(error);
    };

    res.status(200).json(result);
  })
});

router.post('/newHotel',newHotelValidation,auth,(req,res,next)=>{
  const {
    hotel_name,
    description,
    location,
  }=req.body;
const sql=`
  INSERT INTO hotels( 
    hotel_name,
    description,
    location)

    VALUES (?,?,?);
`;
db.query(sql,[hotel_name,description,location],(err,result)=>{
  if(err){
    return next(err);
  };

  
   res.status(201).json({
    message: 'hotel created successfully',
    json:result
   });
});
});

router.patch('/update/:id',updateHotelValidation,auth,(req,res,next)=>{

  const id=req.params.id

  const allowedColumn =[
    'hotel_name',
    'description',
    'location'
];


  const notAllowedColumn=[
    'hotel_id',
    'created_at',
    'updated_at'
  ];

  const update =[];
  const values =[];

  for(const key of notAllowedColumn){
    if(req.body[key]!==undefined){
        const error =new Error("you're not allowed to edit this section");
        error.status=401;
        return next(error);
    }
  }
 
  for(const fields of allowedColumn){
    update.push(`${fields}=?`);
    values.push(req.body[fields]);
  };
  values.push(id);
 
  console.log(update)
  console.log(values);

  const sql=`
  UPDATE hotels
  SET ${update.join(' , ')} and updated_at= NOW()
  WHERE  hotel_id = ?
  `;

  db.query(sql,values,(err,result)=>{
    if(err){
      return next(err)
    };

    if(result.affectedRows===0){
      const error = new Error('hotel did not found');
      error.status=404;
      return next(error);
    };

    res.status(200).send('updated successfully')
  });
});

router.delete('/delete/:id',auth,(req,res,next)=>{
 
 const hotel_id=Number(req.params.id)
  const sql=`
  DELETE  from hotels 
  WHERE hotel_id=?
 `;
 db.query(sql,[hotel_id],(err,result)=>{
  if(err){
    return next(err);
  };
 if (result.affectedRows===0){
    const error=new Error ('user not found');
    error.statusCode=403;
    return next (error);
 };
  res.status(201).send('account deleted successfully');
 });
});



module.exports=router;