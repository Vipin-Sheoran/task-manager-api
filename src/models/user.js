const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const Task=require('./task')

const userSchema=new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('please insert a valid email')
            }
        
    }

    },password:{
     type:String,
     required:true,
     trim:true,
     minlength:7,
     validate(value){
         if(value.toLowerCase().includes('password')){
             throw new Error('Password cannot be "password"')
         }
     }
    },
    age:{
        type: Number,
        default:0,
        validate(value){
            if(value<0){
          throw new Error('age must be positive')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer      //no validation required beacause multer itself will get the job done for us
    }
},{
    timestamps:true
})

userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

//remove password and tokens from user profile
userSchema.methods.toJSON= function(){     
    user=this
    const userObject=user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.methods.generateAuthToken= async function(){
const user=this
const token=jwt.sign({_id:user._id.toString() },process.env.JWT_SECRET)   //in jwt.sign first argument is payload which could be an object and should be unique and second argument is the key value which we provide to generate token
user.tokens=user.tokens.concat({token})      //a new object tokens is generated which stores every token when a new user is created
await user.save()
return token
}


userSchema.statics.findByCredentials=async(email,password)=>{    //email and [password will come from the user file in router which were created by user in body
    const user=await User.findOne({email})     //here User.findOne try to find out email in User
    if(!user){
        throw new Error('unable to login')
    }
    const isMatch=await bcrypt.compare(password,user.password)   //if email matches correctly then bcrypt.compare  will compare the new and already existing password and return true if they matched correctly
    if(!isMatch){
        throw new Error('unable to login')
    }
    return user
}


//hash the plain password before saving
userSchema.pre('save',async function(next){
    const user=this
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)    //user.password is converted into hashed password if password is changed or created newly
    }
    next()
})
//delete users tasks before removing user
userSchema.pre('remove',async function(next){
    const user=this
    await Task.deleteMany({owner:user._id})          //all the tasks will be deleted having the owner value as user._id

    next()
})

const User= mongoose.model('User',userSchema)     //creation of users file in mongodb


module.exports= User
