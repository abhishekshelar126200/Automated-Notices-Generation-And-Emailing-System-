const mongoose=require('mongoose');

const hisaabModel=new mongoose.Schema({
    id:String,
    hisaabName:String,
    hisaab:String,
    dateCreated:String,
    isEncrypted:String,
    password:String,
    isShareable:String,
    isEdit:String
})

const newHisaab=mongoose.model('hisaab',hisaabModel)
module.exports=newHisaab