const express = require ('express');
const router=express.Router();
const db= require ('../db.js');
const SignupValidation= require('../middleware/SingupValidation.js');
const loginValidation = require('../middleware/loginValidation.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()

router.post('/signup',SignupValidation,async (req,res,next)=>{
  const {
    first_name,
    last_name,
    email,
    password,
    phone_number
  }= req.body
 



  const sql=`
    INSERT INTO users (first_name,last_name,email,password,phone_number)

    VALUES(?,?,?,?,?);`;

  const hashedPassword=await bcrypt.hash(password,10)

    db.query(sql,[first_name,last_name,email,hashedPassword,phone_number],(err,result)=>{
      if(err){
          if(err.code==='ER_DUP_ENTRY'){
         const error=new Error('user already exists');
         error.status=409;
         return next(error);
      };
        return next(err)
      };
      

      if(!first_name || !last_name || !email || !phone_number){
          const error=new Error('all fields are required');
          error.status=400;
          return next(error);
      };

      res.status(201).send('Account created successfully!');

    });

});


router.post('/login',loginValidation,async(req,res,next)=>{

  const {
    email,
    password
  }=req.body

  
  const sql=`SELECT * 
      FROM users
      WHERE email = ?`

  db.query(sql,[email],async(err,result)=>{
    if(err){
      console.log(err)
      return next(err);
    };

    
  if(result.length===0){
    const error= new Error('email or passwod is incorrect');
    error.status=401
    return next(error);
  };

  const user=result[0];

  const checkPassword= await bcrypt.compare(password,user.password)

    if(!checkPassword){
      const error = new Error('email or passwod is incorrect');
      error.status=401;
      return next(error);
    }
    const token=jwt.sign({
        email:user.email,
        user_id:user.user_id
    },
    process.env.JWT_PASSWORD,
    {
      expiresIn:'1h'
    }
  );

  res.status(200).json({
    message:'Account logged in successfully ',
    token:token
  });
  });
});





module.exports=router