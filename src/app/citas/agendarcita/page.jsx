'use client'
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { DatePicker } from "antd";
import Select from "react-select";
import Link from "next/link";
import { useForm, Controller } from 'react-hook-form';

import Sidebar from "@/components/Sidebar";

import { TextField, Alert } from "@mui/material";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";

import { fetchDoctors } from "@/services/DoctorsServices";
import { fetchUsers } from "@/services/UsersServices";
import { createAppointment } from "@/services/AppointmentsServices"

import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import ProtectedPage from "@/components/ProtectedRoutes";
import { PlusCircle, ChevronLeft, ChevronRight } from "feather-icons-react/build/IconComponents";
import * as dayjs from 'dayjs'

const AddAppoinments = () => {
  const VIDEOLLAMADA = false;
  const ROL = ["profesional", "admin"]
  // useAuthorization(['alumno'])

  const { register, handleSubmit, watch, control,
    formState: { errors }
  } = useForm(
    {
      defaultValues: { speciality: 'Psicología' }
    }
  )
  const [menuPortalTarget, setMenuPortalTarget] = useState(null);

  const [isClicked, setIsClicked] = useState(false);
  const [startTime, setStartTime] = useState();
  const [selectedOption, setSelectedOption] = useState(null);
  const [doctor, setDoctor] = useState([]);
  const [days, setDays] = useState([]);
  const [hours, setHours] = useState([])
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [indiceDias, setIndiceDias] = useState(0);
  const [indiceHoras, setIndiceHoras] = useState(0);

  const [success, setSuccess] = useState('initial')
  const [error, setError] = useState('')

  const [open, setOpen] = useState(false);
  const handleOpen = (e) => {
    e.preventDefault()
    setOpen(true)
  };
  const handleClose = () => setOpen(false);

  const fetchData = async () => {
    // const { users } = await fetchDoctors()
    // console.log(users);
    const users = [
      {
        id: 0,
        nombre: 'Miguel',
        apellido: 'González',
        email: 'miguelgonzález@udp.cl'
      },
      {
        id: 1,
        nombre: 'Ximena',
        apellido: 'Alarcón',
        email: 'ximenaalarcon@udp.cl'
      }
    ]
    // const { docs } = users.map((doc, i) => {
    const docs = users.map((doc, i) => {
      return {
        value: i + 2,
        label: doc.nombre + ' ' + doc.apellido,
        id: doc.id
      }
    })
    console.log('DOCS', docs);
    setDoctor(docs)

  }

  useEffect(() => {
    setMenuPortalTarget(document.body);
    setSelectedOption({
      id: 0,
      value: 2,
      label: 'Miguel González',
    })
    fetchData()
  }, [])

  const onChange = (date, dateString) => {
    console.log(date, dateString);
    setIsClicked(true);
  };
  const loadFile = (event) => {
    // Handle file loading logic here
  };

  const onSubmit = handleSubmit(async data => {
    setSuccess('initial')
    const patientName = watch("name")
    const patientLastname = watch("lastName")
    // const patients = await fetchUsers()

    // const patient = patients.filter(user =>
    //   user.nombre === patientName
    //   & user.apellido === patientLastname
    //   & user.tipo_usuario === 'alumno'
    // )
    try {
      // const appointment = await createAppointment({ ...data, "patient_id": patient[0].id })
      // console.log('appointment', appointment)
      // return bleh
      setSuccess('success')

    } catch (err) {
      setSuccess('fail')
      console.log('ERRRR', err.message)
      if (err.message === "Cannot read properties of undefined (reading 'id')") {
        setError(`No se encontró al paciente`);
      }
    } finally {
      setOpen(false)
    }
  })

  const [career, setCareer] = useState([
    { value: 2, label: "Antropologia" },
    { value: 3, label: "Arquitectura" },
    { value: 4, label: "Contador" },
    { value: 5, label: "Derecho" },
    { value: 6, label: "Ingenieria" },
  ]);
  const [gender, setGender] = useState([
    { value: 1, label: "Femenino" },
    { value: 2, label: "Masculino" },
    { value: 3, label: "No binario" },
    { value: 4, label: "Otro" },
    { value: 5, label: "Prefiero no decir" }
  ]);


  // // // // // // // // // // // // // // // // // // // 
  const profesional = watch('doctor')

  const handleSelectedProfessional = async (e) => {
    // e.preventDefault()
    setDays([])
    setHours([])
    setDate('')
    setTime('')

    try {
      setDays([
        {
          fechaInicio: '2024-06-20',
          id_user: 2
        },
        {
          fechaInicio: '2024-06-21',
          id_user: 2
        },
        {
          fechaInicio: '2024-06-24',
          id_user: 2
        },
        {
          fechaInicio: '2024-06-25',
          id_user: 2
        },
        {
          fechaInicio: '2024-06-26',
          id_user: 2
        },
        {
          fechaInicio: '2024-06-27',
          id_user: 2
        },
        {
          fechaInicio: '2024-06-28',
          id_user: 2
        },
        {
          fechaInicio: '2024-07-01',
          id_user: 2
        },
      ])

    } catch (error) {
      console.log('Error: ', error)

    }
  }
  const handleDays = async (e, fecha, id) => {
    e.preventDefault()
    console.log('DAYS', days);
    const horasDisponibles = [
      {
        id: 1,
        horaInicioBloque: '10:30'
      },
      {
        id: 2,
        horaInicioBloque: '11:30'
      },
      {
        id: 3,
        horaInicioBloque: '12:30'
      },
      {
        id: 4,
        horaInicioBloque: '14:30'
      },
      {
        id: 5,
        horaInicioBloque: '15:30'
      },
      {
        id: 6,
        horaInicioBloque: '16:30'
      },
      {
        id: 7,
        horaInicioBloque: '17:30'
      },
    ]
    const fechaMod = dayjs(fecha).format('YYYY-MM-DD')

    try {
      setDate(fechaMod)

      setHours(horasDisponibles)


    } catch (error) {
      console.log(error)
    }

  }


  const mostrarSiguientesDias = (e) => {
    e.preventDefault()
    setIndiceDias(prevIndice => prevIndice + 5);
  };

  const mostrarAnterioresDias = (e) => {
    e.preventDefault()
    setIndiceDias(prevIndice => Math.max(0, prevIndice - 5));
  };

  const mostrarSiguientesHoras = (e) => {
    e.preventDefault()
    setIndiceHoras(prevIndice => prevIndice + 5);
  };

  const mostrarAnterioresHoras = (e) => {
    e.preventDefault()
    setIndiceHoras(prevIndice => Math.max(0, prevIndice - 5));
  };

  // // // // // // // // // // // // // // // // // // // // // // 

  return (
    <ProtectedPage level={ROL}>
      {/* <Header /> */}
      {/* <Headerudp /> */}
      <Sidebar
        id="menu-item4"
        id1="menu-items4"
        activeClassName="add-appoinment"
      />
      <>
        <div className="page-wrapper mt-5 pt-5">
          <div className="content">
            {/* Page Header */}
            <div className="page-header">
              <div className="row">
                <div className="col-sm-12">
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="#">Citas </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="feather-chevron-right">
                        <FeatherIcon icon="chevron-right" />
                      </i>
                    </li>
                    <li className="breadcrumb-item active">Agendar Cita</li>
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
                      {/* Detalles del paciente */}
                      <div className="row">
                        <div className="col-12">
                          <div className="form-heading">
                            <h4 >Agendar Cita</h4>
                          </div>
                        </div>
                      </div>

                      {/* Detalles de la cita */}
                      <div className="row" style={{ border: '1px solid lightgrey', borderRadius: '8px', padding: '10px', margin: '10px' }}>
                        <div className="col-12">
                          <div className="form-heading">
                            <h4>Detalles de la Cita</h4>
                          </div>
                        </div>
                        {VIDEOLLAMADA && <div className="row">
                          <div className="col-12 col-md-6 col-xl-4">
                            <div className="form-group select-gender">
                              <label className="gen-label">
                                Indique modalidad de la atención <span className="login-danger">*</span>
                              </label>
                              <div className="form-check-inline">
                                <label className="form-check-label">
                                  <input
                                    type="radio"
                                    name="gender"
                                    value="male"
                                    className="form-check-input"
                                    {...register('gender')}
                                  />
                                  Videollamada
                                </label>
                              </div>
                              <div className="form-check-inline">
                                <label className="form-check-label">
                                  <input
                                    type="radio"
                                    name="gender"
                                    value="female"
                                    className="form-check-input"
                                    {...register('gender')}
                                  />
                                  Presencial
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                        }

                        {/* PROFESIONAL */}

                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group local-forms">
                            <label>Profesional</label>
                            <Controller
                              control={control}
                              name="doctor"
                              {...register('doctor', {
                                required: {
                                  value: true,
                                  message: 'Especialista es requerido',
                                }
                              })}
                              ref={null}
                              render={({ field: { onChange, onBlur, value } }) => (
                                <Select
                                  defaultValue={{
                                    id: 0,
                                    value: 2,
                                    label: 'Miguel González',
                                  }}
                                  onChange={(e) => {
                                    onChange(e);
                                    handleSelectedProfessional(e);
                                  }}
                                  options={doctor}
                                  instanceId="profesional"
                                  menuPortalTarget={menuPortalTarget}
                                  styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                  id="search-commodity"
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
                            {errors.doctor && <span><small>{errors.doctor.message}</small></span>}
                          </div>
                        </div>

                        {/* ESPECIALIDAD */}

                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group local-forms">
                            <label>Especialidad </label>
                            <input className="form-control" type="text" {...register('speciality')} />
                          </div>
                        </div>

                        {/* lUGAR DE ATENCIÓN */}
                     {/*    <div className="row">
                          <div className="col-12 col-md-12 col-xl-12">
                            <div className="form-group select-gender">
                              <label className="gen-label">
                                Indique lugar de preferencia <span className="login-danger">*</span>
                              </label>
                              <div className="form-check-inline">
                                <label className="form-check-label">
                                  <input
                                    type="radio"
                                    name="gender"
                                    value="male"
                                    className="form-check-input"
                                    {...register('gender')}
                                  />
                                  Sede Centro - Manuel Rodríguez 343 sur, 2° piso
                                </label>
                              </div>
                              <div className="form-check-inline">
                                <label className="form-check-label">
                                  <input
                                    type="radio"
                                    name="gender"
                                    value="female"
                                    className="form-check-input"
                                    {...register('gender')}
                                  />
                                  Sede Huechuraba - Av. Sta. Clara 797, Huechuraba
                                </label>
                              </div>

                            </div>
                          </div>
                        </div>
 */}
                        {/* 
                        <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms cal-icon">
                            <label>
                              Día de la Cita{" "}
                              <span className="login-danger">*</span>
                            </label>
                            <Controller
                              control={control}
                              name="appointment_date"
                              {...register('appointment_date', {
                                required: {
                                  value: true,
                                  message: 'Días es requerido',
                                }
                              })}
                              ref={null}
                              render={({ field: { onChange, onBlur, value } }) => (
                                <DatePicker
                                  className="form-control datetimepicker"
                                  onChange={onChange}
                                  suffixIcon={null}
                                  format={'YYYY-MM-DD'}
                                  style={{
                                    control: (baseStyles, state) => ({
                                      ...baseStyles,
                                      borderColor: isClicked ? '#2E37A4' : '2px solid rgba(46, 55, 164, 0.1)',
                                      '&:hover': {
                                        borderColor: state.isFocused ? 'none' : 'none',
                                      },
                                    })
                                  }}
                                />
                              )}
                            />
                            {errors.appointment_date && <span><small>{errors.appointment_date.message}</small></span>}
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Hora <span className="login-danger">*</span>
                            </label>
                            <div className="">
                              <TextField
                                className="form-control"
                                id="outlined-controlled"
                                type="time"
                                value={startTime}
                                onChange={(event) => {
                                  setStartTime(event.target.value);
                                }}
                                {...register('start_time', {
                                  required: {
                                    value: true,
                                    message: 'Hora es requerida',
                                  }
                                })}
                              />
                              {errors.start_time && <span><small>{errors.start_time.message}</small></span>}

                            </div>
                          </div>
                        </div> */}

                        <div className="col-12 col-sm-12">
                          <div className="form-group local-forms">
                            <label>
                              Observaciones <span className="login-danger">*</span>
                            </label>
                            <textarea
                              className="form-control"
                              rows={3}
                              cols={30}
                              defaultValue={""}
                              {...register('notes')}
                              style={{ resize: 'none' }}
                            />
                          </div>
                        </div>


                        {profesional &&

                          <div className="row">
                            <div className="col-12 col-md-12 col-xl-12">
                              <label>
                                Día de la Cita{" "}
                                <span className="login-danger">*</span>
                              </label>
                              <div className="form-group local-forms">
                                {days.length > 0 && (
                                  <>
                                    <button
                                      className="btn btn-primary"
                                      onClick={e => { mostrarAnterioresDias(e) }}
                                      disabled={indiceDias === 0}>
                                      <ChevronLeft />
                                    </button>

                                    {days.slice(indiceDias, indiceDias + 5).map((day, i) => {
                                      // console.log('day en el map', date,'holo', day.fechaInicio)
                                      return (
                                        <button
                                          className={`btn me-2 ${date === day.fechaInicio ? "btn-primary" : "btn-cancel"}`}
                                          key={`${day.id}${i}days`}
                                          onClick={(e) => handleDays(e, day.fechaInicio, day.id_user)}>
                                          {dayjs(day.fechaInicio).format('ddd DD MMM')}
                                        </button>
                                      )
                                    }
                                    )}
                                    <button
                                      className="btn btn-primary"
                                      onClick={e => { mostrarSiguientesDias(e) }}
                                      disabled={indiceDias + 5 >= days.length}>
                                      <ChevronRight />
                                    </button>
                                  </>)
                                }
                              </div>
                            </div>
                            {/* <DatePick /> */}
                            {date !== '' &&
                              <div className="col-12 col-md-12 col-xl-12">
                                <label>
                                  Hora <span className="login-danger">*</span>
                                </label>
                                <div className="form-group local-forms">
                                  {hours.length > 0 && (
                                    <>
                                      <button
                                        className="btn btn-primary"
                                        onClick={e => { mostrarAnterioresHoras(e) }}
                                        disabled={indiceHoras === 0}>
                                        <ChevronLeft />
                                      </button>
                                      {hours.slice(indiceHoras, indiceHoras + 5).map((hour, i) => {
                                        // console.log('hour', hour.horaInicioBloque , time)
                                        return (
                                          <button
                                            type="button"
                                            className={`btn me-2 ${time === hour.horaInicioBloque ? "btn-primary" : "btn-cancel"}`}
                                            key={`${hour.id}${i}hours`}
                                            onClick={() => { setTime(hour.horaInicioBloque) }}>
                                            {hour.horaInicioBloque}
                                          </button>
                                        )
                                      }
                                      )}
                                      <button
                                        className="btn btn-primary"
                                        onClick={e => { mostrarSiguientesHoras(e) }}
                                        disabled={indiceHoras + 5 >= days.length}>
                                        <ChevronRight />
                                      </button>
                                    </>)
                                  }
                                </div>
                              </div>
                            }
                          </div>
                        }



                      </div>

                      <div className="row" style={{ border: '1px solid lightgrey', borderRadius: '8px', padding: '10px', margin: '10px' }}>
                        <div className="col-12">
                          <div className="form-heading">
                            <h4 style={{ margin: 0 }}>Detalles del Paciente</h4>
                            <h5 style={{ fontSize: '12px', margin: '5px 0 25px' }}>Los campos son editables, pero solo afectarán la información en este portal, no para SAP</h5>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12 col-md-6 col-xl-6">
                            <div className="form-group local-forms">
                              <label>
                                Correo electrónico {/* <span className="login-danger">*</span> */}
                              </label>
                              <input
                                className="form-control"
                                type="email"
                                {...register('email', {
                                  required: {
                                    value: true,
                                    message: 'Correo es requerido'
                                  },
                                  pattern: {
                                    value: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
                                    message: 'Correo no es válido'
                                  }
                                })}
                              />
                              {errors.email && <span><small>{errors.email.message}</small></span>}

                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group local-forms">
                            <label>
                              Nombres {/* <span className="login-danger">*</span> */}
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              {...register('name', {
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
                            {
                              errors.name && <span><small>{errors.name.message}</small></span>
                            }
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group local-forms">
                            <label>
                              Apellidos {/* <span className="login-danger">*</span> */}
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              {...register('lastName', {
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
                            {
                              errors.lastName && <span><small>{errors.lastName.message}</small></span>
                            }
                          </div>
                        </div>

                      </div>
                      <div className="col-12">
                        <div className="doctor-submit text-end">
                          <button
                            // type="submit"
                            className="btn btn-primary submit-form me-2"
                            onClick={onSubmit}
                          >
                            Enviar
                          </button>
                          <button
                            // type="submit"
                            className="btn btn-primary cancel-form"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <Modal open={open} handleClose={handleClose} onClick={onSubmit} /> */}

        </div>
        {success === 'success'
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
              La cita se ha creado con éxito. Revisa tu bandeja de entrada para confirmarla.
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
    </ProtectedPage>
  );
};

export default AddAppoinments;
