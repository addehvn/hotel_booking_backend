function updateRoomValidation(req,res,next){


const {
  room_number,
    room_type,
    price,
    capacity,
}=req.body

const room_numberRegex= /^\d{1,4}$/;

const room_typeRegex= /^(Single|Double|Twin|Deluxe|Suite)$/i;

const priceRegex = /^\d{1,4}\.\d{2}$/;

const capacityRegex= /^[1-9]\d{0,2}$/;


if(room_number !== undefined && !room_numberRegex.test(room_number)){
  const error = new Error('Room number must contain only 1-4 digits');
  error.status=400;
  return next(error);
};

if(room_type !== undefined && !room_typeRegex.test(room_type)){
  const error = new Error('Invalid room type. Allowed types: Single, Double, Twin, Deluxe, Suite');
  error.status=400;
  return next(error);
};

if(price !== undefined && !priceRegex.test(price)){
  const error = new Error('Price must be a valid number with up to 4 digits and 2 decimal places');
  error.status=400;
  return next(error);
};

if(capacity !== undefined && !capacityRegex.test(capacity)){
  const error = new Error('Capacity must be a positive whole number');
  error.status=400;
  return next(error);
};
next()
}

module.exports= updateRoomValidation;