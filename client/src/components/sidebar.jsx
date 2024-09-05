import React from 'react';
import {Link} from 'react-router-dom'
function Sidebar()
{
    return(
        <>
            <div className='flex flex-col items-center text-start py-2 gap-5'>
                <div className='flex flex-col gap-2 items-center border-b w-full border-gray-400'>
                    <div className='p-1 w-9 h-9 text-white rounded-full text-center bg-green-700'>A</div>
                    <div className='text-gray-500'>Abhishek Shelar</div>
                </div>
                <Link className='text-gray-500  border-b w-full border-gray-400 pl-3'>
                    Home
                </Link>
                <Link className='text-gray-500  border-b w-full border-gray-400 pl-3'>
                    Your Profile
                </Link>
                <Link to="/displayRecords" className='text-gray-500  border-b w-full border-gray-400 pl-3'>
                    Generated Notices Details
                </Link>
                <Link className='text-gray-500  border-b w-full border-gray-400 pl-3'>
                    Customize word File
                </Link>
            </div>
        </>
    );
}


export default Sidebar;