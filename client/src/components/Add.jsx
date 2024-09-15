import React,{useRef,useState} from 'react';
import { Link } from 'react-router-dom';

function Add(){
    const wordFile=useRef(null);
    const excelFile=useRef(null);
    const [disablewordserver,setWordServer]=useState(false)
    const [disablewordlocal,setWordLocal]=useState(false)
    const [disableexcellocal,setExcelLocal]=useState(false)
    const [disableexcelserver,setExcelServer]=useState(false)
    const disableWordServer = (event) => {
        if (event.target.files.length > 0) {
          setWordServer(true);
        } else {
          setWordServer(false);
        }
    };
    
    // Handle server file input change
    const disableWordLocal = (event) => {
        if (event.target.files.length > 0) {
            setWordLocal(true);
        } else {
            setWordLocal(false);
        }
    };

    const disableExcelServer = (event) => {
        if (event.target.files.length > 0) {
          setExcelServer(true);
        } else {
          setExcelServer(false);
        }
    };
    
    // Handle server file input change
    const disableExcelLocal = (event) => {
        if (event.target.files.length > 0) {
            setExcelLocal(true);
        } else {
            setExcelLocal(false);
        }
    };
    return(
        <>
            <div className='w-full h-full bg-gray-100'>
                <form action="/api/data/addRecord" method='POST' enctype="multipart/form-data" className='w-full flex flex-col gap-5 py-5 border-b border-gray-400'>
                    <div className='flex gap-10 flex-wrap justify-center'>
                        <div className='w-[30%] flex flex-col'>
                            <label htmlFor="academicYear" className='text-sm text-red-500'>*</label>
                            <select name="academicYear" id="academicYear" className='border p-2 rounded-lg' required>
                                <option value="">Academic Year</option>
                                <option value="2021-22">2021-22</option>
                                <option value="2022-23">2022-23</option>
                                <option value="2023-24">2023-24</option>
                                <option value="2024-25">2024-25</option>
                            </select>
                        </div>
                        <div className='w-[30%] flex flex-col'>
                            <label htmlFor="year" className='text-sm text-red-500'>*</label>
                            <select name="year" id="year" className='border p-2 rounded-lg' required>
                                <option value="">Year</option>
                                <option value="BE">BE</option>
                                <option value="TE">TE</option>
                                <option value="SE">SE</option>
                                <option value="FE">FE</option>
                            </select>
                        </div>
                        <div className='w-[30%] flex flex-col'>
                            <label htmlFor="branch" className='text-sm text-red-500'>*</label>
                            <select name="branch" id="branch" className='border p-2 rounded-lg' required>
                                <option value="">Branch</option>
                                <option value="IT">Information Technology</option>
                                <option value="COMP">Computer Engineering</option>
                                <option value="ENTC">Electronics And Telecommunication</option>
                                <option value="AIDS">Artificial Intelligence And Data Science</option>
                            </select>
                        </div>
                        
                        <div className='flex w-full px-3 gap-12'>
                            <div className='flex flex-col w-[30%]'>
                                <label htmlFor="wordFile" className='text-xs text-red-500'>* Select from Local files</label>
                                <input type="file" name="wordFile" id="wordFile" accept=".doc,.docx" onChange={(disableWordServer)} disabled={disablewordlocal} required={!disablewordlocal}/>
                                <div>or</div>
                                <label htmlFor="wordFile" className='text-xs text-red-500'>* Select from Customize files</label>
                                <input type="file" name="wordFile" id="wordFile" accept=".doc, .docx" onChange={(disableWordLocal)} disabled={disablewordserver} required={!disablewordserver}/>
                            </div>
                            <div className='flex flex-col w-[30%]'>
                                <label htmlFor="excelFile" className='text-xs text-red-500'>* Browse excel file</label>
                                <input type="file" name="excelFile" id="excelFile" accept=".xls, .xlsx" onChange={(disableExcelServer)} disabled={disableexcellocal} required={!disableexcellocal}/>
                                <div>or</div>
                                <label htmlFor="excelFile" className='text-xs text-red-500'>* Select from server</label>
                                <input type="file" name="excelFile" id="excelFile" accept=".xls, .xlsx" onChange={(disableExcelLocal)} disabled={disableexcelserver} required={!disableexcelserver}/>
                            </div>
                        </div>
                        <div className='w-full text-center'>
                            <button type="submit" className='border px-8 py-1 rounded-lg bg-blue-500 text-white'>Submit</button>
                        </div>
                    </div>
                </form>

                <div className='w-full p-2 flex flex-col gap-3'>
                    <h1 className='font-medium text-lg'>Instruction's</h1>
                    <ul className="text-sm flex flex-col gap-2">
                        <li className="flex gap-3"><span className='text-red-500 text-lg'>*</span>All fields are mandatory.</li>
                        <li className="flex gap-3"><span className='text-red-500 text-lg'>*</span>Size of Excel file and Word File should be less than 3 MB.</li>
                        <li className="flex gap-3"><span className='text-red-500 text-lg'>*</span>Please check the content in excel file and word file.</li>
                        <li className="flex gap-3"><span className='text-red-500 text-lg'>*</span>Once submited the records cannot be change until deleted and recreate.</li>
                    </ul>
                </div>
            </div>
           
        </>
    );
}

export default Add;