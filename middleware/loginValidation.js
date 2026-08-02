function loginValidation(req,res,next){

  const {
    email,
    password
  }=req.body

  const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const passwordRegex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/

  if(!emailRegex.test(email)){
    const error= new Error('Invalid email format ')
    error.status=400;
    return next(error)
  }
  if(!passwordRegex.test(password)){
    const error = new Error ('password should be at least 8 charachter and have lowercase ,uppercase , and symbols like !@#$%^&*()_+-=[]{};\|,.<>/?')
    error.status=401;
    return next(error);
  }

  next()
}

module.exports=loginValidation