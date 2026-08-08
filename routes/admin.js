const express = require('express');
const router = express.Router();
const db = require('../db.js');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const isAdmin =require('../middleware/isAdmin.js')
require('dotenv').config()

router.post('/login',async(req,res,next)=>{
  const {
    email,
    password
  }=req.body;
  
  

  const sql=`
   SELECT * FROM users
   WHERE email=?
  `;

  db.query(sql,[email],async(err,result)=>{
    if(err){
      return next(err);
    };


    const user=result[0]
  const token = jwt.sign({
    email:user.email,
    user_id:user.user_id,
    role:user.role
  },
  process.env.JWT_PASSWORD,
{
  expiresIn:'1h'
}
);

    if(result.length===0){
      const error=new Error('user not found');
      error.status=404;
      return next(error);
    };
  

    const isPassword=await bcrypt.compare(password ,user.password);


    if(!isPassword){
    const error = new Error('email or password is wrong');
    error.status=400
    return next(error);
  };

    res.status(200).json({
      message:'account loged in successfully',
      json:token 
    });
  });
});


module.exports=router