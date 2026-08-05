const express = require ('express');
const router=express.Router();
const db= require ('../db.js');
const SignupValidation= require('../middleware/SingupValidation.js');
const loginValidation = require('../middleware/loginValidation.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth.js');
const updateUserValidation=require('../middleware/updateUserValidation.js');
const isUser=require('../middleware/isUser.js');
require('dotenv').config();

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

  if(!first_name || !last_name || !email || !phone_number){
          const error=new Error('all fields are required');
          error.status=400;
          return next(error);
      };

      
    db.query(sql,[first_name,last_name,email,hashedPassword,phone_number],(err,result)=>{
      if(err){
          if(err.code==='ER_DUP_ENTRY'){
         const error=new Error('user already exists');
         error.status=409;
         return next(error);
      };
        return next(err)
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

router.patch('/update/:id',auth,isUser,updateUserValidation,async (req,res,next)=>{

  const user_id=Number(req.params.id)

  const allowedColumns=[
    'first_name',
    'last_name',
    'email',
    'password',
    'phone_number'
  ];


  const notAllowedColumns=[
    'role',
    'created_at',
    'updated_at',
    'user_id',
  ]



  if(req.body.password){
    req.body.password=await bcrypt.hash(req.body.password,10)
  }

  const fields=[];
  const values = [];


  for(key of allowedColumns){
    if(req.body[key]!== undefined){
    fields.push(`${key}=?`)
    values.push(req.body[key])
    }

  }
  values.push(user_id)
  
  for( key of notAllowedColumns){
    if( req.body[key] !== undefined){
      const error = new Error('you cant update this section');
      error.status=403;
      return next(error);
    }
  }


  
  const sql=`
      UPDATE users 
        SET ${fields.join(', ')} , updated_at = NOW()
        WHERE user_id=?`;


    db.query(sql,values,(err,result)=>{
      if(err){
        return next (err)
      };
      
      if(result.affectedRows===0){
        const error=new Error('user not found');
        error.status=404;
        return next(error);
      };

      res.status(200).send('account update successfully');
    });
});


router.delete('/delete/:id',auth,isUser,(req,res,next)=>{ 
  const user_id=Number(req.params.id);

  const sql=`
    DELETE from users
    WHERE user_id=?;
  `;

  db.query(sql,[user_id],(err,result)=>{
    if(err){
      return next(err);
    };
    
    if(result.affectedRows==0){
      const error=new Error ('user not found');
      error.status=404;
      return next(error);
    };

    res.status(200).send('user deleted successfully');
  });
  
});




module.exports=router