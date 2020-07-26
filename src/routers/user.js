const express=require('express')
const router = new express.Router()    //way of creating a new router
const sharp=require('sharp')
const User=require('../models/user')
const auth=require('../middleware/auth')
const { sendWelcomeEmail,sendCancellationEmail }=require('../emails/accounts')


router.post('/users', async (req,res)=>{
    const user=new User(req.body)                 //creating a new user which satisfies or follows the conditions given in models/users
    try { 
        await user.save()                      //remember password is converted to hashed password before saving
        sendWelcomeEmail(user.email,user.name)
        const token=await user.generateAuthToken()
        res.status(201).send({user,token})            //first user is created upward and token is generated in models/user file and both are sent to user 

    } catch(e){
        res.status(400).send(e)
    }
    
    
    })

    router.post('/users/login', async (req,res)=>{
        try
        {
            const user=await User.findByCredentials(req.body.email,req.body.password)  //here we call findbyCredentials when user send his email and password to verify whether it matches with existing account or not
            const token=await user.generateAuthToken()
            res.send({user,token})
        } catch(e){
            res.status(400).send()
        }
    })

    router.post('/users/logout',auth,async(req,res)=>{
        try{
         req.user.tokens=req.user.tokens.filter((t)=>{     //for every login a new token is generated automatically for the user
             return t.token!==req.token                  //here only those values of tokens remain which does not match with user.token
         })                                  //filter calls a provided callback function which checks every elemnt of the array
         await req.user.save()
         res.send()
        }catch(e){
        res.status(500).send()
        }
    })
    router.post('/users/logoutall',auth,async(req,res)=>{
        try{
            req.user.tokens=[]
           await req.user.save()
           res.send()
        }catch(e){

        }
    })
  
router.get('/users/me', auth ,async (req,res)=>{

    
   res.send(req.user)

    
    
})


router.patch('/users/me',auth,async(req,res)=>{

const updates=Object.keys(req.body)
const allowedupdates=['age','name','email','password']
const isValidOperation=updates.every((update)=>allowedupdates.includes(update))
if(!isValidOperation){
    return res.status(400).send({error:'invalid updates'})
}

try{
    // const user=await User.findById(req.params.id)
    const user=req.user
    updates.forEach((update)=>user[update]=req.body[update])

    await user.save()
    // const user=await User.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})
    if(!user){
        res.status(404).send()
    }
    res.send(user)
}catch(e){
res.status(400).send(e)
}
})

router.delete('/users/me',auth, async (req,res)=>{
    try{
    //     const user=await User.findByIdAndDelete(req.params.id)
    //     if(!user){
    //      return res.status(404).send()
    //     }
    await req.user.remove()
    sendCancellationEmail(req.user.email,req.user.name)
        res.send(req.user)
    } catch(e){
      res.status(500).send(e)
    }
})

const multer=require('multer')
const upload=multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png )$/)){
          return  cb(new Error('please upload an image'))
        }
        cb(undefined,true)
    }
})

//create and update
router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
    const buffer=await sharp(req.file.buffer).resize({ width:250 ,height:250}).png().toBuffer()
    req.user.avatar=buffer             //req.file.buffer is used to store binary data like images and other documents
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

//delete
router.delete('/users/me/avatar',auth,async(req,res)=>{
    req.user.avatar=undefined    //in post we set req.user.avatar=req.file.buffer and in delete we set it equal to undefined i.e file is deleted
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar',async(req,res)=>{
    try{
        const user=await User.findById(req.params.id)
        if(!user||!user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar)

    }catch(e){
        res.status(404).send()
    }
})

module.exports=router