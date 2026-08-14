const express=require('express');
const router = express.Router();
const db = require('../db.js');
const auth =require('../middleware/auth.js');
const isAdmin=require('../middleware/isAdmin.js');
const upload =require('../middleware/multer.js')
const updateRoomValidation=require('../middleware/updateRoomValidation.js');
const newRoomValidation=require('../middleware/newRoomValidation.js');


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



module.exports=router