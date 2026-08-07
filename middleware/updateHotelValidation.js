function updateHotelValidation(req,res,next){

  const{
    hotel_name,
    description,
    location
  }=req.body


 const hotel_nameRegex=/^[A-Za-z0-9\s.'&-]{2,100}$/;

const descriptionRegex=/^[A-Za-z0-9\s.,!?'"():;&-]{10,1000}$/;

const locationRegex=/^[A-Za-z0-9\s,.'\/-]{2,255}$/


if(hotel_name !== undefined && !hotel_nameRegex.test(hotel_name)){
  const error=new Error("Hotel name must be 2-100 characters and contain only letters, numbers,',-,_,&");
  error.status=400;
  return next(error)
};

if(description !== undefined && !descriptionRegex.test(description)){
  const error=new Error('Description must be 10-1000 characters and contain only valid characters.');
  error.status=400;
  return next(error);
};

if(location !== undefined && !locationRegex.test(location)){
  const error = new Error("Location must be 2-255 characters and contain only letters, numbers,',-,_,&");
  error.status=400;
  return next(error);
};

  next()
}

module.exports=updateHotelValidation