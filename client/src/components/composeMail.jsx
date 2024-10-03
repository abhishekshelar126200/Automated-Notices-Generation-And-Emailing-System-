import React,{useState,useEffect,useRef} from 'react';
import { fetchData } from '../api';
import { _formatNumberTwoDecimalPlacesAndCommas } from 'ag-grid-community';
import close from '../assets/close.svg'
function ComposeMail(){
    const subjectMail = useRef();
    const bodyMail = useRef();
    const [emails, setData] = useState([]);
    const [academicYear,setacademicYear]=useState(localStorage.getItem('academicYearMail') || '2021-22');
    const [branch,setBranch]=useState(localStorage.getItem('branchMail') ||'noBranch');
    const [year,setYear]=useState(localStorage.getItem('yearMail') ||'noYear')
    const [subject,setSubject]=useState(localStorage.getItem('subjectMail') ||'')
    const [body,setBody]=useState(localStorage.getItem('bodyMail') ||'')

    const handleAcademicYearChange=(event)=>{
        setacademicYear(event.target.value);
        localStorage.setItem('academicYearMail',event.target.value)
    }
    
      
    const handleYearChange=(event)=>{
        setYear(event.target.value);
        localStorage.setItem('yearMail',event.target.value)
    }
    
      
    const handleBranchChange=(event)=>{
        setBranch(event.target.value);
        localStorage.setItem('branchMail',event.target.value)
    }

    const handleSubjectChange=(event)=>{
        setSubject(event.target.value);
        localStorage.setItem('subjectMail',event.target.value)
    }

    const handleBodyChange=(event)=>{
        setBody(event.target.value);
        localStorage.setItem('bodyMail',event.target.value)
    }

    const sendMail=async (event)=>{
        event.preventDefault();
        const body={
            subject:subjectMail.current.value,
            body:bodyMail.current.value,
            emails:emails
        }

        console.log(body);
        try {
            const response = await fetch('/api/data/sendMail', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(body),
            });
    
            const result = await response.text();
            console.log('Success:', result);
          } catch (error) {
            console.error('Error:', error);
          }
    }
    useEffect(()=>{
        if(academicYear==='2021-22')
        {
          fetchData(`retreiveMail/2021-22/${year}/${branch}`).then((data) => setData(data));
        }
        else if(academicYear==='2022-23')
        {
          fetchData(`retreiveMail/2022-23/${year}/${branch}`).then((data) => setData(data));
        }
        else if(academicYear==='2023-24')
        {
          fetchData(`retreiveMail/2023-24/${year}/${branch}`).then((data) => setData(data));
        }
        else if(academicYear==='2024-25')
        {
          fetchData(`retreiveMail/2024-25/${year}/${branch}`).then((data) => setData(data));
        }
      
    },[academicYear,year,branch]);

    return(
        <>
            <form action="/api/data/sendMail" method="POST" className='flex flex-col gap-5 p-2' onSubmit={sendMail}>
                <div className='flex justify-between'>
                    <div>To:</div>
                    <div className='w-[90%] h-[30px] flex'>
                        <select name="academicYear" id="academicYear" value={academicYear} onChange={handleAcademicYearChange} className='w-[33%] border border-gray-400 rounded-md'>
                            <option value="">Academic Year</option>
                            <option value="2021-22">2021-22</option>
                            <option value="2022-23">2022-23</option>
                            <option value="2023-24">2023-24</option>
                            <option value="2024-25">2024-25</option>
                        </select>
                        <select name="Year" id="Year" value={year} onChange={handleYearChange} className='w-[33%] border border-gray-400 rounded-md'>
                            <option value="noYear">No Year Selected</option>
                            <option value="BE">BE</option>
                            <option value="TE">TE</option>
                            <option value="SE">SE</option>
                            <option value="FE">FE</option>
                        </select>
                        <select name="branch" id="branch" value={branch} onChange={handleBranchChange} className='w-[33%] border border-gray-400 rounded-md'>
                            <option value="noBranch">No Branch Selected</option>
                            <option value="IT">Information Technology</option>
                            <option value="COMP">Computer Engineering</option>
                            <option value="ENTC">Electronics And Telecommunication</option>
                            <option value="AIDS">Artificial Intelligence And Data Science</option>
                        </select>
                    </div>
                </div>
               

                <div className='flex justify-between'>
                    <div className='w-[100px]'>
                        Subject:
                    </div>
                    <input type="text" ref={subjectMail} name="subject" id="" value={subject} onChange={handleSubjectChange} placeholder='Subject'
                        className='w-[89%] h-[30px] outline-none border border-gray-300 rounded-md p-1 text-sm' required/>
                </div>

                <div className='flex justify-between'>
                    <div className='w-[100px]'>
                        Body:
                    </div>
                    <textarea name="body" ref={bodyMail} id="" value={body} onChange={handleBodyChange} placeholder='Body'
                        className='w-[89%] h-[150px] outline-none border border-gray-300 rounded-md p-1 text-sm' required>

                    </textarea>
                </div>

                <div className='flex justify-between'>
                    <div className='w-[100px]'>Recepients:</div>
                    <div className='border border-black w-[89%] h-[170px] overflow-scroll p-2'>
                        {
                                emails.length>0 ? 
                               
                                    <div className='flex flex-wrap'>
                                    {
                                         emails.map((item,index)=>(
                                            <div className='w-1/2  mb-1 flex justify-around items-center border rounded-md hover:bg-gray-200' key={index}>
                                                <span className=''>{item.email}</span>
                                                <img src={close} className='w-3 hover:w-4' alt="" />
                                            </div>
                                        ))
                                    }
                                    
                                </div>
                                :

                                "Records Not Found"
                                        
            
                        }
                    </div>
                </div>
                <div className='text-center'>
                    <button type='submit' className='border p-1 px-3 rounded-md bg-blue-600 text-white'>Send Mail</button>
                </div>
                
            </form>
        </>
    );
}

export default ComposeMail;
