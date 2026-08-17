const express=require('express');
const router=express.Router();
const db=require('../db.js');
const auth=require('../middleware/auth.js');
const isUser=require('../middleware/isUser.js');
router.get('/hotel/:hotelId/room/:roomId/available',(req,res,next)=>{
  const hotel_id=req.params.hotelId;
  const room_id=req.params.roomId;
  const check_in=req.query.checkIn;
  const check_out=req.query.checkOut;
  if(!check_in || !check_out){
        const error =new Error('date time required');
        error.status=400;
        return next(error)
      }; 
  const sqlHotel=`
    SELECT * FROM rooms
    WHERE room_id =?
    AND hotel_id=?
  `;
  db.query(sqlHotel,[room_id,hotel_id],(err,result)=>{
    if(err){
      return next(err);
    };
    if(result.length===0){
      const error = new Error('room not found');
      error.status=404;
      return next(error);
    };
  })
  const sql=`
    SELECT *
    FROM reservation
    WHERE room_id=?
    AND status IN('pending','confirmed')
    AND check_in < ?
    AND check_out > ?
  `;
  db.query(sql,[room_id,check_out,check_in],(err,result)=>{
    if(err){
      return next(err)
    };
   
    if(result.length===0){
      return res.status(200).json({
        available :true 
      })
    };
      res.status(200).json({
        available :false 
      });
    
  });
  });

router.post('/hotel/:hotelId/room/:roomId/reservation',auth,(req,res,next)=>{
  const hotel_id=req.params.hotelId;
  const room_id=req.params.roomId;
  const {
    check_in,
    check_out,
  }=req.body 

  if(!check_in || !check_out){
    const error = new Error ('date time require');
    error.status=400;
    return next(error);
  };

  if(check_in>=check_out){
    const error=new Error('check_out must be after check_in');
    error.status=400;
    return next(error);
  };


  const sqlHotel=`
  SELECT * 
  FROM rooms 
  WHERE room_id=?
  AND hotel_id=?
  `;

  db.query(sqlHotel,[room_id,hotel_id],(err,result)=>{
    if(err){
      return next(err);
    };
    if(result.length===0){
      const error =new Error('room not found');
      error.status=404;
      return next(error);
    }
  });

  const sqlAvailable=`
  SELECT res_id
  FROM reservation  
  WHERE room_id=?
  AND status IN ('pending','confirmed')
  AND check_in < ?
  AND check_out > ?
  `;
  db.query(sqlAvailable,[room_id,check_out,check_in],(err,result)=>{
    if(err){
      return next (err);
    };
    if(result.length>0){
      const error=new Error('room is not available for these dates');
      error.status=400;
      return next(error);
    };

  });

  const sql =`
  INSERT INTO reservation (user_id,room_id,check_in,check_out,status)
  VALUES (?,?,?,?,?);
  `;

  db.query(sql,[req.user.user_id,room_id,check_in,check_out,'pending'],(err,result)=>{
    if(err){
      return next(err);
    };
    res.status(201).send('room reserved successfully')
  })

});
module.exports=router;