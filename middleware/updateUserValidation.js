function updateUserValidation(req,res,next){
 const {
  first_name,
    last_name,
    username,
    email,
    password,
    phone_number
 }=req.body 

 const first_nameRegex=/^[a-zA-Z\s\'-]{2,50}$/
  const last_nameRegex=/^[a-zA-Z\s\'-]{2,50}$/
  const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const passwordRegex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/
  const phone_numberRegex=/^\+?[0-9]{9}$/

 if(first_name!== undefined && !first_nameRegex.test(first_name)){
  const error = new Error ('first name ca be only letters between 2-50');
  error.status=400;
  return next(error);
 };

 if(last_name!==undefined && !last_nameRegex.test(last_name)){
  const error = new Error ('last name ca be only letters between 2-50');
  error.status=400;
  return next(error);
 };

 if(email !== undefined && !emailRegex.test(email)){
  const error = new Error('Invalid email format');
  error.status=400;
  return next(error);
 };

 if(password!==undefined && !passwordRegex.test(password)){
  const error = new Error('password should be at least 8 charachter and have lowercase ,uppercase , and symbols like !@#$%^&*()_+-=[]{};\|,.<>/?');
  error.status=400;
  return next(error)
 }

if(phone_number!==undefined && !phone_numberRegex.test(phone_number)){
  const error = new Error('phone number should be 9 numbers');
  error.status=400;
  return next(error);
};
 next();

}

module.exports=updateUserValidation 