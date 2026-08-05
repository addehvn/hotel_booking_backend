const jwt = require('jsonwebtoken');


function auth (req,res,next){

  const token = req.headers.authorization?.replace("Bearer ","");
  if(!token){
    const error = new Error ('token did not provided')
    error.status=401;
    return next(error);
  };
  try{
    const decode = jwt.verify(
    token ,
    process.env.JWT_PASSWORD
   )
   req.user=decode
  }catch(err){
    const error = new Error('token did not provided')
    error.status=401;
    return next(error)
  }
   next()
}
module.exports=auth;
