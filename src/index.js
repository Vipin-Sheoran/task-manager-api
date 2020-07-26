const express=require('express')    //express for using app.use,app.get and other models
require('./db/mongoose')            //this is for connecting with database and store data in mongoose db
const Task=require('./models/task')   
const User = require('./models/user')    // for connectint user in models which consist of necessary conditions for diff. objects
const userRouter=require('./routers/user')    //userRouter is for using new router from different files
const taskRouter=require('./routers/task')
const auth = require('./middleware/auth')
const app=express()




const port=process.env.PORT         //for running localhost:3000 or any provided route

// app.use((req,res,next)=>{
//     if(req.method==='GET'){
//      res.send('GET requests are disabled')  
//     }else{
//         next()
//     }
//     // console.log(req.method,req.path)
//     // next()
// })

// app.use((req,res,next)=>{
//     res.status(503).send('site is under maintainence please try soon')
    
// })


// const multer=require('multer')
// const upload=multer({
//     dest:'images',
//     limits:{
//         fileSize:1000000
//     },
//     fileFilter(req,file,cb){
    
//        if(!file.originalname.match(/\.(doc|docx)$/)){                     //regex101.com
//            return cb(new Error('please upload a Word document'))
//        }
//          cb(undefined,true)
//     }
// })

// const errorMiddleware=(req,res,next)=>{
//     throw new Error('From my middleware')
// }

// app.post('/upload',upload.single('upload'),(req,res)=>{
//     res.send()
// },(error,req,res,next)=>{
// res.status(400).send({error:error.message})
// })

app.use(express.json())    //used for sending json response
app.use(userRouter)
app.use(taskRouter) 








app.listen(port,()=>{
    console.log('server is up on port '+port)
})

// const bcrypt=require('bcrypt')
// const jwt=require('jsonwebtoken')

// const myFunction=async()=>{
//     const token=jwt.sign({_id:'abc123'},'thisismynewcourse',{expiresIn:'7 days'})
//     console.log(token)
//     const data=jwt.verify(token,'thisismynewcourse')
//     console.log(data)
//     const password='red12345!'
//     const hashedPassword=await bcrypt.hash(password,8)
//     console.log(password)
//     console.log(hashedPassword)

//     // const isMatch=await bcrypt.compare('red12345!',hashedPassword)
//     // console.log(isMatch)
// }

// myFunction()

// const main= async ()=>{
//     // const task=await Task.findById('5f19032f94999653908fa47b')
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)

//     const user=await User.findById('5f1902243051af1c54bea892')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// main()
