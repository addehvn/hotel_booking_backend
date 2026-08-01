const app=require('./app');
const express=require('express');
const PORT = process.env.PORT || 3000

app.listen(PORT, ()=>{
  console.log('server startedon port '+ PORT);
})