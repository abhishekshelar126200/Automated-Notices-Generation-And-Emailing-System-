import React, { useEffect,useState } from 'react';
import { fetchData } from '../api';
import {Link} from 'react-router-dom';
import './style.css'

function Display(){
    const [data,setData]=useState([]);
    useEffect(()=>{
        fetchData('records').then((data) => setData(data));
    });
    // const data = [
    //     {
    //       srno: 1,
    //       academicYear: '2023-2024',
    //       year: 'Fourth',
    //       branch: 'Electronics and Telecommunication',
    //       wordFile: 'report.docx',
    //       excelFile: 'data.xlsx',
    //       delete: 'Delete'
    //     },
    //     {
    //       srno: 2,
    //       academicYear: '2022-2023',
    //       year: 'Third',
    //       branch: 'Computer Science',
    //       wordFile: 'project.docx',
    //       excelFile: 'results.xlsx',
    //       delete: 'Delete'
    //     },
    //     {
    //       srno: 3,
    //       academicYear: '2023-2024',
    //       year: 'Second',
    //       branch: 'Mechanical Engineering',
    //       wordFile: 'design.docx',
    //       excelFile: 'mechanics.xlsx',
    //       delete: 'Delete'
    //     },
    //     {
    //       srno: 4,
    //       academicYear: '2021-2022',
    //       year: 'First',
    //       branch: 'Civil Engineering',
    //       wordFile: 'blueprint.docx',
    //       excelFile: 'structures.xlsx',
    //       delete: 'Delete'
    //     },
    //     {
    //       srno: 5,
    //       academicYear: '2023-2024',
    //       year: 'Fourth',
    //       branch: 'Information Technology',
    //       wordFile: 'thesis.docx',
    //       excelFile: 'statistics.xlsx',
    //       delete: 'Delete'
    //     }
    //   ];
      
      
    return(
        <div className="w-full h-full">
        <table className="w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-white divide-y divide-gray-200">
            <tr>
                <th className="w-1/12 px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase border">Sr. No</th>
                <th className="w-2/12 px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase border">Academic Year</th>
                <th className="w-1/12 px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase border">Year</th>
                <th className="w-3/12 px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase border">Branch</th>
                <th className="w-2/12 px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase border">Word File</th>
                <th className="w-2/12 px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase border">Excel File</th>
                <th className="w-1/12 px-1 py-1 text-left text-xs font-medium text-gray-500 uppercase border">Delete</th>
            </tr>
            </thead>
        </table>
        
        <div className="w-full h-[90%] overflow-scroll class">
            <table className="w-full table-fixed divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item, index) => (
                <tr key={index}>
                    <td className="w-1/12 px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase border">{index + 1}</td>
                    <td className="w-2/12 px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase border">{item.academicYear}</td>
                    <td className="w-1/12 px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase border">{item.year}</td>
                    <td className="w-3/12 px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase border">{item.branch}</td>
                    <td className="w-2/12 px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase border">{item.wordFile}</td>
                    <td className="w-2/12 px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase border">{item.excelFile}</td>
                    <td className="w-1/12 px-1 py-1 text-left text-xs font-medium uppercase border text-white">
                    <form action={`/api/data/deleteRecord/${item.id}`} method="POST">
                        <button type="submit" className="bg-red-600 p-1.5 rounded-md text-xs">
                        Delete
                        </button>
                    </form>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>

      
    
    );

}

export default Display;