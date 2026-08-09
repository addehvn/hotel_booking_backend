const express = require('express');
const router = express.Router();
const db = require('../db.js');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const isAdmin =require('../middleware/isAdmin.js');
const auth = require('../middleware/auth.js');
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

router.get('/me/:id',auth,isAdmin,async(req,res,next)=>{

const user_id=req.params.id;

const sql =`
SELECT * FROM users 
WHERE user_id=?
`
db.query(sql,[user_id],(err,result)=>{
if(err){
  return next(err);
};
if(result.length===0){
  const error= new Error('user not found');
  error.status=404;
  return next(error);
};
res.status(200).send(result);
});

});

router.patch('/update/:id',auth,isAdmin,async(req,res,next)=>{
  const user_id=Number(req.params.id);

  if(req.body.password){
     req.body.password=await bcrypt.hash(req.body.password,10)
  }

  const allowedColumns=[
    'first_name',
    'last_name',
    'email',
    'password',
    'phone_number'
  ];


  const notAllowedColumns=[
  'user_id',
  'role',
  'created_at',
  'updated_at'
  ]


  for(const key of notAllowedColumns){
    if(req.body[key]!==undefined){
      const error=new Error("you cant update this section");
      error.status=403;
      return next(error);
    };
  };



  const updates=[];
  const values =[];

  for(const fields of allowedColumns){
    if(req.body[fields]!== undefined){
    updates.push(`${fields}=?`);
    values.push(req.body[fields]);}

  }
  values.push(user_id);
  

  const sql=`
  UPDATE  users
   SET ${updates.join(' , ')} , updated_at=NOW()
   WHERE user_id=?
  `;

  db.query(sql,values,(err,result)=>{
    if(err){
      return next(err);
    };

    if(result.affectedRows===0){
      const error = new Error ('user not found');
      error.status=404;
      return next(error);
    };
    res.status(200).send('user updated successfully');
  });

})


module.exports=router