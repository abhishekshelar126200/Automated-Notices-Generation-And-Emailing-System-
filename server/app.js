// server/server.js
const express = require('express');
const path = require('path');
const mongoose=require('mongoose');
const { v4: uuidv4 } = require('uuid');
const record=require('./models/records.js');
const { escape } = require('querystring');
const fs=require('fs').promises
const multer=require('multer');
const xlsx = require('xlsx');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const mammoth = require('mammoth');
const { htmlToText } = require('html-to-text');
const docx = require('docx');
const { Document, Packer, Paragraph, TextRun } = docx;
const nodemailer = require("nodemailer");
const { readdir } = require('fs');
const pdf = require('html-pdf');
const htmlToDocx = require('html-to-docx');
const cors=require('cors');


const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

const generateUniqueId = (req, res, next) => {
  req.uniqueId = uuidv4();
  next();
};

const conn=mongoose.connect("mongodb+srv://abhishekshelar1262003:1557Abhi@abhishek.i4cx7te.mongodb.net/?retryWrites=true&w=majority&appName=Abhishek")


// API endpoint to get data for different components

app.get('/api/data/first', (req, res) => {
  res.json({ items: ['Component1 Item 1', 'Component1 Item 2', 'Component1 Item 3'] });
});


app.get('/api/data/second', (req, res) => {
  res.json({ items: ['Component2 Item 2', 'Component2 Item 2', 'Component2 Item 2'] });
});

app.get('/api/data/third', (req, res) => {
  res.json({ items: ['Component2 Item 1', 'Component2 Item 2', 'Component2 Item 3'] });
});

app.get('/api/data/fourth', (req, res) => {
  res.json({ items: ['Component3 Item 1', 'Component3 Item 2', 'Component3 Item 3'] });
});

// Add Record in database

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'public', 'student_data', `${req.body.academicYear}`, `${req.body.year}`, 'uploads', `${req.body.branch}`,`${req.uniqueId}`);
    
    // Check if the path exists, if not create it
    try {
      await fs.mkdir(uploadPath, { recursive: true }); // Creates the folder if it doesn't exist
      cb(null, uploadPath);
    } catch (err) {
      console.error('Error creating directory:', err);
      cb(err); // Pass the error to multer if directory creation fails
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // or generate a unique name if needed
  }
});

const upload = multer({ storage: storage }).fields([
  { name: 'wordFile', maxCount: 1 },
  { name: 'excelFile', maxCount: 1 }
]);

// Add Record in database
app.post('/api/data/addRecord',generateUniqueId, upload, async (req, res) => {
  if (req.method === 'POST') {
    const { academicYear, year, branch } = req.body;
    const result = await record.find({ academicYear: academicYear, year: year, branch: branch });

    if (result.length === 0) {
      const uniqueId = req.uniqueId;

      const wordFile = req.files['wordFile'] ? req.files['wordFile'][0].filename : null;
      const excelFile = req.files['excelFile'] ? req.files['excelFile'][0].filename : null;

      await record.create({
        id: uniqueId,
        academicYear,
        year,
        branch,
        wordFile,
        excelFile
      });

      const filepath_excel = path.join(__dirname, 'public', 'student_data', `${req.body.academicYear}`, `${req.body.year}`, 'uploads', `${req.body.branch}`,`${uniqueId}`,`${excelFile}`);
      const workbook = xlsx.readFile(filepath_excel);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const recipients = xlsx.utils.sheet_to_json(worksheet);
      
      const filepath_word = path.join(__dirname, 'public', 'student_data', `${req.body.academicYear}`, `${req.body.year}`, 'uploads', `${req.body.branch}`,`${uniqueId}`, `${wordFile}`);
      
      const noticeDir = path.join(__dirname, 'public', 'student_data', `${req.body.academicYear}`, `${req.body.year}`, 'Notices', `${req.body.branch}`, `${uniqueId}`);
      
      try {
        await fs.mkdir(noticeDir, { recursive: true }); // Ensure the notice directory exists
        recipients.forEach(async (recipient) => {
          try {
            const content = await fs.readFile(path.join(filepath_word), 'binary');
            const zip = new PizZip(content);
            const doc = new Docxtemplater(zip, {
              paragraphLoop: true,
              linebreaks: true,
            });

            doc.setData({
              student_name: recipient.Name,
              student_id: recipient.roll_no,
              branch: recipient.branch,
              year: recipient.year,
              pending_fees: recipient.pendingfees
            });

            try {
              doc.render();
            } catch (error) {
              console.error('Error rendering document:', error);
            }

            const buffer = doc.getZip().generate({ type: 'nodebuffer' });
            await fs.writeFile(path.join(noticeDir, `${recipient.roll_no}.docx`), buffer);
          } catch (error) {
            console.error('Error while storing file:', error);
          }
        });
      } catch (err) {
        console.error('Error creating notice directory:', err);
      }
    }
  }

  res.redirect("/displayRecords");
});

// Return records from database

app.get('/api/data/records',async (req,res)=>{
  try {
    const allData = await record.find({});
    res.json(allData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Delete record from database

const deleteDirectoryRecursive =async  (dirPath) => {
  // Read the contents of the directory
  const files = await fs.readdir(dirPath);
  for (const file of files) {
    const currentPath = path.join(dirPath, file);
    const stats = await fs.stat(currentPath);
    if (stats.isDirectory()) {
      await deleteDirectoryRecursive(currentPath);
    } else {
      await fs.unlink(currentPath);
    }
  }
}

app.post('/api/data/deleteRecord/:id',async (req,res)=>{
    try{
          let id=req.params.id;
          const foundRecord=await record.findOne({id:id});
          const dirPath=path.join(__dirname, 'public', 'student_data',`${foundRecord.academicYear}`,`${foundRecord.year}`,'Notices',`${foundRecord.branch}`,`${id}`)
          await deleteDirectoryRecursive(dirPath);
          await fs.rmdir(dirPath);
          await record.deleteOne({id})
          res.redirect('/displayRecords');
      }
    catch (err){
      res.status(500).json({error:err.message});
    }
});


//Retreive files from folders

const retreiveFiles=async (records)=>{
  try {
    const files={};
    
    for(let record of records){
      const file= await fs.readdir(path.join(__dirname, 'public', 'student_data',`${record.academicYear}`,`${record.year}`,'Notices',`${record.branch}`,`${record.id}`));
      if (!files[record.year]) {
        files[record.year] = {};
      }
      if (!files[record.year][record.branch]) {
        files[record.year][record.branch] = [];
      }
      files[record.year][record.branch] = files[record.year][record.branch].concat(file);
    }
    return files
  } catch (err) {
    console.error('Error reading files:', err);
    throw err;  
  }
}

app.get('/api/data/retreiveFiles/:academicYear/:year/:branch',async (req,res)=>{
  const {academicYear,year,branch}=req.params;
  let records=[];
  if(year==='noYear' && branch==='noBranch')
  {
    records=await record.find({academicYear:academicYear});
  }
  else if(year==='noYear')
  {
    records=await record.find({academicYear:academicYear,branch:branch});
  }
  else if(branch==='noBranch')
  {
    records=await record.find({academicYear:academicYear,year:year});
  }
  else
  {
    records=await record.find({academicYear:academicYear,year:year,branch:branch});
  }
  if(records.length>0)
  {
    const fetchedFiles=await retreiveFiles(records);
    res.send(fetchedFiles);
  }
  else
  {
    res.json({'error':["Record Not found"]});
  }
});

//retreiveMail

const retreiveMails=async (records)=>{
  try {
    let emails=[];
    // let finalResults={};
    for(let record of records)
    {
      const files= await fs.readdir(path.join(__dirname, 'public', 'student_data',`${record.academicYear}`,`${record.year}`,'Notices',`${record.branch}`,`${record.id}`));
      const excelPath = path.join(__dirname, 'public', 'student_data', record.academicYear, record.year, 'uploads', record.branch , record.id, 'Student.xlsx');
      const workbook = xlsx.readFile(excelPath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet); 
      files.map(file=>{
        const fileNameWithoutExt = path.basename(file, path.extname(file));
        const fileResults = data.filter(row => {
          // Convert roll_no to string if it's not already
          const rollNo = String(row.roll_no);

          // Check if rollNo includes the fileNameWithoutExt
          return rollNo && rollNo.includes(fileNameWithoutExt);
        });
        emails.push({
          id:record.id,
          name:fileResults[0].Name,
          rollNo:fileResults[0].roll_no,
          academicYear:record.academicYear,
          branch:fileResults[0].branch,
          year:fileResults[0].year,
          email:fileResults[0].email_address
        });
        
      })

    }
    
    
    return emails;
  } catch (err) {
    console.error('Error reading files:', err);
    throw err;  
  }
}

app.get('/api/data/retreiveMail/:academicYear/:year/:branch',async (req,res)=>{
  const {academicYear,year,branch}=req.params;
  let records=[];
  if(year==='noYear' && branch==='noBranch')
  {
    records=await record.find({academicYear:academicYear});
  }
  else if(year==='noYear')
  {
    records=await record.find({academicYear:academicYear,branch:branch});
  }
  else if(branch==='noBranch')
  {
    records=await record.find({academicYear:academicYear,year:year});
  }
  else
  {
    records=await record.find({academicYear:academicYear,year:year,branch:branch});
  }
  if(records.length>0)
  {
    const emails=await retreiveMails(records);
    res.send(emails);
  }
  else
  {
    res.json({'error':["Record Not found"]});
  }
});


//Display file

app.get('/api/data/:academicYear/:year/:branch/:fileName',async (req, res) => {
  const { academicYear, year, branch, fileName } = req.params;
  const foundRecord=await record.findOne({academicYear:academicYear,year:year,branch:branch});
  const filePath = path.join(__dirname, 'public', 'student_data', academicYear, year, 'Notices', branch,`${foundRecord.id}`, fileName);
  const text="s";
  try {
    const fileBuffer = await fs.readFile(filePath);
    const result = await mammoth.convertToHtml({ buffer: fileBuffer });
    const html = result.value;
    res.json({'wordContent':[html]});
  } catch (err) {
    console.error('Error processing file:', err);
    res.status(500).send('Error processing file');
  }
});


//Save edited file

app.post('/api/data/saveContent/:academicYear/:year/:branch/:fileName',async (req,res)=>{
    const {academicYear,year,branch,fileName}=req.params;
    const foundRecord=await record.findOne({academicYear:academicYear,year:year,branch:branch});
    const content=req.body.content;
    const filePath= path.join(__dirname, 'public', 'student_data', academicYear, year, 'Notices', branch,`${foundRecord.id}`, fileName);
    try {
      const plainText = htmlToText(content, {
      wordwrap: 130,
      preserveNewlines: true,
      uppercaseHeadings: false,
      singleNewLineParagraphs: true, 
    });
    
    const templatePath = path.join(__dirname, 'public','template.docx'); // Ensure this is the correct path
    const templateContent = await fs.readFile(templatePath, 'binary');
    const zip = new PizZip(templateContent);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

    // Set the data for the document
    doc.setData({ content: plainText });

    // Render the document
    doc.render();

    // Generate the output file as a binary buffer
    const buffer = doc.getZip().generate({ type: 'nodebuffer' });

    // Save the updated .docx file
    await fs.writeFile(filePath, buffer);
  
      res.redirect('/');
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).send('An error occurred while processing the request.');
    }
});

//Delete File
app.get('/api/data/deleteFile/:academicYear/:year/:branch/:fileName',async (req,res)=>{
  try {
    const { academicYear, year, branch, fileName } = req.params;
    const foundRecord = await record.findOne({ academicYear, year, branch });
    if (!foundRecord) {
      return res.status(404).send('Record not found');
    }
    const filePath = path.join(__dirname, 'public', 'student_data', academicYear, year, 'Notices', branch, foundRecord.id, fileName);
    
    await fs.unlink(filePath);
    res.status(200).json({status:"Delete Succesfully"});
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting file');
  }
});

//Send Mail

app.post('/api/data/sendMail',async (req,res)=>{
  const { subject,body,emails } = req.body;
  try {
      const auth = nodemailer.createTransport({
          service: "gmail",
          secure: true,
          port: 465,
          auth: {
              user: "abhishekshelar1262003@gmail.com",
              pass: "ttbr htww rimk fmrl"
          }
      });
      emails.map(async item=>{
        const filePath = path.join(__dirname, 'public', 'student_data', item.academicYear, item.year, 'Notices', item.branch, item.id);
        const receiver = {
          from : "abhishekshelar1262003@gmail.com",
          to : item.email,
          subject : subject,
          text : body,
          html: `<i>${body}</i>`,
          attachments: [
            {
                filename: `${item.name}.docx`,
                path: path.join(filePath,`${item.rollNo}.docx`)
            }
          ]
        };
        let info = await auth.sendMail(receiver,(error,emailResponse)=>{
            if(error)
              console.log(error);
        });
      })

  } catch (error) {
      console.error('Error occurred:', error);
      res.status(500).send('An error occurred while processing the request.');
  }
  res.json(['ok']);
});

app.post('/api/data/saveCustomFile',async (req,res)=>{
  const { academicYear, Year, branch, filecontent } = req.body;
  const content = filecontent;

  const filePath = path.join(__dirname, 'public', 'customizeFiles', academicYear, Year, branch, 'file.docx');
  const noticeDir = path.dirname(filePath);  // Directory where the file will be saved

  try {
    // Create the directory if it doesn't exist
    await fs.mkdir(noticeDir, { recursive: true });
    // pdf.create(filecontent).toFile(`${path.join(__dirname, 'public','output.pdf')}`, (err, res) => {
    //   if (err) return console.log(err);
    //   console.log(res); // { filename: '/path/to/output.pdf' }
    // });

    const options = {
      pageSize: 'A4',
    };

    const docxBuffer = await htmlToDocx(filecontent, options);
    await fs.writeFile(filePath, docxBuffer);

    const desiredFileName = `${academicYear}-${Year}-${branch}.docx`;
    res.setHeader('Content-Disposition', `attachment; filename="${desiredFileName}"`);
    res.setHeader('Content-Type', 'application/docx');
    res.sendFile(path.join(__dirname, 'public', 'customizeFiles', academicYear, Year, branch, 'file.docx'));
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('An error occurred while processing the request.');
  }
});


// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// Serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
