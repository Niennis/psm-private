'use client'
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import Sidebar from '../../../../components/Sidebar';
import Link from 'next/link';
import { TextField, Alert } from '@mui/material';
import FeatherIcon from 'feather-icons-react/build/FeatherIcon';
import { useForm, Controller } from 'react-hook-form'

import Select from "react-select";

import { fetchSpeciality } from '@/services/DoctorsServices';
import { createSchedule, getDates, fetchScheduleByDate, validateDates } from '@/services/SchedulesServices';
import Calender from '../../../calender/page';

import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import ProtectedPage from '@/components/ProtectedRoutes';

const AddSchedule = ({ params }) => {
  const ROL = ["profesional"]
  const { data: session } = useSession()
  const router = useRouter();
  // useAuthorization(['alumno'])
  console.log(session)

  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [profesional, setProfesional] = useState({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('initial')
  const [startDate, setStartDate] = useState();
  const [startDay, setStartDay] = useState('');

  const [prueba, setPrueba] = useState(new Date)


  const onChange = (date, dateString) => {
    // console.log(date, dateString);
  };
  const [selectedOption, setSelectedOption] = useState(null);
  const styleInput = {
    display: 'inline',
    width: '20%'
  }
  // const label = { inputProps: { 'aria-label': 'Switch demo' } };
  useEffect(() => {
    const fetchProfesional = async () => {
      // const { especialidad: user } = await fetchSpeciality(params.id)
      // console.log('especialidad', user[0])
      // setProfesional(user[0])
      setProfesional({
        nombre: `Miguel González`,
        especialidad: 'Psicología',
      })
      
    }
    fetchProfesional()
  }, [])

  const { register, handleSubmit, watch, control,
    formState: { errors }
  } = useForm({
    defaultValues: async () => {
      // console.log('Params en add schedule', params.id);
      // const { especialidad: user } = await fetchSpeciality(params.id)
      // console.log('user', user);
      // const obj = {
      //   nombre: `${user[0].nombre} ${user[0].apellido}`,
      //   especialidad: user[0].especialidad,
      //   id: user[0].usuario_id,
      //   horaIni: '00:00:00',
      //   semanal: { dia: [] }
      // }
      const obj = {
        nombre: `Miguel González`,
        especialidad: 'Psicología',
        id: 1,
        horaIni: '00:00:00',
        semanal: { dia: [] }
      }
      setProfesional(obj)
      return obj
    }
  })

  const frecuencia = watch('frecuencia')
  const modalidad = watch('modalidad')

  const onSubmit = handleSubmit(async data => {
    setSuccess('initial')
    const semana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes']

    const fechas = []
    const newData = {
      ...data,
      id_user: params.id,
      duracionServicio: parseInt(data.duracion.label) + parseInt(data.postservicio.label),
      fechaInicio: startDate,
      mensual: {
        ...data.mensual,
        'cardinal-numero': startDay
      },
      dias: data.frecuencia === "semanal" ? data.semanal.dia : semana
    }

    // console.log('newData', newData);
    const dates = getDates(newData, fechas)
    let esValido = []

    if (dates.length === 0) {
      // console.log('CHAO NO SE PUEDE')
      esValido.push(false)
      return
    }

    // const promesas = []
    // dates.forEach(date => promesas.push(validateDates(date, data.horaIni, data.horaFin, data.id)))

    // Promise.all(promesas)
    //   .then(async (values) => {
    //     // console.log('VALUES', values);
    //     if (values.includes(true)) {
    //       // console.log('GGGGGGGGGGG')
    //     } else {
          // console.log('AT LAST!!!!')
          try {
            // const req = await createSchedule(newData)
            // if (req.detalle === 'fail!!!') setSuccess('fail')
            setSuccess('success')
          } catch (error) {
            setSuccess('fail')
            console.log('ERRRR', err.message)
          }
      //   }
      // })
      // .catch((reason) => {
      //   console.log('reason', reason);
      // });
  })

  const duracion = [
    { label: '30', value: 1 },
    { label: '45', value: 2 },
    { label: '60', value: 3 },
    { label: '75', value: 4 },]

  const postservicio = [
    { label: '5', value: 5 },
    { label: '10', value: 6 },
    { label: '15', value: 7 },
    { label: '20', value: 8 },]


  const handleDay = (e) => {
    const nuevoNumero = e.target.value;
    setStartDay(nuevoNumero);
    const nuevaFecha = new Date();
    nuevaFecha.setDate(parseInt(nuevoNumero));
    setStartDate(nuevaFecha.toISOString().split('T')[0]);
  }

  const handleDate = (e) => {
    const nuevaFecha = e.target.value;
    setStartDate(nuevaFecha);
    const split = nuevaFecha.split('-')
    setStartDay(split[2]);
  }

  return (
    <ProtectedPage level={ROL}>
      <Sidebar id='menu-item5' id1='menu-items5' activeClassName='add-shedule' />
      <>
        <div className="page-wrapper mt-5 pt-5">
          <div className="content">
            {/* Page Header */}
            <div className="page-header">
              <div className="row">
                <div className="col-sm-12">
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="schedule.html">Horario </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="feather-chevron-right">
                        <FeatherIcon icon="chevron-right" />
                      </i>
                    </li>
                    <li className="breadcrumb-item active">Agregar horario</li>
                  </ul>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            <div className="row">
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-body">
                    <form>
                      <div className="row">
                        <div className="col-12">
                          <div className="form-heading">
                            <h4>Profesional</h4>
                          </div>
                        </div>

                        {/* Nombre profesional */}
                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group local-forms">
                            <label>
                              Nombre profesional <span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              {...register('nombre', {
                                required: {
                                  value: true,
                                  message: 'Nombre es requerido'
                                },
                                minLength: {
                                  value: 2,
                                  message: 'Nombre debe tener al menos 2 caracteres'
                                }
                              })}
                            />
                          </div>
                        </div>
                        {/* Especialidad */}
                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group local-forms">
                            <label>
                              Especialidad <span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              {...register('especialidad', {
                                required: {
                                  value: true,
                                  message: 'Especialidad es requerida'
                                }
                              })} />
                          </div>
                        </div>

                        {/* Nombre profesional */}
                        <div className="col-12">
                          <div className="form-heading">
                            <h4>Detalles del servicio</h4>
                          </div>
                        </div>
                        <div className="col-12 col-md-12 col-xl-12">
                          <div className="form-group local-forms">
                            <label>
                              Nombre servicio o evento <span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              {...register('title')}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group local-forms">
                            <label>
                              Duración servicio <span className="login-danger">*</span>
                            </label>
                            <Controller
                              control={control}
                              name="duracion"
                              {...register('duracion', {
                                required: {
                                  value: true,
                                  message: 'Género es requerido',
                                }
                              })}
                              ref={null}
                              render={({ field: { onChange, onBlur, value } }) => (
                                <Select
                                  instanceId="duracion"
                                  defaultValue={selectedOption}
                                  onChange={onChange}
                                  options={duracion}
                                  // menuPortalTarget={document.body}
                                  styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                  id="duracion"
                                  components={{
                                    IndicatorSeparator: () => null
                                  }}

                                  styles={{
                                    control: (baseStyles, state) => ({
                                      ...baseStyles,
                                      borderColor: state.isFocused ? 'none' : '2px solid rgba(46, 55, 164, 0.1);',
                                      boxShadow: state.isFocused ? '0 0 0 1px #2e37a4' : 'none',
                                      '&:hover': {
                                        borderColor: state.isFocused ? 'none' : '2px solid rgba(46, 55, 164, 0.1)',
                                      },
                                      borderRadius: '10px',
                                      fontSize: "14px",
                                      minHeight: "45px",
                                    }),
                                    dropdownIndicator: (base, state) => ({
                                      ...base,
                                      transform: state.selectProps.menuIsOpen ? 'rotate(-180deg)' : 'rotate(0)',
                                      transition: '250ms',
                                      width: '35px',
                                      height: '35px',
                                      zIndex: 3000,
                                    }),
                                  }}
                                />
                              )}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group local-forms">
                            <label>
                              Tiempo post servicio
                            </label>
                            <Controller
                              control={control}
                              name="postservicio"
                              {...register('postservicio', {
                                required: {
                                  value: true,
                                  message: 'Género es requerido',
                                }
                              })}
                              ref={null}
                              render={({ field: { onChange, onBlur, value } }) => (
                                <Select
                                  instanceId="postservicio"
                                  defaultValue={selectedOption}
                                  onChange={onChange}
                                  options={postservicio}
                                  // menuPortalTarget={document.body}
                                  styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                  id="postservicio"
                                  components={{
                                    IndicatorSeparator: () => null
                                  }}

                                  styles={{
                                    control: (baseStyles, state) => ({
                                      ...baseStyles,
                                      borderColor: state.isFocused ? 'none' : '2px solid rgba(46, 55, 164, 0.1);',
                                      boxShadow: state.isFocused ? '0 0 0 1px #2e37a4' : 'none',
                                      '&:hover': {
                                        borderColor: state.isFocused ? 'none' : '2px solid rgba(46, 55, 164, 0.1)',
                                      },
                                      borderRadius: '10px',
                                      fontSize: "14px",
                                      minHeight: "45px",
                                    }),
                                    dropdownIndicator: (base, state) => ({
                                      ...base,
                                      transform: state.selectProps.menuIsOpen ? 'rotate(-180deg)' : 'rotate(0)',
                                      transition: '250ms',
                                      width: '35px',
                                      height: '35px',

                                    }),
                                  }}
                                />
                              )}
                            />
                          </div>
                        </div>



                        {/* TIPO DE CITA */}
                        <div className="col-12 col-lg-12" >
                          <div className="col-12">
                            <div className="form-heading">
                              <h4>Tipo de disponibilidad</h4>
                            </div>
                          </div>
                          {/* <div className="form-group select-gender">
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                <input
                                  type="radio"
                                  value="individual"
                                  name="tipo_cita"
                                  className="form-check-input"
                                  {...register('tipo_cita')}
                                />
                                Individual
                              </label>
                            </div>
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                <input
                                  type="radio"
                                  value="grupal"
                                  name="tipo_cita"
                                  className="form-check-input"
                                  {...register('tipo_cita')}
                                />
                                Grupal
                              </label>
                            </div>
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                <input
                                  type="radio"
                                  value="mixta"
                                  name="tipo_cita"
                                  className="form-check-input"
                                  {...register('tipo_cita')}
                                />
                                Mixta
                              </label>
                            </div>
                          </div> */}

                          <div className="form-group select-gender">
                            <div className="row">
                              <div className="col-6 d-flex flex-column">

                                <label className="form-check-label">
                                  <input
                                    type="checkbox"
                                    value="Entrevista de despeje"
                                    name="tipo_cita"
                                    className="form-check-input"
                                    {...register('tipo_cita')}
                                  />
                                  Entrevista de despeje
                                </label>
                                <label className="form-check-label">
                                  <input
                                    type="checkbox"
                                    value="Acompañamiento psicológico"
                                    name="tipo_cita"
                                    className="form-check-input"
                                    {...register('tipo_cita')}
                                  />
                                  Acompañamiento psicológico
                                </label>
                                {/* </div>
                                  <div className="form-check-inline"> */}
                                <label className="form-check-label">
                                  <input
                                    type="checkbox"
                                    value="Psicoterapia breve"
                                    name="tipo_cita"
                                    className="form-check-input"
                                    {...register('tipo_cita')}
                                  />
                                  Psicoterapia breve
                                </label>
                                {/* </div>
                                  <div className="form-check-inline"> */}
                                <label className="form-check-label">
                                  <input
                                    type="checkbox"
                                    value="Psicopedagógica individual"
                                    name="tipo_cita"
                                    className="form-check-input"
                                    {...register('tipo_cita')}
                                  />
                                  Psicopedagógica individual
                                </label>

                              </div>
                              {/* </div>
                                  <div className="form-check-inline"> */}
                              <div className="col-6 d-flex flex-column">
                                <label className="form-check-label">
                                  <input
                                    type="checkbox"
                                    value="Grupo psicoterapéutico"
                                    name="tipo_cita"
                                    className="form-check-input"
                                    {...register('tipo_cita')}
                                  />
                                  Grupo psicoterapéutico
                                </label>
                                {/* </div>
                                  <div className="form-check-inline"> */}
                                <label className="form-check-label">
                                  <input
                                    type="checkbox"
                                    value="Grupo psicopedagógico"
                                    name="tipo_cita"
                                    className="form-check-input"
                                    {...register('tipo_cita')}
                                  />
                                  Grupo psicopedagógico
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>



                        {/* MODALIDAD */}
                        <div className="col-12 col-lg-12" >
                          <div className="col-12">
                            <div className="form-heading">
                              <h4>Modalidad</h4>
                            </div>
                          </div>
                          <div className="form-group select-gender">
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                <input
                                  type="radio"
                                  value="videollamada"
                                  name="modalidad"
                                  className="form-check-input"
                                  {...register('modalidad')}
                                />
                                Videollamada
                              </label>
                            </div>
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                <input
                                  type="radio"
                                  value="presencial"
                                  name="modalidad"
                                  className="form-check-input"
                                  {...register('modalidad')}
                                />
                                Presencial
                              </label>
                            </div>
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                <input
                                  type="radio"
                                  value="ambas"
                                  name="modalidad"
                                  className="form-check-input"
                                  {...register('modalidad')}
                                />
                                Ambas
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* MODALIDAD */}
                        {
                          modalidad !== 'videollamada' &&
                          < div className="col-12 col-lg-12" >
                            <div className="col-12">
                              <div className="form-heading">
                                <h4>Campus</h4>
                              </div>
                            </div>
                            <div className="form-group select-gender">
                              <div className="form-check-inline">
                                <label className="form-check-label">
                                  <input
                                    type="radio"
                                    value="videollamada"
                                    name="campus"
                                    className="form-check-input"
                                    {...register('campus')}
                                  />
                                  Sede Huechuraba
                                </label>
                              </div>
                              <div className="form-check-inline">
                                <label className="form-check-label">
                                  <input
                                    type="radio"
                                    value="presencial"
                                    name="campus"
                                    className="form-check-input"
                                    {...register('campus')}
                                  />
                                  Sede Centro
                                </label>
                              </div>
                              <div className="form-check-inline">
                                <label className="form-check-label">
                                  <input
                                    type="radio"
                                    value="ambas"
                                    name="campus"
                                    className="form-check-input"
                                    {...register('campus')}
                                  />
                                  Ambas
                                </label>
                              </div>
                            </div>
                          </div>
                        }


                        {/* HORARIOS */}
                        <div className="col-12">
                          <div className="form-heading">
                            <h4>Disponibilidad</h4>
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Desde <span className="login-danger">*</span>
                            </label>
                            <Controller
                              control={control}
                              defaultValue='00:00:00'
                              render={({ field: { onChange, onBlur, value } }) => (
                                <TextField
                                  className="form-control"
                                  // id="outlined-controlled"
                                  type="time"
                                  onBlur={onBlur}
                                  onChange={onChange}
                                  value={value}
                                />
                              )}
                              name="horaIni"
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Hasta <span className="login-danger">*</span>
                            </label>
                            <div className="">
                              <Controller
                                control={control}
                                defaultValue='00:00:00'
                                render={({ field: { onChange, onBlur, value } }) => (
                                  <TextField
                                    className="form-control"
                                    // id="outlined-controlled"
                                    type="time"
                                    onBlur={onBlur}
                                    onChange={onChange}
                                    value={value}
                                  />
                                )}
                                name="horaFin"
                              />
                            </div>
                          </div>
                        </div>

                        {/* FRECUENCIAS */}

                        <div className="col-12 col-lg-12" >
                          <div className="col-12">
                            <div className="form-heading">
                              <h4>Frecuencia</h4>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-12 col-lg-2" >
                              <div className="form-group select-gender">
                                <div className="form-check-inline">
                                  <label className="form-check-label">
                                    <input
                                      type="radio"
                                      value="diaria"
                                      name="frecuencia"
                                      className="form-check-input"
                                      {...register('frecuencia')}
                                    />
                                    Diaria
                                  </label>
                                </div>
                                <div className="form-check-inline">
                                  <label className="form-check-label">
                                    <input
                                      type="radio"
                                      value="semanal"
                                      name="frecuencia"
                                      className="form-check-input"
                                      {...register('frecuencia')}
                                    />
                                    Semanal
                                  </label>
                                </div>
                                <div className="form-check-inline">
                                  <label className="form-check-label">
                                    <input
                                      type="radio"
                                      value="mensual"
                                      name="frecuencia"
                                      className="form-check-input"
                                      {...register('frecuencia')}
                                    />
                                    Mensual
                                  </label>
                                </div>
                              </div>
                            </div>
                            {
                              frecuencia === 'diaria'
                                ? <div className="col-12 col-lg-6" style={{ border: '1px solid lightgrey', borderRadius: '8px', padding: '20px' }}>
                                  <div className="form-group select-gender">
                                    <div className="form-check">
                                      <label className="form-check-label">
                                        <input
                                          type="radio"
                                          name="diaria"
                                          value="recurrente"
                                          className="form-check-input"
                                          {...register('diaria.tipo')}
                                        />
                                        Cada <input
                                          type="number"
                                          name="diaria"
                                          className='ant-pick-selector'
                                          style={styleInput}
                                          {...register('diaria.recurrencia')}
                                        /> días
                                      </label>

                                      <label className="form-check-label">
                                        <input
                                          type="radio"
                                          name="diaria"
                                          value="diaria"
                                          className="form-check-input"
                                          {...register('diaria.tipo')}
                                        />
                                        Todos los días laborales de la semana
                                      </label>
                                    </div>
                                  </div>
                                </div>
                                : frecuencia === 'semanal'
                                  ? <div className="col-12 col-lg-6" style={{ border: '1px solid lightgrey', borderRadius: '8px', padding: '20px' }}>
                                    <div className="form-group select-gender">
                                      <div className="form-group">
                                        <label className="form-check-label">
                                          {/* Repeticiones cada <input
                                            type="number"
                                            name="semanal"
                                            style={styleInput}
                                            {...register('semanal.recurrencia')}
                                          /> semanas el: */}
                                          Repeticiones los días:
                                        </label>
                                      </div>
                                    </div>
                                    <div className="form-group select-gender">

                                      <div className="form-check-inline">
                                        <label className="form-check-label">
                                          <input
                                            type="checkbox"
                                            value="lunes"
                                            name="semanal"
                                            className="form-check-input"
                                            {...register('semanal.dia')}
                                          />
                                          Lunes
                                        </label>
                                        {/* </div>
                                  <div className="form-check-inline"> */}
                                        <label className="form-check-label">
                                          <input
                                            type="checkbox"
                                            value="martes"
                                            name="semanal"
                                            className="form-check-input"
                                            {...register('semanal.dia')}
                                          />
                                          Martes
                                        </label>
                                        {/* </div>
                                  <div className="form-check-inline"> */}
                                        <label className="form-check-label">
                                          <input
                                            type="checkbox"
                                            value="miércoles"
                                            name="semanal"
                                            className="form-check-input"
                                            {...register('semanal.dia')}
                                          />
                                          Miércoles
                                        </label>
                                        {/* </div>
                                  <div className="form-check-inline"> */}
                                        <label className="form-check-label">
                                          <input
                                            type="checkbox"
                                            value="jueves"
                                            name="semanal"
                                            className="form-check-input"
                                            {...register('semanal.dia')}
                                          />
                                          Jueves
                                        </label>
                                        {/* </div>
                                  <div className="form-check-inline"> */}
                                        <label className="form-check-label">
                                          <input
                                            type="checkbox"
                                            value="viernes"
                                            name="semanal"
                                            className="form-check-input"
                                            {...register('semanal.dia')}
                                          />
                                          Viernes
                                        </label>
                                      </div>
                                    </div>

                                  </div>
                                  : frecuencia === 'mensual'
                                    ? <div className="col-12 col-lg-6" style={{ border: '1px solid lightgrey', borderRadius: '8px', padding: '20px' }}>
                                      {/*  <div className="form-group select-gender">
                                        <div className="form-check">
                                          <label className="form-check-label">
                                            <input
                                              type="radio"
                                              value="cardinal"
                                              name="cardinal"
                                              className="form-check-input"
                                              {...register('mensual.tipo')}
                                            />
                                            El día <input
                                              type="number"
                                              max={31}
                                              min={1}
                                              onChange={handleDay}
                                              value={startDay}
                                            // name="cardinal"
                                            // {...register('mensual.cardinal-numero')}
                                            /> de cada  <input
                                              type="number"
                                              max={31}
                                              min={1}
                                              // name="cardinal"
                                              {...register('mensual.cardinal-frecuencia')}
                                            /> meses
                                          </label>
                                        </div>
                                      </div> */}

                                      <div className="col-12 select-gender">
                                        <div className="form-check">
                                          <label className="form-check-label ">
                                            <input
                                              type="radio"
                                              value="ordinal"
                                              name="ordinal"
                                              className="form-check-input"
                                              {...register('mensual.tipo')}
                                            />
                                            El <select className="select form-check-label"
                                              {...register('mensual.ordinal-orden')}>
                                              <option name="">... elegir</option>
                                              <option name="primer">primer</option>
                                              <option name="segundo">segundo</option>
                                              <option name="tercer">tercer</option>
                                              <option name="cuarto">cuarto</option>
                                              <option name="ultimo">último</option>
                                            </select>
                                            <select className="select form-check-label"
                                              {...register('mensual.ordinal-dia')}
                                            >
                                              <option name="dia">... día</option>
                                              <option name="lunes">lunes</option>
                                              <option name="martes">martes</option>
                                              <option name="miercoles">miércoles</option>
                                              <option name="jueves">jueves</option>
                                              <option name="viernes">viernes</option>
                                            </select>
                                            de cada   <input
                                              type="number"
                                              max={31}
                                              min={1}
                                              // name="mensual"
                                              {...register('mensual.ordinal-frecuencia')}
                                            /> meses
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                    : ""
                            }
                          </div>
                        </div>

                        {/* REPETICIONES */}
                        <div className="col-12 col-md-6 col-xl-12">
                          <div className="col-12">
                            <div className="form-heading">
                              <h4>Rango de repetición</h4>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-12 col-md-6 col-xl-4">
                              <div className="form-group local-forms">
                                Comienza el{" "}
                                <span className="login-danger">*</span>
                                <input
                                  className="form-control datetimepicker"
                                  type="date"
                                  placeholder=""

                                  onChange={handleDate}
                                  value={startDate}
                                // {...register('fechaInicio', {
                                //   required: {
                                //     value: true,
                                //     message: 'Fecha de inicio es requerida'
                                //   }
                                // })}
                                />
                                {/* {errors.fechaInicio && <span><small>{errors.fechaInicio.message}</small></span>} */}
                              </div>
                            </div>
                            <div className="col-12 col-md-6 col-xl-4">
                              <div className="form-group local-forms">
                                Finaliza el{" "}
                                <span className="login-danger">*</span>
                                <input
                                  className="form-control datetimepicker"
                                  type="date"
                                  placeholder=""
                                  {...register('fechaFin', {
                                    required: {
                                      value: true,
                                      message: 'Fecha de finalización es requerida'
                                    }
                                  })}
                                />
                                {errors.fechaFin && <span><small>{errors.fechaFin.message}</small></span>}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="doctor-submit text-end">
                            {/* <Link href="/addschedule" > */}
                            <button
                              type="button"
                              className="btn btn-primary submit-form me-2"
                              onClick={onSubmit}
                            >
                              Agregar horario
                            </button>
                            {/* </Link> */}
                            <button
                              type="submit"
                              className="btn btn-primary cancel-form"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div >
        <div className="page-wrapper">
          <div className="content">
            <Calender id={params.id} />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12 col-lg-6">
            {/* {success === 'success'
              ?
              <Alert
                severity="success"
                onClose={() => { setSuccess('initial') }}
                sx={{
                  zIndex: 'tooltip',
                  position: 'absolute',
                  bottom: -10,
                  left: '10%',
                  width: '80%'
                }}
                spacing={2}
              >
                La cita se ha creado con éxito.
              </Alert>

              : success === 'fail'
                ?
                <Alert
                  severity="error"
                  onClose={() => { setSuccess('initial') }}
                  sx={{
                    zIndex: 'tooltip',
                    position: 'absolute',
                    bottom: -10,
                    left: '10%',
                    width: '80%'
                  }}
                  spacing={2}
                >
                  Ha ocurrido un problema.
                </Alert>
                : ''
            } */}

{success === 'success'
          ?
          <div  style={{
            height: '100%',
            position: 'fixed',
            top: '0',
            width: '100%',
            zIndex: 99999,
            background: '#00000080'
          }}>
            {/* <div className="col-sm-12 col-lg-6"> */}
            <Alert
              severity="success"
              onClose={() => { setSuccess('initial') }}
              sx={{
                zIndex: 'tooltip',
                position: 'absolute',
                left: '30%',
                width: '50%',
                padding: '50px',
                bottom: '50vh'
              }}
              spacing={2}
            >
              Se ha agregado la disponibilidad horario con éxito.
            </Alert>
            {/* </div> */}
          </div>

          : success === 'fail'
            ?
            <div className="row" style={{
              height: '100%',
              position: 'fixed',
              top: '0',
              width: '100%',
              zIndex: 99999,
              background: '#00000080'
            }}>
              <div className="col-sm-12 col-lg-6">
                <Alert
                  severity="error"
                  onClose={() => { setSuccess('initial') }}
                  sx={{
                    zIndex: 'tooltip',
                    position: 'absolute',
                    left: '30%',
                    width: '50%',
                    padding: '50px',
                    bottom: '50vh'
                  }}
                  spacing={2}
                >
                  Ha ocurrido un problema. {error}
                </Alert>
              </div>
            </div>
            : ''
        }
          </div>
        </div>
      </>


    </ProtectedPage>
  )
}

export default AddSchedule;
