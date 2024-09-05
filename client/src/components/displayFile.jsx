import React,{useState, useEffect} from 'react';
import { useParams,Link } from 'react-router-dom';
import { fetchData } from '../api';

function DisplayFile(props)
{
    
    const [data,setData]=useState({});
    const [editable,setEdit]=useState(props.edit);
    const { academicYear, year, branch, fileName } = useParams();
    localStorage.setItem('editable',localStorage.getItem('editable') || false);
    const permitEdit=async ()=>{
        setEdit(!editable)
        await localStorage.setItem('editable',!localStorage.getItem('editable'));
    }
    const handleSubmit=(e)=>{
        e.preventDefault();
        const contentDiv = document.getElementById('content');
        const updatedContent = contentDiv.innerHTML;
        document.getElementById('hiddenContent').value = updatedContent;
        e.target.submit();
    };
    

    useEffect(()=>{
        fetchData(`${academicYear}/${year}/${branch}/${fileName}`).then((data) => setData(data));
    },[])
    return (
        <>
            <form method="POST" action={`/saveContent/${academicYear}/${year}/${branch}/${fileName}`} className='w-full h-full flex flex-col items-center py-3 gap-2' onSubmit={handleSubmit}>
                <div id="content" className='w-[90%] h-[90%] shadow-2xl p-5 outline-none border border-gray-400 rounded-lg overflow-auto' 
                    contentEditable={`${editable}`} 
                    dangerouslySetInnerHTML={{ __html: data['wordContent'] }}
                />
                <input type="hidden" id="hiddenContent" name="content" />
                {
                    editable ?
                    <div className='flex gap-5'>
                         <button type="submit" className='p-1 px-8 bg-green-600 rounded-md cursor-pointer  text-white'>Save</button>
                         <div onClick={()=>{permitEdit()}} className='p-1 px-8 bg-blue-600 rounded-md cursor-pointer  text-white'>Cancel</div>
                    </div>
                     :
                    <div onClick={()=>{permitEdit()}} className='p-1 cursor-pointer px-8 bg-blue-600 rounded-md text-white'>Edit</div>    
                }
            </form>
        </>
    );
}

export default DisplayFile;