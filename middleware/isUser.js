function isUser(req,res,next){

const user_id=Number(req.params.id)

if(user_id !== req.user.user_id){
  const error = new Error('you can only change your own user ');
  error.status=403;
  return next(error);
}
next();
}

module.exports=isUser