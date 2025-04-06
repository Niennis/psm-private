'use client'
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { TextField, Alert } from '@mui/material';
import FeatherIcon from 'feather-icons-react/build/FeatherIcon';
import { useForm, Controller } from 'react-hook-form'

import Select from "react-select";

import { fetchSpecialityById, fetchProfessionalById, fetchProfessionals } from '@/services/DoctorsServices';
import { createSchedule, getDates, fetchScheduleByDate, validateDates, generarHorasMedicas, fetchBlocksAvailables, deleteDisponibilidad } from '@/services/SchedulesServices';
import Calender from '../../calender/page';

import { useSidebar } from "@/context/SidebarContext";

import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import withAuth from '@/components/withAuth';
import CacheHandler from "@/utils/cache-handler";

const cacheHandler = new CacheHandler();

import Tooltip from '@mui/material/Tooltip';
import CustomizedTooltips from '@/components/Tooltip';
import { FaInfoCircle } from "react-icons/fa";
import SimpleBackdrop from '@/components/Backdrop';
import { getServerData } from '@/app/actions';

const AddSchedule = () => {
  const { data: session, status } = useSession()
  const router = useRouter();

  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('initial')
  const [startDate, setStartDate] = useState('');
  const [startDay, setStartDay] = useState('');
  const [calendario, setCalendario] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [profesional, setProfesional] = useState([])
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const { setProps } = useSidebar();
  const [idProfesional, setIdProfesional] = useState()

  const onChange = (date, dateString) => {
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
      activeClassName: "add-shedule",
    });
  }, [setProps]);

  const datesToTimestamp = (fecha, hora) => {
    // Combinar fecha y hora en un formato ISO 8601 compatible con `Date`
    const fechaHora = `${fecha} ${hora}`;
    const timestamp = Date.parse(fechaHora); // Obtiene el tiempo en milisegundos
    return timestamp;
  };

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
      console.log('Error:', error)
      setError('No hay conexión con el servidor')
    }
  }

  const getProfessionals = async () => {
    try {
      const response = await fetchProfessionals()

      const responseWithSpeciality = response.map(async item => {
        const { especialidades } = await fetchSpecialityById(item.id)
        return ({
          ...item,
          especialidad: especialidades[0]?.especialidad || 'No informada',
        })
      })
      const promises = await Promise.all(responseWithSpeciality)

      const docs = promises.map((doc, i) => {
        return {
          value: i + 2,
          label: doc.nombre + ' ' + doc.apellido,
          id: doc.id,
          email: doc.email,
          name: doc.nombre,
          especialidad: doc.especialidad
        }
      })

      if (docs.length > 0) {
        setProfesional(docs)
      }

      return promises
    } catch (error) {
      console.log('Error', error)
    }
  }

  useEffect(() => {

    const getIdProfesional = async () => {
      const profId = await getServerData()
      setIdProfesional(profId)
    }
    getIdProfesional()

    const id_prof = session?.user?.id || idProfesional
    session?.user?.rol === 'administrador'
      ?
      getProfessionals()
      :
      fetchData(id_prof)
  }, [])

  const { register, handleSubmit, watch, control, setValue, reset, formState: { errors } } = useForm();

  // Lógica para manejar los valores predeterminados asíncronos
  useEffect(() => {
    if (session?.user?.rol === "profesional") {
      const fetchDefaults = async () => {
        setLoading(true); // Indicamos que estamos cargando los datos
        try {
          const { users } = await fetchProfessionalById(session?.user?.id);
          const { especialidades: user } = await fetchSpecialityById(session?.user?.id);
          const defaultValues = {
            nombre: `${users[0].nombre} ${users[0].apellido}`,
            especialidad: user[0]?.especialidad || "No informada",
            id: users[0].usuario_id,
            horaIni: "00:00:00",
            semanal: { dia: [] },
          };
          reset(defaultValues); // Establece los valores predeterminados
        } catch (error) {
          console.error("Error fetching default values:", error);
        } finally {
          setLoading(false); // Terminamos de cargar los datos
        }
      };

      fetchDefaults();
    }
  }, [session?.user?.rol, reset]);

  const frecuencia = watch('frecuencia')
  const modalidad = watch('modalidad')
  const horaIni = watch("horaIni");
  const horaFin = watch("horaFin");
  const profesionalSeleccionado = watch("nombre")

  // Validación personalizada para horaFin
  const validateHoraFin = (value) => {
    if (value < horaIni) {
      return "La hora de fin no puede ser menor que la hora de inicio.";
    }
    return true;
  };

  const onSubmit = handleSubmit(async data => {
    setSuccess('initial')
    const semana = ["lunes", "martes", "miércoles", "jueves", "viernes"]
    const fechas = []
    const newData = {
      ...data,
      nombre: session?.user?.rol === 'profesional' ? data.nombre : data.nombre.label,
      id_user: session?.user?.rol === 'profesional' ? session?.user?.id : data.nombre.id,
      email: session?.user?.rol === 'profesional' ? session?.user?.email : data.nombre.email,
      especialidad: session?.user?.rol === 'profesional' ? data.especialidad : data.especialidad,
      duracionServicio: parseInt(data.duracion.label),
      fechaInicio: startDay,
      mensual: {
        ...data.mensual,
        'cardinal-numero': startDay
      },
      dias: data.frecuencia === "semanal" ? data.semanal.dia : semana,
      fecha_inicio: data.fecha_inicio,
    }

    const dates = getDates(newData, fechas)
    let esValido = []
    if (dates.length === 0) {
      esValido.push(false)
      return
    }

    const promesas = []
    dates.forEach(date => {
      return promesas.push(validateDates(date, data.horaIni, data.horaFin, session?.user?.rol === 'profesional' ? session?.user?.id : data.nombre.id))
    })
    Promise.all(promesas)
      .then(async (values) => {
        if (values.includes(true)) {
          setSuccess('fail')
          setError('Hay choque de horario.')
        } else {
          try {
            const req = await createSchedule(newData)
            if (req.estado === false) {
              setSuccess('fail')
              setError(`Hubo un problema. Intenta más tarde. ${req.detalle}}`)
            } else {
              setSuccess('success')
              setError('Se ha cargado la disponibilidad correctamente.')
              session?.user?.rol === 'profesional' ? fetchData(session?.user?.id) : fetchData(profesionalSeleccionado.id)
              setIsLoading(true)
            }
          } catch (error) {
            setSuccess('fail')
            setError(`Hubo un problema. Intenta más tarde. ${error}`)
          } finally {
            setTimeout(() => setIsLoading(false), 500);
          }
        }
      })
      .catch((error) => {
        setSuccess('fail')
        setError(`Hubo un problema. Intenta más tarde. ${error}`)
      });
  })

  const duracion = [
    { label: '30', value: 1 },
    { label: '45', value: 2 },
    { label: '60', value: 3 },
    { label: '75', value: 4 },]

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

  const handleOnClose = () => {
    setSuccess('initial')
    session?.user?.rol === 'profesional' ? fetchData(session?.user?.id) : fetchData(profesionalSeleccionado.id)
  }

  const handleEdit = () => {
    if (pathname.includes('agregarhorario')) {
      if (session?.user?.rol === 'profesional') {
        router.push(`/horarios/${session?.user?.id}`)
      } else {
        router.push(`/horarios/${profesionalSeleccionado.id}`)
      }
    }
  }

  const handleDelete = async (data) => {
    try {
      const response = await deleteDisponibilidad(data)
      if (response.validacion === true) {
        setSuccess('success')
        setError(`Disponibilidad eliminada exitosamente.`)
      } else {
        setSuccess('fail')
        setError(`Ha ocurrido un problema ${response.detalle}`)
      }
    } catch (error) {
      console.log('Error:', error)
      setError(`Ha ocurrido un problema ${error}`)
    } finally {
      session?.user?.rol === 'profesional' ? fetchData(session?.user?.id) : fetchData(profesionalSeleccionado.id)
    }
  }

  const handleRefresh = () => {
    setIsLoading(true)
    fetchData(session?.user?.id)
    setTimeout(() => {
      setIsLoading(false)
    }, 300);
  }

  return (
    < >
      <div className="sidebar-overlay" data-reff="" style={{ zIndex: 98 }} />
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
                            {
                              session?.user?.rol === 'profesional'
                                ?

                                <input
                                  className="form-control"
                                  type="text"
                                  disabled
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
                                :
                                <Controller
                                  control={control}
                                  name="nombre"
                                  {...register('nombre')}
                                  ref={null}
                                  render={({ field: { onChange, onBlur, value, name, ref } }) => {
                                    return (<Select
                                      placeholder={profesional.length === 0 ? 'Cargando...' : 'Seleccione...'}
                                      instanceId="nombre"
                                      defaultValue={selectedOption}
                                      onChange={(e) => {
                                        onChange(e)
                                        setValue('especialidad', e.especialidad);
                                        fetchData(e.id)
                                      }}
                                      getOptionLabel={e => e.label}
                                      options={profesional}
                                      styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                      id="nombre"
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
                                    />)
                                  }}
                                />
                            }


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

                        {/* DETALLES DEL SERVICIO */}
                        <div className="col-12" id="detalles">
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
                                    {...register('tipo_cita', {
                                      validate: (value) => value?.length > 0 || "Debes seleccionar al menos una opción",
                                    })}
                                  />
                                  Entrevista de despeje
                                </label>
                                <label className="form-check-label">
                                  <input
                                    type="checkbox"
                                    value="Acompañamiento psicológico"
                                    name="tipo_cita"
                                    className="form-check-input"
                                    {...register('tipo_cita', {
                                      validate: (value) => value?.length > 0 || "Debes seleccionar al menos una opción",
                                    })}
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
                                    {...register('tipo_cita', {
                                      validate: (value) => value?.length > 0 || "Debes seleccionar al menos una opción",
                                    })}
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
                                    {...register('tipo_cita', {
                                      validate: (value) => value?.length > 0 || "Debes seleccionar al menos una opción",
                                    })}
                                  />
                                  Psicopedagógica individual
                                </label>

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
                              {/* <div className="form-check-inline">
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
                              </div> */}
                            </div>
                          </div>
                        }


                        {/* HORARIOS */}
                        <div className="col-12">
                          <div className="form-heading">
                            <CustomizedTooltips text={(
                              <>
                                <p>
                                  Al seleccionar un rango de disponibilidad, el tiempo de cada sesión será dividido en N bloques según la duración del servicio.
                                </p>
                                <p>
                                  Por ejemplo, si seleccionaste una duración de 1 hora y un rango de disponibilidad entre 9:00 y 12:00, entonces en ese rango caben 3 sesiones de 1 hora.
                                </p>
                              </>
                            )}>
                              <h4 style={{ width: 'max-content' }}>Disponibilidad <span className="login-danger">*</span><FaInfoCircle className="font-blue" style={{ fontSize: '14px' }} data-placement="right" /></h4>
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
                                  inputProps={{
                                    min: '08:00',
                                    max: '17:00',
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
                                        max: '17:00',
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

                        {/* FRECUENCIAS */}

                        <div className="col-12 col-lg-12" >
                          <div className="col-12">
                            <div className="form-heading">
                              <CustomizedTooltips text={(
                                <>
                                  <p>
                                    Al seleccionar una frecuencia, los intervalos seleccionados previamente se repetirán automáticamente para esa selección.
                                  </p>
                                  <p>
                                    Por ejemplo, si se selecciona diariamente, entonces todos los días, a la misma hora, estará disponible el mismo servicio o grupo de servicios.
                                  </p>
                                </>
                              )}>
                                <h4 style={{ width: 'max-content' }}>Frecuencia <span className="login-danger">*</span><FaInfoCircle className="font-blue" style={{ fontSize: '14px' }} /></h4>
                              </CustomizedTooltips>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-12 col-lg-2" >
                              <div className="form-group select-gender">
                             {/*    <div className="form-check-inline">
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
                                </div> */}
                                <div className="form-check-inline">
                                  <label className="form-check-label">
                                    <input
                                      type="radio"
                                      value="semanal"
                                      name="frecuencia"
                                      checked
                                      className="form-check-input"
                                      {...register('frecuencia')}
                                    />
                                    Semanal
                                  </label>
                                </div>
                            {/*     <div className="form-check-inline">
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
                                </div> */}
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
                                <h4 style={{ width: 'max-content' }}>Rango de repetición <FaInfoCircle className="font-blue" style={{ fontSize: '14px' }} /></h4>
                              </CustomizedTooltips>
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
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div >
        <div className="page-wrapper">
          <div className="content">
            {isLoading ?
              <SimpleBackdrop />
              :
              <Calender
                profesional_id={session?.user?.id}
                calendario={calendario}
                editBloque={handleEdit}
                deleteBloque={handleDelete}
                refresh={handleRefresh}
              />
            }
          </div>
        </div>

        {
          success === 'success'
            ?
            <div style={{
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
                onClose={handleOnClose}
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
                {error}
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
      </>


    </>
  )
}

// export default AddSchedule;
export default withAuth(AddSchedule, ['administrador', 'profesional']);

