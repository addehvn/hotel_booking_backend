const multer=require('multer');

const storage=multer.diskStorage({
  destination:(req,File,cb)=>{
    cb(null,'upload/');
  },
  fileName:(req,file,cb)=>{
    const uniqueName=
    Date.now()+
    '_'+
    Math.random(Math.round()*1E20)+
    Path.extname(file.originalname)
    cb(null,uniquName)
  }
});
const fileFilter=multer.fileFilter=(req,file,cb)=>{
  if(file.mimetype.startsWith('image/')){
    cb(null,true);
  }else{
    cb(new Error ('only image file are allowed'),false);
  };
};
const upload=multer({
  storage: storage ,
  fileFilter: fileFilter 
});
module.exports= upload 