const jwt=require('jsonwebtoken')
const User=require('../models/user')


const auth=async(req,res,next)=>{
    try{
    const token=req.header('Authorization').replace('Bearer ','')            //here token gives the token value which  we stord in value of key authorization
    const decoded=jwt.verify(token,process.env.JWT_SECRET)                    //after taking in token and signature(the same which we provided during crating the jwt) it will generate _id and iat which will further match with existing id if the token provided by the user is correct //not sure about that this is my assumption
    const user=await User.findOne({_id:decoded._id,'tokens.token':token})  //User.findOne will find the user by matching id which we get from decode and token which we get from token up above to the existing account and we can get access to the profile which we created earlier as user
    if(!user){
        throw new Error()
    }
    req.token=token
    req.user=user
    next()

    }catch(e){
     res.status(401).send({error:'please authenticate'})
    }
    
}

module.exports=auth