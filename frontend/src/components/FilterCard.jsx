import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'

const filterData=[
  {
    filterType:"Location",
    array:["Delhi","Bangalore","Pune","Mumbai","Hyderabad"]
  },
  {
    filterType:"Position",
    array:["Frontend Developer","Backend Developer","Full Stack Developer","Data Analyst","Graphic Designer"]
  },
  {
    filterType:"Salary",
    array:["0-5LPA","5-10LPA","10-15LPA"]
  },
 
]


const FilterCard = () => {
  const [selectedValue,setSelectedValue]=useState("");
  const dispatch=useDispatch();

  const changeHandler= (value)=>{
    setSelectedValue(value);
  }
  useEffect(()=>{
    dispatch(setSearchedQuery(selectedValue));
  },[selectedValue])
  return (
    <div className='w-full bg-white p-3 rounded-md'>
      <h1 className='font-bold text-lg'>Filter Jobs</h1>
      <hr className='mt-3'/>
      <RadioGroup value={selectedValue} onValueChange={changeHandler}>
        {
          filterData.map((data,index)=>(
            <div key={index}> 
              <h1 className='font-bold text-lg'>{data.filterType}</h1>
              {
                data.array.map((item,idx)=>{
                  const itemId=`id${index}-${idx}`               //${index} refers to the index of location,position and idx to location=>pune,etc.

                  return (
                    <div key={idx} className='flex items-center space-x-2 my-2 '> 
                      <RadioGroupItem value={item} id={itemId} className='cursor-pointer' />
                      <Label htmlFor={itemId}>{item}</Label>
                    </div>
                  )
                })
              }
            </div>
          ))
        }
      </RadioGroup>
    </div>
  )
}

export default FilterCard