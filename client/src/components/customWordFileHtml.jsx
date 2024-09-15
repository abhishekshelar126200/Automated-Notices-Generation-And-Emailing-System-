import React,{useState} from 'react';
import MonacoEditor from '@monaco-editor/react';

function CustomFile(){
    const [fileDataHtml,setfileData]=useState(localStorage.getItem('fileDataHtml') || 'Customize the content of file');
    const setFileData=(value)=>{
        setfileData(value);
        localStorage.setItem('fileDataHtml',value);
    }
    return(
        <>
        <div className='flex flex-col justify-start h-full w-full'> 
        <form action='/api/data/saveCustomFile' method="POST" className='w-full h-[40px] flex mb-5 justify-center gap-5 items-end'>
                 <select name="academicYear" id="academicYear" className='w-[25%] h-3/4 border border-gray-400 rounded-md' required>
                    <option value="">Academic Year</option>
                    <option value="2021-22">2021-22</option>
                    <option value="2022-23">2022-23</option>
                    <option value="2023-24">2023-24</option>
                    <option value="2024-25">2024-25</option>
                 </select>
                 <select name="Year" id="Year" className='w-[25%] h-3/4 border border-gray-400 rounded-md' required>
                    <option value="noYear">No Year Selected</option>
                    <option value="BE">BE</option>
                    <option value="TE">TE</option>
                    <option value="SE">SE</option>
                    <option value="FE">FE</option>
                 </select>
                 <select name="branch" id="branch" className='w-[25%] h-3/4 border border-gray-400 rounded-md' required>
                     <option value="noBranch">No Branch Selected</option>
                     <option value="IT">Information Technology</option>
                     <option value="COMP">Computer Engineering</option>
                     <option value="ENTC">Electronics And Telecommunication</option>
                     <option value="AIDS">Artificial Intelligence And Data Science</option>
                 </select>
                 <input type="text" name="filecontent" value={fileDataHtml} className='hidden'/>
                <button type='submit' className='border w-[7%] h-3/4 rounded-md bg-green-500 text-white'>Save</button>
            </form>
            
            <div className='flex h-full overflow-scroll border-t border-gray-400'>
                <div className='w-1/2'>
                    <MonacoEditor
                        defaultLanguage="html"
                        value={fileDataHtml}
                        onChange={(value) => setFileData(value)}
                        options={{
                        automaticLayout: true,
                        wordWrap: "on",
                        minimap: { enabled: false },
                        }}
                    />
                </div>
                
                <div className='w-1/2 overflow-scroll' dangerouslySetInnerHTML={{ __html: fileDataHtml }}>
                </div>
            </div>

        </div>
            
        </>
    );
}

export default CustomFile;