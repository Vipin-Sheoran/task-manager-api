const calculateTip=(total,tipPercent=.25)=>total+(total*tipPercent)

const add=(a,b)=>{
    return new Promise((resolve,reject)=>{
    setTimeout(()=>{
        if(a<0||b<0){
            return reject('both numbers must be positive')
        }
     resolve(a+b)
    },2000)
})
}


module.exports={
    calculateTip,
    add
}