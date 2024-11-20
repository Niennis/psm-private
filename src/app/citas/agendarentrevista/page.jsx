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

import { fetchUser, fetchUsers, fetchUserByEmail, updateUser } from "@/services/UsersServices";
import { createInterview, sendEmail } from "@/services/AppointmentsServices"
import { regiones, comunas, motivo_consulta, carreras } from "@/utils/selects";
// import { formatRut } from "@/utils/managedata";
import { fetchScheduleByDate, fetchScheduleByUser, fetchScheduleByAvailability } from "@/services/SchedulesServices";
import { fetchProfDespeje } from "@/utils/getDoctorsWithDespeje";

import withAuth from '@/components/withAuth';
import CacheHandler from "@/utils/cache-handler";

const cacheHandler = new CacheHandler();

const formatRut = (value) => {
  const cleanedValue = value.replace(/[^\dkK]/g, '');
  const [number, verifierDigit] = cleanedValue.split('-');
  const formattedNumber = number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formattedNumber}-${verifierDigit || ''}`;
};

const formatDate = (dateString) => {
  const [year, day, month] = dateString.split("-");
  return `${year}-${month}-${day}`
};


const formatDateToService = (dateString) => {
  const [year, month, day] = dateString.split("-");
  return `${year}-${day}-${month}`
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
  const [dataPatient, setDataPatient] = useState(null)

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  const fetchInitialData = async () => {
    try {
      const response = await fetchUserByEmail(session.user?.email);
      const patient = {
        name: response.nombre,
        lastName: response.apellido,
        email: session.user?.email,
        birthday: dayjs(response.fecha_nacimiento).format('YYYY-MM-DD'), // "Wed, 14 Feb 1990 00:00:00 GMT"
        genero: response.genero === 'personalizado' ? 'No binarie' : response.genero,
        mobile: response.telefono,
        aplica_despeje: response.aplica_despeje
      };

      setDataPatient(patient)
      return patient
    } catch (error) {
      console.error("Error fetching initial data:", error);
      return {};
    }
  };

  const { register, handleSubmit, watch, control,
    formState: { errors }, reset
  } = useForm({
    defaultValues: async () => await fetchInitialData()
  });

  useEffect(() => {
    fetchData()
    setMenuPortalTarget(document.body);
  }, [])

  const selectedRegion = { value: 13, label: "Región Metropolitana", name: "metropolitana" }
  const profesional = watch('professional')
  const modalidad = watch("modalidad", "videollamada"); // Valor predeterminado: videollamada
  const campus = watch("campus", ""); // Valor predeterminado: ninguno

  useEffect(() => {
    let filtered = allDays;
    let uniqueFiltered = Array.from(new Set(filtered.map(item => `${item.fechaInicio}-${item.horaIni}`))).map(compositeKey => { return filtered.find(item => `${item.fechaInicio}-${item.horaIni}` === compositeKey); });

    if (modalidad === "videollamada") {
      uniqueFiltered = uniqueFiltered.filter(item => ((item.modalidad === "videollamada") || (item.modalidad === "ambas")));
    } else if (modalidad === "presencial") {
      if (campus) {
        uniqueFiltered = uniqueFiltered.filter(
          item => item.modalidad === "presencial" && (item.campus === campus
            || item.campus === null));
      } else {
        uniqueFiltered = uniqueFiltered.filter(item => ((item.modalidad === "presencial") || (item.modalidad === "ambas")));
      }
    }

    setDays(uniqueFiltered);
  }, [modalidad, campus, doctor]);



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

  const orderByDate = (arr) => {
    return arr.sort((a, b) => dayjs(a.fechaInicio).isAfter(dayjs(b.fechaInicio)) ? 1 : -1);
  }


  /* Retorna días disponibles */
  const handleSelectedProfessional = async (e) => {
    setDays([])
    setHours([])
    setDate('')
    setTime('')
    try {
      const { users: byProf } = await fetchScheduleByAvailability(e.id)

      const response = byProf.map(item => ({
        ...item,
        fechaFin: formatDate(item.fechaFin),
        fechaInicio: formatDate(item.fechaInicio)
      }))

      const hoy = new Date();
      const filterByDate = response.filter(item => new Date(item.fechaInicio) >= hoy);

      const orderedData = orderByDate(filterByDate)
      const bloque = obtenerDias(orderedData)

      setAllDays(orderedData)
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
  const minutosAHora = (minutos) => {
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;
    return `${String(horas).padStart(2, "0")}:${String(minutosRestantes).padStart(2, "0")}:00`;
  }

  const handleDays = async (e, fecha, id) => {
    setHours('')
    e.preventDefault()

    // console.log('handle.days', fecha, id)
    const fechaMod = dayjs(fecha).format('YYYY-MM-DD')
    // console.log('fechamod', fecha);
    try {
      const { bloques } = await fetchScheduleByDate(parseInt(id), fechaMod)
      console.log('BLOQUES', bloques)
      // console.log('allDays', allDays)
      setDate(fechaMod)
      // const newBloques = agruparBloquesPorHora(bloques)
      const selectedDays = allDays.filter(item => item.fechaInicio === fechaMod)

      let newBloques = []
      selectedDays.forEach(item => {
        newBloques.push(calcularHoraInicioDeBloques(item))
      })

      const flatted = newBloques.flat()

      setHours(flatted)
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
    const users = await fetchProfDespeje()
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


  const motivo_consulta_seleccionado = watch('motivo_consulta')

  const gender = [
    { value: "Hombre", label: "Hombre" },
    { value: "Mujer", label: "Mujer" },
    { value: "Hombre trans", label: "Hombre trans" },
    { value: "Mujer trans", label: "Mujer trans" },
    { value: "No binarie", label: "No binarie" }
  ]

  const handleFirstInterview = handleSubmit(async (data, e) => {
    e.preventDefault()
    setSuccess('initial')
    const patient = await fetchUserByEmail(session.user?.email)

    const bodyInterview = {
      ...data,
      "patient_id": patient.id,
      "fecha": date,
      "hora": time,
      "region": regiones[0].label,
    }

    const bodyUpdate = {
      "apellido": data.lastName || patient.apellido,
      "aplica_despeje": 1,
      "anoIngresoCarrera": 'NA',
      "campus": data.campus,
      "comuna": data.comuna.label,
      "carrera": data.career.label,
      "contrasena": 'NA',
      "direccion": data.address,
      "email": data.email,
      "entrevistador": 0,
      "fecha_nacimiento": data.birthday || patient.fecha_nacimiento,
      "genero": data.genero || patient.genero,
      "id": patient.id,
      "jornada": 'NA',
      "mustChangePassword": 0,
      "nombre": data.name || patient.nombre,
      "region": regiones[0].label,
      "rut": data.rut,
      "status": patient.status,
      "telefono": data.mobile || patient.telefono,
      "tipo_usuario": patient.tipo_usuario,
    }

    try {
      const [appointment, update] = await Promise.all([
        createInterview(bodyInterview),
        updateUser(bodyUpdate)
      ]);

      if (!appointment['detalle'].includes('success') && !update['detalle'].includes('success')) {
        setSuccess('fail')
      } else if (appointment['detalle'].includes('success') && !update['detalle'].includes('success')) {
        setSuccess('success')
        setError('Se creó la cita, pero no se logró actualizar la información. Revisa la información en Lista de citas.')
      } else {
        setSuccess('success')
      }
      setOpenBackdrop(true)
      // await sendEmail()

    } catch (err) {
      setSuccess('fail')
      console.error('Algo falló', err)
      setError(`Algo falló: ${err.message}`);
    } finally {
      setOpen(false)
    }
  })

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
    < >
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
                            <small className="font-red">* Completa toda la información del formulario para agendar una primera entrevista inicial.</small>
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
                                <h5 style={{ fontSize: '12px', margin: '5px 0 25px' }}>Los campos son editables, pero solo afectarán la información en este portal, no en otros sistemas internos de la universidad</h5>
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
                                  render={({ field: { onChange, onBlur, value } }) => {
                                    return (
                                      <Select
                                        // instanceId="genero"
                                        value={gender.find(option => option.value === value) || null}
                                        onChange={(option) => onChange(option.value)}
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
                                      />)
                                  }}
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
                                  disabled
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
                                      options={carreras}
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
                                  {...register('region')}
                                  ref={null}
                                  render={({ field: { onChange, onBlur, value } }) => (
                                    <Select
                                      instanceId="select-region"
                                      defaultValue={{ value: 13, label: "Región Metropolitana", name: "metropolitana" }}
                                      isDisabled={true}
                                      onChange={onChange}
                                      options={regiones}
                                      value={value}
                                      // isDisabled={true}
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
                              <h5 className="font-blue">Agregar contacto <PlusCircle onClick={() => { handleAddContact() }} /></h5>
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
                          </div>
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
                                          // console.log('hour', hour.horaInicioBloque, time)
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
                                          disabled={indiceHoras + 5 >= hours.length}>
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
                            <div className="doctor-submit text-end mt-3">
                              <button
                                // type="button"
                                className="btn btn-primary submit-form me-2"
                                onClick={handleFirstInterview}
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
          <Modal open={open} handleClose={handleClose} onClick={handleFirstInterview} errors={errors} />
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
                  Ha ocurrido un problema.
                </Alert>
              </div>
            </div>
            : ''
        }
      </>
    </>
  );
};

// export default AddFirstAppoinments;
export default withAuth(AddFirstAppoinments, ['alumno', 'profesional']);

