const request= require('supertest');
const app = require ('../app.js');

describe('all hotels test',()=>{

  test('show all hotels successfully',async()=>{
    const response = await request(app)
    .get('/hotel/allHotels')
    expect(response.statusCode).toBe(200);
  });

  test('showing hotel by search',async()=>{
    const response = await request(app)
    .get('/hotel/allHotels?search=AAAAA');
    expect(response.statusCode).toBe(200);
  });

  test('not showing anything ',async()=>{
    const response = await request(app)
    .get('/hotel/allHotels?search=z');
    expect(response.statusCode).toBe(404);
  });

  test('sorting hotels by name',async()=>{
    const  response =await request(app)
    .get('/hotel/allHotels?sort=A-Z')
    expect(response.statusCode).toBe(200);
  });

});

describe('hotel details test',()=>{
  test('show hotel details successfully',async()=>{
    const response = await request (app)
    .get('/hotel/13');
    expect(response.statusCode).toBe(200);
  });

  test('show hotel details successfully',async()=>{
    const response = await request (app)
    .get('/hotel/1');
    expect(response.statusCode).toBe(404);
  });
  
})