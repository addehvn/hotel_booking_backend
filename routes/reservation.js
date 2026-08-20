const express=require('express');
const router=express.Router();
const db=require('../db.js');
const auth=require('../middleware/auth.js');
const isUser=require('../middleware/isUser.js');
router.get('/hotel/:hotelId/room/:roomId/available',auth,(req,res,next)=>{
  const hotel_id=req.params.hotelId;
  const room_id=req.params.roomId;
  const check_in=req.query.checkIn;
  const check_out=req.query.checkOut;
  if(!check_in || !check_out){
        const error =new Error('date time required');
        error.status=400;
        return next(error)
      }; 

      if(check_in>=check_out){
    const error=new Error('check_out must be after check_in');
    error.status=400;
    return next(error);
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

router.get('/reservationList/:id',auth,isUser,(req,res,next)=>{
  const user_id=Number(req.params.id);

  const sql=`
  SELECT  rm.room_type,r.check_in,r.check_out
  FROM reservation r
  JOIN rooms rm
  ON rm.room_id=r.room_id 
  WHERE user_id=?
  `;

  db.query(sql,[user_id],(err,result)=>{
    if(err){
      return next(err)
    };
    if(result.length===0){
    const error= new Error('there is no reservation');
    error.status=401;
    return next(error);
    };
    res.status(200).send(result);
  });
});

router.get('/reservationList/:resId/detail',auth,isUser,(req,res,next)=>{
  const res_id=req.params.resId;
  const sql=`
    SELECT rm.room_number,
      rm.room_type,
      rm.price,
      rm.image,
      r.check_in,
      r.check_out  
    FROM reservation r  
    JOIN rooms rm
    ON rm.room_id=r.room_id
    WHERE r.res_id=?
    AND r.user_id=?
    `;

    db.query(sql,[res_id,req.user.user_id],(err,result)=>{
      if(err){
        return next(err);
      };
      res.status(200).send(result);
    });
});

router.patch('/reservationList/:resId/cancel',auth,isUser,(req,res,next)=>{
  const res_id=req.params.resId;
  
  const sql = `
    UPDATE reservation
    SET status='cancel'
    WHERE res_id=?
    AND user_id=?
  `;

  db.query(sql,[res_id,req.user.user_id],(err,result)=>{
    if(err){
      return next(err);
    };
    if(result.affectedRows===0){
      const error = new Error('reservation does not exists');
      error.status=404;
      return next(error);
    };
    res.status(200).send('reservation cancelled successfully');
  });
});


module.exports=router;
