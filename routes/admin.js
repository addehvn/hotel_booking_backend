const express = require('express');
const router = express.Router();
const db = require('../db.js');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const upload=require('../middleware/multer.js');
const isAdmin =require('../middleware/isAdmin.js');
const auth = require('../middleware/auth.js');
const updateUserValidation= require('../middleware/updateUserValidation.js');
const updateHotelValidation= require('../middleware/updateHotelValidation.js');
const newHotelValidation=require('../middleware/newHotelValidation.js');
const newRoomValidation=require('../middleware/newRoomValidation.js');
const updateRoomValidation=require('../middleware/updateRoomValidation.js');
require('dotenv').config();




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

});




router.get('/allUsers',auth,isAdmin,(req,res,next)=>{
  
  const search = req.query.search;
  
  let sql=`
  SELECT * FROM users 
  WHERE 1=1
  `;

  if(search){
    sql+=`
    AND first_name like ?
    `;
  };

  db.query(sql,[search],(err,result)=>{
    if(err){
      return next(err);
    };

    if(result.length===0){
      const error = new Error('user doesnt exists');
      error.status=404;
      return next(error);
    };
    res.status(200).send(result);
  });
});

router.get('/user/:id',auth,isAdmin,(req,res,next)=>{
 
  const user_id=req.params.id;

  const sql=`
  SELECT * 
  FROM users
  WHERE user_id =?;
  `;


  db.query(sql,[user_id],(err,result)=>{
    if(err){
      return next(err);
    };

    if(result.length===0){
      const error = new Error('user doesnt exist');
      error.status=404;
      return next(error);
    };
    res.status(200).send(result);
  });
});

router.patch('/user/update/:id',auth,isAdmin,updateUserValidation,async(req,res,next)=>{
  const user_id=req.params.id;

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
  ];


  const updates=[];
  const values =[];

  for(key of notAllowedColumns){
    if(req.body[key] !== undefined){
      const error = new Error("you're not allowed to update this column");
      error.status=403;
      return next(error);
    };
  };

  if(req.body.password){
     req.body.password=await bcrypt.hash(req.body.password,10)
  };


  for (key of allowedColumns){
    if(req.body[key]!==undefined){
      updates.push(`${key}=?`)
      values.push(req.body[key])
    };
  };
  values.push(user_id);

  const sql=`
  UPDATE users
    SET ${updates.join(', ')}, updated_at=NOW()
    WHERE user_id=?
  `


  db.query(sql,values,(err,result)=>{
    if(err){
      return next(err);
    };
    if(result.affectedRows===0){
      const error = new Error('user  not found')
    }
    res.status(200).send('user updated successfully')
  });
});




router.get('/allHotels',auth,isAdmin,(req,res,next)=>{
  const search = req.query.search;

  let sql = `
  SELECT * FROM hotels
  WHERE 1=1
  `;

  if(search){
    sql +=`
    AND hotel_name LIKE ?
    `;
  };

  db.query(sql,[search],(err,result)=>{
    if(err){
      return next(err);
    };

    if(result.length===0){
      const error = new Error('hotel  not find');
      error.status=404;
      return next(error);
    };
    res.status(200).send(result);
  });


});

router.get('/hotel/:id',auth,isAdmin,(req,res,next)=>{
  const hotel_id=req.params.id;

  const sql = `
  SELECT * 
  FROM hotels 
  WHERE hotel_id=?
  `;


  db.query(sql,[hotel_id],(err,result)=>{
    if(err){
      return next (err);
    };

    if(result.length===0){
      const error = new Error('hotel  not find');
      error.status=404;
      return next(error);
    };
    res.status(200).send(result);
  });
});

router.post('/hotel/newHotel',auth,isAdmin,newHotelValidation,(req,res,next)=>{
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

router.patch('/hotel/update/:id',auth,isAdmin,updateHotelValidation,(req,res,next)=>{

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
    if(req.body[fields]){
    update.push(`${fields}=?`);
    values.push(req.body[fields]);
    }
  };
  values.push(id);
 
  console.log(update)
  console.log(values);

  const sql=`
  UPDATE hotels
  SET ${update.join(' , ')} , updated_at= NOW()
  WHERE  hotel_id = ?
  `;

  db.query(sql,values,(err,result)=>{
    if(err){
      return next(err)
    };

    if(result.affectedRows===0){
      const error = new Error('hotel  not found');
      error.status=404;
      return next(error);
    };

    res.status(200).send('updated successfully')
  });
});

router.delete('/hotel/delete/:id',auth,isAdmin,(req,res,next)=>{
 
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
    error.status=403;
    return next (error);
 };
  res.status(201).send('account deleted successfully');
 });
});




router.patch('/update/hotel/:hotelId/room/:roomId',auth,isAdmin,upload.single('image'),updateRoomValidation,(req,res,next)=>{

  const hotel_id=Number(req.params.hotelId);
  const room_id=Number(req.params.roomId);

  const allowedColumns=[
    'room_number',
    'room_type',
    'price',
    'capacity',
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
    if(req.body[key]!==undefined ){
      const error=new Error("you're not allowed to change this column");
      error.status=403;
      return next(error);
    }
  };

  for(const key of allowedColumns){
    if(req.body[key]!==undefined ){
      updates.push(`${key}=?`);
      values.push(req.body[key]);
    }};
    
    if(req.file){
      updates.push('image=?');
      values.push(req.file.filename);
    };
     
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

router.post('/hotel/:hotelId/newRoom',auth,isAdmin,upload.single('image'),newRoomValidation,(req,res,next)=>{

  const hotel_id=req.params.hotelId;
  const {
      room_type,
      room_number,
      price,
      capacity
    }=req.body;

    const image=req.file?req.file.filename:null;
  const sql=`
  INSERT INTO rooms (
      hotel_id,
      room_number,
      room_type,
      price,
      capacity,
      image
      )
    VALUES(?,?,?,?,?,?) 
  `;

  db.query(sql,[hotel_id,room_number,room_type,price,capacity,image],(err,result)=>{
    if(err){
      return next(err);
    };
    res.status(201).send('room created succuessfully');
  });
});

router.delete('/hotel/:hotelId/deleteRoom/:roomId',auth,isAdmin,(req,res,next)=>{
  const hotel_id=req.params.hotelId;
  const room_id=req.params.roomId;


  const sql =`
  DELETE FROM rooms 
  WHERE hotel_id=? AND room_id=? 
  `;

  db.query(sql,[hotel_id,room_id],(err,result)=>{

    if(err){
      return  next(err)
    };

    if(result.affectedRows===0){
      const error = new Error('room not found ');
      error.status=404;
      return next(error);
    };

    res.status(200).send('room deleted successfully');
  });


});




router.get('/reservation/list',auth,isAdmin,(req,res,next)=>{
  const filter=req.query.filter;
  
  let  sql=`
    SELECT * 
    FROM reservation r
    JOIN rooms rm
    ON rm.room_id=r.room_id 
    WHERE 1=1
  `;

  if(filter){
    sql += `
    AND rm.room_type LIKE ?
    `
  }
  db.query(sql,`%${filter}%`,(err,result)=>{
    if(err){
      return next(err);
    };
    if(result.length===0){
      const error =new Error('there is no reservation');
      error.status=404;
      return next(error);
    };
    res.status(200).send(result);
  });
});

router.get('/reservation/list/:id/detail',auth,isAdmin,(req,res,next)=>{
  const res_id=req.params.id;

  const sql=`
    SELECT * 
    FROM reservation 
    WHERE res_id=?;
  `;

  db.query(sql,[res_id],(err,result)=>{
    if(err){
      return next(err);
    };
    if(result.length===0){
      const error = new Error("user does'nt have any reservation");
      error.status=400;
      return next(error);
    };
    res.status(200).send(result);
  });
});

router.patch('/reservation/list/:id/detail/update',auth,isAdmin,(req,res,next)=>{
  const res_id=req.params.id;
  
  const allowedColumns=[
    'check_in',
    'check_out',
    'status',
    'information'
  ];

  const notAllowedColumns=[
    'res_id',
    'user_id',
    'room_id',
    'created_at',
    'updated_at'
  ];
  const update=[];
  const values=[];
  for (key of notAllowedColumns){
    if(req.body[key]!==undefined){
      const error=new Error("you're not allowed to chande this column");
      error.status=403;
      return next(error);
    };
  };
  for(key of allowedColumns){
    if(req.body[key]!==undefined){
      update.push(`${key}=?`);
      values.push(req.body[key]);
    };
  };
  values.push(res_id);


  const sql=`
  UPDATE reservation
  SET ${update.join(', ')} , updated_at = NOW()
  WHERE res_id=?
  `;
  db.query(sql,values,(err,result)=>{
  if(err){
    return next(err);
  };
  if(result.affectedRows===0){
    const error = new Error ("reservation does'nt exists");
    error.status=404;
    return next(error);
  };
  res.status(201).send('reservation updated successfully');
  });
});

router.delete('/reservation/list/:id/delete',(req,res,next)=>{
  const res_id=req.params.id;
  
  const sql=`
  DELETE FROM reservation 
  WHERE res_id=?
  `;
  db.query(sql,[res_id],(err,result)=>{
    if(err){
      return next(err); 
    };
    if(result.affectedRows===0){
      const error=new Error("reservation does'nt");
      error.status=404;
      return next(error);
    };
    res.status(200).send('reservation deleted successfully');
  });
});
module.exports=router