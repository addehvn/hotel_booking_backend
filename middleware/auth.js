const jwt = require('jsonwebtoken');


function auth (req,res,next){

  const token = req.header.authorization?.replace("Bearer"," ");
  if(!token){
    const error = new Error ('token did not provided')
    error.status=401;
    return next(error);
  };
  try{
    const decode = jwt.verif(
    token ,
    process.env.JWT_PASSWORD
   )
   req.user=decode
  }catch(error){
    const error = new Error('token did not provided')
    error.status=401;
    return next(error)
  }
   

   next()
}