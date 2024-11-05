'use client'
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useId } from "react";
import { DatePicker } from "antd";
import Select from "react-select";
import Link from "next/link";
import { useForm, Controller } from 'react-hook-form';

import Sidebar from "@/components/Sidebar";

import FeatherIcon from "feather-icons-react/build/FeatherIcon";

import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";

import { fetchDoctors, fetchDoctor } from "@/services/DoctorsServices";
import { fetchUsers } from "@/services/UsersServices";
import { createAppointment } from "@/services/AppointmentsServices"
import { createInterviewRecord } from "@/services/RecordServices";
import Contact from "@/components/Contact"
import dayjs from "dayjs";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { regiones, comunas, motivo_consulta, existencia_servicio, quien_derivo, diagnosticos_previos } from "../../../utils/selects";

import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import ProtectedPage from "@/components/ProtectedRoutes";

const AddInterviewRecord = ({ params }) => {
  const ROL = ["profesional"]
  const { data: session } = useSession()
  const router = useRouter();
  // useAuthorization(['alumno'])

  const [isClicked, setIsClicked] = useState(false);
  const [startTime, setStartTime] = useState();
  const [selectedOption, setSelectedOption] = useState(null);
  const [doctor, setDoctor] = useState([]);
  const [patients, setPatients] = useState([])
  const [contacts, setContacts] = useState([])

  const [success, setSuccess] = useState('initial')
  const [error, setError] = useState('')
  // const [allRegions, setAllRegions] = useState(regiones)
  // const [selectedCities, setSelectedCities] = useState([])
  // const [rut, setRut] = useState('')

  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchData()
    getPatients()
  }, [])

  const calcularEdad = (fechaNacimiento) => {
    var hoy = new Date();
    var cumpleanos = new Date(fechaNacimiento);
    var edad = hoy.getFullYear() - cumpleanos.getFullYear();
    var mes = hoy.getMonth() - cumpleanos.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < cumpleanos.getDate())) {
      edad--;
    }
    console.log('EDAD', edad);
    return edad;
  }

  const { register, handleSubmit, watch, control,
    formState: { errors }
  } = useForm({
    defaultValues: async () => fetchUsers().then(response => {
      console.log('response', response.users)
      const patient = response.users.filter(user => user.id == params.id)
      console.log('patient', patient)
      const obj = {
        profesional_evaluador: session.user.name,
        nombre_completo: `${patient[0].nombre} ${patient[0].apellido}`,
        lastName: patient[0].apellido,
        correo: patient[0].email,
        fecha_nacimiento: dayjs(patient[0].fecha_nacimiento).format('DD-MM-YYYY'),
        edad: calcularEdad(dayjs(patient[0].fecha_nacimiento).format('DD-MM-YYYY')),
        genero: patient[0].genero,
        telefono: patient[0].telefono
      }
      console.log('obj', patient);
      return obj
    })
      .catch(error =>
        console.log('err', error)
      )
  })

  const fetchData = async () => {
    const { users } = await fetchDoctor('6')
    console.log('users', users);
    const docs = users.map((doc, i) => {
      return {
        value: i + 2,
        label: doc.nombre + ' ' + doc.apellido,
        id: doc.id
      }
    })
    setDoctor(docs)
  }

  const getPatients = async () => {
    const { users } = await fetchUsers()
    const patients = users.filter(patient => patient.tipo_usuario === 'alumno')
    setPatients(patients)
  }

  const handleOpen = (e) => {
    e.preventDefault()
    setOpen(true)
  };
  const handleClose = () => setOpen(false);

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
    const patients = await fetchUsers()

    const patient = patients.filter(user =>
      user.nombre === patientName
      & user.apellido === patientLastname
      & user.tipo_usuario === 'alumno'
    )
    try {
      const appointment = await createAppointment({ ...data, "patient_id": patient[0].id })
      console.log('appointment', appointment)
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
  const gender = [
    { value: 1, label: "Femenino" },
    { value: 2, label: "Masculino" },
    { value: 3, label: "No binario" },
    { value: 4, label: "Otro" },
    { value: 5, label: "Prefiero no decir" }
  ];
  const career = [
    { value: 2, label: "Antropologia" },
    { value: 3, label: "Arquitectura" },
    { value: 4, label: "Contador" },
    { value: 5, label: "Derecho" },
    { value: 6, label: "Ingenieria" },
  ];
  const tipo_apoyo = [
    { value: 2, label: "Emocional" },
    { value: 3, label: "Familiar" },
    { value: 4, label: "Amoroso" },
    { value: 5, label: "Profesional" },
    { value: 6, label: "Académico" },
    { value: 7, label: "Económico" },
    { value: 8, label: "Pares" },
    { value: 9, label: "Otro" }
  ];
  const modalidad = [
    { value: 2, label: "Atención psicológica breve" },
    { value: 3, label: "Orientación/Consejería" },
    { value: 4, label: "Atención psicopedagógica" },
    { value: 5, label: "Orientación psicopedagógica" },
    { value: 6, label: "Grupo Psicoterapéutico" },
    { value: 7, label: "Grupo Psicopedagógico" },
    { value: 8, label: "Grupo de acompañamiento" },
    { value: 9, label: "Derivación externa" },
    { value: 10, label: "Derivación Psiquiatra" }
  ];

  const estdo_atencion = [
    { value: 2, label: "Reagendada" },
    { value: 3, label: "Realizada" },
    { value: 4, label: "Cancelada" }
  ];
  const area_atencion = [
    { value: 2, label: "Psicológica" },
    { value: 3, label: "Psicopedagógica" },
    { value: 4, label: "Psiquiátrica" },
    { value: 4, label: "Grupal" }
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

  const handleFormat = rut => rut.replace(/[^\dkK]/g, '').replace(/^(\d{1,2})(\d{3})(\d{3})([0-9kK]{1})$/, '$1.$2.$3-$4')

  const handleInterview = handleSubmit(async (data, e) => {
    e.preventDefault()
    console.log('HOOOLAAAA', data)
    try {
      const resp = await createInterviewRecord({ ...data, id_profesional: 9, id_alumno: parseInt(params.id) })
      console.log('resp', resp)

    } catch (error) {
      console.log('Error: ', error);
    }
  })

  return (
    <ProtectedPage level={ROL}>
      <Sidebar
        id="menu-item4"
        id1="menu-items4"
        activeClassName="add-medical-record"
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
                      <Link href="#">Ficha </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="feather-chevron-right">
                        <FeatherIcon icon="chevron-right" />
                      </i>
                    </li>
                    <li className="breadcrumb-item active">Entrevista de evaluación</li>
                  </ul>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            <div className="row">
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-body">
                    <h4>Entrevista de evaluación</h4>
                    <form>
                      {/* Detalles de la cita */}

                      <div className="row" style={{ border: '1px solid lightgrey', borderRadius: '8px', padding: '20px 0 0 0', margin: '10px' }}>
                        <div className="col-12 col-md-4 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Profesional que realiza evaluación
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              {...register('profesional_evaluador')}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-4 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Fecha
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              {...register('fecha', {
                                required: {
                                  value: true,
                                  message: 'Fecha es requerida'
                                }
                              })}
                            />
                            {errors.fecha && <span className="login-danger">
                              <small>{errors.fecha.message}</small>
                            </span>}
                          </div>
                        </div>
                        <div className="col-12 col-md-4 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Número de ficha
                            </label>
                            <input
                              className="form-control"
                              // value={rut}
                              type="text"
                              {...register('numero_ficha', {
                                required: {
                                  value: true,
                                  message: 'Número de ficha es requerido'
                                }
                              })}
                            />
                            {errors.numero_ficha && <span className="login-danger">
                              <small>{errors.numero_ficha.message}</small>
                            </span>}
                          </div>
                        </div>
                      </div>

                      {/* 1. Datos de identificación */}
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header">
                          <div className="col-12">
                            <div className="form-heading">
                              <h4>1. Datos de identificación</h4>
                            </div>
                          </div>
                        </AccordionSummary>
                        <AccordionDetails>
                          <div className="row" >
                            <div className="col-12 col-md-12 col-xl-12">
                              <div className="form-group local-forms">
                                <label>Nombre completo</label>
                                {/* <select className="select form-control" name="cars" id="cars">
                              {
                                patients.map(patient => (
                                  <option
                                    value={`${patient.nombre} ${patient.apellido}`}
                                    key={patient.id}>{patient.nombre} {patient.apellido}
                                  </option>
                                ))
                              }
                            </select> */}
                                <input
                                  className="form-control" type="text"
                                  defaultValue={""}
                                  {...register('nombre_completo')} />
                                {errors.nombre_completo && <span className="login-danger">
                                  <small>{errors.nombre_completo.message}</small>
                                </span>}
                              </div>
                            </div>

                            <div className="col-12 col-md-12 col-xl-12">
                              <div className="form-group local-forms">
                                <label>Rut</label>
                                <input
                                  className="form-control" type="text"
                                  defaultValue={""}
                                  {...register('rut')} />
                                {errors.rut && <span className="login-danger">
                                  <small>{errors.rut.message}</small>
                                </span>}
                              </div>
                            </div>

                            <div className="col-12 col-md-6 col-xl-6">
                              <div className="form-group local-forms">
                                <label>Carrera</label>
                                <input
                                  className="form-control" type="text"
                                  defaultValue={""}
                                  {...register('carrera')} />
                                {errors.carrera && <span className="login-danger">
                                  <small>{errors.carrera.message}</small>
                                </span>}
                              </div>
                            </div>

                            <div className="col-12 col-md-6 col-xl-6">
                              <div className="form-group local-forms">
                                <label>Año de ingreso</label>
                                <input
                                  className="form-control" type="text"
                                  defaultValue={""}
                                  {...register('ano_ingreso')} />
                                {errors.ano_ingreso && <span className="login-danger">
                                  <small>{errors.ano_ingreso.message}</small>
                                </span>}
                              </div>
                            </div>

                            <div className="col-12 col-md-6 col-xl-6">
                              <div className="form-group local-forms">
                                <label>Fecha de nacimiento</label>
                                <input
                                  className="form-control" type="text"
                                  defaultValue={""}
                                  {...register('fecha_nacimiento')} />
                                {errors.fecha_nacimiento && <span className="login-danger">
                                  <small>{errors.fecha_nacimiento.message}</small>
                                </span>}
                              </div>
                            </div>

                            <div className="col-12 col-md-6 col-xl-6">
                              <div className="form-group local-forms">
                                <label>Edad</label>
                                <input
                                  className="form-control" type="text"
                                  defaultValue={""}
                                  {...register('edad')} />
                                {errors.edad && <span className="login-danger">
                                  <small>{errors.edad.message}</small>
                                </span>}
                              </div>
                            </div>

                            <div className="col-12 col-md-12 col-xl-12">
                              <div className="form-group local-forms">
                                <label>Dirección</label>
                                <input
                                  className="form-control" type="text"
                                  defaultValue={""}
                                  {...register('direccion')} />
                                {errors.direccion && <span className="login-danger">
                                  <small>{errors.direccion.message}</small>
                                </span>}
                              </div>
                            </div>

                            <div className="col-12 col-md-6 col-xl-6">
                              <div className="form-group local-forms">
                                <label>Correo electrónico</label>
                                <input
                                  className="form-control" type="text"
                                  defaultValue={""}
                                  {...register('correo')} />
                                {errors.correo && <span className="login-danger">
                                  <small>{errors.correo.message}</small>
                                </span>}
                              </div>
                            </div>

                            <div className="col-12 col-md-6 col-xl-6">
                              <div className="form-group local-forms">
                                <label>Teléfono</label>
                                <input
                                  className="form-control" type="text"
                                  defaultValue={""}
                                  {...register('telefono')} />
                                {errors.telefono && <span className="login-danger">
                                  <small>{errors.telefono.message}</small>
                                </span>}
                              </div>
                            </div>

                          </div>
                        </AccordionDetails>
                      </Accordion>

                      {/* 2. Datos de contactos de urgencia */}
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header">
                          <div className="col-12">
                            <div className="form-heading">
                              <h4>2. Datos de contactos de urgencia</h4>
                            </div>
                          </div>
                        </AccordionSummary>
                        <AccordionDetails>
                          <div className="row">
                            <div className="col-12 col-md-4 col-xl-4">
                              <div className="form-group local-forms">
                                <label>
                                  Nombre y apellido
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  {...register('nombre_contacto_emergencia1')}
                                />
                                {errors.nombre_contacto_emergencia1 && <span className="login-danger">
                                  <small>{errors.nombre_contacto_emergencia1.message}</small>
                                </span>}
                              </div>
                            </div>
                            <div className="col-12 col-md-4 col-xl-4">
                              <div className="form-group local-forms">
                                <label>
                                  Parentesco o relación
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  {...register('parentesco_contacto_emergencia1')}
                                />
                                {errors.parentesco_contacto_emergencia1 && <span className="login-danger">
                                  <small>{errors.parentesco_contacto_emergencia1.message}</small>
                                </span>}
                              </div>
                            </div>
                            <div className="col-12 col-md-4 col-xl-4">
                              <div className="form-group local-forms">
                                <label>
                                  Teléfono
                                </label>
                                <input
                                  className="form-control"
                                  // value={rut}
                                  type="text"
                                  {...register('celular_contacto_emergencia1')}
                                />
                                {errors.celular_contacto_emergencia1 && <span className="login-danger">
                                  <small>{errors.celular_contacto_emergencia1.message}</small>
                                </span>}
                              </div>
                            </div>


                            <div className="col-12 col-md-4 col-xl-4">
                              <div className="form-group local-forms">
                                <label>
                                  Nombre y apellido
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  {...register('nombre_contacto_emergencia2')}
                                />
                              </div>
                            </div>
                            <div className="col-12 col-md-4 col-xl-4">
                              <div className="form-group local-forms">
                                <label>
                                  Parentesco o relación
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  {...register('parentesco_contacto_emergencia2')}
                                />
                              </div>
                            </div>
                            <div className="col-12 col-md-4 col-xl-4">
                              <div className="form-group local-forms">
                                <label>
                                  Teléfono
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  {...register('celular_contacto_emergencia2')}
                                />
                              </div>
                            </div>
                          </div>
                        </AccordionDetails>
                      </Accordion>

                      {/* 3. Antecedentes sociales y familiares */}
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header">
                          <div className="col-12">
                            <div className="form-heading">
                              <h4>3. Antecedentes sociales y familiares</h4>
                            </div>
                          </div>
                        </AccordionSummary>
                        <AccordionDetails>
                          {/* <div className="col-12 col-md-12 col-xl-12">
                          <div className="form-group select-gender">
                            <label>Previsión de salud </label>
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                <input
                                  type="radio"
                                  name="prevision"
                                  value="prevision_salud_isapre"
                                  className="form-check-input"
                                  {...register('prevision')}
                                />
                                Isapre
                              </label>
                            </div>
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                <input
                                  type="radio"
                                  name="prevision"
                                  value="prevision_salud_fonasa"
                                  className="form-check-input"
                                  {...register('prevision')}
                                />
                                Fonasa
                              </label>
                            </div>
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                <input
                                  type="radio"
                                  name="prevision"
                                  value="prevision_salud_otro"
                                  className="form-check-input"
                                  {...register('prevision')}
                                />
                                Otro
                              </label>
                            </div>
                          </div>
                        </div> */}
                          <div className="row">
                            <div className="col-12 col-md-12 col-xl-12">
                              <div className="form-group select-gender">
                                <label>Financiamiento carrera </label>
                                <div className="form-check-inline">
                                  <label className="form-check-label">
                                    <input
                                      type="radio"
                                      name="financiamiento_carrera"
                                      value="gratuidad"
                                      className="form-check-input"
                                      {...register('financiamiento_carrera')}
                                    />
                                    Gratuidad
                                  </label>
                                </div>
                                <div className="form-check-inline">
                                  <label className="form-check-label">
                                    <input
                                      type="radio"
                                      name="financiamiento_carrera"
                                      value="beca"
                                      className="form-check-input"
                                      {...register('financiamiento_carrera')}
                                    />
                                    Beca
                                  </label>
                                </div>
                                <div className="form-check-inline">
                                  <label className="form-check-label">
                                    <input
                                      type="radio"
                                      name="financiamiento_carrera"
                                      value="credito"
                                      className="form-check-input"
                                      {...register('financiamiento_carrera')}
                                    />
                                    Crédito
                                  </label>
                                </div>
                                <div className="form-check-inline">
                                  <label className="form-check-label">
                                    <input
                                      type="radio"
                                      name="financiamiento_carrera"
                                      value="sin beneficio"
                                      className="form-check-input"
                                      {...register('financiamiento_carrera')}
                                    />
                                    Sin beneficio
                                  </label>
                                </div>
                                {
                                  errors.financiamiento_carrera && <span className="login-danger">
                                    <small>{errors.financiamiento_carrera.message}</small>
                                  </span>
                                }
                              </div>
                            </div>

                            <div className="col-12 col-md-12 col-xl-12">
                              <div className="form-group local-forms">
                                <label>¿Dónde y con quién vives? Relación que tienes con ellos. ¿cómo te llevas con ellos?</label>

                                <textarea
                                  className="form-control"
                                  rows={3}
                                  cols={30}
                                  defaultValue={""}
                                  style={{ resize: 'none' }}
                                  {...register('vivienda_situacion_actual')}
                                />
                                {
                                  errors.vivienda_situacion_actual && <span className="login-danger">
                                    <small>{errors.vivienda_situacion_actual.message}</small>
                                  </span>
                                }
                              </div>
                            </div>

                            <div className="col-12 col-md-12 col-xl-12">
                              <div className="form-group local-forms">
                                <label>¿Tienes labores de cuidador? ¿A quién cuidas?</label>

                                <textarea
                                  className="form-control"
                                  rows={3}
                                  cols={30}
                                  defaultValue={""}
                                  style={{ resize: 'none' }}
                                  {...register('labores_cuidador')}
                                />
                                {
                                  errors.labores_cuidador && <span className="login-danger">
                                    <small>{errors.labores_cuidador.message}</small>
                                  </span>
                                }
                              </div>
                            </div>

                            <div className="col-12 col-md-12 col-xl-12">
                              <div className="form-group local-forms">
                                <label>¿De qué manera financias tus gastos personales?</label>
                                <textarea
                                  className="form-control"
                                  rows={3}
                                  cols={30}
                                  defaultValue={""}
                                  style={{ resize: 'none' }}
                                  {...register('financiamiento_gastos_personales')}
                                />
                                {
                                  errors.financiamiento_gastos_personales && <span className="login-danger">
                                    <small>{errors.financiamiento_gastos_personales.message}</small>
                                  </span>
                                }
                              </div>
                            </div>

                            <div className="col-12 col-md-12 col-xl-12">
                              <div className="form-group local-forms">
                                <label>En caso de que tuvieses que costear tratamiento externo, quién/es podrían apoyarte económicamente?</label>
                                <input
                                  className="form-control" type="text"
                                  defaultValue={""}
                                  {...register('apoyo_economico_tratamiento')} />
                                {
                                  errors.apoyo_economico_tratamiento && <span className="login-danger">
                                    <small>{errors.apoyo_economico_tratamiento.message}</small>
                                  </span>
                                }
                              </div>
                            </div>

                            <div className="col-12 col-md-12 col-xl-12">
                              <div className="form-group local-forms">
                                <label>¿Cuánto crees que podrías pagar para acceder a tratamiento semanalmente?</label>
                                <input
                                  className="form-control" type="text"
                                  defaultValue={""}
                                  {...register('pago_tratamiento_semanal')} />
                                {
                                  errors.pago_tratamiento_semanal && <span className="login-danger">
                                    <small>{errors.pago_tratamiento_semanal.message}</small>
                                  </span>
                                }
                              </div>
                            </div>
                          </div>
                        </AccordionDetails>
                      </Accordion>

                      {/* 4. Antecedentes de salud */}
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header">
                          <div className="col-12">
                            <div className="form-heading">
                              <h4>4. Antecedentes de salud</h4>
                            </div>
                          </div>
                        </AccordionSummary>
                        <AccordionDetails>
                          <div className="row">
                            <div className="col-12 col-md-12 col-xl-12">
                              <label>¿Te has realizado chequeos de salud durante el último año?  </label>
                              <div className="form-group select-gender">
                                <div className="form-check-inline col-2 col-md-1 col-xl-1">
                                  <label className="form-check-label">
                                    <input
                                      type="radio"
                                      value="si"
                                      name="chequeos_salud_ultimo_ano"
                                      className="form-check-input"
                                      {...register('chequeos_salud_ultimo_ano')}
                                    />
                                    Si
                                  </label>
                                </div>
                                <div className="form-check-inline col-6 col-md-2 col-xl-2">
                                  <label className="form-check-label">
                                    <input
                                      type="radio"
                                      value="no"
                                      name="chequeos_salud_ultimo_ano"
                                      className="form-check-input"
                                      {...register('chequeos_salud_ultimo_ano')}
                                    />
                                    No / No recuerdo
                                  </label>
                                </div>
                                <div className="form-check-inline col-8" style={{ display: 'inline-flex' }} >
                                  <label className="form-check-label">
                                    Motivo
                                  </label>
                                  <textarea
                                    className="form-control"
                                    rows={1}
                                    cols={30}
                                    defaultValue={""}
                                    style={{ resize: 'none' }}
                                    {...register('motivo_chequeos_salud')}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="col-12 col-md-12 col-xl-12">
                              <label>¿Tienes alguna enfermedad de salud física?</label>
                              <div className="form-group select-gender">
                                <div className="form-check-inline col-2 col-md-1 col-xl-1">
                                  <label className="form-check-label">
                                    <input
                                      type="radio"
                                      value="si"
                                      name="enfermedad_salud_fisica"
                                      className="form-check-input"
                                      {...register('enfermedad_salud_fisica')}
                                    />
                                    Si
                                  </label>
                                </div>
                                <div className="form-check-inline col-6 col-md-2 col-xl-2">
                                  <label className="form-check-label">
                                    <input
                                      type="radio"
                                      value="no"
                                      name="enfermedad_salud_fisica"
                                      className="form-check-input"
                                      {...register('enfermedad_salud_fisica')}
                                    />
                                    No / No sé
                                  </label>
                                </div>
                                <div className="form-check-inline col-8" style={{ display: 'inline-flex' }} >
                                  <label className="form-check-label">
                                    ¿Cuál?
                                  </label>
                                  <textarea
                                    className="form-control"
                                    rows={1}
                                    cols={30}
                                    defaultValue={""}
                                    style={{ resize: 'none' }}
                                    {...register('diagnostico_salud_fisica')}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="col-12 col-md-12 col-xl-12">
                              <label>¿Tienes algún diagnóstico de salud mental?</label>
                              <div className="form-group select-gender">
                                <div className="form-check-inline col-2 col-md-1 col-xl-1">
                                  <label className="form-check-label">
                                    <input
                                      type="radio"
                                      value="si"
                                      name="enfermedad_salud_mental"
                                      className="form-check-input"
                                      {...register('enfermedad_salud_mental')}
                                    />
                                    Si
                                  </label>
                                </div>
                                <div className="form-check-inline col-6 col-md-2 col-xl-2">
                                  <label className="form-check-label">
                                    <input
                                      type="radio"
                                      value="no"
                                      name="enfermedad_salud_mental"
                                      className="form-check-input"
                                      {...register('enfermedad_salud_mental')}
                                    />
                                    No
                                  </label>
                                </div>
                                <div className="form-check-inline col-8" style={{ display: 'inline-flex' }} >
                                  <label className="form-check-label">
                                    ¿Cuál?
                                  </label>
                                  <textarea
                                    className="form-control"
                                    rows={1}
                                    cols={30}
                                    defaultValue={""}
                                    style={{ resize: 'none' }}
                                    {...register('diagnostico_salud_mental')}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="col-12 col-md-12 col-xl-12">
                              <label>¿Tomas alguna medicación de manera permanente? (salud física y/o salud mental)</label>
                              <div className="form-group select-gender">
                                <div className="form-check-inline col-2 col-md-1 col-xl-1">
                                  <label className="form-check-label">
                                    <input
                                      type="radio"
                                      value="si"
                                      name="medicacion_permanente"
                                      className="form-check-input"
                                      {...register('medicacion_permanente')}
                                    />
                                    Si
                                  </label>
                                </div>
                                <div className="form-check-inline col-6 col-md-2 col-xl-2">
                                  <label className="form-check-label">
                                    <input
                                      type="radio"
                                      value="no"
                                      name="medicacion_permanente"
                                      className="form-check-input"
                                      {...register('medicacion_permanente')}
                                    />
                                    No
                                  </label>
                                </div>
                                <div className="form-check-inline col-8" style={{ display: 'inline-flex' }} >
                                  <label className="form-check-label">
                                    ¿Cuál/es?
                                  </label>
                                  <textarea
                                    className="form-control"
                                    rows={1}
                                    cols={30}
                                    defaultValue={""}
                                    style={{ resize: 'none' }}
                                    {...register('medicacion_permanente_nombres')}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="col-12 col-md-12 col-xl-12">
                              <label>¿Tienes atenciones previas en el departamento de salud mental?</label>
                              <div className="form-group select-gender">
                                <div className="form-check-inline col-2 col-md-1 col-xl-1">
                                  <label className="form-check-label">
                                    <input
                                      type="radio"
                                      name="atenciones_previas_salud_mental"
                                      className="form-check-input"
                                      {...register('atenciones_previas_salud_mental')}
                                    />
                                    Si
                                  </label>
                                </div>
                                <div className="form-check-inline col-6 col-md-2 col-xl-2">
                                  <label className="form-check-label">
                                    <input
                                      type="radio"
                                      name="atenciones_previas_salud_mental"
                                      className="form-check-input"
                                      {...register('atenciones_previas_salud_mental')}
                                    />
                                    No
                                  </label>
                                </div>
                                <div className="form-check-inline col-8" style={{ display: 'inline-flex' }} >
                                  <label className="form-check-label">
                                    Describe
                                  </label>
                                  <textarea
                                    className="form-control"
                                    rows={1}
                                    cols={30}
                                    defaultValue={""}
                                    style={{ resize: 'none' }}
                                    {...register('atenciones_previas_salud_mental')}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="col-12 col-md-12 col-xl-12">
                              <label>¿Has estado en tratamientos previos en salud mental? ¿Cuánto tiempo y de qué tipo?</label>
                              <div className="form-group select-gender">
                                <div className="form-check-inline col-2 col-md-1 col-xl-1">
                                  <label className="form-check-label">
                                    <input
                                      type="radio"
                                      name="tratamientos_previos_salud_mental"
                                      className="form-check-input"
                                      {...register('tratamientos_previos_salud_mental')}
                                    />
                                    Si
                                  </label>
                                </div>
                                <div className="form-check-inline col-6 col-md-2 col-xl-2">
                                  <label className="form-check-label">
                                    <input
                                      type="radio"
                                      name="tratamientos_previos_salud_mental"
                                      className="form-check-input"
                                      {...register('tratamientos_previos_salud_mental')}
                                    />
                                    No
                                  </label>
                                </div>
                                <div className="form-check-inline col-8" style={{ display: 'inline-flex' }} >
                                  <label className="form-check-label">
                                    Describe
                                  </label>
                                  <textarea
                                    className="form-control"
                                    rows={1}
                                    cols={30}
                                    defaultValue={""}
                                    style={{ resize: 'none' }}
                                    {...register('tratamientos_previos_salud_mental')}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="col-12 col-md-12 col-xl-12">
                              <label>¿Actualmente estás con algún tratamiento en salud mental?</label>
                              <div className="form-group select-gender">
                                <div className="form-check-inline col-2 col-md-1 col-xl-1">
                                  <label className="form-check-label">
                                    <input
                                      type="radio"
                                      name="tratamiento_actual_salud_mental"
                                      className="form-check-input"
                                      {...register('tratamiento_actual_salud_mental')}
                                    />
                                    Si
                                  </label>
                                </div>
                                <div className="form-check-inline col-6 col-md-2 col-xl-2">
                                  <label className="form-check-label">
                                    <input
                                      type="radio"
                                      name="tratamiento_actual_salud_mental"
                                      className="form-check-input"
                                      {...register('tratamiento_actual_salud_mental')}
                                    />
                                    No
                                  </label>
                                </div>
                                <div className="form-check-inline col-8" style={{ display: 'inline-flex' }} >
                                  <label className="form-check-label">
                                    ¿De qué tipo?
                                  </label>
                                  <textarea
                                    className="form-control"
                                    rows={1}
                                    cols={30}
                                    defaultValue={""}
                                    style={{ resize: 'none' }}
                                    {...register('tratamiento_actual_salud_mental')}
                                  />
                                </div>
                              </div>
                            </div>


                            {/* Consumo de alcohol y/o drogas */}
                            <div className="col-12">
                              <div className="form-heading">
                                <h4>a) Consumo de alcohol y/o drogas</h4>
                              </div>
                            </div>

                            {/* Consumo de alcohol */}

                            <div className="col-12 col-md-12 col-xl-12">
                              <div className="form-group select-gender">
                                <label>¿Consumes alcohol?</label>
                                <div className="form-check-inline">
                                  <label className="form-check-label">
                                    <input
                                      type="radio"
                                      name="consume_alcohol"
                                      value="si"
                                      className="form-check-input"
                                      {...register('consume_alcohol')}
                                    />
                                    Si
                                  </label>
                                </div>
                                <div className="form-check-inline">
                                  <label className="form-check-label">
                                    <input
                                      type="radio"
                                      name="consume_alcohol"
                                      value="no"
                                      className="form-check-input"
                                      {...register('consume_alcohol')}
                                    />
                                    No
                                  </label>
                                </div>
                                <div className="form-check-inline">
                                  <label className="form-check-label">
                                    <input
                                      type="radio"
                                      name="alcohol"
                                      value="ocasional"
                                      className="form-check-input"
                                      {...register('alcohol_ocasional')}
                                    />
                                    Ocasional
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="col-12 col-md-6 col-xl-6">
                              <div className="form-group local-forms">
                                <label>
                                  ¿Qué tipo?
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  {...register('tipo_alcohol_consumido')}
                                />
                              </div>
                            </div>
                            <div className="col-12 col-md-6 col-xl-6">
                              <div className="form-group local-forms">
                                <label>
                                  Frecuencia en que consumes
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  {...register('frecuencia_consumo_alcohol')}
                                />
                              </div>
                            </div>

                            {/* Consumo de drogas */}
                            <div className="col-12 col-md-12 col-xl-12">
                              <div className="form-group select-gender">
                                <label>¿Consumes drogas? </label>
                                <div className="form-check-inline">
                                  <label className="form-check-label">
                                    <input
                                      type="radio"
                                      name="consume_drogas"
                                      className="form-check-input"
                                      {...register('consume_drogas')}
                                    />
                                    Si
                                  </label>
                                </div>
                                <div className="form-check-inline">
                                  <label className="form-check-label">
                                    <input
                                      type="radio"
                                      name="consume_drogas"
                                      className="form-check-input"
                                      {...register('consume_drogas')}
                                    />
                                    No
                                  </label>
                                </div>
                                <div className="form-check-inline">
                                  <label className="form-check-label">
                                    <input
                                      type="radio"
                                      name="consume_drogas"
                                      className="form-check-input"
                                      {...register('consume_drogas')}
                                    />
                                    Ocasional
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="col-12 col-md-6 col-xl-6">
                              <div className="form-group local-forms">
                                <label>
                                  ¿Qué tipo?
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  {...register('tipo_drogas_consumidas')}
                                />
                              </div>
                            </div>
                            <div className="col-12 col-md-6 col-xl-6">
                              <div className="form-group local-forms">
                                <label>
                                  Frecuencia en que consumes
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  {...register('frecuencia_consumo_drogas')}
                                />
                              </div>
                            </div>

                            {/* Riesgo suicida */}
                            <div className="col-12">
                              <div className="form-heading">
                                <h4>b) Riesgo suicida</h4>
                              </div>
                            </div>
                            <div className="col-12 col-md-12 col-xl-12">
                              <div className="form-group local-forms">
                                <label>
                                  Aplicar escala riesgo suicida
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  {...register('riesgo_suicida_escala')}
                                />
                              </div>
                            </div>


                            {/*  <div className="col-12 col-md-4 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Nombre y apellido
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              {...register('contacto_uno_nombre')}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-4 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Parentesco o relación
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              {...register('contacto_uno_relacion')}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-4 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Teléfono
                            </label>
                            <input
                              className="form-control"
                              // value={rut}
                              type="text"
                              {...register('contacto_uno_telefono')}
                            />
                          </div>
                        </div>


                        <div className="col-12 col-md-4 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Nombre y apellido
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              {...register('contacto_dos_nombre')}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-4 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Parentesco o relación
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              {...register('contacto_dos_relacion')}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-4 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Teléfono
                            </label>
                            <input
                              className="form-control"
                              // value={rut}
                              type="text"
                              {...register('contacto_dos_telefono')}
                            />
                          </div>
                        </div> */}
                          </div>
                        </AccordionDetails>
                      </Accordion>
                      {/* 5. Motivo de consulta */}
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header">
                          <div className="col-12">
                            <div className="form-heading">
                              <h4>5. Motivo de consulta</h4>
                            </div>
                          </div>
                        </AccordionSummary>
                        <AccordionDetails>
                          <div className="row">
                            <div className="col-12 col-md-12 col-xl-12">
                              <div className="form-group local-forms">
                                <label>
                                  Descripción motivo de consulta
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  {...register('motivo_consulta')}
                                />
                              </div>
                            </div>
                            <div className="col-12 col-md-12 col-xl-12">
                              <div className="form-group local-forms">
                                <label>
                                  Sintomatología asociada al motivo de consulta
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  {...register('sintomatologia_motivo_consulta')}
                                />
                              </div>
                            </div>
                            <div className="col-12 col-md-12 col-xl-12">
                              <div className="form-group local-forms">
                                <label>
                                  ¿Cuál es tu expectativa con respecto a la atención en nuestro departamento?
                                </label>
                                <input
                                  className="form-control"
                                  // value={rut}
                                  type="text"
                                  {...register('expectativas_departamento')}
                                />
                              </div>
                              <div className="col-12 col-md-12 col-xl-12">
                                <div className="form-group local-forms">
                                  <label>Área de atención de preferencia del/la estudiante<span className="login-danger">*</span>
                                  </label>
                                  <Controller
                                    control={control}
                                    name="area_atencion_preferencia"
                                    {...register('area_atencion_preferencia')}
                                    ref={null}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                      <Select
                                        instanceId="area_atencion_preferencia"
                                        defaultValue={selectedOption}
                                        onChange={onChange}
                                        options={area_atencion}
                                        // menuPortalTarget={document.body}
                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                        id="area_atencion_preferencia"
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
                            </div>

                          </div>
                        </AccordionDetails>
                      </Accordion>
                      {/* 6. Antecedentes académicos */}
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header">
                          <div className="col-12">
                            <div className="form-heading">
                              <h4>6. Antecedentes académicos</h4>
                            </div>
                          </div>
                        </AccordionSummary>
                        <AccordionDetails>
                          <div className="row">
                            <div className="col-12 col-md-12 col-xl-12">
                              <label>¿Es tu primera carrera?</label>
                              <div className="form-group select-gender">
                                <div className="form-check-inline col-2 col-md-1 col-xl-1">
                                  <label className="form-check-label">
                                    <input
                                      type="radio"
                                      name="primera_carrera"
                                      className="form-check-input"
                                      {...register('primera_carrera')}
                                    />
                                    Si
                                  </label>
                                </div>
                                <div className="form-check-inline col-6 col-md-2 col-xl-2">
                                  <label className="form-check-label">
                                    <input
                                      type="radio"
                                      name="primera_carrera"
                                      className="form-check-input"
                                      {...register('primera_carrera')}
                                    />
                                    No
                                  </label>
                                </div>
                                <div className="form-check-inline col-8" style={{ display: 'inline-flex' }} >
                                  <label className="form-check-label">
                                    Si es no, ¿qué estudiaste antes?
                                  </label>
                                  <textarea
                                    className="form-control"
                                    rows={1}
                                    cols={30}
                                    defaultValue={""}
                                    style={{ resize: 'none' }}
                                    {...register('primera_carrera')}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="col-12 col-md-12 col-xl-12">
                              <label>¿Te sientes satisfecho/a con tu decisión de carrera actual?</label>
                              <div className="form-group select-gender">
                                <div className="form-check-inline col-2 col-md-1 col-xl-1">
                                  <label className="form-check-label">
                                    <input
                                      type="radio"
                                      name="satisfecho_decision_carrera"
                                      className="form-check-input"
                                      {...register('satisfecho_decision_carrera')}
                                    />
                                    Si
                                  </label>
                                </div>
                                <div className="form-check-inline col-6 col-md-2 col-xl-2">
                                  <label className="form-check-label">
                                    <input
                                      type="radio"
                                      name="satisfecho_decision_carrera"
                                      className="form-check-input"
                                      {...register('satisfecho_decision_carrera')}
                                    />
                                    No
                                  </label>
                                </div>
                                <div className="form-check-inline col-6 col-md-2 col-xl-2">
                                  <label className="form-check-label">
                                    <input
                                      type="radio"
                                      name="satisfecho_decision_carrera"
                                      className="form-check-input"
                                      {...register('satisfecho_decision_carrera')}
                                    />
                                    Aún no lo sé
                                  </label>
                                </div>
                              </div>
                            </div>


                            <div className="col-12 col-md-12 col-xl-12">
                              <label>¿Cómo consideras que ha sido tu desempeño hasta ahora?</label>
                              <div className="form-group select-gender">
                                <div className="form-check-inline col-2 col-md-1 col-xl-1">
                                  <label className="form-check-label">
                                    <input
                                      type="radio"
                                      name="desempeno_academico"
                                      className="form-check-input"
                                      {...register('desempeno_academico')}
                                    />
                                    Bueno
                                  </label>
                                </div>
                                <div className="form-check-inline col-6 col-md-2 col-xl-2">
                                  <label className="form-check-label">
                                    <input
                                      type="radio"
                                      name="desempeno_academico"
                                      className="form-check-input"
                                      {...register('desempeno_academico')}
                                    />
                                    Malo
                                  </label>
                                </div>
                                <div className="form-check-inline col-6 col-md-2 col-xl-2">
                                  <label className="form-check-label">
                                    <input
                                      type="radio"
                                      name="desempeno_academico"
                                      className="form-check-input"
                                      {...register('desempeno_academico')}
                                    />
                                    Regular
                                  </label>
                                </div>
                              </div>
                            </div>

                            <div className="col-12 col-md-12 col-xl-12">
                              <label>
                                ¿Cuál ha sido el principal desafío al que te has enfrentado en la universidad?
                              </label>
                              <div className="form-group local-forms">

                                <textarea
                                  className="form-control"
                                  rows={2}
                                  cols={30}
                                  defaultValue={""}
                                  style={{ resize: 'none' }}
                                  {...register('desafio_enfrentado_universidad')}
                                />
                              </div>
                            </div>

                          </div>
                        </AccordionDetails>
                      </Accordion>
                      {/* 7. Redes de apoyo disponibles */}
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header">
                          <div className="col-12">
                            <div className="form-heading">
                              <h4>7. Redes de apoyo disponibles</h4>
                            </div>
                          </div>
                        </AccordionSummary>
                        <AccordionDetails>
                          <div className="row">
                            <div className="col-12 col-md-12 col-xl-12">
                              <div className="form-group local-forms">
                                <label>
                                  ¿Cuentas con personas significativas que te apoyen hoy en día? ¿Quiénes son?
                                </label>

                                <textarea
                                  className="form-control"
                                  rows={2}
                                  cols={30}
                                  defaultValue={""}
                                  style={{ resize: 'none' }}
                                  {...register('redes_apoyo_personas_significativas')}
                                />
                              </div>
                            </div>

                            <div className="col-12 col-md-12 col-xl-12">
                              <div className="form-group local-forms">
                                <label>Área de atención de preferencia del/la estudiante<span className="login-danger">*</span>
                                </label>
                                <Controller
                                  control={control}
                                  name="tipos_apoyo_actual"
                                  {...register('tipos_apoyo_actual')}
                                  ref={null}
                                  render={({ field: { onChange, onBlur, value } }) => (
                                    <Select
                                      isMulti
                                      instanceId="tipos_apoyo_actual"
                                      defaultValue={selectedOption}
                                      onChange={onChange}
                                      options={tipo_apoyo}
                                      // menuPortalTarget={document.body}
                                      styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                      id="tipos_apoyo_actual"
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

                          </div>
                        </AccordionDetails>
                      </Accordion>
                      {/* 8. Intereses y autocuidado */}
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header">
                          <div className="col-12">
                            <div className="form-heading">
                              <h4>8. Intereses y autocuidado </h4>
                            </div>
                          </div>
                        </AccordionSummary>
                        <AccordionDetails>
                          <div className="row">
                            <div className="col-12 col-md-12 col-xl-12">
                              <div className="form-group local-forms">
                                <label>
                                  ¿Qué tipo de actividades te gusta realizar? ¿Les dedicas tiempo?
                                </label>
                                <textarea
                                  className="form-control"
                                  rows={2}
                                  cols={30}
                                  defaultValue={""}
                                  style={{ resize: 'none' }}
                                  {...register('actividades_gustan_realizar')}
                                />
                              </div>
                            </div>

                            <div className="col-12 col-md-12 col-xl-12">
                              <div className="form-group local-forms">
                                <label>
                                  ¿Tienes espacios de autocuidado? ¿Cómo cuáles?
                                </label>
                                <textarea
                                  className="form-control"
                                  rows={2}
                                  cols={30}
                                  defaultValue={""}
                                  style={{ resize: 'none' }}
                                  {...register('espacios_autocuidado')}
                                />
                              </div>
                            </div>

                            <div className="col-12 col-md-12 col-xl-12">
                              <div className="form-group local-forms">
                                <label>
                                  ¿Dedicas tiempo para descansar? Promedio de horas dedicadas a dormir
                                </label>
                                <textarea
                                  className="form-control"
                                  rows={2}
                                  cols={30}
                                  defaultValue={""}
                                  style={{ resize: 'none' }}
                                  {...register('tiempo_descanso_horas_sueno')}
                                />
                              </div>
                            </div>

                            <div className="col-12 col-md-12 col-xl-12">
                              <div className="form-group local-forms">
                                <label>
                                  ¿Cómo te alimentas? Describe un día de alimentación habitual
                                </label>
                                <textarea
                                  className="form-control"
                                  rows={2}
                                  cols={30}
                                  defaultValue={""}
                                  style={{ resize: 'none' }}
                                  {...register('alimentacion_diaria_habitual')}
                                />
                              </div>
                            </div>

                          </div>
                        </AccordionDetails>
                      </Accordion>
                      {/* Evaluación profesional */}
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header">
                          <div className="col-12">
                            <div className="form-heading">
                              <h4>9. Evaluación profesional <small>(se completa luego de la entrevista)</small></h4>
                            </div>
                          </div>
                        </AccordionSummary>
                        <AccordionDetails>
                          <div className="row">
                            <div className="col-12 col-md-12 col-xl-12">
                              <label>Modalidad de atención a la cual accede según evaluación</label>
                              <div className="form-group local-forms">
                                <Controller
                                  control={control}
                                  name="modalidad_atencion_evaluacion"
                                  {...register('modalidad_atencion_evaluacion')}
                                  ref={null}
                                  render={({ field: { onChange, onBlur, value } }) => (
                                    <Select
                                      isMulti
                                      instanceId="modalidad_atencion_evaluacion"
                                      defaultValue={selectedOption}
                                      onChange={onChange}
                                      options={modalidad}
                                      // menuPortalTarget={document.body}
                                      styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                      id="modalidad_atencion_evaluacion"
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

                            <div className="col-12 col-md-12 col-xl-12">
                              <label>
                                Estado de ánimo/ Afectividad (presencia o no de sintomatología asociada a ansiedad/ depresión/ manía, entre otras)
                              </label>
                              <div className="form-group local-forms">
                                <textarea
                                  className="form-control"
                                  rows={2}
                                  cols={30}
                                  defaultValue={""}
                                  style={{ resize: 'none' }}
                                  {...register('estado_animo_afectividad')}
                                />
                              </div>
                            </div>


                            <div className="col-12 col-md-12 col-xl-12">
                              <label>
                                Tipo de pensamiento observado (organizado, desorganizado, obsesivo, entre otros)
                              </label>
                              <div className="form-group local-forms">
                                <textarea
                                  className="form-control"
                                  rows={2}
                                  cols={30}
                                  defaultValue={""}
                                  style={{ resize: 'none' }}
                                  {...register('tipo_pensamiento_observado')}
                                />
                              </div>
                            </div>


                            <div className="col-12 col-md-12 col-xl-12">
                              <div className="form-group local-forms">
                                <label>
                                  Detección de posibles condiciones asociadas a déficit cognitivo (TEA, TDHA)
                                </label>
                                <textarea
                                  className="form-control"
                                  rows={2}
                                  cols={30}
                                  defaultValue={""}
                                  style={{ resize: 'none' }}
                                  {...register('deteccion_condiciones_deficit_cognitivo')}
                                />
                              </div>
                            </div>


                            <div className="col-12 col-md-12 col-xl-12">
                              <div className="form-group local-forms">
                                <label>
                                  Consciencia de realidad (presencia de delirios, percepción alterada)
                                </label>
                                <textarea
                                  className="form-control"
                                  rows={2}
                                  cols={30}
                                  defaultValue={""}
                                  style={{ resize: 'none' }}
                                  {...register('consciencia_realidad')}
                                />
                              </div>
                            </div>


                            <div className="col-12 col-md-12 col-xl-12">
                              <div className="form-group local-forms">
                                <label>
                                  Autoconcepto y autoestima
                                </label>
                                <textarea
                                  className="form-control"
                                  rows={2}
                                  cols={30}
                                  defaultValue={""}
                                  style={{ resize: 'none' }}
                                  {...register('autoconcepto_autoestima')}
                                />
                              </div>
                            </div>


                            <div className="col-12 col-md-12 col-xl-12">
                              <div className="form-group local-forms">
                                <label>
                                  Situaciones de riesgo a nivel relacional
                                </label>
                                <textarea
                                  className="form-control"
                                  rows={2}
                                  cols={30}
                                  defaultValue={""}
                                  style={{ resize: 'none' }}
                                  {...register('situaciones_riesgo_relacional')}
                                />
                              </div>
                            </div>

                            <div className="col-12 col-md-12 col-xl-12">
                              <div className="form-group local-forms">
                                <label>
                                  Situaciones de riesgo a nivel personal
                                </label>
                                <textarea
                                  className="form-control"
                                  rows={2}
                                  cols={30}
                                  defaultValue={""}
                                  style={{ resize: 'none' }}
                                  {...register('situaciones_riesgo_personal')}
                                />
                              </div>
                            </div>

                            <div className="col-12 col-md-12 col-xl-12">
                              <div className="form-group local-forms">
                                <label>
                                  Observaciones
                                </label>
                                <textarea
                                  className="form-control"
                                  rows={4}
                                  cols={30}
                                  defaultValue={""}
                                  style={{ resize: 'none' }}
                                  {...register('observaciones')}
                                />
                              </div>
                            </div>

                          </div>
                        </AccordionDetails>
                      </Accordion>
                      <div className="col-12">
                        <div className="doctor-submit text-end">
                          <button
                            // type="submit"
                            className="btn btn-primary submit-form me-2"
                            onClick={(e) => { handleInterview(e) }}
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

        </div>
      </>
    </ProtectedPage>
  );
};

export default AddInterviewRecord;
