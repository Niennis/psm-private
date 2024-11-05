'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { Switch, TextField } from '@mui/material';


const Days = ({ day, startTime, setStartTime, endTime, setEndTime }) => {

  const [hours, setHours] = useState([])
  const { register,
    formState: { errors }
  } = useForm()

  const label = { inputProps: { 'aria-label': 'Switch demo' } };

  const handleClick = () => {
    'holo'
  }

  const handleAddHours = (event) => {
    let key = hours.length
    event.preventDefault()
    const newHour = [
      ...hours,
      <div className='row' key={key}>
        <div className="col-12 col-md-6 col-xl-4">
          <div className="form-group local-forms">
            <label>
              Desde <span className="login-danger">*</span>
            </label>
            <TextField
              className="form-control"
              // id="outlined-controlled"
              type="time"
              value={startTime}
              onChange={(event) => {
                setStartTime(event.target.value);
              }}
            />
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-4">
          <div className="form-group local-forms">
            <label>
              Hasta <span className="login-danger">*</span>
            </label>
            <TextField
              className="form-control"
              // id="outlined-controlled"
              type="time"
              value={endTime}
              onChange={(event) => {
                setEndTime(event.target.value);
              }}
            />
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-2">
          <div className="form-group local-forms">
            <button className="btn cancel-form" onClick={() => { handleDeleteHour(key) }}>
              <i className="fa fa-trash-alt m-r-5"></i>
            </button>
          </div>
        </div>
      </div>
    ];
    setHours(newHour);
  }

  const handleDeleteHour = (indexToRemove) => {
    console.log('indexToRemove', indexToRemove);
    const updatedItems = hours.filter((_, index) => index !== indexToRemove);
    setHours(updatedItems);
    // console.log('key', key)
    // const newArray = []
    // const left = []
    // //hours.filter((_, i) => i !== key);

    // for (let index = 0; index < hours.length; index++) {
    //   if(parseInt(index) === parseInt(key) ){
    //     left.push(hours[index]);
    //   } else {
    //     newArray.push(hours[index])
    //   }
    // }
    // setHours(newArray)
  }

  return (
    <>
      <div className="col-6 col-md-6 col-xl-6">
        <Switch {...label} defaultChecked /> {day}
      </div>
      <div className="col-6 col-md-6 col-xl-6">
        <button
          className="btn cancel-form"
          onClick={event => { handleAddHours(event) }}>
          + Agregar
        </button>
      </div>
      {hours && hours.map((item, i) => item)}

      <div className="col-12 col-md-12 col-xl-12">
        <div className="form-group local-forms" >
          <small>Total atenciones:</small>
        </div>
      </div>
    </>
  )
}

export default Days