'use client'
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import Select from "react-select";
import Link from "next/link";
import { useForm, Controller } from 'react-hook-form';

import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import { Accordion, AccordionSummary, AccordionDetails, Alert, Box, LinearProgress } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { fetchSpecialityById } from "@/services/DoctorsServices";
import { fetchPatientsDespejeFalse } from "@/services/UsersServices";
import { createAppointment } from "@/services/AppointmentsServices"
import { fetchScheduleByDate, fetchScheduleByAvailability, generarHorasMedicas } from "@/services/SchedulesServices";
import { fetchFilteredProfesssionals } from "@/utils/getDoctorsWithDespeje";

import { useSession } from "next-auth/react";
import { ChevronLeft, ChevronRight } from "feather-icons-react/build/IconComponents";
import * as dayjs from 'dayjs'
import * as isLeapYear from 'dayjs/plugin/isLeapYear' // import plugin
import 'dayjs/locale/es-mx'
import { motivo_consulta } from "@/utils/selects";

import { useSidebar } from "@/context/SidebarContext";
import withAuth from '@/components/withAuth';

// Función para obtener fechas únicas
const obtenerFechasUnicas = array => {
  let fechasUnicas = [];
  let arrayDeComprobacion = []

  array.forEach(objeto => {
    let { fechaInicio, id_user } = objeto;
    if (!arrayDeComprobacion.includes(fechaInicio)) {
      fechasUnicas.push({ fechaInicio, id_user });
      arrayDeComprobacion.push(fechaInicio)
    }
  });
  return fechasUnicas;
}

const AddAppoinments = () => {
  const { data: session, status } = useSession()
  const [menuPortalTarget, setMenuPortalTarget] = useState(null);
  const [isClicked, setIsClicked] = useState(false);
  const [startTime, setStartTime] = useState();
  const [selectedOption, setSelectedOption] = useState(null);
  const [doctor, setDoctor] = useState([]);
  const [patients, setPatients] = useState(null);
  const [days, setDays] = useState([]);
  const [allDays, setAllDays] = useState([])
  const [hours, setHours] = useState([])
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [indiceDias, setIndiceDias] = useState(0);
  const [indiceHoras, setIndiceHoras] = useState(0);
  const [selectedPatient, setSelectedPatient] = useState('')
  const [filteredData, setFilteredData] = useState([]);
  const [especialidad, setEspecialidad] = useState('')
  dayjs.extend(isLeapYear) // use plugin
  dayjs.locale('es-mx') // use locale
  const [bloques, setBloques] = useState([])

  const [success, setSuccess] = useState('initial')
  const [error, setError] = useState('')
  const [loadingDays, setLoadingDays] = useState(false)
  const { setProps } = useSidebar();

  useEffect(() => {
    setProps({
      id: "menu-item4",
      id1: "menu-items4",
      activeClassName: "add-appoinment",
    });
  }, [setProps]);

  const { register, handleSubmit, watch, control, setValue, resetField,
    formState: { errors }, reset
  } = useForm({
    defaultValues: async () => await getPatients()
  });

  const tipo_cita = [
    { value: "Acompañamiento", label: "Acompañamiento psicológico" },
    { value: "breve", label: "Psicoterapia breve" },
    { value: "individual", label: "Psicopedagógica individual" },
  ]

  const [open, setOpen] = useState(false);
  const handleOpen = (e) => {
    e.preventDefault()
    setOpen(true)
  };

  const handleClose = () => setOpen(false);
  /* FETCH PACIENTES CON DESPEJE */
  const getPatients = async () => {
    try {
      const { users: alumnosFiltered } = await fetchPatientsDespejeFalse()
      const alumnosProcessed = alumnosFiltered.map((alumno, i) => {
        return {
          value: i + 2,
          label: alumno.email,
          name: alumno.nombre,
          lastName: alumno.apellido,
          id: alumno.id
        }
      })
      setPatients(alumnosProcessed)
    } catch (error) {
      console.error("Error al traer data inicial:", error);
      return {};
    }
  };

  const getSpeciality = async () => {
    if (session?.user?.rol === 'administrador') {
      setEspecialidad('Administrador')
    } else {
      try {
        const { especialidades: profesional } = await fetchSpecialityById(session?.user?.id)
        setEspecialidad(profesional[0].especialidad)
      } catch (error) {
        console.log('ERROR', error)
      }
    }
  }

  const modalidad = watch("modalidad"); // Valor predeterminado: videollamada
  const campus = watch("campus", ""); // Valor predeterminado: ninguno
  const motivo_consulta_seleccionado = watch('motivo')
  const profesional = watch('professional')

  useEffect(() => {
    setMenuPortalTarget(document.body);
    getPatients()
    getSpeciality()
  }, [])


  // Filtros
  useEffect(() => {
    setLoadingDays(true)
    let filtered = allDays;
    let uniqueFiltered = Array.from(new Set(filtered.map(item => `${item.fechaInicio}`))).map(compositeKey => {
      return filtered.find(item => `${item.fechaInicio}` === compositeKey);
    });

    if (modalidad === "presencial" && (campus === "centro" || campus === "ambas")) {
      setDays([])
      setHours([])
      setDate('')
      setTime('')
      uniqueFiltered = uniqueFiltered.filter(item => (item.modalidad === "presencial" || item.modalidad === "ambas") && (item.campus === "centro"));
      setLoadingDays(false)

    } else if (modalidad === "presencial" && (campus === "huechuraba" || campus === "ambas")) {
      setDays([])
      setHours([])
      setDate('')
      setTime('')

      uniqueFiltered = uniqueFiltered.filter(
        item => (item.modalidad === "presencial" || item.modalidad === "ambas") && (item.campus === "huechuraba")
      );
      setLoadingDays(false)
    } else if (modalidad === "videollamada" || modalidad === "ambas") {
      setDays([])
      setHours([])
      setDate('')
      setTime('')
      uniqueFiltered = uniqueFiltered.filter(item => item.modalidad === "videollamada" || item.modalidad === "ambas"
      );
      setLoadingDays(false)

    } else if (modalidad === "presencial" || modalidad === "ambas") {
      setDays([])
      setHours([])
      setDate('')
      setTime('')

      uniqueFiltered = uniqueFiltered.filter(item => item.modalidad === "presencial" || item.modalidad === "ambas"
      );
      setLoadingDays(false)
    }

    setDays(uniqueFiltered);
  }, [modalidad, campus, doctor]);

  const onChange = (date, dateString) => {
    setIsClicked(true);
  };

  const loadFile = (event) => {
    // Handle file loading logic here
  };

  const obtenerDias = (objetos) => {
    let fechaActual = new Date();

    const filterWeekDays = objetos.filter(item => {
      if (fechaActual.toISOString().split('T')[0] < item.fechaInicio) {
        if (new Date(item.fechaInicio).getDay() !== 5
          && new Date(item.fechaInicio).getDay() !== 6) {
          return true;
        }
      }
      return false
    })
    const soloDias = obtenerFechasUnicas(filterWeekDays)

    return soloDias;
  }

  // SUBMIT FUNCTION
  const onSubmit = handleSubmit(async (data, e) => {
    e.preventDefault()
    setSuccess('initial')
    try {
      // la función que crea la cita
      const appointment = await createAppointment({
        ...data,
        "patient_id": selectedPatient.id,
        hora: data.selectedHour,
        fecha: data.selectedDay,
        motivo: data.motivo === 'Otro' ? data.otro : data.motivo,
        campus: data.campus || 'No aplica'
      })


      if (appointment.estado === false) {
        setSuccess('fail')
        setError(appointment.detalle)
      } else {
        setSuccess('success')
      }

    } catch (err) {
      setSuccess('fail')
      if (err.message === "Cannot read properties of undefined (reading 'id')") {
        setError(`No se encontró al paciente`);
      }
    } finally {
      setOpen(false)
    }
  })

  // // // // // // // // // // // // // // // // // // // 

  const orderByDate = (arr) => {
    return arr.sort((a, b) => dayjs(a.fechaInicio).isAfter(dayjs(b.fechaInicio)) ? 1 : -1);
  }

  const handleSelectedType = async (e) => {
    setDoctor([])
    setDays([])
    setHours([])
    setDate('')
    setTime('')
    setLoadingDays(true)
    const professionals = await fetchFilteredProfesssionals(e.value)
    const selectedProfessionals = professionals.map((doc, i) => {
      return {
        value: i + 2,
        label: doc.nombre + ' ' + doc.apellido,
        id: doc.id,
        email: doc.email,
        name: doc.nombre
      }
    })
    setDoctor(selectedProfessionals)
  }

  // Obtiene días según profesional seleccionado
  const handleSelectedProfessional = async (e) => {
    setDays([])
    setHours([])
    setDate('')
    setTime('')
    setLoadingDays(true)
    resetField('modalidad')
    resetField('campus')
    resetField('selectedDay')
    resetField('selecteHour')
    try {
      const horasmedicas = await generarHorasMedicas(e.id)

      // Traer disponibilidades
      const { users: byProf } = await fetchScheduleByAvailability(e.id)

      // Filtrar para que salgan solo las fechas posteriores
      const hoy = new Date();
      const filterByDate = horasmedicas.filter(item => new Date(item.fechaInicio) >= hoy);

      const orderedData = orderByDate(filterByDate)
      const bloque = obtenerDias(orderedData)
      setAllDays(orderedData)
      setLoadingDays(false)
      setDays(bloque)
    } catch (error) {
      console.log('Error: ', error)
    }
  }

  const horaAMinutos = (hora) => {
    const partesHora = hora.split(":");
    return parseInt(partesHora[0]) * 60 + parseInt(partesHora[1]);
  }

  const calcularHoraInicioDeBloques = (cita) => {
    const horaIniMinutos = horaAMinutos(cita.horaInicio);
    const duracionBloque = cita.duracionServicio;
    // Array para almacenar las horas de inicio de cada bloque
    const horasInicioBloques = [];
    // Calcular la hora de inicio para cada bloque
    for (let i = 0; i < Math.floor((horaAMinutos(cita.horaFin) - horaIniMinutos) / duracionBloque); i++) {
      // Convertir minutos a formato HH:MM
      const horaInicioBloque = minutosAHora(horaIniMinutos + i * duracionBloque);
      horasInicioBloques.push({ ...cita, horaInicioBloque });
    }
    return horasInicioBloques;
  }

  // Función para convertir minutos a formato HH:MM
  const minutosAHora = (minutos) => {
    const horas = Math.floor(minutos / 60); // Obtener las horas
    const minutosRestantes = minutos % 60; // Obtener los minutos restantes
    return `${String(horas).padStart(2, '0')}:${String(minutosRestantes).padStart(2, '0')}`; // Formato HH:mm
  }

  // Muestra horas por día
  const handleDays = async (e, fecha, id) => {
    e.preventDefault()
    setHours('')
    setBloques('')
    resetField('selecteHour')
    setTime('')
    resetField('selecteHour')
    setValue('selectedDay', fecha)

    const fechaMod = dayjs(fecha).format('YYYY-MM-DD')
    try {
      setDate(fechaMod)
      const selectedDays = allDays.filter(item => item.fechaInicio === fechaMod)

      let newBloques = []
      selectedDays.forEach(item => {
        newBloques.push(calcularHoraInicioDeBloques(item))
      })
      const flatted = newBloques.flat()

      const arrayOrdenado = flatted.sort((a, b) => {
        const horaA = new Date(`1970-01-01T${a.horaInicio}:00`).getTime();
        const horaB = new Date(`1970-01-01T${b.horaInicio}:00`).getTime();
        return horaA - horaB;
      });

      setHours(arrayOrdenado)
    } catch (error) {
      console.log(error)
    }
  }

  const handleHours = (hour) => {
    setTime(hour)
    setValue('selectedHour', hour)
  }

  // Obtiene la duración y la agrega a la función agregarBloques
  const handleBloques = async (id, hora) => {
    const { bloques } = await fetchScheduleByDate(id, date)

    const getDuracionServicio = hours.find(item1 => bloques.some(item2 => item2.hora_inicio >= item1.horaIni && item2.hora_inicio <= item1.horaFin))

    return agregarBloques(bloques, hora, getDuracionServicio.duracionServicio);
  }


  // Función para convertir la hora en formato HH:mm:ss a segundos
  const convertirAHoras = (hora) => {
    const [h, m, s] = hora.split(':').map(Number);
    return h * 3600 + m * 60 + s;  // Convertir a segundos
  };

  // Función principal que obtiene los bloques según el rango y duración
  const agregarBloques = (bloques, horaInicio, duracionServicio) => {

    const bloqueIni = bloques.filter(item => convertirAHoras(item.hora_inicio) == convertirAHoras(horaInicio))
    const idBloqueIni = bloqueIni[0].id_bloque
    const cantidadBloques = duracionServicio / 5

    const resultado = bloques.filter(item => item.id_bloque >= idBloqueIni && item.id_bloque < (parseInt(idBloqueIni) + parseInt(cantidadBloques))
    )

    return resultado;
  };

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

  const handleSelectedalumno = async (e) => {
    setSelectedPatient(e)
    setValue('patientName', e?.name);
    setValue('patientLastname', e?.lastName);
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
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header"
                        >
                          <div className="col-12">
                            <div className="form-heading">
                              <h4>Detalles del Profesional que agenda</h4>
                            </div>
                          </div>
                        </AccordionSummary>
                        <AccordionDetails>


                          {/* PROFESIONAL */}

                          <div className="col-12 col-md-6 col-xl-6">
                            <div className="form-group local-forms">
                              <label>Profesional</label>
                              <input
                                disabled
                                className="form-control"
                                type="text"
                                value={session.user?.name}
                                {...register('nombre_quien_agenda')}
                              />
                              {errors.professional && <span><small>{errors.professional.message}</small></span>}
                            </div>
                          </div>

                          {/* ESPECIALIDAD */}

                          <div className="col-12 col-md-6 col-xl-6">
                            <div className="form-group local-forms">
                              <label>Especialidad </label>
                              <input className="form-control" type="text"
                                disabled
                                {...register('speciality')} value={especialidad || ''} />
                            </div>
                          </div>
                        </AccordionDetails>
                      </Accordion>
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header"
                        >
                          <div className="col-12">
                            <div className="form-heading">
                              <h4 style={{ margin: 0 }}>Detalles del Paciente</h4>
                              <h5 style={{ fontSize: '12px', margin: '5px 0 25px' }}>Los campos son editables, pero solo afectarán la información en este portal, no en otros sistemas internos de la universidad</h5>
                            </div>
                          </div>
                        </AccordionSummary>
                        <AccordionDetails>
                          {/* DATOS ESTUDIANTE */}
                          <div className="row">
                            <div className="col-12 col-md-6 col-xl-6">
                              <div className="form-group local-forms">
                                <label>
                                  Correo electrónico de alumno {/* <span className="login-danger">*</span> */}
                                </label>
                                <Controller
                                  control={control}
                                  name="alumno"
                                  {...register('alumno')}
                                  ref={null}
                                  render={({ field: { onChange, onBlur, value, name, ref } }) => {
                                    return (<Select
                                      instanceId="alumno"
                                      defaultValue={selectedOption}
                                      onChange={(e) => {
                                        onChange(e);
                                        handleSelectedalumno(e);
                                      }}
                                      getOptionLabel={e => e.label}
                                      options={patients}
                                      styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                      id="alumno"
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
                                {errors.alumno && <span><small>{errors.alumno.message}</small></span>}

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
                                value={selectedPatient?.name || ''}
                                disabled
                                {...register('patientName', {
                                  required: {
                                    value: true,
                                    message: 'Nombre de estudiante requerido'
                                  }
                                })}
                              />
                              {
                                errors.patientName && <span><small>{errors.patientName.message}</small></span>
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
                                disabled
                                value={selectedPatient?.lastName || ''}
                                {...register('patientLastname', {
                                  required: {
                                    value: true,
                                    message: 'Apellido de estudiante requerido'
                                  }
                                })}
                              />
                              {
                                errors.patientLastname && <span><small>{errors.patientLastname.message}</small></span>
                              }
                            </div>
                          </div>
                        </AccordionDetails>
                      </Accordion>
                      {/* DATOS ESTUDIANTE */}

                      <Accordion
                        defaultExpanded={true}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header"
                        >
                          <div className="col-12 pb-0 mb-0">
                            <div className="form-heading pb-0 mb-0">
                              <h4>Detalles de la Cita</h4>
                            </div>
                          </div>
                        </AccordionSummary>
                        <AccordionDetails>


                          <div className="row">
                            <div className="col-12">
                              <div className="col-12 col-md-6 col-xl-6">
                                <div className="form-group local-forms">
                                  <label>Modalidad de atención a la cual accede según evaluación</label>
                                  <Controller
                                    control={control}
                                    name="tipo_cita"
                                    {...register('tipo_cita')}
                                    ref={null}
                                    render={({ field: { onChange, onBlur, value, name, ref } }) => {
                                      return (<Select
                                        instanceId="tipo_cita"
                                        defaultValue={selectedOption}
                                        onChange={(e) => {
                                          onChange(e);
                                          handleSelectedType(e);
                                        }}
                                        getOptionLabel={e => e.label}
                                        options={tipo_cita}
                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                        id="tipo_cita"
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
                                  {errors.professional && <span><small>{errors.professional.message}</small></span>}

                                </div>
                              </div>
                            </div>
                          </div>


                          <div className="row">
                            <div className="col-12 ">
                              <div className="form-group local-forms col-md-6 col-xl-6">
                                <label>Profesional</label>
                                <Controller
                                  control={control}
                                  name="professional"
                                  {...register('professional')}
                                  ref={null}
                                  render={({ field: { onChange, onBlur, value, name, ref } }) => {
                                    return (<Select
                                      placeholder={doctor.length === 0 ? 'Cargando...' : 'Seleccione...'}
                                      instanceId="professional"
                                      defaultValue={selectedOption}
                                      onChange={(e) => {
                                        onChange(e);
                                        handleSelectedProfessional(e);
                                      }}
                                      getOptionLabel={e => e.label}
                                      options={doctor}
                                      styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                      id="professional"
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
                                {errors.professional && <span><small>{errors.professional.message}</small></span>}
                              </div>

                            </div>


                            <div className="col-12 col-md-12 col-xl-12">
                              <div className="form-group local-forms">
                                <label>Motivo de la consulta</label>
                                <Controller
                                  control={control}
                                  name="motivo"
                                  {...register('motivo', {
                                    required: {
                                      value: true,
                                      message: 'Motivo es requerido',
                                    }
                                  })}
                                  ref={null}
                                  render={({ field: { onChange, onBlur, value } }) => (
                                    <Select
                                      instanceId="motivo"
                                      defaultValue={selectedOption}
                                      onChange={onChange}
                                      options={motivo_consulta}
                                      menuPortalTarget={menuPortalTarget}
                                      styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                      id="motivo"
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
                                          zIndex: '90000000'
                                        }),
                                      }}
                                    />
                                  )}
                                />
                                {errors.motivo && <span><small>{errors.motivo.message}</small></span>}
                              </div>
                            </div>

                            {
                              motivo_consulta_seleccionado?.label === 'Otro' ?
                                <div className="col-12 col-sm-6">
                                  <div className="form-group local-forms">
                                    <label>
                                      Escribe el motivo <span className="login-danger">*</span>
                                    </label>
                                    <input
                                      className="form-control" type="text"
                                      defaultValue={""}
                                      {...register('otro')} />
                                  </div>
                                </div>
                                : <></>
                            }


                            <div className="col-12 col-md-6 col-xl-4">
                              <div className="form-group select-gender">
                                <label className="gen-label">
                                  Indique modalidad de la atención <span className="login-danger">*</span>
                                </label>
                                <div className="form-check-inline">
                                  <label className="form-check-label">
                                    <input
                                      type="radio"
                                      name="modalidad"
                                      value="videollamada"
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
                                      name="modalidad"
                                      value="presencial"
                                      className="form-check-input"
                                      {...register('modalidad')}
                                    />
                                    Presencial
                                  </label>
                                </div>
                                {errors.modalidad && errors.modalidad && <span><small>{errors.modalidad.message}</small></span>}
                              </div>
                            </div>
                          </div>
                          {modalidad === 'presencial' &&
                            <div className="row">
                              <div className="col-12 col-md-12 col-xl-12">
                                <div className="form-group select-gender">
                                  <label className="gen-label">
                                    Indique lugar de preferencia <span className="login-danger">*</span>
                                  </label>
                                  <div className="form-check-inline">
                                    <label className="form-check-label">
                                      <input
                                        type="radio"
                                        name="campus"
                                        value="centro"
                                        className="form-check-input"
                                        {...register('campus')}
                                      />
                                      Sede Centro - Manuel Rodríguez Sur 343 , 2° piso
                                    </label>
                                  </div>
                                  <div className="form-check-inline">
                                    <label className="form-check-label">
                                      <input
                                        type="radio"
                                        name="campus"
                                        value="huechuraba"
                                        className="form-check-input"
                                        {...register('campus')}
                                      />
                                      Sede Huechuraba - Avenida Santa Clara 797, Huechuraba, piso -2, edificio Cubo
                                    </label>
                                  </div>
                                  {errors.campus && errors.campus && <span><small>{errors.campus.message}</small></span>}

                                </div>
                              </div>
                            </div>

                          }

                          {profesional &&

                            <div className="row">
                              <div className="col-12 col-md-12 col-xl-12">
                                <label>
                                  Día de la Cita{" "}
                                  <span className="login-danger">*</span>
                                </label>
                                {
                                  loadingDays ?

                                    <Box sx={{ width: '100%' }}>
                                      <LinearProgress />
                                    </Box>
                                    :
                                    <div className="form-group local-forms mb-0">
                                      {days.length > 0 && modalidad !== null && (
                                        <>
                                          <button
                                            className="btn btn-primary"
                                            onClick={e => { mostrarAnterioresDias(e) }}
                                            disabled={indiceDias === 0}>
                                            <ChevronLeft />
                                          </button>

                                          {days.slice(indiceDias, indiceDias + 5).map((day, i) => {
                                            return (
                                              <div key={`${day.id}${i}days`} style={{ display: 'inline-block' }}>
                                                <input type="hidden" {...register("selectedDay", {
                                                  required: {
                                                    value: true,
                                                    message: 'Seleccione una fecha'
                                                  }
                                                })} />
                                                <button
                                                  className={`btn me-2 ${date === day.fechaInicio ? "btn-primary" : "btn-cancel"}`}

                                                  onClick={(e) => handleDays(e, day.fechaInicio, day.id_user)}>
                                                  {dayjs(day.fechaInicio).format('ddd DD MMM')}

                                                </button>
                                              </div>
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
                                }
                                {
                                  errors.selectedDay && errors.selectedDay && <span><small>{errors.selectedDay.message}</small></span>
                                }
                              </div>

                              {/* <DatePick /> */}
                              {date !== '' &&
                                <div className="col-12 col-md-12 col-xl-12 mt-3">
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

                                          return (
                                            <div key={`${hour.id}${i}hours`} style={{ display: 'inline-block' }}>
                                              <input type="hidden" {...register("selectedHour", {
                                                required: {
                                                  value: true,
                                                  message: 'Seleccione una hora'
                                                }
                                              })} />
                                              <button
                                                type="button"
                                                className={`btn me-2 ${time === hour.horaInicio ? "btn-primary" : "btn-cancel"}`}
                                                onClick={() => { handleHours(hour.horaInicio) }}>
                                                {hour.horaInicioBloque}
                                              </button>
                                            </div>
                                          )
                                        }
                                        )}
                                        <button
                                          className="btn btn-primary"
                                          onClick={e => { mostrarSiguientesHoras(e) }}
                                          disabled={indiceHoras + 5 >= hours.length}>
                                          <ChevronRight />
                                        </button>
                                      </>)
                                    }
                                  </div>
                                </div>
                              }
                              {
                                errors.selectedHour && <span><small>{errors.selectedHour.message}</small></span>
                              }
                            </div>
                          }
                        </AccordionDetails>
                      </Accordion>

                      <div className="col-12">
                        <div className="doctor-submit text-end mt-3">
                          <button
                            // type="submit"
                            className="btn btn-primary submit-form me-2"
                            onClick={onSubmit}
                          >
                            Agendar
                          </button>
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
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
              La cita se ha creado con éxito. Revisa los detalles en la sección Lista de citas.
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
  );
};

export default withAuth(AddAppoinments, ['profesional', 'administrador']);
