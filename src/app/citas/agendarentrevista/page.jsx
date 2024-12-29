'use client'
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import Select from "react-select";
import Link from "next/link";
import { useForm, Controller } from 'react-hook-form';
import { useSession } from "next-auth/react";

import { useRouter } from 'next/navigation';
import * as dayjs from 'dayjs'
import * as isLeapYear from 'dayjs/plugin/isLeapYear' // import plugin
import 'dayjs/locale/es-mx'

import Modal from "@/components/Modal";
import Contact from "@/components/Contact"
import SimpleBackdrop from "@/components/Backdrop";

import { Alert, Accordion, AccordionSummary, AccordionDetails, Box, LinearProgress } from "@mui/material";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import { PlusCircle, ChevronLeft, ChevronRight } from "feather-icons-react/build/IconComponents";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { fetchUserByEmail, updateUser, fetchUser, fetchUsers } from "@/services/UsersServices";
import { createInterview, sendEmail } from "@/services/AppointmentsServices"
import { regiones, comunas, motivo_consulta, carreras } from "@/utils/selects";
import { fetchScheduleByAvailability, generarHorasMedicas } from "@/services/SchedulesServices";
import { fetchFilteredProfesssionals } from "@/utils/getDoctorsWithDespeje";

import { useSidebar } from "@/context/SidebarContext";
import withAuth from '@/components/withAuth';
import CacheHandler from "@/utils/cache-handler";
import { validarRut } from "@/utils/managedata";

const cacheHandler = new CacheHandler();

const formatRut = (value) => {
  const cleanedValue = value.replace(/[^\dkK]/g, '');
  const [number, verifierDigit] = cleanedValue.split('-');

  const formattedNumber = number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const response = validarRut(value)
  if (response) {
    return `${formattedNumber}-${verifierDigit || ''}`;
  }
  setError('Rut inválido')
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
  const [bloques, setBloques] = useState([])
  const { setProps } = useSidebar();
  const [loadingDays, setLoadingDays] = useState(false)
  const [loadingHours, setLoadingHours] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const childFormRef = useRef();

  useEffect(() => {
    setProps({
      id: "menu-item4",
      id1: "menu-items4",
      activeClassName: "add-first-appoinment",
    });
  }, [setProps]);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  const fetchInitialData = async (id) => {
    try {
      const { users: response } = await fetchUser(id);

      const patient = {
        name: response[0].nombre,
        lastName: response[0].apellido,
        nombre_social: response[0].nombre_social || ' ',
        email: session.user?.email,
        birthday: dayjs(response[0].fecha_nacimiento).format('YYYY-MM-DD'),
        genero: response[0].genero === 'personalizado' ? 'No binarie' : response[0].genero,
        mobile: response[0].telefono,
        aplica_despeje: response[0].aplica_despeje,
        rut: response[0].rut,
        career: response[0].carrera,
        address: response[0].direccion,
        region: response[0].region,
        comuna: response[0].comuna,
      };

      setDataPatient(patient)
      return patient
    } catch (error) {
      console.error("Error fetching initial data:", error);
      return {};
    }
  };

  const { register, handleSubmit, watch, control, setValue,
    formState: { errors }, reset
  } = useForm();

  // Efecto para manejar valores predeterminados condicionalmente
  useEffect(() => {
    const setDefaultValues = async () => {
      if (session?.user?.rol !== 'administrador') {
        const defaultValues = await fetchInitialData(session?.user?.id);
        reset(defaultValues); // Actualiza los valores del formulario
      }
    };

    setDefaultValues();
  }, [session?.user?.rol, reset]);

  const selectedRegion = watch('region')
  const profesional = watch('professional')
  const modalidad = watch("modalidad", "videollamada"); // Valor predeterminado: videollamada
  const campus = watch("campus", ""); // Valor predeterminado: ninguno

  useEffect(() => {
    fetchData()
    setMenuPortalTarget(document.body);
  }, [])

  const getComuna = (region, comunaName) => {
    const reg = region.toLowerCase()
    if (!comunas[reg]) {
      return `Región "${reg}" no encontrada.`;
    }

    const comuna = comunas[reg].find((comuna) => comuna.label === comunaName);

    return comuna
  }

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
      uniqueFiltered = uniqueFiltered.filter(item => item.modalidad === "presencial" && (item.campus === "centro"));
      setLoadingDays(false)

    } else if (modalidad === "presencial" && (campus === "huechuraba" || campus === "ambas")) {
      setDays([])
      setHours([])
      setDate('')
      setTime('')

      uniqueFiltered = uniqueFiltered.filter(
        item => item.modalidad === "presencial" && (item.campus === "huechuraba")
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
    setLoadingDays(true)
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
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;
    return `${String(horas).padStart(2, "0")}:${String(minutosRestantes).padStart(2, "0")}:00`;
  }

  const handleDays = async (e, fecha, id) => {
    e.preventDefault()
    setHours('')
    setBloques('')
    setValue('selectedDay', fecha)

    const fechaMod = dayjs(fecha).format('YYYY-MM-DD')
    try {
      setDate(fechaMod)
      const selectedDays = allDays.filter(item => item.fechaInicio === fechaMod)

      let newBloques = []
      selectedDays.forEach(item => {
        newBloques.push(calcularHoraInicioDeBloques(item))
      })
      // console.log('newbloques', selectedDays)
      const flatted = newBloques.flat()
      // console.log('FLATTED', flatted)

      const arrayOrdenado = flatted.sort((a, b) => { const horaA = new Date(`1970-01-01T${a.horaIni}:00`).getTime(); const horaB = new Date(`1970-01-01T${b.horaIni}:00`).getTime(); return horaA - horaB; });
      setHours(arrayOrdenado.reverse())
    } catch (error) {
      console.log(error)
    }
  }

  const handleHours = (hour) => {
    setTime(hour)
    setValue('selectedHour', hour)
  }

  // const handleBloques = async (id, hora) => {
  //   const { bloques } = await fetchScheduleByDate(id, date)
  //   const getDuracionServicio = hours.find(item1 => bloques.some(item2 => item2.hora_inicio >= item1.horaIni && item2.hora_inicio <= item1.horaFin))

  //   return agregarBloques(bloques, hora, getDuracionServicio.duracionServicio);
  // }


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

  const handleOpen = (e) => {
    e.preventDefault()
    setOpen(true)
  };
  const handleClose = () => setOpen(false);

  const fetchData = async () => {
    const users = await fetchFilteredProfesssionals('despeje')
    const docs = users.map((doc, i) => {
      return {
        value: i + 2,
        label: doc.nombre + ' ' + doc.apellido,
        id: doc.id,
        email: doc.email,
        name: doc.nombre
      }
    })

    if (docs.length > 0) {
      setDoctor(docs)
    }
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

  // Función para validar el formato y largo del RUT
  const validateRUT = (rut) => {
    const cleanRUT = rut.replace(/[.-]/g, "");

    if (cleanRUT.length < 8 || cleanRUT.length > 10) {
      return "El RUT debe tener entre 8 y 10 caracteres.";
    }

    if (!/^\d+k?$/i.test(cleanRUT)) {
      return "El RUT solo puede contener números y la letra K.";
    }

    return true; // RUT válido
  };

  const handleFirstInterview = handleSubmit(async (data, e) => {
    console.log('childFormRef.current', childFormRef)
    let childFormData;
    if (childFormRef.current) {
      childFormData = await childFormRef.current.submitForm();
      console.log('childFormData', childFormData)
    }

    e.preventDefault()
    setSuccess('initial')
    const { users: patient } = await fetchUser(session.user?.id)

    const bodyInterview = {
      ...data,
      "nombre_contacto_emergencia2": childFormData?.nombre_contacto_emergencia2 || '',
      "parentesco_contacto_emergencia2": childFormData?.parentesco_contacto_emergencia2 || '',
      "celular_contacto_emergencia2": childFormData?.celular_contacto_emergencia2 || '',
      "patient_id": patient[0].id,
      "hora": data.selectedHour,
      "fecha": data.selectedDay,
      "region": regiones[0].label,
      "motivo_consulta": motivo_consulta === 'otro' ? data.otro : data.motivo_consulta
    }

    const bodyUpdate = {
      "apellido": data.lastName || patient[0].apellido,
      "aplica_despeje": 1,
      "anoIngresoCarrera": 'NA',
      "campus": data.campus || 'NA',
      "comuna": data.comuna.label || patient[0].comuna,
      "carrera": data.career.label || patient[0].carrera,
      "contrasena": 'NA',
      "direccion": data.address,
      "email": data.email,
      "entrevistador": 0,
      "fecha_nacimiento": data.birthday || patient[0].fecha_nacimiento,
      "genero": data.genero || patient[0].genero,
      "id": patient[0].id,
      "jornada": 'NA',
      "mustChangePassword": 0,
      "nombre": data.name || patient[0].nombre,
      "nombre_social": data.nombre_social || patient[0].nombre_social,
      "region": data.region.label || patient[0].region,
      "rut": data.rut,
      "status": patient[0].status,
      "telefono": data.mobile || patient[0].telefono,
      "tipo_usuario": patient[0].tipo_usuario,
      "id_emergencia": patient[0].id_emergencia || 0,
      "id_emergencia_2": patient[0].id_emergencia_2 || 0,
    }
    // tomarHoraDisponible(bloques, time, hours, date)
    const professional = watch('professional')
    console.log('bodyInterview', bodyInterview)
    try {

      const [appointment, update] = await Promise.all([
        createInterview(bodyInterview),
        updateUser(bodyUpdate)
      ]);
      console.log('appointment', appointment)
      if (appointment.estado === false && update.estado === false) {
        setSuccess('fail')
      } else if (appointment.estado === true && update.estado === false) {
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
    setDisabled(true)
    const newContact = [
      ...contacts,
      <Contact
        key={contacts.length}
        index={contacts.length}
        deleteContact={() => handleDeleteContact(contacts.length)}
        ref={childFormRef}
      />
    ];
    setContacts(newContact);
  }

  const handleDeleteContact = (key) => {
    setDisabled(false)
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

                            {session?.user?.rol === "alumno"
                              ? <small className="font-red">* Completa toda la información del formulario para agendar una primera entrevista inicial.</small>
                              : <small className="font-red">* Solo el alumno puede completar este formulario.</small>
                            }

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
                                  Apellido <span className="login-danger">*</span>
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
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
                                  Nombre social <span className="login-danger">*</span>
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  {...register('nombre_social', {
                                    required: {
                                      value: true,
                                      message: 'Nombre social es requerido'
                                    },
                                    minLength: {
                                      value: 2,
                                      message: 'Nombre debe tener al menos 2 caracteres'
                                    }
                                  })}
                                />
                                {
                                  errors.nombre_social && <span><small>{errors.nombre_social.message}</small></span>
                                }
                              </div>
                            </div>
                            <div className="col-12 col-md-6 col-xl-6">
                              <div className="form-group local-forms">
                                <label>
                                  Rut <span className="login-danger">*</span>
                                </label>
                                <input
                                  onChange={handleChangeRut}
                                  className="form-control"
                                  maxLength={12}
                                  minLength={8}
                                  // name="rut"
                                  type="text"
                                  {...register('rut', {
                                    required: {
                                      value: true,
                                      message: 'Rut es requerido'
                                    },
                                    validate: validateRUT
                                  })}
                                />
                                {
                                  errors.rut && <span><small>{errors.rut.message}</small></span>
                                }
                              </div>
                            </div>

                            <div className="col-12 col-md-6 col-xl-4">
                              <div className="form-group local-forms">
                                <label>
                                  Fecha de nacimiento {" "}
                                  <span className="login-danger">*</span>
                                </label>
                                <Controller
                                  control={control}
                                  name="birthday"
                                  {...register('birthday', {
                                    required: {
                                      value: true,
                                      message: 'Fecha es requerido',
                                    }
                                  })}
                                  ref={null}
                                  render={({ field: { onChange, onBlur, value } }) => (
                                    <input
                                      className="form-control datetimepicker"
                                      type="date"
                                      defaultValue={value}
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

                                {errors.genero && <span><small>{errors.genero.message}</small></span>}

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
                                    className="form-control"
                                    type="tel"
                                    {...register('mobile', {
                                      required: {
                                        value: true,
                                        message: 'Teléfono es requerido'
                                      },
                                      validate: (value) =>
                                        value.length === 9 || "Cantidad de caracteres debe ser igual a 9",
                                    })}
                                    maxLength={9}
                                    minLength={9}
                                  />
                                  {errors.mobile && <span><small>{errors.mobile.message}</small></span>}

                                </div>
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
                                      value={carreras.find(option => option.label === value) || value}

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
                                      // defaultValue={{ value: 13, label: "Región Metropolitana", name: "metropolitana" }}
                                      onChange={onChange}
                                      options={regiones}
                                      value={regiones.find(option => option.label === value) || value}

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
                                  render={({ field: { onChange, onBlur, value } }) => {
                                    const regionKey = dataPatient?.region?.toLowerCase()
                                      .normalize("NFD") // Descompone caracteres con acentos
                                      .replace(/[\u0300-\u036f]/g, "") // Elimina marcas de acentos
                                      .replace(/\s+/g, "_"); // Reemplaza espacios por "_"
                                    const opcionesComunas = regionKey ? comunas[regionKey] : []; // Busca las comunas según la región
                                    return (
                                      <Select
                                        instanceId="select-region"
                                        defaultValue={selectedOption}
                                        value={
                                          opcionesComunas.find((comuna) => comuna.label === value) || null
                                        }

                                        onChange={onChange}
                                        options={comunas[selectedRegion?.value]}
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
                                    )
                                  }}
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
                                  {...register('nombre_contacto_emergencia1', {
                                    required: {
                                      value: true,
                                      message: 'El campo es obligatorio'
                                    }
                                  })} />
                                {
                                  errors.nombre_contacto_emergencia1 && <span><small>{errors.nombre_contacto_emergencia1.message}</small></span>
                                }
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
                                  {...register('parentesco_contacto_emergencia1', {
                                    required: {
                                      value: true,
                                      message: 'El campo es obligatorio'
                                    }
                                  })} />
                                {
                                  errors.parentesco_contacto_emergencia1 && <span><small>{errors.parentesco_contacto_emergencia1.message}</small></span>
                                }
                              </div>
                            </div>
                            <div className="col-12 col-sm-6">
                              <div className="form-group local-forms">
                                <label>
                                  Celular <span className="login-danger">*</span>
                                </label>
                                <div className="input-group">
                                  <div className="input-group-prepend">
                                    <span className="input-group-text">+56</span>
                                  </div>
                                  <input
                                    className="form-control"
                                    type="tel"
                                    defaultValue={""}
                                    {...register('celular_contacto_emergencia1', {
                                      required: {
                                        value: true,
                                        message: 'El campo es obligatorio'
                                      },
                                      validate: (value) =>
                                        value.length === 9 || "Cantidad de caracteres debe ser igual a 9",
                                    })}
                                    maxLength={9}
                                    minLength={9}
                                  />
                                  {
                                    errors.celular_contacto_emergencia1 && <span><small>{errors.celular_contacto_emergencia1.message}</small></span>
                                  }
                                </div>
                              </div>
                            </div>
                            <div className="col-12 col-sm-6">
                              <div className="form-group local-forms">
                                <label>
                                  Correo electrónico
                                </label>
                                <input
                                  className="form-control"
                                  type="email"
                                  defaultValue={""}
                                  {...register('email_contact', {
                                    required: {
                                      value: true,
                                      message: 'El campo es obligatorio',
                                    },
                                    pattern: {
                                      value: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
                                      message: 'Correo no es válido'
                                    }
                                  })} />
                                {
                                  errors.email_contact && <span><small>{errors.email_contact.message}</small></span>
                                }
                              </div>
                            </div>
                            <h5 className="font-blue">Agregar contacto {disabled ? '' : <PlusCircle
                              onClick={() => { handleAddContact() }}
                            />}
                            </h5>
                            {contacts.map((item) => item)}
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
                                {
                                  errors.professional && <span><small>{errors.professional.message}</small></span>
                                }
                              </div>
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
                                {
                                  errors.modalidad && <span><small>{errors.modalidad.message}</small></span>
                                }
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
                                      Sede Huechuraba - Avenida Santa Clara 797, Huechuraba, piso -2, edificio Cubo
                                    </label>
                                  </div>

                                </div>
                              </div>
                            </div>

                          }

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
                                  {...register('otro')} />
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
                                    : <div className="form-group local-forms mb-0">
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

                          {
                            Object.keys(errors).length > 0 && <span><small>Hay campos sin completar.</small></span>
                          }
                          <div className="col-12">
                            <div className="doctor-submit text-end mt-3">
                              <button
                                disabled={Object.keys(errors).length > 0}
                                className="btn btn-primary submit-form me-2"
                                onClick={handleFirstInterview}
                              >
                                Enviar
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
export default withAuth(AddFirstAppoinments, ['alumno', 'profesional', 'administrador']);

