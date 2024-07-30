const mongoose=require('mongoose');
const { log } = require("console")
const express=require("express")
const app=express()
const path=require('path')
const fs=require('fs').promises
const session=require('express-session')
const { v4: uuidv4 } = require('uuid');
const flash=require('connect-flash')
const user=require('./models/user.js')
const newHisaab=require('./models/hisaab.js')



const conn=mongoose.connect("mongodb+srv://abhishekshelar1262003:1557Abhi@abhishek.i4cx7te.mongodb.net/?retryWrites=true&w=majority&appName=Abhishek")

app.set('view engine','ejs')
app.use(express.static(path.join(__dirname,'public')))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret:"Random Stuff",
  resave:false,
  saveUninitialized:false
}))

app.use(flash())

app.use((req, res, next) => {
  res.locals.err = req.flash('err');
  res.locals.passwordWrong = req.flash('passwordWrong');
  res.locals.shareable=req.flash('shareable')
  next();
});






const readRecords = async () => {
    try {
      const files = await fs.readdir(path.join(__dirname, 'public', 'records'));
      return files
    } catch (err) {
      console.error('Error reading files:', err);
      throw err;
    }
};






app.get('/',async (req,res)=>{
    if(req.session.isLogin)
    {
      const files = await readRecords();
      const hisaabDetails={}
      for (const file of files) {
        const record = await newHisaab.findOne({ hisaabName: file });
        hisaabDetails[file] = record ? {record} : null;
      }
     
      res.render('index',{ files,hisaabDetails })
    }
    else{
      
      res.render('login')

    }
    
})

app.get('/register',(req,res)=>{
  res.render('register')
})

app.get('/loginPage',(req,res)=>{
  res.render('login')
})



app.post('/create',async (req,res)=>{
  const { email,password }=req.body
  const uniqueId = uuidv4();
  await user.create({
    id:uniqueId,
    email,
    password
  })
  
  res.redirect('/loginPage')
})

app.post('/login',async (req,res)=>{
  const { email,password }=req.body
  const userDetail=await user.findOne({email})
  if(userDetail){
    if(userDetail.password === password)
    {
      req.session.isLogin=true
      res.redirect("/")
    }
    else{
      req.flash('err',1)
      res.redirect('/loginPage')
    }
    
  }
  else{
    req.flash('err',1)
    res.redirect('/loginPage')
  }
  
})

app.get('/logOut',(req,res)=>{
  req.session.isLogin=false
  res.redirect('/loginPage')
})

app.get('/delete/:filename',async (req,res)=>{
    if(!req.session.isLogin)
    {
      res.redirect('/loginPage')
    }
    const filePath=req.params.filename
    
    fs.unlink(path.join(__dirname,"public",'records',filePath),(err)=>{
        if(err){
          res.send("Error is occur")
        }
        
    })

    await newHisaab.deleteOne({hisaabName:filePath})
  
   
  res.redirect("/")
})


app.get("/createHisaab",(req,res)=>{
  if(!req.session.isLogin)
  {
    res.redirect('/loginPage')
  }
  else
  {
    res.render('create')
  }
  
})



app.post('/addHisaab',async (req,res)=>{
    if(!req.session.isLogin)
    {
      res.redirect('/loginPage')
    }
    else
    {
      const { filename,hisaab,encrypt,password,shareable,isEdit }=req.body
      const currentDate = new Date().toISOString().slice(0, 10); // Get current date in 'YYYY-MM-DD' format
      const filePath = path.join(__dirname, 'public', 'records', filename); // Construct file path

      const uniqueId=uuidv4();

      await newHisaab.create({
        id:uniqueId,
        hisaabName:filename,
        hisaab:hisaab,
        dateCreated:currentDate,
        isEncrypted:encrypt,
        password:password,
        isShareable:shareable,
        isEdit:isEdit
      })

      try{
        
        await fs.access(filePath)
        res.send("I am a devil");
      }
      catch(err){
      
        fs.writeFile(filePath,hisaab)
        res.redirect('/')
      }
      
    }
})



app.get('/displayRecord/:filename',async (req,res)=>{
  if(!req.session.isLogin)
  {
    res.redirect('/loginPage')
  }
  else
  {
    const fileName=req.params.filename
    const firstName=fileName.split('.')[0]
    const recordData=null
    const data=await fs.readFile(path.join(__dirname,'public','records',fileName),'utf8')
    const record=await newHisaab.findOne({hisaabName:fileName})
    const isEncrypted=record.isEncrypted
    const isShareable=record.isShareable
    const isEditable=record.isEdit
    const date=record.dateCreated
    res.render("details",{ data,firstName,fileName,isEncrypted,date,isShareable,isEditable })
  }
  
})


app.get('/edit/:file',async (req,res)=>{
  if(!req.session.isLogin)
  {
    res.redirect('/loginPage')
  }
  const fileName=req.params.file
  const firstName=fileName.split('.')[0]
  const data=await fs.readFile(path.join(__dirname,'public','records',fileName),'utf8')
  res.render('edit',{ data,fileName,firstName })
})



app.post('/editHisaab/:fileName',(req,res)=>{
  if(!req.session.isLogin)
  {
    res.redirect('/loginPage')
  }
  const { hisaab }=req.body
  fs.writeFile(path.join(__dirname,'public','records',req.params.fileName),hisaab)
  res.redirect('/')
})

app.post('/displayEncryptedRecord/:filename',async (req,res)=>{
    if(!req.session.isLogin)
    {
      res.redirect('/loginPage')
    }
    else
    {
      const {ePassword}=req.body
      const fileName=(req.params.filename).replace('%20'," ")
      console.log(fileName)
      const fileRecord=await newHisaab.findOne({hisaabName:fileName})
      if(fileRecord.password==ePassword)
      {
        
        res.redirect(`/displayRecord/${fileName}`)
      }
      else
      {
        req.flash('passwordWrong',1)
        res.redirect('/')
      }
    }
    
})

app.get("/share/:fileName",async (req,res)=>{

    if(!req.session.isLogin)
    {
      res.redirect('/loginPage')
    }
    else
    {
      const filename=req.params.fileName.replace("%20",' ')
      const record=await newHisaab.findOne({hisaabName:filename})
      if(record.isShareable=="on")
      {
        res.redirect(`/displayRecord/${filename}`)
      }
      else{
        req.flash('unshareable',1)
      }
    }

    
})

app.post('/findByDate',async (req,res)=>{
  const {date}=req.body
  const records=await newHisaab.find({dateCreated:date})
  const filenames=[]
  let j=0
  for(let i=0;i<records.length;i++)
  {
    filenames[j++]=records[i].hisaabName
  }
  
  const files = await readRecords();
  const hisaabDetails={}
  for (const file of files) {
    if(filenames.includes(file))
    {
      const record = await newHisaab.findOne({ hisaabName: file });
      hisaabDetails[file] = record ? {record} : null;
    }
  }


  res.render('index',{files:filenames,hisaabDetails})
})




app.listen(3000)
