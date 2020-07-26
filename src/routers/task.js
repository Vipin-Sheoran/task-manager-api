const express=require('express')
const auth=require('../middleware/auth')
const router=new express.Router()
const Task=require('../models/task')

router.post('/tasks',auth, async (req,res)=>{

    // const task=new Task(req.body)

    const task=new Task({
        ...req.body,             
        owner:req.user._id           //req.user._id we get it from auth file
    })
    try{
        await task.save() 
        res.status(201).send(task)
    } catch(e){
      res.status(400).send(e) 
    }

})

//GET tasks?sortBy=createdAt:desc

router.get('/tasks',auth,async(req,res)=>{
      const match={} 
      const sort={}    //first create match variable as an object
      
      if(req.query.completed){
          match.completed=req.query.completed==='true'  //req.query.completed==='true' will return true as both string values are equal
      }

      if(req.query.sortBy){
          const parts=req.query.sortBy.split(':')
          sort[parts[0]]=parts[1]==='desc' ? -1:1    
      }

    try{
        // const task=await Task.find({owner:req.user._id})          //easy method next step is res.send(task)
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort//:{
                //     // createdAt:-1        //descending order
                //     completed:-1          //completed first then incomplete ones
                // }                        //req.query.limit should be a number otherwisw its not gonna work
            }                              //  this match represents => match:{ completed:true }
        }
        ).execPopulate()
        res.status(200).send(req.user.tasks)
    } catch(e){
        res.status(500).send(e)
    }
    
})
router.get('/tasks/:id',auth, async (req,res)=>{
    const _id=req.params.id         // herereq.params.id return the value of id which we provide at /tasks/???? 
    try{
        // const task=await Task.findById(_id)
        const task=await Task.findOne({_id,owner:req.user._id})
    if(!task){
        res.status(404).send()
    }
    res.status(201).send(task)
    }catch(e){
     res.status(500).send()
    }
})
    router.patch('/tasks/:id', auth,async (req,res)=>{
        const updates=Object.keys(req.body)                //Object.keys return us the property name of of the object i.e description,completed
        const allowedupdates=['description','completed']
        const isvalidoperation=updates.every((update)=>allowedupdates.includes(update))  //every has provided callback function which checks for every property of updates 
        if(!isvalidoperation){                                                          //includes return true if the string value in allowedupdate matches with the property name of updates
         return   res.status(400).send({error:'invalid update'})
        }
        try{
            const _id=req.params.id
            const task=await Task.findOne({_id,owner:req.user._id})
            
            // const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
            if(!task){
             return res.status(404).send()
            }
            updates.forEach((update)=>task[update]=req.body[update])
            task.save()
            res.send(task)
        }catch(e){
            res.status(400).send(e)
        }
    })

    router.delete('/tasks/:id',auth,async(req,res)=>{
        try{
            const task=await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
            if(!task){
                res.status(404).send()
            }
            res.send(task)
        } catch(e){ 
            res.status(500).send()
        }
    })

module.exports=router