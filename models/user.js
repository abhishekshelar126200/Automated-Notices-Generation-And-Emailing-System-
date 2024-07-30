const mongoose=require('mongoose');


const userSchema=new mongoose.Schema({
    id: String,
    email: String,
    password: String
})

const user=mongoose.model('user',userSchema)

module.exports=user