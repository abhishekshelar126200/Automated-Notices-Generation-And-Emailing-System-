// client/src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Add from './components/Add';
import First from './components/First';
import Display from './components/displayRecords';
import DisplayFile from './components/displayFile';
import CustomFile from './components/customFile';

function App() {
  const [activeNav,setActivenav]=useState(parseInt(localStorage.getItem('activeNav'),10) || 1);
  const handleanotherClick=(nav)=>{
    setActivenav(nav);
    localStorage.setItem('activeNav',nav)
  }


  return (
    <Router>
      <div className='h-screen w-screen'>
        <header className='w-full border-b flex justify-between h-[10%]'>  
            <div className='w-[70%] py-2 px-14 font-medium text-lg flex items-center'><Link>AUNGES</Link></div>
            <div className='flex w-[30%] justify-around items-center p-2 font-medium'>
                <Link to="/" onClick={()=>{handleanotherClick(1)}} className={`${activeNav === 1 ? "border-b-2" :""} border-blue-500 rounded-lg p-2`}><div>Home</div></Link>
                <Link to="/addRecord" onClick={()=>{handleanotherClick(2)}} className={`${activeNav === 2 ? "border-b-2" :""} border-blue-500 rounded-lg p-2`}><div>Add Record</div></Link>
                <Link className='px-3 py-1 bg-blue-600 text-white rounded-md'><div>Log Out</div></Link>
            </div>
        </header>

        <main className='w-full h-[90%] flex'>
            <div className='h-full w-[18%] flex flex-col border'>
                {/* <Routes>
                  <Route path='/' element={<Sidebar />}/>
                </Routes> */}
                <div className='flex flex-col items-center text-start py-2 gap-5'>
                    <div className='flex flex-col gap-2 items-center border-b w-full border-gray-400'>
                        <div className='p-1 w-9 h-9 text-white rounded-full text-center bg-green-700'>A</div>
                        <div className='text-gray-500'>Abhishek Shelar</div>
                    </div>
                    <Link to="/" className='text-gray-500  border-b w-full border-gray-400 pl-3'>
                        Home
                    </Link>
                    <Link className='text-gray-500  border-b w-full border-gray-400 pl-3'>
                        Your Profile
                    </Link>
                    <Link to="/displayRecords" className='text-gray-500  border-b w-full border-gray-400 pl-3'>
                        Generated Notices Details
                    </Link>
                    <Link to="/customFile" className='text-gray-500  border-b w-full border-gray-400 pl-3'>
                        Customize word File
                    </Link>
                </div>
              </div>
            <div className='h-full w-[82%] border'>
                  <Routes>
                      <Route path="/" element={<First />} />
                      <Route path="/addRecord" element={<Add />} />
                      <Route path="/displayRecords" element={<Display />} />
                      <Route path="/:academicYear/:year/:branch/:fileName" element={<DisplayFile edit={false}/>} />
                      <Route path="/editFile/:academicYear/:year/:branch/:fileName" element={<DisplayFile edit={true}/>} />
                      <Route path="/customFile" element={<CustomFile />} />
                  </Routes>
            </div>
        </main>
      </div>
    </Router>
  );
}
export default App;