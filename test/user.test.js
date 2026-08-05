const request = require ('supertest');
const app=require ('../app.js');

describe('user sign up test',()=>{
  test('sign up successfully ',async ()=>{
    const response = await request(app)
    .post('/user/signup')
    .send({
      first_name:'test',
      last_name:'test',
      email:'test10@gmail.com',
      password:'Test1234!',
      phone_number:'123456789'
    });

    expect(response.statusCode).toBe(201);
  });

  test('signup with information  that exists',async()=>{
    const response = await request(app)
    .post('/user/signup')
    .send({
      first_name:'test',
      last_name:'test',
      email:'test6@gmail.com',
      password:'Test1234!',
      phone_number:'123456789'
    });

    expect (response.statusCode).toBe(409);
  });

  test('signup without entering information ',async ()=>{
    const response =await request(app)
    .post('/user/signup')
    .send({
      first_name:'test',
      last_name:'test',
      email:'',
      password:'',
      phone_number:''
    });
    expect(response.statusCode).toBe(400)
  });

  test('sign up with wrong information  ',async ()=>{
    const response = await request(app)
    .post('/user/signup')
    .send({
      first_name:'test11',
      last_name:'test',
      email:'testgmail.com',
      password:'Test1234!',
      phone_number:'123456789'
    });

    expect(response.statusCode).toBe(400);
  });

});

describe('user login test',()=>{

  test('user login successfully',async ()=>{
    const response = await request(app)
    .post('/user/login')
    .send({
      email:'test@gmail.com',
      password : 'Test1234!'
    });
    expect(response.statusCode).toBe(200);
  });

  test('user login with wrong information ',async ()=>{
    const response = await request(app)
    .post('/user/login')
    .send({
      email:'testgmail.com',
      password : 'Test1234!'
    });
    expect(response.statusCode).toBe(400);
  });

  test('user login without entering information',async ()=>{
    const response = await request(app)
    .post('/user/login')
    .send({
      email:'',
      password : 'Test1234!'
    });
    expect(response.statusCode).toBe(400);
  });
});

describe('user update test',()=>{

  test("user update's successfully",async ()=>{
    const loginResponse=await request(app)
    .post('/user/login')
    .send({
      email:'test1@gmail.com',
      password:'Test1234!'
    })
    const token =loginResponse.body.token
    const response  = await request(app)
    .patch('/user/update/13')
    .set("Authorization",`Bearer ${token}`)
    .send({
      first_name:'Test'
     });
       expect(response.statusCode).toBe(200);
    });


    test("user update's with wrong information",async ()=>{
    const loginResponse=await request(app)
    .post('/user/login')
    .send({
      email:'test1@gmail.com',
      password:'Test1234!'
    })
    const token =loginResponse.body.token
    const response  = await request(app)
    .patch('/user/update/13')
    .set("Authorization",`Bearer ${token}`)
    .send({
      first_name:'Test1'
     });
       expect(response.statusCode).toBe(400);
    }
  );


  test("user update's without information ",async ()=>{
    const loginResponse=await request(app)
    .post('/user/login')
    .send({
      email:'test1@gmail.com',
      password:'Test1234!'
    })
    const token =loginResponse.body.token
    const response  = await request(app)
    .patch('/user/update/13')
    .set("Authorization",`Bearer ${token}`)
    .send({
      first_name:''
     });
       expect(response.statusCode).toBe(400);
    }
  );


  test("user update's without login",async ()=>{
    const response  = await request(app)
    .patch('/user/update/13')
    .send({
      first_name:'Test'
     });
       expect(response.statusCode).toBe(401);
    }
  );

  test("user update's another user's account ",async ()=>{
    const loginResponse=await request(app)
    .post('/user/login')
    .send({
      email:'test1@gmail.com',
      password:'Test1234!'
    })
    const token =loginResponse.body.token
    const response  = await request(app)
    .patch('/user/update/14')
    .set("Authorization",`Bearer ${token}`)
    .send({
      first_name:'Test'
     });
       expect(response.statusCode).toBe(403);
    }
  );

   test("user update's not allowed column ",async ()=>{
    const loginResponse=await request(app)
    .post('/user/login')
    .send({
      email:'test1@gmail.com',
      password:'Test1234!'
    })
    const token =loginResponse.body.token
    const response  = await request(app)
    .patch('/user/update/13')
    .set("Authorization",`Bearer ${token}`)
    .send({
      role:'admin'
     });
       expect(response.statusCode).toBe(403);
    }
  );

});

describe('user delete test',()=>{

  test ("user delete's acoount successfully ",async()=>{

    const loginResponse=await request(app)
    .post('/user/login')
    .send({
      email:'test9@gmail.com', 
      password:'Test1234!'
    });

    const token = loginResponse.body.token
  
    const response = await request(app)
    .delete('/user/delete/26')
    .set("Authorization",`Bearer ${token}`)

    expect(response.statusCode).toBe(200)
  });

  test ("user delete's acoount without login",async()=>{

    const response = await request(app)
    .delete('/user/delete/28')
    expect(response.statusCode).toBe(401)
  });

  test ("user delete's another user's acoount",async()=>{

    const loginResponse=await request(app)
    .post('/user/login')
    .send({
      email:'test9@gmail.com',
      password:'Test1234!'
    });

    const token = loginResponse.body.token
  
    const response = await request(app)
    .delete('/user/delete/28')
    .set("Authorization",`Bearer ${token}`)

    expect(response.statusCode).toBe(401)
  });
});
