'use client'
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
/* eslint-disable-next-line react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import Select from "react-select";
import Link from "next/link";
import { useForm, Controller, useWatch } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useSidebar } from "@/context/SidebarContext";
import withAuth from '@/components/withAuth';
import { useSession } from "next-auth/react";

import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import { PlusCircle, ChevronLeft, ChevronRight } from "feather-icons-react/build/IconComponents";
import { Alert, Accordion, AccordionSummary, AccordionDetails, Box, LinearProgress } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import SimpleBackdrop from "@/components/Backdrop";

import { createInterview, createContact, editContact, fetchAppointments } from "@/services/AppointmentsServices"
import { updateUser, fetchUser } from "@/services/UsersServices";
import { fetchScheduleByAvailability, generarHorasMedicas } from "@/services/SchedulesServices";
import { fetchFilteredProfesssionals } from "@/utils/getDoctorsWithDespeje";

import * as dayjs from 'dayjs'
import * as isLeapYear from 'dayjs/plugin/isLeapYear'
import 'dayjs/locale/es-mx'

import ConsentimientoInformado from "@/components/ConsentimientoInformado";
import Contact from "@/components/Contact"
import { regiones, comunas, motivo_consulta, carreras, genero } from "@/utils/selects";
import { esFechaValida } from "@/utils/managedata";
import { formatAndValidateRUT } from "@/utils/rutFormat";
import SelectorDeDias from "@/components/SelectorDias";
import AlertModal from "@/components/Alert";

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

const normalizarGenero = (value) => {
  const match = genero.find(g => g.label === value);
  return match ? match.label : "";
}

const soloPrimeraCitaCanceladaOPerdida = citas => {
  const response = citas.every(cita => {
    // Si alguna cita tiene primera_cita === 0 → false
    if (cita.primera_cita === 0) return false;

    // Si tiene primera_cita === 1 pero su estado NO es cancelada o perdida → false
    const estado = cita.estado.toLowerCase();
    return estado.includes('cancelada') || estado.includes('perdida');
  });
  return !response
}

const AddFirstAppoinments = () => {
  const { data: session } = useSession()
  const router = useRouter();
  dayjs.extend(isLeapYear) // use plugin
  dayjs.locale('es-mx') // use locale

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
  const [menuPortalTarget, setMenuPortalTarget] = useState(null);
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
  const [datosPreCargados, setDatosPreCargados] = useState(null);
  const [cargaCompletada, setCargaCompletada] = useState(false);
  const [showModalInterview, setShowModalInterview] = useState(false);

  useEffect(() => {
    setProps({
      id: "menu-item4",
      id1: "menu-items4",
      activeClassName: "add-first-appoinment",
    });
  }, [setProps]);

  const fetchAppointmentsData = async () => {
    const response = await fetchAppointments()
    const alumnoCitas = response.filter(item => item.id_paciente === session?.user?.id)
    return soloPrimeraCitaCanceladaOPerdida(alumnoCitas)
  }
  
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchAppointmentsData()
      setShowModalInterview(result)
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id])

  const fetchInitialData = async (id) => {
    try {
      const { users: response } = await fetchUser(id);
      const patient = {
        id: response[0].id,
        name: response[0].nombre,
        lastName: response[0].apellido,
        nombre_social: response[0].nombre_social || ' ',
        email: session.user?.email,
        birthday: esFechaValida(response[0].fecha_nacimiento) ? dayjs(response[0].fecha_nacimiento).format('YYYY-MM-DD') : '',
        genero: normalizarGenero(response[0]?.genero),
        mobile: response[0].telefono,
        aplica_despeje: response[0].aplica_despeje,
        rut: response[0].rut == 'NA' || response[0].rut == '0' || !response[0].rut ? '' : response[0].rut,
        carrera: response[0].carrera,
        address: response[0].direccion,
        region: response[0].region,
        comuna: response[0].comuna,
        contacto1_id: response[0].contacto1_id > 0 ? response[0].contacto1_id : 0,
        email_contacto_emergencia1: response[0].contacto1_email === 'NA' ? '' : response[0].contacto1_email,
        nombre_contacto_emergencia1: response[0].contacto1_nombre === 'NA' ? '' : response[0].contacto1_nombre,
        celular_contacto_emergencia1: response[0].contacto1_numero === 'NA' ? '' : response[0].contacto1_numero,
        parentesco_contacto_emergencia1: response[0].contacto1_relacion === 'NA' ? '' : response[0].contacto1_relacion,
        contacto2_id: response[0].contacto2_id > 0 ? response[0].contacto2_id : 0,
        email_contacto_emergencia2: response[0].contacto2_email === 'NA' ? '' : response[0].contacto2_email,
        nombre_contacto_emergencia2: response[0].contacto2_nombre === 'NA' ? '' : response[0].contacto2_nombre,
        celular_contacto_emergencia2: response[0].contacto2_numero === 'NA' ? '' : response[0].contacto2_numero,
        parentesco_contacto_emergencia2: response[0].contacto2_relacion === 'NA' ? '' : response[0].contacto2_relacion,
        status: response[0].status,
        tipo_usuario: response[0].tipo_usuario
      };

      const datosFormateados = {
        nombre_contacto_emergencia2: response[0].contacto2_nombre === 'NA' ? '' : response[0].contacto2_nombre,
        parentesco_contacto_emergencia2: response[0].contacto2_relacion === 'NA' ? '' : response[0].contacto2_relacion,
        celular_contacto_emergencia2: response[0].contacto2_numero === 'NA' ? '' : response[0].contacto2_numero,
        email_contacto_emergencia2: response[0].contacto2_email === 'NA' ? '' : response[0].contacto2_email,
      };

      setDatosPreCargados(datosFormateados);
      setDataPatient(patient)

      return patient
    } catch (error) {
      console.error("Error fetching initial data:", error);
      return {};
    }
  };

  const { register, handleSubmit, watch, control, setValue, getValues, clearErrors, trigger,
    formState: { errors, isValid }, reset
  } = useForm({ mode: 'onChange' });

  // Efecto para manejar valores predeterminados condicionalmente
  useEffect(() => {
    const setDefaultValues = async () => {
      if (session?.user?.rol !== 'administrador') {
        const defaultValues = await fetchInitialData(session?.user?.id);
        reset(defaultValues); // Actualiza los valores del formulario
      }
    };

    setDefaultValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.rol, reset]);

  const rutValue = useWatch({ control, name: 'rut' });

  useEffect(() => {
    if (rutValue) {
      const { formattedRUT } = formatAndValidateRUT(rutValue);
      setValue('rut', formattedRUT, { shouldValidate: true });
    }
  }, [rutValue, setValue]);

  const selectedRegion = watch('region')
  const selectedComuna = watch('comuna')
  const profesional = watch('professional')
  const modalidad = watch("modalidad", "videollamada"); // Valor predeterminado: videollamada
  const campus = watch("campus", ""); // Valor predeterminado: ninguno

  useEffect(() => {
    fetchData()
    setMenuPortalTarget(document.body);
  }, [])

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
    setDays([]);
    setHours([]);
    setDate('');
    setTime('');
    setLoadingDays(true);
    setCargaCompletada(false); // nuevo: comienza carga
    setValue('profesional', '');
    setValue('modalidad', '');
    setAllDays([]);
    setDays([]);

    try {
      const horasmedicas = await generarHorasMedicas(e.id);
      const { users: byProf } = await fetchScheduleByAvailability(e.id);

      const hoy = new Date();
      const filterByDate = horasmedicas.filter(item => new Date(item.fechaInicio) >= hoy);
      const filterByAvailability = filterByDate.filter(item => item.disponible === 1)

      const orderedData = orderByDate(filterByAvailability);
      const bloque = obtenerDias(orderedData);

      setAllDays(orderedData);
      setDays(bloque); // importante: esto sí llena el estado
    } catch (error) {
      console.log('Error: ', error);
      setDays([]); // en caso de error, aseguramos estado vacío
    } finally {
      setTimeout(() => {
        setLoadingDays(false);
        setCargaCompletada(true); // nuevo: carga finalizada
      }, 1000);
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
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;
    return `${String(horas).padStart(2, "0")}:${String(minutosRestantes).padStart(2, "0")}:00`;
  }

  const handleDays = async (e, fecha, id) => {
    e.preventDefault(); // Para evitar el comportamiento predeterminado del botón
    setHours(''); // Limpiar las horas cuando se seleccione una nueva fecha
    setBloques('');

    // Actualiza el valor de 'selectedDay' en el formulario de forma correcta
    setDate(fecha); // Esto actualiza el estado 'date' con la fecha seleccionada

    setValue('selectedDay', fecha);

    const data = getValues()
    if (data?.selectedDay !== '') {
      clearErrors('selectedDay')
    }
    const fechaMod = dayjs(fecha).format('YYYY-MM-DD');
    try {
      const selectedDays = allDays.filter(item => item.fechaInicio === fechaMod);
      let newBloques = [];
      selectedDays.forEach(item => {
        newBloques.push(calcularHoraInicioDeBloques(item)); // Aquí calculas las horas disponibles
      });
      const flatted = newBloques.flat();
      const arrayOrdenado = flatted.sort((a, b) => {
        const horaA = new Date(`1970-01-01T${a.horaIni}:00`).getTime();
        const horaB = new Date(`1970-01-01T${b.horaIni}:00`).getTime();
        return horaA - horaB;
      });
      setHours(arrayOrdenado.reverse());
    } catch (error) {
      console.log(error);
    }
  }

  const handleHours = (hour) => {
    setTime(hour)
    setValue('selectedHour', hour)
    const data = getValues()
    if (data?.selectedHour !== '') {
      clearErrors('selectedHour')
    }
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

  const handleOpen = async (e) => {
    e.preventDefault()
    setOpen(true)
    const isValid = await trigger();
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSuccess('initial')
    // session?.user?.rol === 'alumno' ? router.push('/citas') : router.push('/pacientes')
  }

  const handleClose = () => {
    setOpen(false);
    setSuccess('initial')
    session?.user?.rol === 'alumno' ? router.push('/citas') : router.push('/pacientes')
  }

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

  const motivo_consulta_seleccionado = watch('motivo')

  const gender = [
    { value: "Hombre", label: "Hombre" },
    { value: "Mujer", label: "Mujer" },
    { value: "Hombre trans", label: "Hombre trans" },
    { value: "Mujer trans", label: "Mujer trans" },
    { value: "No binarie", label: "No binarie" }
  ]

  const handleFirstInterview = handleSubmit(async (data, e) => {
    setOpenBackdrop(true)
    let childFormData;
    if (childFormRef.current) {
      childFormData = await childFormRef.current.submitForm();
    }

    e.preventDefault()
    setSuccess('initial')
    // const { users: patient } = await fetchUser(session.user?.id)

    const bodyContactOne = {
      "nombre": data?.nombre_contacto_emergencia1 || dataPatient.nombre_contacto_emergencia1 || '',
      "relacion": data?.parentesco_contacto_emergencia1 || dataPatient.parentesco_contacto_emergencia1 || '',
      "numero": data?.celular_contacto_emergencia1 || dataPatient.celular_contacto_emergencia1 || '',
      "mail": data?.email_contacto_emergencia1 || dataPatient.email_contacto_emergencia1 || '',
      "parentesco": data?.parentesco_contacto_emergencia1 || dataPatient.parentesco_contacto_emergencia1 || '',
      "id_emergencia": dataPatient.contacto1_id || 0
    }

    const bodyContactTwo = {
      "nombre": childFormData?.nombre_contacto_emergencia2 || dataPatient.nombre_contacto_emergencia2 || '',
      "relacion": childFormData?.parentesco_contacto_emergencia2 || dataPatient.parentesco_contacto_emergencia2 || '',
      "numero": childFormData?.celular_contacto_emergencia2 || dataPatient.celular_contacto_emergencia2 || '',
      "mail": childFormData?.email_contacto_emergencia2 || dataPatient.email_contacto_emergencia2 || '',
      "parentesco": childFormData?.parentesco_contacto_emergencia2 || dataPatient.parentesco_contacto_emergencia2 || '',
      "id_emergencia": dataPatient.contacto2_id
    }

    const bodyInterview = {
      ...data,
      "nombre_contacto_emergencia2": childFormData?.nombre_contacto_emergencia2 || '',
      "parentesco_contacto_emergencia2": childFormData?.parentesco_contacto_emergencia2 || '',
      "celular_contacto_emergencia2": childFormData?.celular_contacto_emergencia2 || '',
      "patient_id": dataPatient.id,
      "hora": data.selectedHour,
      "fecha": data.selectedDay,
      "region": regiones[0].label,
      "motivo": motivo_consulta === 'otro' ? data.otro : data.motivo.label,
      "motivo_consulta": motivo_consulta === 'otro' ? data.otro : data.motivo.label,
      "derivado_desde": 'no'
    }

    const bodyUpdate = {
      "apellido": data.lastName || dataPatient.apellido,
      "aplica_despeje": 1,
      "anoIngresoCarrera": 'No aplica',
      "campus": data.campus || 'No aplica',
      "comuna": data.comuna.label || dataPatient.comuna,
      "carrera": data.carrera.label || dataPatient.carrera,
      "contrasena": 'No aplica',
      "direccion": data.address,
      "email": data.email,
      "entrevistador": 0,
      "fecha_nacimiento": data.birthday || dataPatient.birthday,
      "genero": data.genero || dataPatient.genero,
      "id": dataPatient.id,
      "jornada": 'No aplica',
      "mustChangePassword": 0,
      "nombre": data.name || dataPatient.nombre,
      "nombre_social": data.nombre_social || dataPatient.nombre_social,
      "region": data.region.label || dataPatient.region,
      "rut": data.rut,
      "status": dataPatient.status,
      "telefono": data.mobile || dataPatient.telefono,
      "tipo_usuario": dataPatient.tipo_usuario,
      "id_emergencia": dataPatient.id_emergencia || 0,
      "id_emergencia_2": dataPatient.id_emergencia_2 || 0,
    }

    let id_contact_1;
    let id_contact_2;

    try {
      const response1 = dataPatient.contacto1_id == 0
        ? await createContact(bodyContactOne)
        : await editContact(bodyContactOne)

      const response2 = dataPatient.contacto2_id == 0
        ? await createContact(bodyContactTwo)
        : await editContact(bodyContactTwo)


      id_contact_1 = dataPatient.contacto1_id == 0
        ? response1.id
        : dataPatient.contacto1_id

      id_contact_2 = dataPatient.contacto2_id == 0
        ? response2.id
        : dataPatient.contacto2_id

    } catch (error) {
      console.log(error)
    }

    if (id_contact_1 || id_contact_2) {
      try {
        const [appointment, update] = await Promise.all([
          createInterview(bodyInterview),
          updateUser({ ...bodyUpdate, "id_emergencia": id_contact_1, "id_emergencia_2": id_contact_2 })
        ]);

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
        setOpenBackdrop(false)
      }
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
        datosPrecargados={datosPreCargados}
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
  const handleCloseModalInterview = () => {
    setShowModalInterview(false)
  }

  return (
    < >
      <div className="sidebar-overlay" data-reff="" style={{ zIndex: 98 }} />
      <>

        <div className="page-wrapper">
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
                              ? <><small className="font-red">* Completa toda la información del formulario para agendar una <strong>primera entrevista</strong> inicial.</small></>
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
                                  disabled
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
                                  disabled
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
                                  Nombre social
                                </label>
                                <input
                                  disabled={!!(dataPatient?.nombre_social && dataPatient?.nombre_social.trim() !== "")}
                                  className="form-control"
                                  type="text"
                                  {...register('nombre_social', {
                                    validate: (value) => {
                                      // Si el campo está vacío (valor opcional), retorna true inmediatamente
                                      if (!value || value.trim().length === 0) {
                                        return true;
                                      }
                                      // Solo aplica validaciones si el usuario ingresó algo
                                      if (value.length < 2) {
                                        return 'Nombre debe tener al menos 2 caracteres';
                                      }
                                      return true;
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
                                  disabled={dataPatient?.rut ? true : false}
                                  className="form-control"
                                  maxLength={12}
                                  type="text"
                                  // name="rut"
                                  style={{ border: errors.rut ? '2px solid red' : '2px solid green' }}
                                  onKeyDown={(e) => {
                                    const key = e.key;
                                    if (
                                      ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'].includes(key)
                                    ) {
                                      return;
                                    }
                                    const isAllowed = /^[0-9kK]$/.test(key);
                                    if (!isAllowed) {
                                      e.preventDefault();
                                    }
                                  }}
                                  {...register('rut', {
                                    required: "RUT es requerido",
                                    validate: (value) => formatAndValidateRUT(value).isValid || "RUT inválido",
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

                                <input
                                  disabled={esFechaValida(dataPatient?.birthday)}
                                  className="form-control datetimepicker"
                                  type="date"
                                  placeholder=""
                                  {...register('birthday', {
                                    required: {
                                      value: true,
                                      message: 'Fecha de nacimiento es requerida'
                                    }
                                  })}
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
                                        isDisabled={dataPatient?.genero ? true : false}
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
                                    disabled={dataPatient?.mobile ? true : false}
                                    className="form-control"
                                    type="tel"
                                    onKeyDown={(e) => {
                                      // Solo permite números, '+', '-', '(', ')' y teclas de control
                                      if (!/[0-9+\-()]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                                        e.preventDefault();
                                      }
                                    }}
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
                                  name="carrera"
                                  rules={{
                                    validate: (value) => {
                                      if (!value) return 'Carrera es requerida';

                                      if (typeof value === 'string') {
                                        return (
                                          carreras.some(opt => opt.value === value || opt.label === value) ||
                                          'Carrera inválida'
                                        );
                                      }

                                      return (value.value || value.label) ? true : 'Carrera inválida';
                                    },
                                  }}
                                  render={({ field }) => {
                                    let selectedCarrera = null;

                                    // Si hay un valor en el paciente que viene de la base de datos
                                    if (dataPatient?.carrera) {
                                      selectedCarrera = carreras.find(c =>
                                        c.label === dataPatient.carrera || c.value === dataPatient.carrera
                                      );
                                    }

                                    // Si ya tenemos un valor en el campo del formulario, priorizamos ese
                                    if (field.value) {
                                      if (typeof field.value === 'string') {
                                        selectedCarrera = carreras.find(c =>
                                          c.label === field.value || c.value === field.value
                                        );
                                      } else {
                                        selectedCarrera = field.value;
                                      }
                                    }

                                    const isDisabled = !!dataPatient?.carrera && carreras.some(opt =>
                                      opt.label === dataPatient.carrera ||
                                      opt.value === dataPatient.carrera
                                    );

                                    return (
                                      <Select
                                        instanceId="select-carrera"
                                        value={selectedCarrera}
                                        onChange={(selectedOption) => {
                                          field.onChange(selectedOption);
                                        }}
                                        onBlur={field.onBlur}
                                        options={carreras}
                                        isDisabled={isDisabled}
                                        menuPortalTarget={menuPortalTarget}
                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                        id="carrera"
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
                                {errors.carrera && <span><small>{errors.carrera.message}</small></span>}
                              </div>
                            </div>

                            <div className="col-12 col-sm-12">
                              <div className="form-group local-forms">
                                <label>
                                  Dirección <span className="login-danger">*</span>
                                </label>
                                <input
                                  disabled={dataPatient?.address ? true : false}
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
                                  rules={{
                                    validate: (value) => {
                                      // Aceptamos tanto string como objeto
                                      if (!value) return 'Región es requerida';

                                      // Si es string, puede ser label o value
                                      if (typeof value === 'string') {
                                        return regiones.some(opt => opt.value === value || opt.label === value) || 'Región es requerida';
                                      }

                                      // Si es objeto, debe tener value o label
                                      return (value.value || value.label) ? true : 'Región es requerida';
                                    },
                                  }}
                                  render={({ field }) => {
                                    // Determinar el valor seleccionado para el Select
                                    let selectedRegion = null;

                                    // Si hay un valor en el paciente que viene de la base de datos
                                    if (dataPatient?.region) {
                                      // Buscamos el objeto completo que corresponde al LABEL de la base de datos
                                      // (por ejemplo, "Arica y Parinacota")
                                      selectedRegion = regiones.find(r =>
                                        r.label === dataPatient.region || // Busca por label exacto
                                        r.value === dataPatient.region    // O por value exacto
                                      );
                                    }

                                    // Si ya tenemos un valor en el campo del formulario, priorizamos ese
                                    if (field.value) {
                                      if (typeof field.value === 'string') {
                                        // Busca por label o value
                                        selectedRegion = regiones.find(r =>
                                          r.label === field.value ||
                                          r.value === field.value
                                        );
                                      } else {
                                        // Si ya es un objeto, lo usamos directamente
                                        selectedRegion = field.value;
                                      }
                                    }

                                    // Determinar si el campo debe estar deshabilitado
                                    // Solo deshabilitar si existe un valor válido en dataPatient.region
                                    const isDisabled = !!dataPatient?.region && regiones.some(opt =>
                                      opt.label === dataPatient.region ||
                                      opt.value === dataPatient.region
                                    );

                                    return (
                                      <Select
                                        instanceId="select-region"
                                        value={selectedRegion}
                                        onChange={(selectedOption) => {
                                          // Guardamos el objeto completo del select
                                          field.onChange(selectedOption);
                                        }}
                                        onBlur={field.onBlur}
                                        options={regiones}
                                        isDisabled={isDisabled}
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
                            <div className="col-12 col-sm-6">
                              <div className="form-group local-forms">
                                <label>
                                  Comuna <span className="login-danger">*</span>
                                </label>
                                <Controller
                                  control={control}
                                  name="comuna"
                                  rules={{
                                    validate: (value) => {
                                      if (!value) return 'Comuna es requerida';

                                      // Si es string, puede ser label o value
                                      if (typeof value === 'string') {
                                        const todasLasComunas = Object.values(comunas).flat();
                                        return todasLasComunas.some(opt =>
                                          opt.value === value ||
                                          opt.label === value
                                        ) || 'Comuna es requerida';
                                      }

                                      // Si es objeto, debe tener value o label
                                      return (value.value || value.label) ? true : 'Comuna es requerida';
                                    }
                                  }}
                                  render={({ field }) => {
                                    // Obtener la región actual (manejando tanto string como objeto)
                                    const currentRegion = watch('region');

                                    // Función para encontrar la clave de comunas a partir de una región
                                    const getRegionKey = (regionData) => {
                                      if (!regionData) return null;

                                      let regionObj;

                                      if (typeof regionData === 'string') {
                                        // Buscar la región por label o value
                                        regionObj = regiones.find(r =>
                                          r.label === regionData ||
                                          r.value === regionData
                                        );
                                      } else {
                                        // Si ya es un objeto, usarlo directamente
                                        regionObj = regionData;
                                      }

                                      return regionObj?.value?.toLowerCase()
                                        .normalize("NFD")
                                        .replace(/[\u0300-\u036f]/g, "")
                                        .replace(/\s+/g, "_");
                                    };

                                    // Primero intentamos con el valor seleccionado en el formulario
                                    let normalizedRegionKey = getRegionKey(currentRegion);

                                    // Si no hay una región seleccionada en el formulario, usamos la del paciente
                                    if (!normalizedRegionKey && dataPatient?.region) {
                                      normalizedRegionKey = getRegionKey(dataPatient.region);
                                    }

                                    // Obtener las opciones de comunas para la región actual
                                    const opcionesComunas = normalizedRegionKey ? comunas[normalizedRegionKey] || [] : [];

                                    // Determinar el valor seleccionado para el Select
                                    let selectedComuna = null;

                                    // Si hay un valor en el paciente que viene de la base de datos
                                    if (dataPatient?.comuna) {
                                      // Buscamos el objeto completo que corresponde al label o value de la base de datos
                                      selectedComuna = opcionesComunas.find(c =>
                                        c.label === dataPatient.comuna ||
                                        c.value === dataPatient.comuna
                                      );
                                    }

                                    // Si hay un valor en el campo del formulario, priorizamos ese
                                    if (field.value) {
                                      if (typeof field.value === 'string') {
                                        // Si es string, buscamos el objeto correspondiente (puede ser label o value)
                                        selectedComuna = opcionesComunas.find(c =>
                                          c.label === field.value ||
                                          c.value === field.value
                                        );
                                      } else {
                                        // Si ya es un objeto, lo usamos directamente
                                        selectedComuna = field.value;
                                      }
                                    }

                                    // Determinar si el campo debe estar deshabilitado
                                    // Solo deshabilitar si existe un valor válido en dataPatient.comuna
                                    const isDisabled = !!dataPatient?.comuna &&
                                      opcionesComunas.some(opt =>
                                        opt.label === dataPatient.comuna ||
                                        opt.value === dataPatient.comuna
                                      );

                                    // En lugar de useEffect, actualizamos el valor inmediatamente si es necesario
                                    // Esto se ejecutará durante el renderizado, antes de devolver el JSX
                                    if (selectedComuna && !field.value) {
                                      // Usamos setTimeout para asegurarnos de que esto ocurra después del ciclo de renderizado actual
                                      setTimeout(() => {
                                        field.onChange(selectedComuna);
                                      }, 0);
                                    }

                                    return (
                                      <Select
                                        instanceId="select-comuna"
                                        value={selectedComuna}
                                        onChange={(selectedOption) => {
                                          // Guardamos el objeto completo del select
                                          field.onChange(selectedOption);
                                        }}
                                        onBlur={field.onBlur}
                                        options={opcionesComunas}
                                        isDisabled={isDisabled}
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
                                    onKeyDown={(e) => {
                                      // Solo permite números, '+', '-', '(', ')' y teclas de control
                                      if (!/[0-9+\-()]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                                        e.preventDefault();
                                      }
                                    }}
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
                                </div>
                                {
                                  errors.celular_contacto_emergencia1 && <span><small>{errors.celular_contacto_emergencia1.message}</small></span>
                                }
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
                                  {...register('email_contacto_emergencia1', {
                                    pattern: {
                                      value: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
                                      message: 'Correo no es válido'
                                    }
                                  })} />
                                {
                                  errors.email_contacto_emergencia1 && <span><small>{errors.email_contacto_emergencia1.message}</small></span>
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
                                  rules={{ required: 'El campo es obligatorio' }}
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
                                rules={{ required: 'Motivo es requerido' }}
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
                            motivo_consulta_seleccionado?.label == 'Otro' &&
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
                                      {...register('modalidad', {
                                        required: {
                                          value: true,
                                          message: 'Seleccione videollamada o presencial'
                                        }
                                      })}
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
                                      {...register('modalidad', {
                                        required: {
                                          value: true,
                                          message: 'Seleccione videollamada o presencial'
                                        }
                                      })}
                                    />
                                    Presencial
                                  </label>
                                </div>
                                {
                                  errors.modalidad && <span style={{ display: 'block' }}><small>{errors.modalidad.message}</small></span>
                                }
                              </div>
                            </div>
                          </div>

                          {/*   SEDES  */}
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

                          {/*  FECHAS  */}
                          {profesional && (
                            <>
                              {!modalidad || (modalidad === 'presencial' && !campus) ? null : (
                                <>
                                  {loadingDays ? (
                                    <div className="row">
                                      <div className="col-12 col-md-12 col-xl-12">
                                        <label>
                                          Día de la Cita <span className="login-danger">*</span>
                                        </label>
                                        <Box sx={{ width: '100%' }}>
                                          <LinearProgress />
                                        </Box>
                                      </div>
                                    </div>
                                  ) :

                                    !loadingDays && cargaCompletada && days.length === 0 ? (
                                      <div className="row">
                                        <div className="col-12">
                                          <div className="alert alert-info">
                                            No hay horas disponibles para esta opción.
                                          </div>
                                        </div>
                                      </div>
                                    )

                                      : cargaCompletada && days.length > 0 ? (
                                        <div className="row">
                                          <div className="col-12 col-md-12 col-xl-12">
                                            <label>
                                              Día de la Cita <span className="login-danger">*</span>
                                            </label>
                                            <div className="form-group local-forms mb-0">
                                              <>
                                                <button
                                                  className="btn btn-primary"
                                                  onClick={e => { mostrarAnterioresDias(e) }}
                                                  disabled={indiceDias === 0}>
                                                  <ChevronLeft />
                                                </button>
                                                <input
                                                  type="hidden"
                                                  {...register("selectedDay", {
                                                    required: {
                                                      value: true,
                                                      message: 'Seleccione una fecha'
                                                    }
                                                  })}
                                                />
                                                {days.slice(indiceDias, indiceDias + 5).map((day, i) => (
                                                  <div key={`${day.id}${i}days`} style={{ display: 'inline-block' }}>
                                                    <button
                                                      className={`btn me-2 ${date === day.fechaInicio ? "btn-primary" : "btn-cancel"}`}
                                                      onClick={(e) => handleDays(e, day.fechaInicio, day.id_user)}>
                                                      {dayjs(day.fechaInicio).format('ddd DD MMM')}
                                                    </button>
                                                  </div>
                                                ))}

                                                <button
                                                  className="btn btn-primary"
                                                  onClick={e => { mostrarSiguientesDias(e) }}
                                                  disabled={indiceDias + 5 >= days.length}>
                                                  <ChevronRight />
                                                </button>
                                              </>
                                            </div>
                                            {errors.selectedDay && <span><small>{errors.selectedDay.message}</small></span>}
                                          </div>

                                          {/* Horas */}
                                          {date !== '' && (
                                            <div className="col-12 col-md-12 col-xl-12 mt-3">
                                              <label>
                                                Hora <span className="login-danger">*</span>
                                              </label>
                                              <div className="form-group local-forms">
                                                {hours.length > 0 ? (
                                                  <>
                                                    <button
                                                      className="btn btn-primary"
                                                      onClick={e => { mostrarAnterioresHoras(e) }}
                                                      disabled={indiceHoras === 0}>
                                                      <ChevronLeft />
                                                    </button>
                                                    <input
                                                      type="hidden"
                                                      {...register("selectedHour", {
                                                        required: {
                                                          value: true,
                                                          message: 'Seleccione una hora'
                                                        }
                                                      })}
                                                    />
                                                    {hours.slice(indiceHoras, indiceHoras + 5).map((hour, i) => (
                                                      <div key={`${hour.id}${i}hours`} style={{ display: 'inline-block' }}>
                                                        <button
                                                          type="button"
                                                          className={`btn me-2 ${time === hour.horaInicio ? "btn-primary" : "btn-cancel"}`}
                                                          onClick={() => handleHours(hour.horaInicio)}>
                                                          {hour.horaInicioBloque}
                                                        </button>
                                                      </div>
                                                    ))}

                                                    <button
                                                      className="btn btn-primary"
                                                      onClick={e => { mostrarSiguientesHoras(e) }}
                                                      disabled={indiceHoras + 5 >= hours.length}>
                                                      <ChevronRight />
                                                    </button>
                                                  </>
                                                ) : (
                                                  <div>No hay horas disponibles para esta fecha.</div>
                                                )}
                                              </div>
                                              {errors.selectedHour && <span><small>{errors.selectedHour.message}</small></span>}
                                            </div>
                                          )}
                                        </div>
                                      ) : null}
                                </>
                              )}
                            </>
                          )}

                          <SelectorDeDias
                            allDays={allDays}
                            modalidad={modalidad}
                            campus={campus}
                            profesional={profesional}
                            setDays={setDays}
                            setHours={setHours}
                            setDate={setDate}
                            setTime={setTime}
                            setLoadingDays={setLoadingDays}
                            loadingDays={loadingDays}
                          />
                          {
                            Object.keys(errors).length > 0 && <span><small>Hay campos sin completar.</small></span>
                          }
                          <div className="col-12">
                            <div className="doctor-submit text-end mt-3">
                              <button
                                disabled={Object.keys(errors).length > 0 || !showModalInterview}
                                // disabled={!isValid}
                                className="btn btn-primary submit-form me-2"
                                onClick={handleOpen}
                              >
                                Agendar entrevista
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
          <ConsentimientoInformado open={open} handleClose={handleCloseModal} onClick={handleFirstInterview} errors={errors} />
        </div>

        {openBackdrop && <SimpleBackdrop
        // open={openBackdrop}
        // handleClose={handleCloseBackdrop}
        />}
        {success === 'success'
          &&
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
              La cita se ha creado con éxito. Revisa los detalles en la sección Lista de citas.
            </Alert>
            {/* </div> */}
          </div>
        }
        {success === 'fail'
          &&
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
        }

        {showModalInterview
          &&
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
                onClose={() => { setShowModalInterview(false) }}
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
                <h4>Ya tienes una primera cita agendada</h4>
                <ul>
                  <li>
                    <h4>Para pedir otra, primero debes cancelar la que ya tienes.</h4>
                  </li>
                  <li>
                    <h4>Después de tu primera sesión, será el profesional quien coordine las siguientes citas contigo.</h4>

                  </li>
                </ul>
              </Alert>
            </div>
          </div>
        }
      </>
    </>
  );
};

// export default AddFirstAppoinments;
export default withAuth(AddFirstAppoinments, ['alumno', 'profesional', 'administrador', 'blend']);

