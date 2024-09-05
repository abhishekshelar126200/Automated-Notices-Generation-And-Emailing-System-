import React, { useEffect, useState } from 'react';
import { fetchData } from '../api';
import { Link } from 'react-router-dom';
import './style.css'
import pen from '../assets/pen.svg'
import remove from '../assets/delete.svg'

function First() {
  const [filesData, setData] = useState({});
  const [academicYear,setacademicYear]=useState(localStorage.getItem('academicYear') || '2021-22');
  const [branch,setBranch]=useState(localStorage.getItem('branch') ||'noBranch');
  const [year,setYear]=useState(localStorage.getItem('year') ||'noYear')
  const handleClick=(year)=>{
      localStorage.setItem('academicYear',year);
      setacademicYear(localStorage.getItem('academicYear'));
  }

  // const handleSubmit=(e)=>{
  //   e.preventDefault();
  //   const contentDiv = document.getElementById('content');
  //   const updatedContent = contentDiv.innerHTML;
  //   document.getElementById('hiddenContent').value = updatedContent;
  //   e.target.submit();
  // };

  const handleAcademicYearChange=(event)=>{
    setacademicYear(event.target.value);
    localStorage.setItem('academicYear',event.target.value)
  }

  
  const handleYearChange=(event)=>{
    setYear(event.target.value);
    localStorage.setItem('year',event.target.value)
  }

  
  const handleBranchChange=(event)=>{
    setBranch(event.target.value);
    localStorage.setItem('branch',event.target.value)
  }

  useEffect(()=>{
      if(academicYear==='2021-22')
      {
        fetchData(`retreiveFiles/2021-22/${year}/${branch}`).then((data) => setData(data));
      }
      else if(academicYear==='2022-23')
      {
        fetchData(`retreiveFiles/2022-23/${year}/${branch}`).then((data) => setData(data));
      }
      else if(academicYear==='2023-24')
      {
        fetchData(`retreiveFiles/2023-24/${year}/${branch}`).then((data) => setData(data));
      }
      else if(academicYear==='2024-25')
      {
        fetchData(`retreiveFiles/2024-25/${year}/${branch}`).then((data) => setData(data));
      }
    
  },[academicYear,year,branch]);


  
  return (
        <>

          <div className='w-full flex flex-col justify-center items-center min-h-[20%] gap-2'>
              <div className='flex w-full justify-between h-[40px]'>
                <div onClick={()=>{handleClick('2021-22')}} className={`w-1/4 text-center ${ academicYear==='2021-22' ? "border-b-2": "" } border-blue-500 rounded-lg cursor-pointer`}><div>2021-22</div></div>
                <div onClick={()=>{handleClick('2022-23')}} className={`w-1/4 text-center ${ academicYear==='2022-23' ? "border-b-2": "" } border-blue-500 rounded-lg cursor-pointer`}><div>2022-23</div></div>
                <div onClick={()=>{handleClick('2023-24')}} className={`w-1/4 text-center ${ academicYear==='2023-24' ? "border-b-2": "" } border-blue-500 rounded-lg cursor-pointer`}><div>2023-24</div></div>
                <div onClick={()=>{handleClick('2024-25')}} className={`w-1/4 text-center ${ academicYear==='2024-25' ? "border-b-2": "" } border-blue-500 rounded-lg cursor-pointer`}><div>2024-25</div></div>
              </div>
              <div className='w-full h-[40px] flex justify-evenly'>
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
          <div className='h-[80%] flex flex-col gap-5 overflow-scroll'>
            {Object.keys(filesData).map((keyYear,yearIndex)=>(
              Object.keys(filesData[keyYear]).map((keyBranch,branchIndex)=>(
                    keyYear === "BE" ? (
                      <div id="BE" className='h-full relative'>
                          <h1 className='h-[15%] p-1 border bg-gray-100'>BE-{keyBranch}</h1>
                          {filesData[keyYear] && filesData[keyYear][keyBranch] && filesData[keyYear][keyBranch].length > 0 ? (
                            <div className='class h-[85%] p-2 flex flex-wrap gap-5 justify-between border overflow-scroll'>
                              {filesData[keyYear][keyBranch].map((file, fileIndex) => (
                                
                                  <div className='w-[20%] h-[60px] border text-xs rounded-md' key={fileIndex}>
                                    <div className='bg-gray-100 h-[30px] p-1 text-center text-blue-500'>
                                    <Link to={`/${academicYear}/${keyYear}/${keyBranch}/${file}`}>
                                        {file}
                                    </Link>
                                    </div>
                                    <div className='h-[30px] flex justify-around'>
                                        <Link to={`/editFile/${academicYear}/${keyYear}/${keyBranch}/${file}`}>
                                            <img src={`${pen}`} className='w-4' alt="" />
                                        </Link>
                                        <form action={`/deleteFile/${academicYear}/${keyYear}/${keyBranch}/${file}`} method='GET'>
                                            <button type='submit'><img src={`${remove}`} className='w-4' alt="" /></button>
                                        </form>
                                    </div>
                                  </div>
                                
                              ))}
                               <div className='absolute bottom-0 p-1 px-3 rounded-md bg-red-600 text-white'>
                                <a href={`/sendMail/${academicYear}/${keyYear}/${keyBranch}`}>Send Mail</a>
                              </div>
                            </div>
                          ) : (
                            <div className='h-[85%] p-2'>
                                <div className='p-1 w-[20%] h-[50px] text-xs'>
                                  Record Not Found
                                </div>
                            </div>
                          )}
                      </div>
                    ) : keyYear === "TE" ? (
                      <div id="TE" className='h-full relative'>
                          <h1 className='h-[15%] p-1 border bg-gray-100'>TE-{keyBranch}</h1>
                          {filesData[keyYear] && filesData[keyYear][keyBranch] && filesData[keyYear][keyBranch].length > 0 ? (
                            <div className='class h-[85%] p-2 flex flex-wrap gap-5 justify-between border overflow-scroll'>
                              {filesData[keyYear][keyBranch].map((file, fileIndex) => (
                                <div className='w-[20%] h-[60px] border text-xs rounded-md' key={fileIndex}>
                                <div className='bg-gray-100 h-[30px] p-1 text-center text-blue-500'>
                                    <Link to={`/${academicYear}/${keyYear}/${keyBranch}/${file}`}>
                                        {file}
                                    </Link>
                                </div>
                                <div className='h-[30px] flex justify-around items-center'>
                                    <Link to={`/editFile/${academicYear}/${keyYear}/${keyBranch}/${file}`}>
                                        <img src={`${pen}`} className='w-4' alt="" />
                                    </Link>
                                    <form action={`/deleteFile/${academicYear}/${keyYear}/${keyBranch}/${file}`} method='GET'>
                                        <button type='submit'><img src={`${remove}`} className='w-4' alt="" /></button>
                                    </form>
                                </div>
                              </div>
                              ))}
                              <div className='absolute bottom-0 p-1 px-3 rounded-md bg-red-600 text-white'>
                                <a href={`/sendMail/${academicYear}/${keyYear}/${keyBranch}`}>Send Mail</a>
                              </div>
                            </div>
                          ) : (
                            <div className='h-[85%] p-2'>
                                <div className='p-1 w-[20%] h-[50px] text-xs'>
                                  Record Not Found
                                </div>
                            </div>
                          )}
                      </div>
                    ) : keyYear === "SE" ? (
                      <div id="SE" className='min-h-full relative'>
                          <h1 className='min-h-[15%] p-1 border bg-gray-100'>SE-{keyBranch}</h1>
                          {filesData[keyYear] && filesData[keyYear][keyBranch] && filesData[keyYear][keyBranch].length > 0 ? (
                            <div className='class h-[85%] p-2 flex flex-wrap gap-5 justify-between border overflow-scroll'>
                              {filesData[keyYear][keyBranch].map((file, fileIndex) => (
                                <div className='w-[20%] h-[60px] border text-xs rounded-md' key={fileIndex}>
                                  <div className='bg-gray-100 h-[30px] p-1 text-center text-blue-500'>
                                    <Link to={`/${academicYear}/${keyYear}/${keyBranch}/${file}`}>
                                        {file}
                                    </Link>
                                  </div>
                                  <div className='h-[30px] flex justify-around items-center'>
                                    <Link to={`/editFile/${academicYear}/${keyYear}/${keyBranch}/${file}`}>
                                        <img src={`${pen}`} className='w-4' alt="" />
                                    </Link>
                                    <form action={`/deleteFile/${academicYear}/${keyYear}/${keyBranch}/${file}`} method='GET'>
                                        <button type='submit'><img src={`${remove}`} className='w-4' alt="" /></button>
                                    </form>
                                </div>
                              </div>
                              ))}
                              <div className='absolute bottom-0 p-1 px-3 rounded-md bg-red-600 text-white'>
                                <a href={`/sendMail/${academicYear}/${keyYear}/${keyBranch}`}>Send Mail</a>
                              </div>
                            </div>
                            
                          ) : (
                            <div className='h-[85%] p-2'>
                                <div className='p-1 w-[20%] h-[50px] text-xs'>
                                  Record Not Found
                                </div>
                            </div>
                          )}
                      </div>
                    ) : keyYear === "FE" ? (
                      <div id="FE" className='h-full relative'>
                          <h1 className='h-[15%] p-1 border bg-gray-100'>FE-{keyBranch}</h1>
                          {filesData[keyYear] && filesData[keyYear][keyBranch] && filesData[keyYear][keyBranch].length > 0 ? (
                            <div className='class h-[85%] p-2 flex flex-wrap gap-5 justify-between border overflow-scroll'>
                              {filesData[keyYear][keyBranch].map((file, fileIndex) => (
                                <div className='w-[20%] h-[60px] border text-xs rounded-md' key={fileIndex}>
                                <div className='bg-gray-100 h-[30px] p-1 text-center text-blue-500'>
                                    <Link to={`/${academicYear}/${keyYear}/${keyBranch}/${file}`}>
                                        {file}
                                    </Link>
                                </div>
                                <div className='h-[30px] flex justify-around items-center'>
                                    <Link to={`/editFile/${academicYear}/${keyYear}/${keyBranch}/${file}`}>
                                        <img src={`${pen}`} className='w-4' alt="" />
                                    </Link>
                                    <form action={`/deleteFile/${academicYear}/${keyYear}/${keyBranch}/${file}`} method='GET'>
                                        <button type='submit'><img src={`${remove}`} className='w-4' alt="" /></button>
                                    </form>
                                </div>
                              </div>
                              ))}
                              <div className='absolute bottom-0 p-1 px-3 rounded-md bg-red-600 text-white'>
                                <a href={`/sendMail/${academicYear}/${keyYear}/${keyBranch}`}>Send Mail</a>
                              </div>
                            </div>
                          ) : (
                            <div className='h-[85%] p-2'>
                                <div className='p-1 w-[20%] h-[50px] text-xs'>
                                  Record Not Found
                                </div>
                            </div>
                          )}
                      </div>
                    ) : (
                      <div className='h-[85%] p-2'>
                                <div className='p-1 w-[20%] h-[50px] text-xs'>
                                  Record Not Found
                                </div>
                      </div>
                    )
              ))
              
            ))}
          </div>
          
        </>
    
    );
  }
  
  export default First;