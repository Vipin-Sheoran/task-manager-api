const express=require('express')    //express for using app.use,app.get and other models
require('./db/mongoose')            //this is for connecting with database and store data in mongoose db    // for connecting user in models which consist of necessary conditions for diff. objects
const userRouter=require('./routers/user')    //userRouter is for using new router from different files
const taskRouter=require('./routers/task')

const app=express()

app.use(express.json())    //used for sending json response
app.use(userRouter)
app.use(taskRouter) 

module.exports=app
 
