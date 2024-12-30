'use client'
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import Sidebar from '../../../components/Sidebar';
import Link from 'next/link';
import { TextField, Alert } from '@mui/material';
import FeatherIcon from 'feather-icons-react/build/FeatherIcon';
import { useForm, Controller } from 'react-hook-form'

import Select from "react-select";

import { fetchSpecialityById } from '@/services/DoctorsServices';
import { createSchedule, getDates, fetchScheduleByDate, validateDates, generarHorasMedicas, fetchBlocksAvailables, editDisponibilidad, deleteDisponibilidad } from '@/services/SchedulesServices';
import Calender from '../../calender/page';

import { useSidebar } from "@/context/SidebarContext";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import withAuth from '@/components/withAuth';
import CacheHandler from "@/utils/cache-handler";
import CustomizedTooltips from '@/components/Tooltip';
import { FaInfoCircle } from "react-icons/fa";
import SimpleBackdrop from '@/components/Backdrop';

const cacheHandler = new CacheHandler();

const ScheduleByProfessional = ({ params }) => {
  const ROL = ["profesional"]
  const { data: session } = useSession()
  // useAuthorization(['alumno'])

  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [profesional, setProfesional] = useState({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('initial')
  const [startDate, setStartDate] = useState();
  const [startDay, setStartDay] = useState('');
  const { setProps } = useSidebar();
  const [isLoading, setIsLoading] = useState(false)
  const [calendario, setCalendario] = useState('')
  const [infoDelHijo, setInfoDelHijo] = useState(null);
  const [disponibilidad, setDisponibilidad] = useState()

  const onChange = (date, dateString) => {
    // console.log(date, dateString);
  };
  const [selectedOption, setSelectedOption] = useState(null);
  const styleInput = {
    display: 'inline',
    width: '20%'
  }

  useEffect(() => {
    setProps({
      id: "menu-item5",
      id1: "menu-items5",
      activeClassName: "professional-shedule",
    });
  }, [setProps]);

  useEffect(() => {
    const fetchProfesional = async () => {
      const { especialidades: user } = await fetchSpecialityById(params.id)
      setProfesional(user[0])
    }
    fetchProfesional()
  }, [])

  const { register, handleSubmit, watch, control, setValue, reset, getValues,
    formState: { errors }
  } = useForm({
    defaultValues: async () => {
      const { especialidades: user } = await fetchSpecialityById(params.id)
      const obj = {
        nombre: `${user[0].nombre} ${user[0].apellido}`,
        especialidad: user[0].especialidad,
        id: user[0].usuario_id,
        horaIni: '00:00:00',
        semanal: { dia: [] }
      }
      setProfesional(obj)
      return obj
    }
  })


  const modalidad = watch('modalidad')
  const horaIni = watch("horaIni");

  const fetchData = async (id) => {
    try {
      const response = await generarHorasMedicas(id)
      const processed = response.map(item => {
        // detalleServicio y duracionServicio
        return (
          {
            ...item,
            start: datesToTimestamp(item.fechaInicio, `${item.horaInicio}:00`),
            end: datesToTimestamp(item.fechaInicio, `${item.horaFin}:00`),
            className:
              item.modalidad === 'videollamada'
                ? 'bg-videollamada' : item.modalidad === 'presencial'
                  ? 'bg-presencial' : 'bg-ambas',
            title: item.detalleServicio || 'Disponible',
          }
        )
      })
      const prueba = [...processed]

      setCalendario([...processed])

    } catch (error) {
      console.log(error)
      setError('No hay conexión con el servidor')
    }
  }

  useEffect(() => {
    session?.user?.rol === 'administrador'
      ?
      getProfessionals()
      :
      fetchData(session?.user?.id)
  }, [])

  const duracion = [
    { label: '30', value: 1 },
    { label: '45', value: 2 },
    { label: '60', value: 3 },
    { label: '75', value: 4 },]


  const datesToTimestamp = (fecha, hora) => {
    // Combinar fecha y hora en un formato ISO 8601 compatible con `Date`
    const fechaHora = `${fecha} ${hora}`;
    const timestamp = Date.parse(fechaHora); // Obtiene el tiempo en milisegundos
    return timestamp;
  };


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

  const handleEdit = (data) => {
    setDisponibilidad(data)
    setInfoDelHijo(data);

    setValue("title", data.detalleServicio);
    setValue("tipo_cita", data.tipoServicio)
    if (data.modalidad) {
      setValue("modalidad", data.modalidad); // Asumiendo que `data.modalidad` es uno de "videollamada", "presencial" o "ambas"
    }

    if (data.campus) {
      setValue("campus", data.campus); // Asumiendo que `data.modalidad` es uno de "videollamada", "presencial" o "ambas"
    }

    const selectedOption = duracion.find((option) => parseInt(option.label) === data.duracionServicio);
    if (selectedOption) {
      setValue('duracion', selectedOption);
    }

    setValue("horaIni", data.horaIni);
    setValue("horaFin", data.horaFin);
    setValue("fecha_inicio", data.fechaInicio)
  }

  const options = [
    'Entrevista de despeje',
    'Acompañamiento psicológico',
    'Psicoterapia breve',
    'Psicopedagógica individual',
  ];

  const validateHoraFin = (value) => {
    if (value < horaIni) {
      return "La hora de fin no puede ser menor que la hora de inicio.";
    }
    return true;
  };


  const handleCheckboxChange = (e) => {
    const currentValues = getValues('tipo_cita') || [];
    const updatedValues = e.target.checked
      ? [...currentValues, e.target.value]
      : currentValues.filter((item) => item !== e.target.value);

    setValue('tipo_cita', updatedValues, { shouldValidate: true });
  };

  const onSubmit = handleSubmit(async data => {
    
    const body = {
      "id_user": disponibilidad.id_user,
      "id": disponibilidad.id,
      "id_bloque": disponibilidad.id_bloque,
      "tipo": disponibilidad.tipo,
      "día": disponibilidad.dia,
      "fechaInicio": data.fecha_inicio,
      "fechaFin": data.fecha_inicio,
      "repeticiones": 0,
      "horaIni": data.horaIni,
      "horaFin": data.horaFin,
      "modalidad": data.modalidad,
      "frecuencia": disponibilidad.frecuencia,
      "detalleServicio": data.title,
      "duracionServicio": data.duracion.label,
      "tipoServicio": data.tipo_cita,
      "campus": data.campus,
    }

    try {
      const response = await editDisponibilidad(body)
    } catch (error) {

    }
  })

  const handleDelete = async (data) => {
    try {
      const response = await deleteDisponibilidad(data)

      return response
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    < >
      <div className="sidebar-overlay" data-reff="" style={{ zIndex: 98 }} />
      <>
        <div className="page-wrapper  mt-5 pt-5">
          <div className="content">
            {/* Page Header */}
            <div className="page-header">
              <div className="row">
                <div className="col-sm-12">
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="schedule.html">Horario</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="feather-chevron-right">
                        <FeatherIcon icon="chevron-right" />
                      </i>
                    </li>
                    <li className="breadcrumb-item active">Editar horario</li>
                  </ul>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            <div className="row">
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-body">
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
                            disabled
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
                            disabled
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
                      {isLoading ?
                        <SimpleBackdrop />
                        :
                        <Calender
                          calendario={calendario}
                          deleteBloque={handleDelete}
                          editBloque={handleEdit}
                          profesional_id={params.id}
                        />
                      }


                      {/* DETALLES DEL SERVICIO */}
                      <div className="col-12">
                        <div className="form-heading">
                          <h4>Detalles del servicio</h4>
                        </div>
                      </div>
                      {/* Nombre servicio o evento */}
                      <div className="col-12 col-md-12 col-xl-12">
                        <div className="form-group local-forms">
                          <CustomizedTooltips text={(
                            <>El nombre del servicio es un nombre de fantasía para identificar las horas disponibles en los reportes. Este nombre permite agrupar diferentes tipos de disponibilidad en un mismo grupo.</>
                          )}>
                            <label>
                              Nombre servicio o evento  <span className="login-danger">*</span> <FaInfoCircle className="font-blue" style={{ fontSize: '14px' }} />
                            </label>
                          </CustomizedTooltips>
                          <input
                            className="form-control"
                            type="text"
                            {...register('title')}
                          />
                          {/* </Tooltip> */}
                        </div>
                      </div>
                      {/* Duración servicio */}
                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="form-group local-forms">
                          <CustomizedTooltips text={(
                            <>La duración del servicio indica cuánto tiempo se dedicará a la atención profesional indicada.</>
                          )}>
                            <label>
                              Duración servicio <span className="login-danger">*</span> <FaInfoCircle className="font-blue" style={{ fontSize: '14px' }} />
                            </label>

                          </CustomizedTooltips>
                          <Controller
                            control={control}
                            name="duracion"
                            rules={{
                              required: {
                                value: true,
                                message: 'Duración de servicio es requerida',
                              },
                            }}
                            // ref={null}
                            render={({ field: { onChange, onBlur, value } }) => (
                              <Select
                                instanceId="duracion"
                                defaultValue={value}
                                onChange={onChange}
                                options={duracion}
                                value={duracion.find(option => option.label === value) || value}
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
                          {errors.duracion && <span><small>{errors.duracion.message}</small></span>}

                        </div>
                      </div>


                      {/* Tipo de disponibilidad */}
                      <div className="col-12 col-lg-12" >
                        <div className="col-12">
                          <div className="form-heading">
                            <CustomizedTooltips text={(
                              <>Selecciona el tipo de disponibilidad para indicar cuándo y para qué tipos de atención estás disponible. Si no seleccionas un tipo, no se podrán agendar citas de esa categoría en el bloque horario especificado.</>
                            )}>
                              <h4 style={{ width: 'max-content' }}>Tipo de disponibilidad <span className="login-danger">*</span> <FaInfoCircle className="font-blue" style={{ fontSize: '14px' }} /></h4>
                            </CustomizedTooltips>
                          </div>
                        </div>

                        <div className="form-group select-gender">
                          <div className="row">
                            <div className="col-6 d-flex flex-column">
                              {options.map((option) => (
                                <label key={option} className="form-check-label">
                                  <input
                                    type="checkbox"
                                    value={option}
                                    name="tipo_cita"
                                    className="form-check-input"
                                    {...register('tipo_cita', {
                                      onChange: handleCheckboxChange, // Actualiza dinámicamente
                                      validate: (value) =>
                                        value?.length > 0 || 'Debes seleccionar al menos una opción',
                                    })}
                                    checked={(getValues('tipo_cita') || []).includes(option)} // Chequea dinámicamente
                                  />
                                  {option}
                                </label>
                              ))}

                            </div>
                          </div>
                          {/* <div className="form-check-inline"> 
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
                              </div>
                              <div className="form-check-inline">
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
                            </div> */}

                          {errors.tipo_cita && <span><small>{errors.tipo_cita.message}</small></span>}
                        </div>
                      </div>



                      {/* MODALIDAD */}
                      <div className="col-12 col-lg-12" >
                        <div className="col-12">
                          <div className="form-heading">
                            <CustomizedTooltips text={(
                              <>Al seleccionar un tipo de modalidad u otra, se ofrecerá como opción al momento de agendar una cita. Si estarás disponible para todos los tipos de modalidad, selecciona Ambas.</>
                            )}>
                              <h4 style={{ width: 'max-content' }}>Modalidad <span className="login-danger">*</span><FaInfoCircle className="font-blue" style={{ fontSize: '14px' }} /></h4>
                            </CustomizedTooltips>
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
                                {...register('modalidad', {
                                  required: {
                                    value: true,
                                    message: 'Debe seleccionar una opción'
                                  },
                                })}
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
                                {...register('modalidad', {
                                  required: {
                                    value: true,
                                    message: 'Debe seleccionar una opción'
                                  },
                                })}
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
                                {...register('modalidad', {
                                  required: {
                                    value: true,
                                    message: 'Debe seleccionar una opción'
                                  },
                                })}
                              />
                              Ambas
                            </label>
                          </div>
                          {errors.modalidad && <span><small>{errors.modalidad.message}</small></span>}
                        </div>
                      </div>

                      {/* MODALIDAD */}
                      {
                        modalidad !== 'videollamada' &&
                        < div className="col-12 col-lg-12" >
                          <div className="col-12">
                            <div className="form-heading">
                              <CustomizedTooltips text={(
                                <>Al seleccionar un campus, se podrán asignar horas de atención para dicho lugar.</>
                              )}>
                                <h4 style={{ width: 'max-content' }}>Campus <span className="login-danger">*</span><FaInfoCircle className="font-blue" style={{ fontSize: '14px' }} /></h4>
                              </CustomizedTooltips>
                            </div>
                          </div>
                          <div className="form-group select-gender">
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                <input
                                  type="radio"
                                  value="huechuraba"
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
                                  value="centro"
                                  name="campus"
                                  className="form-check-input"
                                  {...register('campus')}
                                />
                                Sede Centro
                              </label>
                            </div>

                          </div>
                        </div>
                      }

                      <div className="col-12">
                        <div className="form-heading">
                          <CustomizedTooltips text={(
                            <>Selecciona el tipo de disponibilidad para indicar cuándo y para qué tipos de atención estás disponible. Si no seleccionas un tipo, no se podrán agendar citas de esa categoría en el bloque horario especificado.</>
                          )}>
                            <h4 style={{ width: 'max-content' }}>Tipo de disponibilidad <span className="login-danger">*</span> <FaInfoCircle className="font-blue" style={{ fontSize: '14px' }} /></h4>
                          </CustomizedTooltips>
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
                            rules={{
                              required: {
                                value: true,
                                message: 'Hora inicio es requerida',
                              }
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                              <TextField
                                // className="form-control"
                                // id="outlined-controlled"
                                type="time"
                                onBlur={onBlur}
                                onChange={(e) => {
                                  onChange(e);
                                  setValue("horaFin", e.target.value); // Ajusta automáticamente horaFin si es menor
                                }}
                                value={value}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                              />
                            )}
                            name="horaIni"
                          />
                          {errors.horaIni && <span> <small>{errors.horaIni.message}</small></span>}
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
                              rules={{
                                validate: validateHoraFin,
                                required: {
                                  value: true,
                                  message: 'Hora inicio es requerida',
                                }
                              }}
                              render={({ field: { onChange, onBlur, value } }) => (
                                <TextField
                                  // className="form-control"
                                  // id="outlined-controlled"
                                  type="time"
                                  onBlur={onBlur}
                                  onChange={onChange}
                                  InputProps={{
                                    inputProps: {
                                      min: horaIni, // Configura el mínimo como la hora de inicio seleccionada
                                    },
                                  }}
                                  InputLabelProps={{ shrink: true }}
                                  value={value}
                                  fullWidth
                                />
                              )}
                              name="horaFin"
                            />
                            {errors.horaFin && <span> <small>{errors.horaFin.message}</small></span>}
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6 col-xl-12">
                        <div className="col-12">
                          <div className="form-heading">
                            <CustomizedTooltips text={(
                              <>
                                <p>
                                  El rango de repetición permite identificar un período global en que la agenda tenga horas disponibles, por ejemplo, se puede establecer la fecha de inicio y fin de un año académico completo o de un semestre.
                                </p>
                                <p>
                                  La disponibilidad de horas, será hasta la fecha de finalización.
                                </p>
                              </>
                            )}>
                              <h4 style={{ width: 'max-content' }}>Fecha <span className="login-danger">*</span> <FaInfoCircle className="font-blue" style={{ fontSize: '14px' }} /></h4>
                            </CustomizedTooltips>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12 col-md-6 col-xl-4">
                            <div className="form-group local-forms">

                              <input
                                className="form-control datetimepicker"
                                type="date"
                                placeholder=""

                                onChange={handleDate}
                                // value={startDate}
                                {...register('fecha_inicio', {
                                  required: {
                                    value: true,
                                    message: 'Fecha de inicio es requerida'
                                  }
                                })}
                              />
                              {errors.fecha_inicio && <span><small>{errors.fecha_inicio.message}</small></span>}
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
                            Editar disponibilidad
                          </button>
                          {/* </Link> */}
                          <Link href={'/citas'}>
                            <button
                              type="reset"
                              className="btn btn-primary cancel-form"
                            >
                              Cancelar
                            </button>
                          </Link>
                        </div>
                      </div>




                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div >

      </>
    </>
  )
}

// export default ScheduleByProfessional;
export default withAuth(ScheduleByProfessional, ['administrador', 'profesional']);
