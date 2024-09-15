import React,{useState} from 'react';
import MonacoEditor from '@monaco-editor/react';
import {Link} from 'react-router-dom'

function CustomFile(){
    
    return(
        <>
            <div className='border flex'>   
                <Link to='/customWordFileHtml' className='border-b-2 border-blue-500 w-1/2 text-center'>HTML</Link>
                <Link to='/customWordFileEditor' className='w-1/2 text-center'>Editor</Link>
            </div>
            
        </>
    );
}

export default CustomFile;