'use client'
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
/* eslint-disable-next-line react-hooks/exhaustive-deps */

import { useState, useEffect } from "react";
import { useSidebar } from "@/context/SidebarContext";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Select from "react-select";
import { useForm, Controller } from 'react-hook-form';
import { changeStatusAppointment, fetchAppointments, editAppointmentUuid, editAppointmentHour, fetchAppointmentById } from "@/services/AppointmentsServices";
import { fetchScheduleByDate, fetchScheduleByAvailability, generarHorasMedicas } from "@/services/SchedulesServices";
import { fetchProfessionals } from "@/services/DoctorsServices";
import { fetchUser, fetchUserByEmail } from "@/services/UsersServices";
import SimpleBackdrop from "@/components/Backdrop";
import { fetchFilteredProfesssionals } from "@/utils/getDoctorsWithDespeje";

import FeatherIcon from "feather-icons-react";
import { ChevronLeft, ChevronRight } from "feather-icons-react/build/IconComponents";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import withAuth from '@/components/withAuth';
import { Alert, Box, LinearProgress } from "@mui/material";
import { tipo_cita, motivo_consulta } from "@/utils/selects";

import dayjs from "dayjs";
import * as isLeapYear from 'dayjs/plugin/isLeapYear' // import plugin
import 'dayjs/locale/es-mx'

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

const EditAppoinments = ({ params }) => {
  const { data: session, status } = useSession()
  const userRole = session?.user?.rol
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [menuPortalTarget, setMenuPortalTarget] = useState(null);

  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [selectedOption, setSelectedOption] = useState(null);
  const [appointment, setAppointment] = useState('');
  const [dataPatient, setDatapatient] = useState('')
  const [success, setSuccess] = useState('initial')
  const [profesional, setProfesional] = useState([]);
  const { setProps } = useSidebar();
  const [allDays, setAllDays] = useState([])
  const [loadingDays, setLoadingDays] = useState(false)
  const [days, setDays] = useState([])
  const [date, setDate] = useState('')
  const [doctor, setDoctor] = useState([]);
  const [indiceDias, setIndiceDias] = useState(0);
  const [indiceHoras, setIndiceHoras] = useState(0);
  const [hours, setHours] = useState([])
  const [bloques, setBloques] = useState([])
  const [time, setTime] = useState('')
  const [message, setMessage] = useState('')
  dayjs.extend(isLeapYear) // use plugin
  dayjs.locale('es-mx') // use locale

  const [speciality, setSpeciality] = useState([
    { value: "Psicopedagogía", label: "Psicopedagogía", name: "speciality" },
    { value: "Psicología", label: "Psicología", name: "speciality" },
    { value: "Psiquiatría", label: "Psiquiatría", name: "speciality" },
  ]);

  const handleClose = () => {
    setSuccess('initial')
    session?.user?.rol === 'alumno' ? router.push('/citas') : router.push('/pacientes')
  };

  useEffect(() => {
    setProps({
      id: "menu-item4",
      id1: "menu-items4",
      activeClassName: "edit-appoinment",
    });
  }, [setProps]);

  const fetchDataProfessionals = async () => {
    const response = await fetchProfessionals()
    const docs = response.map((doc, i) => {
      return {
        value: i + 2,
        label: doc.nombre + ' ' + doc.apellido,
        id: doc.id,
        name: doc.nombre + ' ' + doc.apellido,
        email: doc.email,
      }
    })
    setProfesional(docs)
    return docs
  }

  const getAppointmentById = async () => {
    try {
      const { citas: response } = await fetchAppointmentById(params.appointmentId)
      const obj = {
        campus: response[0].campus,
        email: response[0].email_estudiante,
        speciality: response[0].especialidad_profesional,
        appointment_date: dayjs(response[0]['fecha']).format('YYYY-MM-DD'),
        start_time: formatearHora(response[0]['hora']),
        id: response[0].id_cita,
        id_paciente: response[0].id_paciente,
        id_profesional: response[0].id_profesional,
        name: response[0]['nombre_alumno'].split(' ')[0],
        lastName: response[0]['nombre_alumno'].split(' ')[1],
        selected_doctor: response[0].nombre_profesional,
        mobile: response[0].telefono_estudiante,
        uuid: response[0].uuid,
        estado: response[0].estado
      }
      if (response.length === 0) {
      } else {
        setDatapatient(obj)
        return obj;
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  useEffect(() => {
    setMenuPortalTarget(document.body);
    fetchDataProfessionals()
    // const selected = profesional?.find(option => option.label === dataPatient?.selected_doctor) || null
    // console.log('selected', selected);
    getAppointmentById()
    // fetchScheduleByAvailability(selected)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    resetField,
    setValue,
    watch,
  } = useForm({
    defaultValues: async () => {
      if (status === "loading") {
        return {} // Retorna un objeto vacío mientras se carga la sesión
      }
      if (!session) {
        router.push("/")
        return {} // Detiene la ejecución
      }
      setLoading(true)

      try {
        // 1. cargar datos de cita
        const appointmentData = await getAppointmentById();

        // 2. Luego cargar profesionales
        const docs = await fetchDataProfessionals();

        // 3. Esperar a que el estado profesional se actualice

        await new Promise(resolve => setTimeout(resolve, 100));

        // 4.  buscar el seleccionado
        const selected = docs?.find(option => option.label === appointmentData?.selected_doctor);
        // 5. si encuentra el profesional, cargar su disponibilidad
        if (selected) {
          await handleSelectedProfessional(selected);
        } else {
          console.log('No se encontró el profesional:', appointmentData?.selected_doctor);
        }

        return appointmentData;
      } catch (error) {
        console.error("Error al cargar datos:", error);
        return { data: [] };
      } finally {
        setLoading(false);
        setLoadingDays(false)
      }
    },
  });

  const modalidad = watch("modalidad"); // Valor predeterminado: videollamada
  const campus = watch("campus", ""); // Valor predeterminado: ninguno

  const orderByDate = (arr) => {
    return [...arr].sort((a, b) => {
      try {
        return dayjs(a.fechaInicio).isAfter(dayjs(b.fechaInicio)) ? 1 : -1;
      } catch (e) {
        return 0; // Si hay error en el parseo, mantiene el orden original
      }
    });
  }

  // FILTROS
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

    setLoadingDays(false)
    setDays(uniqueFiltered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalidad, campus, doctor]);

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
      // Obtener horas médicas y filtrar solo las disponibles (disponible > 0)
      const todasHorasMedicas = await generarHorasMedicas(e.id)
      const horasmedicas = todasHorasMedicas.filter(hora => hora.disponible > 0)

      // Traer disponibilidades (esto parece necesario para otra lógica)
      const { users: byProf } = await fetchScheduleByAvailability(e.id)

      // Filtrar para que salgan solo las fechas posteriores (manteniendo tu lógica original)
      const hoy = new Date()
      const filterByDate = horasmedicas.filter(item => new Date(item.fechaInicio) >= hoy)
      const filterByAvailability = filterByDate.filter(item => item.disponible === 1)

      const orderedData = orderByDate(filterByAvailability);
      const bloque = obtenerDias(orderedData)
      setAllDays(orderedData)
      setLoadingDays(false)
      setDays(bloque)
    } catch (error) {
      console.log('Error: ', error)
    } finally {
      setLoading(false)
    }
  }

  // Muestra horas por día
  const handleDays = async (e, fecha, id) => {
    e.preventDefault();
    setHours('');
    setBloques('');
    resetField('selecteHour');
    setTime('');
    resetField('selecteHour');
    setValue('selectedDay', fecha, { shouldValidate: true });

    const fechaMod = dayjs(fecha).format('YYYY-MM-DD');
    try {
      setDate(fechaMod);

      // 1. Filtrar horarios para la fecha seleccionada
      const horariosDelDia = allDays.filter(item => item.fechaInicio === fechaMod);

      // 2. Extraer y ordenar las horas disponibles directamente
      const horasDisponibles = horariosDelDia
        .map(item => ({
          ...item,
          horaInicioBloque: item.horaInicio, // Usamos las horas ya calculadas
          horaFinBloque: item.horaFin
        }))
        .sort((a, b) => {
          const horaA = convertirAHoras(a.horaInicio);
          const horaB = convertirAHoras(b.horaInicio);
          return horaA - horaB; // Orden ascendente
        });

      setHours(horasDisponibles);
    } catch (error) {
      console.error('Error al cargar horarios:', error);
    }
  };


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

  const handleHours = (hour) => {
    setTime(hour)
    setValue('selectedHour', hour)
  }

  const formatearHora = (hora) => {
    const partes = hora.split(':').map(Number);

    if (partes.length < 2 || partes.some(isNaN)) {
      throw new Error('Formato de hora inválido. Debe ser "HH:mm" o "HH:mm:ss"');
    }

    const [h, m, s = 0] = partes;

    if (h < 0 || h > 23 || m < 0 || m > 59 || s < 0 || s > 59) {
      throw new Error('Hora, minutos o segundos fuera de rango');
    }

    const horaFormateada = [
      String(h).padStart(2, '0'),
      String(m).padStart(2, '0'),
      String(s).padStart(2, '0')
    ].join(':');

    return horaFormateada;
  }


  const onSubmit = handleSubmit(async data => {
    setLoading(true)
    setSuccess('initial')
    try {
      const patientByEmail = await fetchUserByEmail(data.email)
      const { users: alumno } = await fetchUser(patientByEmail.id)

      data.validacion = patientByEmail.validacion
      data.alumno_id = patientByEmail.id
      data.name = patientByEmail.nombre_social || patientByEmail.nombre
      data.campus = data.campus === 'centro'
        ? "Sede Centro - Manuel Rodríguez Sur 343 , 2° piso"
        : data.campus === 'huechuraba' ? "Sede Huechuraba - Avenida Santa Clara 797, Huechuraba, piso -2, edificio Cubo" : 'Videollamada'
      data.tipo_cita = patientByEmail.aplica_despeje == 1 ? 'Entrevista de despeje' : 'Atención con profesional'
      data.carrera = alumno[0]?.carrera || ''
      data.quien_cancela = session?.user?.id

      if (data.status === "status") {
        const status = session.user?.rol === 'alumno' ? 'cancelada por alumno' : 'cancelada por profesional'
        data.status = status
        try {
          const response = await changeStatusAppointment(data)
          if (response.estado === false) {
            setSuccess('fail')
          } else {
            setSuccess('success')
          }
        } catch (error) {
          setSuccess('fail')

        }
      }
    } catch (error) {
      setSuccess('fail')
      console.log(error)
    } finally {
      setLoading(false)
    }
    // return updateAppointment({ ...data, "patient_id": patient[0].id }, id)
  })

  // EDITA FECHA Y HORA DE UNA SOLA CITA
  const handleEditHourAppointment = handleSubmit(async data => {
    setSuccess('initial')
    setLoading(true);
    const body = {
      id: dataPatient.id,
      fecha: data.selectedDay || dataPatient.appointment_date,
      hora: formatearHora(data.selectedHour) || formatearHora(dataPatient.start_time),
    }

    try {
      const response = await editAppointmentHour(body)
      if (response.validacion !== true) {
        setSuccess('fail')
        setMessage(`Ocurrió un problema.`)
      } else {
        setSuccess('success')
        setMessage(`Se actulizó la hora en todas las citas correspondientes.`)
      }
    } catch (error) {
      console.log(error)
      setMessage(error)
      setSuccess('fail')
    } finally {
      setLoading(false)
    }
  })

  // EDITA HORA EN TODAS LAS CITAS ASOCIADAS
  const handleEditByUuid = handleSubmit(async data => {
    setSuccess('initial')
    setLoading(true);
    const body = {
      uuid: dataPatient.uuid,
      hora: formatearHora(data.selectedHour) || formatearHora(dataPatient.start_time),
    }
    try {
      const response = await editAppointmentUuid(body)
      setMessage(response.detalle)
      if (response?.validacion == false) {
        setSuccess('fail')
        setMessage(`Ocurrió un problema.`)
      } else if (response?.validacion === 'parcial') {
        setSuccess('success')
        setMessage(`Se actulizó la hora de las citas.`)
      } else if (response?.validacion === true) {
        setSuccess('success')
        setMessage(`Se actulizó la hora en todas las citas correspondientes.`)
      }
    } catch (error) {
      console.log(error)
      setMessage(error)
      setSuccess('fail')
    } finally {
      setLoading(false)
    }
  })

  const convertirAHoras = (hora) => {
    const [h, m, s] = hora.split(':').map(Number);
    return h * 3600 + m * 60 + s;  // Convertir a segundos
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


  return (
    <div>
      <div className="sidebar-overlay" data-reff="" style={{ zIndex: 98 }} />
      {loading && <SimpleBackdrop />}
      <>
        <div className="page-wrapper">
          <div className="content">
            {/* Page Header */}
            <div className="page-header">
              <div className="row">
                <div className="col-sm-12">
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="#">Cita </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="feather-chevron-right">
                        <FeatherIcon icon="chevron-right" />
                      </i>
                    </li>
                    <li className="breadcrumb-item active">Editar Cita</li>
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
                        {/* DETALLES DEL PACIENTE */}
                        <div className="col-12">
                          <div className="form-heading">
                            <h4>Detalles del Paciente</h4>
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group local-forms">
                            <label>
                              Nombre <span className="login-danger">*</span>
                            </label>
                            <input
                              disabled
                              className="form-control"
                              type="text"
                              // defaultValue="Stephen"
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
                              Apellido <span className="login-danger">*</span>
                            </label>
                            <input
                              disabled
                              className="form-control"
                              type="text"
                              // defaultValue="Bruklin"
                              {...register('lastName', {
                                required: {
                                  value: true,
                                  message: 'Apellido es requerido'
                                },
                                minLength: {
                                  value: 2,
                                  message: 'Apellido debe tener al menos 2 caracteres'
                                }
                              })}
                            />
                            {
                              errors.lastName && <span><small>{errors.lastName.message}</small></span>
                            }
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group local-forms">
                            <label>
                              Teléfono <span className="login-danger">*</span>
                            </label>
                            <div className="input-group">
                              <div className="input-group-prepend">
                                <span className="input-group-text">+56</span>
                              </div>
                              <input
                                disabled
                                className="form-control"
                                type="tel"
                                {...register('mobile', {
                                  validate: (value) =>
                                    value.length === 0 || value.length === 9 || "La cantidad de caracteres debe ser igual a 0 o 9.",
                                })}
                                maxLength={9}
                              />
                              {errors.mobile && <span><small>{errors.mobile.message}</small></span>}
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group local-forms">
                            <label>
                              Correo electrónico <span className="login-danger">*</span>
                            </label>
                            <input
                              disabled
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

                        {/* DETALLES DE LA CITA */}
                        <div className="col-12">
                          <div className="form-heading">
                            <h4>Detalles de la Cita</h4>
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group local-forms">
                            <label>
                              Fecha de la Cita{" "}
                              {/* <span className="login-danger">*</span> */}
                            </label>
                            <input
                              className="form-control datetimepicker"
                              type="date"
                              disabled
                              placeholder=""
                              // onChange={handleDate}
                              // value={startDate}
                              {...register('appointment_date', {
                                required: {
                                  value: true,
                                  message: 'Fecha es requerida'
                                }
                              })}
                            />
                            {
                              errors.appointment_date && <span><small>{errors.appointment_date.message}</small></span>
                            }
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group local-forms">
                            <label>
                              Hora
                              {/* <span className="login-danger">*</span> */}
                            </label>
                            <div className="">
                              <input
                                className="form-control form-group local-forms"
                                type="time"
                                placeholder=""
                                // onChange={handleDate}
                                // value={startDate}
                                disabled
                                {...register('start_time', {
                                  required: {
                                    value: true,
                                    message: 'Fecha es requerida'
                                  }
                                })}
                              />
                              {
                                errors.start_time && <span><small>{errors.start_time.message}</small></span>
                              }
                            </div>
                          </div>
                        </div>
                        {/* <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Hasta <span className="login-danger">*</span>
                            </label>
                            <div className="">
                              <TextField
                                disabled={userRole === 'profesional' ? false : true}
                                className="form-control"
                                id="outlined-controlled"
                                type="time"
                                value={endTime}
                                onChange={(event) => {
                                  setEndTime(event.target.value);
                                }}
                                {...register('end_time')}
                              />
                              {
                                errors.end_time && <span><small>{errors.end_time.message}</small></span>
                              }
                            </div>
                          </div>
                        </div> */}
                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group local-forms">
                            <label>Profesional</label>
                            <Controller
                              control={control}
                              name="selected_doctor"
                              {...register('selected_doctor')}
                              ref={null}
                              render={({ field: { onChange, onBlur, value, name, ref } }) => {
                                return (<Select
                                  placeholder={profesional.length === 0 ? 'Cargando...' : 'Seleccione...'}
                                  // value={profesional.find(option => option.name === value) || value}
                                  instanceId="select_doctor"
                                  value={profesional.find(option => option.label === value) || value}
                                  onChange={(e) => {
                                    onChange(e);
                                    handleSelectedProfessional(e);
                                  }}
                                  getOptionLabel={e => e.label}
                                  options={profesional}
                                  styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                  id="select_doctor"
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
                            {
                              errors.selected_doctor && <span><small>{errors.selected_doctor.message}</small></span>
                            }

                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group local-forms">
                            <label>Especialidad </label>
                            <Controller
                              control={control}
                              name="speciality"
                              rules={{
                                required: {
                                  value: true,
                                  message: 'Especialidad es requerida',
                                }
                              }}
                              ref={null}
                              render={({ field: { onChange, onBlur, value } }) => {
                                const profesionalSelected = watch('selected_doctor')

                                return (
                                  <Select
                                    isDisabled={userRole === 'profesional' ? false : true}
                                    instanceId={'especialidadprofesional'}
                                    value={speciality.find(option => option.label === value) || null}
                                    onChange={(option) => onChange(option.value)}
                                    options={speciality}
                                    id="speciality"
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
                                )
                              }}
                            />

                          </div>
                        </div>

                        {/* <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                          >
                            <div className="col-12">
                              <div className="form-heading">
                                <h4>Seleccionar hora</h4>
                              </div>
                            </div>
                          </AccordionSummary>
                          <AccordionDetails> */}

                        <div className="row">
                          <div className="col-12">
                            <div className="form-heading">
                              <h4>Seleccionar hora</h4>
                            </div>
                          </div>
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
                        {/* </AccordionDetails>
                        </Accordion> */}
                        <div className="col-12 col-sm-12">
                          <div className="form-group">
                            <label className="form-check-label">
                              <input
                                type="checkbox"
                                value="status"
                                name="status"
                                className="form-check-input me-2"
                                {...register('status')}
                              />
                              ¿ Desea cancelar cita la cita?
                            </label>
                          </div>
                        </div>

                        <div className="col-12" >
                          <div className="doctor-submit text-end">
                            <button
                              type="button"
                              className="btn btn-primary submit-form me-2"
                              onClick={handleEditByUuid}
                            >
                              Modificar hora de citas
                            </button>
                            <button
                              type="button"
                              className="btn btn-primary submit-form me-2"
                              onClick={handleEditHourAppointment}
                            >
                              Modificar fecha y hora individual
                            </button>
                            <Link href={session?.user?.rol === 'alumno' ? '/citas' : '/pacientes'}>
                              <button
                                type="reset"
                                className="btn btn-primary cancel-form "
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
              onClose={handleClose}
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
              Acción exitosa. Revisa los detalles en la sección Lista de citas.
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
                  Ha ocurrido un problema.
                </Alert>
              </div>
            </div>
            : ''
        }
      </>
    </div>
  );
};

// export default EditAppoinments;
export default withAuth(EditAppoinments, ['alumno', 'profesional', 'administrador']);
