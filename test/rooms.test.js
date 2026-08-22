const request = require('supertest');
const app = require ('../app.js');

describe("hotel's all rooms test",()=>{
  test("show hotel's all rooms successfully",async()=>{
    const response =await request(app)
    .get('/room/hotel/13/allRooms');
    expect(response.statusCode).toBe(200);
  });

   test('show rooms of hotel that does not exist',async()=>{
    const response = await request(app)
    .get('/room/hotel/1/allRooms');
    expect(response.statusCode).toBe(404);
   });
});

describe("room's detail",()=>{

  test('show room detail successfully',async()=>{
    const response = await request(app)
    .get('/room/hotel/13/room/13');
    expect(response.statusCode).toBe(200);
  });

  test('show room detail that exist',async()=>{
    const response = await request(app)
    .get('/room/hotel/13/room/1000');
    expect (response.statusCode).toBe(404);
  });
});