'use client'
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { DatePicker } from "antd";
import Select from "react-select";
import Link from "next/link";
import { useForm, Controller } from 'react-hook-form';
import { useSession } from "next-auth/react";

import { useRouter } from 'next/navigation';
import * as dayjs from 'dayjs'
import * as isLeapYear from 'dayjs/plugin/isLeapYear' // import plugin
import 'dayjs/locale/es-mx'

import Sidebar from "@/components/Sidebar";
import Modal from "@/components/Modal";
import Contact from "@/components/Contact"
import SimpleBackdrop from "@/components/Backdrop";

import { Alert, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import { PlusCircle, ChevronLeft, ChevronRight } from "feather-icons-react/build/IconComponents";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { fetchDoctors } from "@/services/DoctorsServices";
import { fetchUsers } from "@/services/UsersServices";
import { createAppointment, sendEmail } from "@/services/AppointmentsServices"
import { regiones, comunas, motivo_consulta } from "@/utils/selects";
// import { formatRut } from "@/utils/managedata";
import { fetchScheduleByDate, fetchScheduleByUser, fetchScheduleByAvailability } from "@/services/SchedulesServices";
import ProtectedPage from "@/components/ProtectedRoutes";

const formatRut = (value) => {
  const cleanedValue = value.replace(/[^\dkK]/g, '');
  const [number, verifierDigit] = cleanedValue.split('-');
  const formattedNumber = number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formattedNumber}-${verifierDigit || ''}`;
};

// Función para obtener fechas únicas
const obtenerFechasUnicas = array => {
  let fechasUnicas = [];
  let arrayDeComprobacion = []

  array.forEach(objeto => {
    // console.log('OBJETO', objeto);
    let { fechaInicio, id_user } = objeto;
    if (!arrayDeComprobacion.includes(fechaInicio)) {
      fechasUnicas.push({ fechaInicio, id_user });
      arrayDeComprobacion.push(fechaInicio)
    }
  });
  return fechasUnicas;
}

const AddFirstAppoinments = () => {
  const ROL = ["alumno"]
  const { data: session } = useSession()
  const router = useRouter();
  // useAuthorization(['alumno'])
  dayjs.extend(isLeapYear) // use plugin
  dayjs.locale('es-mx') // use locale

  const [isClicked, setIsClicked] = useState(false);
  const [startTime, setStartTime] = useState();
  const [selectedOption, setSelectedOption] = useState(null);
  const [doctor, setDoctor] = useState([]);
  const [contacts, setContacts] = useState([])
  const [success, setSuccess] = useState('initial')
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false);
  const [days, setDays] = useState([]);
  const [hours, setHours] = useState([])
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [allDays, setAllDays] = useState([])
  const [checked, setChecked] = useState(true);
  const [menuPortalTarget, setMenuPortalTarget] = useState(null);
  const [rut, setRut] = useState('');
  // fechas siguiente
  const [indiceDias, setIndiceDias] = useState(0);
  const [indiceHoras, setIndiceHoras] = useState(0);
  // modal alert
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  const { register, handleSubmit, watch, control,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: 'Juan',
      lastName: 'Perez',
      email: 'juanperez@udp.cl',
      birthday: '12/12/2002',
      genero: 'hombre',
      mobile: '987654321'

    }
    /*  async () => fetchUsers().then(response => {
       // console.log('response', response);
       if (session?.user) {
         // console.log('session?.user', session?.user)
         const patient = response.users.filter(user => user.email === session?.user.email)
         // console.log('SESSION async', session);
         const obj = {
           name: patient[0].nombre,
           lastName: patient[0].apellido,
           email: session.user.email,
           birthday: dayjs(patient[0].fecha_nacimiento).format('YYYY-MM-DD'),
           genero: patient[0].genero,
           mobile: patient[0].telefono
 
         }
         console.log('obj', patient);
         return obj
       } else {
         console.log('No encuentra al usuario')
       }
     })
       .catch(error =>
         console.log('err', error)
       ) */
  })

  useEffect(() => {
    fetchData()
    // fetchDoctors()
    setMenuPortalTarget(document.body);
  }, [])

  const selectedRegion = watch('region')
  const profesional = watch('professional')
  const modalidad = watch('modalidad')

  const handleChangeRut = (e) => {
    const inputValue = e.target.value;
    const formattedRut = formatRut(inputValue);
    setRut(formattedRut);
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
    // const dias = Array.from(filterWeekDays).sort();

    return soloDias;
  }

  /* Retorna días disponibles */
  const handleSelectedProfessional = async (e) => {
    setDays([])
    setHours([])
    setDate('')
    setTime('')
    try {
      // const { users: byProf } = await fetchScheduleByAvailability(e.id)
      // const { bloques } = await fetchScheduleByUser(e.id)

      // const bloque = obtenerDias(byProf)
      // setAllDays(byProf)
      // setDays(bloque)
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

  function horaAMinutos(hora) {
    const partesHora = hora.split(":");
    return parseInt(partesHora[0]) * 60 + parseInt(partesHora[1]);
  }

  function calcularHoraInicioDeBloques(cita) {
    const horaIniMinutos = horaAMinutos(cita.horaIni);
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
  function minutosAHora(minutos) {
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;
    return `${String(horas).padStart(2, "0")}:${String(minutosRestantes).padStart(2, "0")}:00`;
  }

  // Función para convertir una hora en formato HH:MM:SS a minutos
  function horaAMinutos(hora) {
    const partesHora = hora.split(":");
    return parseInt(partesHora[0]) * 60 + parseInt(partesHora[1]);
  }

  const handleDays = async (e, fecha, id) => {
    e.preventDefault()
    // console.log('handle.days', fecha, id)
    const fechaMod = dayjs(fecha).format('YYYY-MM-DD')
    // console.log('fechamod', fecha);
    try {
      // const { bloques } = await fetchScheduleByDate(parseInt(id), fechaMod)
      // console.log('BLOQUES', bloques)
      // console.log('allDays', allDays)
      setDate(fechaMod)
      // const newBloques = agruparBloquesPorHora(bloques)
      const selectedDays = allDays.filter(item => item.fechaInicio === fechaMod)

      let newBloques = []
      selectedDays.forEach(item => {
        newBloques.push(calcularHoraInicioDeBloques(item))
      })

      const flatted = newBloques.flat()
      // console.log('flatted', flatted);

      // const horasDisponibles = flatted.filter(hora => {
      //   // Busca la disponibilidad correspondiente en el segundo array
      //   console.log(('HORA', hora));
      //   const disponibilidadHora = bloques.find(item => {
      //     return ((item.hora_inicio).length === 7 ? `0${item.hora_inicio}` : item.hora_inicio) === hora.horaInicioBloque
      //   });
      //   // Si la disponibilidadHora existe y está disponible, devuelve true (se incluirá en el resultado)
      //   return disponibilidadHora && disponibilidadHora.disponible === 1;
      // });
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

      // console.log('horasDisponibles', horasDisponibles);

      setHours(horasDisponibles)
    } catch (error) {
      console.log(error)
    }
  }

  const handleHours = (e) => {
    e.preventDefault()
    setHours(dayjs(e.id_bloque).format('DD/MM/YYYY'))
  }


  const handleOpen = (e) => {
    e.preventDefault()
    setOpen(true)
  };
  const handleClose = () => setOpen(false);

  const fetchData = async () => {
    // const { users } = await fetchDoctors()
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
    const docs = users.map((doc, i) => {
      return {
        value: i + 2,
        label: doc.nombre + ' ' + doc.apellido,
        id: doc.id,
        email: doc.email,
        name: doc.nombre
      }
    })

    // console.log('docs', docs);
    setDoctor(docs)
  }

  const onChange = (date, dateString) => {
    // console.log(date, dateString);
    setIsClicked(true);
  };
  const loadFile = (event) => {
    // Handle file loading logic here
  };

  const onSubmit = handleSubmit(async data => {
    // console.log('data', data);
    setSuccess('initial')
    const patientName = watch("name")
    const patientLastname = watch("lastName")
    // const patients = await fetchUsers()

    console.log('session.user.email', session.user.email);
    // const patient = patients.users.filter(user =>
    //   user.email === session.user.email
    // )
    // const body = {
    //   ...data,
    //   "patient_id": patient[0].id,
    //   "fecha": date,
    //   "hora": time
    // }

    try {
      // const appointment = await createAppointment(body)
      // if (appointment.detalle === 'fail!!!') setSuccess('fail')
      setSuccess('success')
      setOpenBackdrop(true)
    } catch (err) {
      setSuccess('fail')
      // console.log('ERRRR', err.message)
      // if (err.message === "Cannot read properties of undefined (reading 'id')") {
      //   setError(`No se encontró al paciente`);
      // }
    } finally {
      setOpen(false)
    }
  })

  const motivo_consulta_seleccionado = watch('motivo_consulta')
  // console.log('motivo_consulta_seleccionado')

  const gender = [
    { value: 1, label: "Hombre" },
    { value: 2, label: "Mujer" },
    { value: 3, label: "Hombre trans" },
    { value: 4, label: "Mujer trans" },
    { value: 5, label: "No binarie" }
  ]

  const career = [
    { value: 2, label: "Antropologia" },
    { value: 3, label: "Arquitectura" },
    { value: 4, label: "Contador" },
    { value: 5, label: "Derecho" },
    { value: 6, label: "Ingenieria" },
  ];

  const handleAddContact = () => {
    const newContact = [
      ...contacts,
      <Contact
        key={contacts.length}
        index={contacts.length}
        deleteContact={() => handleDeleteContact(contacts.length)}
      />
    ];
    setContacts(newContact);
  }

  const handleDeleteContact = (key) => {
    const newArray = contacts.filter((_, i) => i !== key);
    setContacts(newArray)
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

  const handleOpenBackdrop = () => setOpenBackdrop(true);
  const handleCloseBackdrop = () => setOpenBackdrop(false);

  return (
    <ProtectedPage level={ROL}>
      {/* <Header /> */}
      <Sidebar
        id="menu-item4"
        id1="menu-items4"
        activeClassName="add-first-appoinment"
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
                    <li className="breadcrumb-item active">Agendar Entrevista</li>
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
                            <h4 >Agendar Entrevista</h4>
                          </div>
                        </div>
                      </div>

                      {/* Detalles del paciente */}
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header"
                        >
                          <div className="col-12">
                            <div className="form-heading">
                              <h4>Detalles Personales</h4>
                            </div>
                          </div>
                        </AccordionSummary>
                        <AccordionDetails>
                          <div className="row">
                            <div className="col-12">
                              <div className="form-heading">
                                <h5 style={{ fontSize: '12px', margin: '5px 0 25px' }}>Los campos son editables, pero solo afectarán la información en este portal, no para SAP</h5>
                              </div>
                            </div>
                            <div className="col-12 col-md-6 col-xl-6">
                              <div className="form-group local-forms">
                                <label>
                                  Nombre legal <span className="login-danger">*</span>
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
                                  Nombre social <span className="login-danger">*</span>
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
                            <div className="col-12 col-md-6 col-xl-4">
                              <div className="form-group local-forms">
                                <label>
                                  Rut <span className="login-danger">*</span>
                                </label>
                                <input
                                  onChange={handleChangeRut}
                                  className="form-control"
                                  // name="rut"
                                  type="text"
                                  {...register('rut', {
                                    required: {
                                      value: true,
                                      message: 'Rut es requerido'
                                    },
                                    minLength: {
                                      value: 2,
                                      message: 'Rut debe ser un número válido'
                                    }
                                  })}
                                />
                                {
                                  errors.rut && <span><small>{errors.rut.message}</small></span>
                                }
                              </div>
                            </div>

                            <div className="col-12 col-md-6 col-xl-4">
                              <div className="form-group local-forms cal-icon">
                                <label>
                                  Fecha de nacimiento {" "}
                                  <span className="login-danger">*</span>
                                </label>
                                <Controller
                                  control={control}
                                  name="birthday"
                                  rules={{
                                    required: {
                                      value: true,
                                      message: 'Fecha es requerida',
                                    }
                                  }}
                                  ref={null}
                                  render={({ field: { onChange, onBlur, value } }) => (
                                    <DatePicker
                                      className="form-control datetimepicker"
                                      onChange={onChange}
                                      // value={value}
                                      onBlur={onBlur}
                                      suffixIcon={null}
                                      format={'DD-MM-YYYY'}
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
                                {errors.birthday && <span><small>{errors.birthday.message}</small></span>}


                              </div>
                            </div>
                            <div className="col-12 col-md-6 col-xl-4">
                              <div className="form-group local-forms">
                                <label>Género<span className="login-danger">*</span>
                                </label>
                                <Controller
                                  control={control}
                                  name="genero"
                                  {...register('genero', {
                                    required: {
                                      value: true,
                                      message: 'Género es requerido',
                                    }
                                  })}
                                  ref={null}
                                  render={({ field: { onChange, onBlur, value } }) => (
                                    <Select
                                      instanceId="genero"
                                      defaultValue={selectedOption}
                                      onChange={onChange}
                                      options={gender}
                                      menuPortalTarget={menuPortalTarget}
                                      styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                      id="genero"
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
                            <div className="col-12 col-md-6 col-xl-4">
                              <div className="form-group local-forms">
                                <label>
                                  Correo electrónico <span className="login-danger">*</span>
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
                            <div className="col-12 col-md-6 col-xl-4">
                              <div className="form-group local-forms">
                                <label>
                                  Teléfono <span className="login-danger">*</span>
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  {...register('mobile')}
                                />
                              </div>
                            </div>

                            <div className="col-12 col-md-6 col-xl-6">
                              <div className="form-group local-forms">
                                <label>Carrera<span className="login-danger">*</span>

                                </label>
                                <Controller
                                  control={control}
                                  name="career"
                                  {...register('career', {
                                    required: {
                                      value: true,
                                      message: 'Carrera es requerido',
                                    }
                                  })}
                                  ref={null}
                                  render={({ field: { onChange, onBlur, value } }) => (
                                    <Select
                                      instanceId="career"
                                      defaultValue={selectedOption}
                                      onChange={onChange}
                                      options={career}
                                      menuPortalTarget={menuPortalTarget}
                                      styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                      id="career"
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
                                {errors.career && <span><small>{errors.career.message}</small></span>}
                              </div>
                            </div>

                            <div className="col-12 col-sm-12">
                              <div className="form-group local-forms">
                                <label>
                                  Dirección <span className="login-danger">*</span>
                                </label>
                                {/* <textarea
                              className="form-control"
                              rows={3}
                              cols={30}
                            /> */}

                                <input
                                  className="form-control" type="text"
                                  defaultValue={""}
                                  {...register('address')} />
                              </div>
                            </div>
                            <div className="col-12 col-sm-6">
                              <div className="form-group local-forms">
                                <label>
                                  Región <span className="login-danger">*</span>
                                </label>
                                <Controller
                                  control={control}
                                  name="region"
                                  {...register('region', {
                                    required: {
                                      value: true,
                                      message: 'Región es requerida',
                                    }
                                  })}
                                  ref={null}
                                  render={({ field: { onChange, onBlur, value } }) => (
                                    <Select
                                      instanceId="select-region"
                                      defaultValue={selectedOption}
                                      onChange={onChange}
                                      options={regiones}
                                      menuPortalTarget={menuPortalTarget}
                                      styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                      id="select-region"
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
                            <div className="col-12 col-sm-6">
                              <div className="form-group local-forms">
                                <label>
                                  Comuna <span className="login-danger">*</span>
                                </label>
                                <Controller
                                  control={control}
                                  name="comuna"
                                  {...register('comuna', {
                                    required: {
                                      value: true,
                                      message: 'Comuna es requerida',
                                    }
                                  })}
                                  ref={null}
                                  render={({ field: { onChange, onBlur, value } }) => (
                                    <Select
                                      instanceId="select-region"
                                      defaultValue={selectedOption}
                                      onChange={onChange}
                                      options={comunas[selectedRegion?.name]}
                                      menuPortalTarget={menuPortalTarget}
                                      styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                      id="select-region"
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
                            {/* </div> */}

                          </div>
                        </AccordionDetails>
                      </Accordion>

                      {/* Datos de contacto de urgencia */}
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header"
                        >
                          <div className="col-12">
                            <div className="form-heading">
                              <h4>Datos de contacto en caso de urgencias</h4>
                            </div>
                          </div>
                        </AccordionSummary>
                        <AccordionDetails>
                          <div className="row">
                            <div className="col-12 col-md-12 col-xl-12">
                              <h5>Primera Opción <span className="login-danger">*</span> </h5>
                            </div>
                            <div className="col-12 col-sm-6">
                              <div className="form-group local-forms">
                                <label>
                                  Nombres y apellidos <span className="login-danger">*</span>
                                </label>
                                <input
                                  className="form-control" type="text"
                                  defaultValue={""}
                                  {...register('name_contact')} />
                              </div>
                            </div>
                            <div className="col-12 col-sm-6">
                              <div className="form-group local-forms">
                                <label>
                                  Parentesco o tipo de relación <span className="login-danger">*</span>
                                </label>
                                <input
                                  className="form-control" type="text"
                                  defaultValue={""}
                                  {...register('relationship_contact')} />
                              </div>
                            </div>
                            <div className="col-12 col-sm-6">
                              <div className="form-group local-forms">
                                <label>
                                  Celular <span className="login-danger">*</span>
                                </label>
                                <input
                                  className="form-control" type="tel"
                                  defaultValue={""}
                                  placeholder="+56"
                                  {...register('mobile_contact')} />
                              </div>
                            </div>
                            <div className="col-12 col-sm-6">
                              <div className="form-group local-forms">
                                <label>
                                  Correo electrónico
                                </label>
                                <input
                                  className="form-control" type="text"
                                  defaultValue={""}
                                  {...register('email_contact')} />
                              </div>
                            </div>
                            <div className="col-12 col-md-12 col-xl-12">
                              <h5>Agregar contacto <PlusCircle onClick={() => { handleAddContact() }} /></h5>
                              {contacts.map((item) => item)}
                            </div>
                          </div>
                        </AccordionDetails>
                      </Accordion>

                      {/* Detalles de la cita */}
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header"
                        >
                          <div className="col-12">
                            <div className="form-heading">
                              <h4>Detalles de la Cita</h4>
                            </div>
                          </div>
                        </AccordionSummary>
                        <AccordionDetails>
                          <div className="row">
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
                                      Sede Centro - Manuel Rodríguez 343 sur, 2° piso
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
                                      Sede Huechuraba - Av. Sta. Clara 797, Huechuraba
                                    </label>
                                  </div>

                                </div>
                              </div>
                            </div>

                          }

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
                            motivo_consulta_seleccionado === 'Otro' &&
                            <div className="col-12 col-sm-6">
                              <div className="form-group local-forms">
                                <label>
                                  Escribe el motivo <span className="login-danger">*</span>
                                </label>
                                <input
                                  className="form-control" type="text"
                                  defaultValue={""}
                                  {...register('relationship_contact')} />
                              </div>
                            </div>
                          }
                          <div className="col-12 col-md-6 col-xl-6">
                            <div className="form-group local-forms">
                              <label>Profesional</label>
                              <Controller
                                control={control}
                                name="professional"
                                {...register('professional')}
                                ref={null}
                                render={({ field: { onChange, onBlur, value, name, ref } }) => {
                                  return (<Select
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
                          <div className="col-12">
                            <div className="doctor-submit text-end">
                              <button
                                type="button"
                                className="btn btn-primary submit-form me-2"
                                onClick={handleOpen}
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
                          {/* </div> */}

                        </AccordionDetails>
                      </Accordion>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Modal open={open} handleClose={handleClose} onClick={onSubmit} errors={errors} />
        </div>

        {/*  <SimpleBackdrop
          open={openBackdrop}
          handleClose={handleCloseBackdrop}
        /> */}
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

export default AddFirstAppoinments;
