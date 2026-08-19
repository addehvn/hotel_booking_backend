const multer=require('multer');
const path = require('path');
const storage=multer.diskStorage({
destination:(req,file,cb)=>{
  cb(null,'upload/')
  },
  filename:(req,file,cb)=>{
    const uniquename= Date.now()+
    '_'+
    Math.round(Math.random()*1E20)+
    path.extname(file.originalname);
    cb(null,uniquename)
  }});
  const fileFilter=(req,file,cb)=>{
    if(file.mimetype.startsWith('image/')){
      cb(null,true)
    }else{
      cb(new Error('only image file are allowed'),false)
    }
  }
  const upload=multer({
    storage ,
    fileFilter
  })
module.exports=upload 