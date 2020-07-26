const mongoose=require('mongoose')
// const validator=require('validator')

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false
})

// const User= mongoose.model('User',{ 
//     name:{
//         type: String,
//         required:true
//     },
//     Email:{
//         type:String,
//         required:true,
//         lowercase:true,
//         trim:true,
//         validate(value){
//             if(!validator.isEmail(value)){
//                 throw new Error('please insert a valid email')
//             }
        
//     }

//     },Password:{
//      type:String,
//      required:true,
//      trim:true,
//      minlength:7,
//      validate(value){
//          if(value.toLowerCase().includes('password')){
//              throw new Error('Password cannot be "password"')
//          }
//      }
//     },
//     age:{
//         type: Number,
//         validate(value){
//             if(value<0){
//           throw new Error('age must be positive')
//             }
//         }
//     }
// })
// const me=new User({
//     name:'    nikhil    ',
//     age:21,
//     Email:'    vipin@gmail.com    ',
//     Password:'vipi'
// })

// me.save().then(()=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log(error)
// })



// const my=new Task({
//     description:'this is des.',
//     completed:true
// })

// my.save().then(()=>{
//     console.log(my)
// }).catch(()=>{
//     console.log(error)
// })