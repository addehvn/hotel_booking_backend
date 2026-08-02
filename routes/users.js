const express = require ('express');
const router=express.Router();
const db= require ('../db.js');
const SignupValidation= require('../middleware/SingupValidation.js');
const bcrypt = require('bcrypt');

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

module.exports=router