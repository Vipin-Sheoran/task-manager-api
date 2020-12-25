const request=require('supertest')
const app=require('../src/app')

test('should signup user',async()=>{
    await request(app).post('/users').send({
        name:'hiii',
        email:'sheoranvi@gmail.com',
        password:'sheoran'
    }).expect(201)
})  