import React from 'react';


function Edit(){
    return(
        <>
            <div className='w-full h-full flex justify-center items-center'>
                <textarea name="fileContent" id="fileContent" className='w-[90%] h-[90%] shadow-2xl p-5 outline-none border border-gray-400 rounded-lg'>Hello</textarea>
            </div>
        </>
    );
}

export default Edit;