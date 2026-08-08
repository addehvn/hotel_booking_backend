function isAdmin(req,res,next){
  if(req.user.role!=='Admin'){
    const error =new Error('your not allowed');
    error.status=403;
    return next(error);
  }

  next();
}

module.exports=isAdmin;