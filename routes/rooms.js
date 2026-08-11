const express=require('express');
const router = express.Router();
const db = require('../db.js');
const auth =require('../middleware/auth.js');
const isAdmin=require('../middleware/isAdmin.js');

router.get('/hotel/:hotelId/allRooms',(req,res,next)=>{
  const hotel_id=req.params.hotelId
  
  const sql=`
  SELECT  
    room_type,
    price,
    capacity,
    image
  FROM rooms
  WHERE hotel_id=?
  `;

  db.query(sql,[hotel_id],(err,result)=>{
    if(err){
      return next(err);
    };

    if(result.length===0){
      const error = new Error("hotel doesn't  exists or doesn't have free rooms");
      error.status=404;
      return next(error);
    };
    res.status(200).send(result);
  });
});

router.get('/hotel/:hotelId/room/:roomId',(req,res,next)=>{
  const hotel_id=req.params.hotelId;
  const room_id=req.params.roomId;

  const sql=`
  SELECT 
    room_type,
    price,
    capacity,
    image 
  FROM rooms 
  WHERE hotel_id=?AND room_id=?;
  `;

  db.query(sql,[hotel_id,room_id],(err,result)=>{
    if(err){
      return next(err);
    };
    if(result.length===0){
      const error = new Error("hotel doesn't  exists or doesn't have free rooms");
      error.status=404;
      return next(error);
    };
    res.status(200).send(result);
  });

});

router.patch('/update/hotel/:hotelId/room/:roomId',auth,isAdmin,(req,res,next)=>{
  const hotel_id=Number(req.params.hotelId);
  const room_id=Number(req.params.roomId);

  const allowedColumns=[
    'room_number',
    'room_type',
    'price',
    'capacity',
    'image' 
  ];

  const notAllowedColumns=[
    'room_id',
    'hotel_id',
    'created_at',
    'updated_at',
  ];

  const updates=[];
  const values =[];
  
  

 
  for(const key of notAllowedColumns){
    if(req.body[key]!==undefined){
      const error=new Error("you're not allowed to change this column");
      error.status=403;
      return next(error);
    }
  };

  for(const key of allowedColumns){
    if(req.body[key]!==undefined){
      updates.push(`${key}=?`);
      values.push(req.body[key]);
    }};
    
     
    if(updates.length===0){
    const error = new Error('no fields to update');
    error.status=400;
    return next(error);
  };
    values.push(hotel_id);
    values.push(room_id);
    
    
    const sql=`
    UPDATE rooms 
    SET ${updates.join(', ')} , updated_at=NOW()
    WHERE hotel_id=? AND room_id=?;
    `;

    db.query(sql,values,(err,result)=>{
      if(err){
        return next(err);
      };

      if(result.affectedRows===0){
        const error=new Error("hotel doesn't  exists");
        error.status=404;
        return next(error);
      };
      
      res.status(200).send('room updated successfully');    
    })

  
});


module.exports=router