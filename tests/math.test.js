const {calculateTip,add}=require('../src/math') 
// test('should calculate total with tip',()=>{
//     const total=calculateTip(10,.3)

//     expect(total).toBe(13)

    // if(total!==13){
    //     throw new Error('Total tip should be 13.Got '+total)
    // }
// })

// test('should calculate total with default tip',()=>{
//     const total=calculateTip(10)
//     expect(total).toBe(12.5)
// })

// test('Should add two number',(done)=>{
//     add(2,3).then((sum)=>{
//         expect(sum).toBe(5)
//         done()
//     })
// })

test('should add two numbers async/await',async()=>{
    const sum=await add(11,10)
    expect(sum).toBe(21)
})