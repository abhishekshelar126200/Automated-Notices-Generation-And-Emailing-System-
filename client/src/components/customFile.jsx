import React,{useState} from 'react';
import MonacoEditor from '@monaco-editor/react';

function CustomFile(){
    const [fileData,setfileData]=useState(localStorage.getItem('fileData') || 'Customize the content of file');
    const setFileData=(value)=>{
        setfileData(value);
        localStorage.setItem('fileData',value);
    }
    return(
        <>
        <div className='flex justify-start h-full w-full'>   
            <div className='w-1/2 h-full p-1'>
                <MonacoEditor
                    defaultLanguage="html"
                    value={fileData}
                    onChange={(value) => setFileData(value)}
                    options={{
                    automaticLayout: true,
                    wordWrap: "on",
                    minimap: { enabled: false },
                    }}
                />
            </div>
            
            <div className='border border-black h-full w-1/2 p-1' dangerouslySetInnerHTML={{ __html: fileData }}>
            </div>
        </div>
            
        </>
    );
}

export default CustomFile;