'use client'
/* eslint-disable-next-line react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-duplicate-props */
import React, { useState, useEffect, use } from "react";
import Select from "react-select";

import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Link from 'next/link';
import { Accordion, AccordionSummary, AccordionDetails, Alert } from "@mui/material";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'; // Importa el plugin de UTC
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/es'

import { useSidebar } from "@/context/SidebarContext";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import withAuth from '@/components/withAuth';
import { useForm, Controller, useWatch } from 'react-hook-form';

import { showRecordById, showRecords } from "@/services/RecordServices";
import { fetchUser } from "@/services/UsersServices";
import { useUserContext } from "@/context/UserContext";
import { formatAndValidateRUT } from "@/utils/rutFormat";
import { updateUser } from "@/services/UsersServices";
import { createContact, editContact } from "@/services/AppointmentsServices";
import { isAssignedToProfessional } from "@/services/DoctorsServices";
import { regiones, comunas, motivo_consulta, carreras } from "@/utils/selects";
import { Button } from 'react-bootstrap'
import SimpleBackdrop from "@/components/Backdrop";

const FichaAlumno = () => {
  const { data: session, update } = useSession()
  const { setProps } = useSidebar();
  const [records, setRecords] = useState()
  const [patient, setPatient] = useState()
  const [visibleItem, setVisibleItem] = useState(null);
  const router = useRouter()
  const { selectedUserId } = useUserContext()
  const [success, setSuccess] = useState('initial')
  const [message, setMessage] = useState('')
  const [menuPortalTarget, setMenuPortalTarget] = useState(null);
  const [loading, setLoading] = useState(false)
  const [edad, setEdad] = useState('')

  dayjs.extend(utc);
  dayjs.extend(timezone)

  useEffect(() => {
    setProps({
      id: "menu-item8",
      id1: "menu-items8",
      activeClassName: "ficha",
    });
  }, [setProps]);

  useEffect(() => {
    setMenuPortalTarget(document.body);
  }, [])


  useEffect(() => {
    const checkAssignment = async () => {
      if (!selectedUserId || !session?.user?.id) return;

      // if (session.user.rol === "admin"  || session.user.rol === "blend") return; 
      const isAssigned = await isAssignedToProfessional(selectedUserId, session.user.id);

      if ((session.user.rol != 'alumno' && !isAssigned) || (session.user.rol == 'alumno' && selectedUserId != session.user.id)) {
        setSuccess('failAccess')
      }
    };

    checkAssignment();
  }, [selectedUserId, session?.user?.id, session?.user?.rol]);

  const { register, handleSubmit, watch, control, setValue, trigger, clearErrors,
    formState: { errors }
  } = useForm({
    mode: "onChange",
    reValidateMode: 'onChange',
    defaultValues: async () => {
      try {
        const data = await getStudent();
        return data
      } catch (error) {
        console.error("Error al cargar datos:", error);
        return { data: [] };
      }
    }
  })

  const fechaNacimiento = watch('fecha_nacimiento');
  useEffect(() => {
    if (fechaNacimiento) {
      setValue('fecha_nacimiento', fechaNacimiento);
      trigger('fecha_nacimiento').then((isValid) => {
        if (isValid) clearErrors('fecha_nacimiento');
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fechaNacimiento]);

  const rutValue = useWatch({ control, name: 'rut' });
  useEffect(() => {
    if (rutValue) {
      const { formattedRUT } = formatAndValidateRUT(rutValue);
      setValue('rut', formattedRUT, { shouldValidate: true });
    }

    const formattedAge = patient?.fecha_nacimiento ? calcularEdad(patient.fecha_nacimiento) : ''
    setEdad(formattedAge)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rutValue, setValue]);

  const getRecords = async () => {
    try {
      const { entrevista: response } = await showRecords(selectedUserId)
      const motivo_consulta = response[0]?.motivo_consulta || ''
      const recordsProcesados = response.map((record) => {
        return {
          ...record,
          motivo_consulta: motivo_consulta,
        }
      })
      const withDerivados = recordsProcesados.map(async (record) => {
        if (record.derivado) {
          const { users } = await fetchUser(record.derivado)

          return {
            ...record,
            nombre_derivado: `${users[0]?.nombre} ${users[0]?.apellido}` || '',
          }
        } else {
          return {
            ...record,
            nombre_derivado: ''
          }
        }
      })
      const promises = await Promise.all(withDerivados);
      setRecords(promises)
    } catch (error) {
      console.log(error)
    }
  }

  const convertirAInputDate = fechaTexto => {
    const fecha = dayjs.utc(fechaTexto).tz('America/Santiago', true);
    return fecha.format('YYYY-MM-DD');
  }

  const getStudent = async () => {
    try {
      const { users: student } = await fetchUser(selectedUserId)

      const patient = {
        anoIngresoCarrera: (() => {
          const valor = student[0].anoIngresoCarrera;
          const valorNumerico = parseInt(valor);
          return isNaN(valorNumerico) || valorNumerico < 1900 || valorNumerico.toString() !== valor.toString() ? '' : valor;
        })(),
        name: student[0].nombre,
        apellido: student[0].apellido,
        nombre_social: student[0]?.nombre_social || '',
        email: student[0]?.email,
        fecha_nacimiento: student[0].fecha_nacimiento
          ? convertirAInputDate(student[0].fecha_nacimiento)
          : '',
        genero: student[0].genero === 'personalizado' ? 'No binarie' : student[0].genero,
        telefono: student[0].telefono,
        aplica_despeje: student[0].aplica_despeje,
        rut: student[0].rut == 'NA' || student[0].rut == '0' || !student[0].rut ? '' : student[0].rut,
        carrera: student[0].carrera,
        address: student[0].direccion,
        region: student[0].region,
        comuna: student[0].comuna,
        direccion: student[0].direccion,
        contacto1_id: student[0].contacto1_id > 0 ? student[0].contacto1_id : 0,
        contacto1_email: student[0].contacto1_email === 'NA' ? '' : student[0].contacto1_email,
        contacto1_nombre: student[0].contacto1_nombre === 'NA' ? '' : student[0].contacto1_nombre,
        contacto1_numero: student[0].contacto1_numero === 'NA' ? '' : student[0].contacto1_numero,
        contacto1_relacion: student[0].contacto1_relacion === 'NA' ? '' : student[0].contacto1_relacion,
        contacto2_id: student[0].contacto2_id > 0 ? student[0].contacto2_id : 0,
        contacto2_email: student[0].contacto2_email === 'NA' ? '' : student[0].contacto2_email,
        contacto2_nombre: student[0].contacto2_nombre === 'NA' ? '' : student[0].contacto2_nombre,
        contacto2_numero: student[0].contacto2_numero === 'NA' ? '' : student[0].contacto2_numero,
        contacto2_relacion: student[0].contacto2_relacion === 'NA' ? '' : student[0].contacto2_relacion,
        tipo_usuario: student[0].tipo_usuario,
        status: student[0].status,
        nombre: student[0].nombre,
        id: student[0].id
      };

      setPatient(patient)
      return patient
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getRecords()
    getStudent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const toggleVisibility = (id) => {
    setVisibleItem(visibleItem === id ? null : id);
  };

  const formatearFecha = (fechaOriginal) => {
    const fecha = dayjs(fechaOriginal).locale('es').utc();

    // Usamos el formato 'ddd, DD-MM-YYYY' para incluir el día de la semana
    const fechaFormateada = fecha.format('ddd, DD-MM-YYYY'); // 'lun., 15-04-2024'

    // Corregimos el punto y ponemos solo la primera letra en mayúscula
    const fechaFinal = fechaFormateada.replace('.', '').replace(/^\w/, (match) => match.toUpperCase());

    return fechaFinal; // 'Lun, 15-04-2024'
  }

  const toTitleCase = str => {
    return str
      .toLowerCase() // Convertir todo a minúsculas primero
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalizar la primera letra de cada palabra
  }

  const handleUpdate = handleSubmit(async data => {
    setLoading(true)

    const bodyUpdateUser = {
      "apellido": data.lastName || patient?.apellido,
      "aplica_despeje": data.aplica_despeje,
      "anoIngresoCarrera": data.anoIngresoCarrera || patient?.anoIngresoCarrera,
      "campus": data.campus || 'No aplica',
      "comuna": data.comuna.label || patient?.comuna,
      "carrera": data.carrera.label || patient?.carrera,
      "contrasena": 'No aplica',
      "direccion": data.direccion || patient?.direccion,
      "email": data.email,
      "entrevistador": 0,
      "fecha_nacimiento": data.fecha_nacimiento || patient?.fecha_nacimiento,
      "genero": data.genero || patient?.genero,
      "id": parseInt(patient?.id),
      "jornada": 'No aplica',
      "mustChangePassword": 0,
      "nombre": patient?.nombre,
      "nombre_social": data.nombre_social || patient?.nombre_social,
      "region": data.region.label || patient?.region,
      "rut": data.rut || patient?.rut || ' ',
      "status": patient?.status,
      "telefono": data.telefono || patient?.telefono,
      "tipo_usuario": patient?.tipo_usuario,
      "id_emergencia": patient?.contacto1_id || 0,
      "id_emergencia_2": patient?.contacto2_id || 0,
    }

    const bodyContactOne = {
      "nombre": data?.contacto1_nombre || patient?.contacto1_nombre || '',
      "relacion": data?.contacto1_relacion || patient?.contacto1_relacion || '',
      "numero": data?.contacto1_numero || patient?.contacto1_numero || '',
      "mail": data?.contacto1_email || patient?.mail_contacto_emergencia1 || '',
      "parentesco": data?.contacto1_relacion || patient?.contacto1_relacion || '',
      "id_emergencia": patient?.contacto1_id || 0
    }

    const bodyContactTwo = {
      "nombre": data?.contacto2_nombre || patient?.contacto2_nombre || '',
      "relacion": data?.contacto2_relacion || patient?.contacto2_relacion || '',
      "numero": data?.contacto2_numero || patient?.contacto2_numero || '',
      "mail": data?.contacto2_email || patient?.mail_contacto_emergencia2 || '',
      "parentesco": data?.contacto2_relacion || patient?.contacto2_relacion || '',
      "id_emergencia": patient?.contacto2_id || 0
    }

    let id_contact_1;
    let id_contact_2;

    try {
      const response1 = patient.contacto1_id == 0
        ? await createContact(bodyContactOne)
        : await editContact(bodyContactOne)

      const response2 = patient.contacto2_id == 0
        ? await createContact(bodyContactTwo)
        : await editContact(bodyContactTwo)

      id_contact_1 = patient.contacto1_id == 0
        ? response1.id
        : patient?.contacto1_id

      id_contact_2 = patient.contacto2_id == 0
        ? response2.id
        : patient?.contacto2_id

    } catch (error) {
      console.log(error)
      setSuccess('fail')
      const detail1 = `${response1?.message}.` || ''
      const detail2 = `${response2?.message}.` || ''
      setMessage(`${detail1}${detail2}`)
    }
    bodyUpdateUser.id_emergencia = id_contact_1
    bodyUpdateUser.id_emergencia_2 = id_contact_2

    if (id_contact_1 > 0 || id_contact_2 > 0) {
      try {
        const response = await updateUser(bodyUpdateUser)
        await update();
        if (response.validacion === true) {
          setSuccess('success')
          setMessage('Datos actualizados con éxito.')
        } else {
          setSuccess('fail')
          if (response?.detalle.includes('fecha_nacimiento')) {
            setMessage('Error al registrar la fecha. Revisa que el formato sea similar a 01-01-2025, día-mes-año')
          } else {
            setMessage(response?.detalle)
          }
        }
      } catch (error) {
        console.log('Error: ', error);
        setSuccess('fail')
        if (response?.detalle.includes('fecha_nacimiento')) {
          setMessage('Error al registrar la fecha. Revisa que el formato sea similar a 01-01-2025, día-mes-año')
        } else {
          setMessage('Ocurrió un problema.')
        }
      } finally {
        setLoading(false)
      }
    }
  })

  const parsearFecha = (fechaStr) => {
    // Extraer día, mes y año manualmente

    const partes = fechaStr.split(/[-/]/);
    if (partes.length !== 3) return null;

    const [dia, mes, anio] = partes.map(Number);
    return new Date(anio, mes - 1, dia);
  };


  const calcularEdad = (fechaStr) => {
    const fecha = dayjs(fechaStr, 'DD-MM-YYYY', true); // true = modo estricto

    if (!fecha.isValid()) return "";
    setEdad(dayjs().diff(fecha, 'year'))
    return dayjs().diff(fecha, 'year');
  };

  const convertDateFormat = (dateString) => {
    const [day, month, year] = dateString.split("-");
    return `${year}-${month}-${day}`;
  }

  const openWarning = (e) => {
    e.preventDefault()
    setSuccess('warning')
    setMessage('¿Confirma la actualización de su información?')
  }

  const handleClose = () => {
    setSuccess('initial')
    if (session?.user?.rol !== 'alumno') {
      router.push('/pacientes')
    } else {
      router.push('/citas')
    }
  }

  const handleCloseModal = () => {
    setSuccess('initial')
  }


  return (
    <>
      {loading && <SimpleBackdrop />}
      <div className="sidebar-overlay" data-reff="" style={{ zIndex: 98 }} />
      <div className="main-wrapper">
        <div className="page-wrapper">
          <div className="content">
            {/* Page Header */}
            <div className="page-header">
              <div className="row">
                <div className="col-sm-12">
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="#">Fichas </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="feather-chevron-right">
                        <FeatherIcon icon="chevron-right" />
                      </i>
                    </li>
                    <li className="breadcrumb-item active">Ficha Estudiante</li>
                  </ul>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-12">
                        <div className="form-heading">
                          <h4>Estudiante</h4>
                        </div>
                      </div>

                      {/* Nombre estudiante */}
                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="form-group local-forms">
                          <label className="col-md-6 col-form-label">
                            Nombre estudiante <span className="login-danger">*</span>
                          </label>
                          <div className="col-md-12">
                            <input
                              disabled={patient?.nombre ? true : false}
                              type="text"
                              className="form-control"
                              {...register('nombre', {
                                required: {
                                  value: true,
                                  message: 'Nombre es requerido'
                                },
                              })}
                            />
                          </div>
                          {
                            errors.nombre && <span><small>{errors.nombre.message}</small></span>
                          }
                        </div>
                      </div>


                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="form-group local-forms">
                          <label className="col-md-6 col-form-label">
                            Nombre social
                          </label>
                          <div className="col-md-12">
                            <input
                              type="text"
                              className="form-control"
                              {...register('nombre_social')}
                              disabled={!!(patient?.nombre_social && patient?.nombre_social.trim() !== "")}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="form-group local-forms">
                          <label className="col-md-6 col-form-label">
                            Apellido <span className="login-danger">*</span>
                          </label>
                          <div className="col-md-12">
                            <input
                              disabled={patient?.apellido ? true : false}
                              type="text"
                              className="form-control"
                              {...register('apellido', {
                                required: {
                                  value: true,
                                  message: 'Apellido es requerido'
                                },
                              })}
                            />
                          </div>
                          {
                            errors.apellido && <span><small>{errors.apellido.message}</small></span>
                          }
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="form-group local-forms">
                          <label className="col-md-6 col-form-label">
                            Email estudiante
                          </label>
                          <div className="col-md-12">
                            <input
                              type="email"
                              className="form-control"
                              value={patient && patient?.email || ""}
                              disabled
                            />
                          </div>
                        </div>
                      </div>

                      <div className="card-body">

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
                            <div className="row">

                              <div className="col-12 col-md-6 col-xl-6">
                                <div className="form-group local-forms">
                                  <label>Rut <span className="login-danger">*</span></label>
                                  <input
                                    disabled={patient?.rut ? true : false}
                                    className="form-control"
                                    maxLength={12}
                                    type="text"
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
                                      required: {
                                        value: true,
                                        message: 'Rut es requerido'
                                      },
                                      validate: (value) => formatAndValidateRUT(value).isValid || "RUT inválido",
                                    })}
                                  />
                                  {
                                    errors.rut && <span><small>{errors.rut.message}</small></span>
                                  }
                                </div>
                              </div>

                              <div className="col-12 col-md-6 col-xl-6">
                                <div className="form-group local-forms">
                                  <label>Fecha de nacimiento <span className="login-danger">*</span></label>
                                  <input
                                    disabled={patient?.fecha_nacimiento ? true : false}
                                    className="form-control datetimepicker"
                                    type="date"
                                    placeholder=""
                                    {...register('fecha_nacimiento', {
                                      required: {
                                        value: true,
                                        message: 'Fecha de nacimiento es requerida'
                                      }
                                    })}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      calcularEdad(value);
                                      setValue('fecha_nacimiento', value, { shouldValidate: true });
                                    }}
                                  />
                                  {
                                    errors.fecha_nacimiento && <span><small>{errors.fecha_nacimiento.message}</small></span>
                                  }
                                </div>
                              </div>

                              <div className="col-12 col-md-6 col-xl-6">
                                <div className="form-group local-forms">
                                  <label>Edad</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={edad}
                                    disabled
                                  />
                                </div>
                              </div>

                              <div className="col-12 col-md-6 col-xl-6">
                                <div className="form-group local-forms">
                                  <label>Teléfono <span className="login-danger">*</span></label>
                                  <div className="input-group">
                                    <div className="input-group-prepend">
                                      <span className="input-group-text">+56</span>
                                    </div>
                                    <input
                                      disabled={patient?.telefono && patient?.telefono != 0 ? true : false}
                                      type="tel"
                                      className="form-control"
                                      maxLength={9}
                                      minLength={9}
                                      onKeyDown={(e) => {
                                        // Solo permite números, '+', '-', '(', ')' y teclas de control
                                        if (!/[0-9+\-()]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                                          e.preventDefault();
                                        }
                                      }}
                                      {...register('telefono', {
                                        required: {
                                          value: true,
                                          message: 'Teléfono es requerido'
                                        },
                                        validate: (value) =>
                                          value.length === 9 || "Cantidad de caracteres debe ser igual a 9",
                                      })}
                                    />
                                  </div>
                                  {
                                    errors.telefono && <span><small>{errors.telefono.message}</small></span>
                                  }
                                </div>
                              </div>


                              <div className="col-12 col-md-6 col-xl-6">
                                <div className="form-group local-forms">
                                  <label>Carrera <span className="login-danger">*</span></label>
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
                                      if (patient?.carrera) {
                                        selectedCarrera = carreras.find(c =>
                                          c.label === patient.carrera || c.value === patient.carrera
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

                                      const isDisabled = !!patient?.carrera && carreras.some(opt =>
                                        opt.label === patient.carrera ||
                                        opt.value === patient.carrera
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

                              <div className="col-12 col-md-6 col-xl-6">
                                <div className="form-group local-forms">
                                  <label>Año de ingreso <span className="login-danger">*</span></label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    disabled={patient?.anoIngresoCarrera ? true : false}
                                    {...register('anoIngresoCarrera', {
                                      required: {
                                        value: true,
                                        message: 'Año de ingreso es requerido'
                                      },
                                    })}
                                  />
                                  {
                                    errors.anoIngresoCarrera && <span><small>{errors.anoIngresoCarrera.message}</small></span>
                                  }
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
                                      if (patient?.region) {
                                        // Buscamos el objeto completo que corresponde al LABEL de la base de datos
                                        // (por ejemplo, "Arica y Parinacota")
                                        selectedRegion = regiones.find(r =>
                                          r.label === patient.region || // Busca por label exacto
                                          r.value === patient.region    // O por value exacto
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
                                      // Solo deshabilitar si existe un valor válido en patient.region
                                      const isDisabled = !!patient?.region && regiones.some(opt =>
                                        opt.label === patient.region ||
                                        opt.value === patient.region
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
                                  {
                                    errors.region && <span><small>{errors.region.message}</small></span>
                                  }
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
                                      if (!normalizedRegionKey && patient?.region) {
                                        normalizedRegionKey = getRegionKey(patient.region);
                                      }

                                      // Obtener las opciones de comunas para la región actual
                                      const opcionesComunas = normalizedRegionKey ? comunas[normalizedRegionKey] || [] : [];

                                      // Determinar el valor seleccionado para el Select
                                      let selectedComuna = null;

                                      // Si hay un valor en el paciente que viene de la base de datos
                                      if (patient?.comuna) {
                                        // Buscamos el objeto completo que corresponde al label o value de la base de datos
                                        selectedComuna = opcionesComunas.find(c =>
                                          c.label === patient.comuna ||
                                          c.value === patient.comuna
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
                                      // Solo deshabilitar si existe un valor válido en patient.comuna
                                      const isDisabled = !!patient?.comuna &&
                                        opcionesComunas.some(opt =>
                                          opt.label === patient.comuna ||
                                          opt.value === patient.comuna
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
                                  {
                                    errors.comuna && <span><small>{errors.comuna.message}</small></span>
                                  }
                                </div>
                              </div>



                            </div>
                          </AccordionDetails>
                        </Accordion>

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
                                  <label>Nombre y apellido <span className="login-danger">*</span></label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    {...register('contacto1_nombre', {
                                      required: {
                                        value: true,
                                        message: 'Nombre de contacto es requerido'
                                      },
                                    })}
                                  />
                                  {
                                    errors.contacto1_nombre && <span><small>{errors.contacto1_nombre.message}</small></span>
                                  }
                                </div>
                              </div>
                              <div className="col-12 col-md-4 col-xl-4">
                                <div className="form-group local-forms">
                                  <label>Parentesco o relación <span className="login-danger">*</span></label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    {...register('contacto1_relacion', {
                                      required: {
                                        value: true,
                                        message: 'Parentesco o relación es requerido'
                                      },
                                    })}
                                  />
                                  {
                                    errors.contacto1_relacion && <span><small>{errors.contacto1_relacion.message}</small></span>
                                  }
                                </div>

                              </div>
                              <div className="col-12 col-md-4 col-xl-4">
                                <div className="form-group local-forms">
                                  <label>Teléfono <span className="login-danger">*</span></label>
                                  <div className="input-group">
                                    <div className="input-group-prepend">
                                      <span className="input-group-text">+56</span>
                                    </div>
                                    <input
                                      className="form-control"
                                      type="tel"
                                      onKeyDown={(e) => {
                                        // Solo permite números, '+', '-', '(', ')' y teclas de control
                                        if (!/[0-9+\-()]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                                          e.preventDefault();
                                        }
                                      }}
                                      {...register('contacto1_numero', {
                                        required: {
                                          value: true,
                                          message: 'Teléfono de contacto es requerido'
                                        },
                                        validate: (value) =>
                                          value.length === 9 || "Cantidad de caracteres debe ser igual a 9",
                                      })}
                                      maxLength={9}
                                      minLength={9}
                                    />
                                  </div>
                                  {
                                    errors.contacto1_numero && <span><small>{errors.contacto1_numero.message}</small></span>
                                  }
                                </div>
                              </div>

                              <div className="col-12 col-md-4 col-xl-4">
                                <div className="form-group local-forms">
                                  <label>Nombre y apellido</label>
                                  <input
                                    autoComplete="off"
                                    className="form-control"
                                    type="text"
                                    {...register('contacto2_nombre')}
                                  />
                                </div>
                              </div>
                              <div className="col-12 col-md-4 col-xl-4">
                                <div className="form-group local-forms">
                                  <label>Parentesco o relación</label>
                                  <input
                                    autoComplete="off"
                                    className="form-control"
                                    type="text"
                                    {...register('contacto2_relacion')}
                                  />
                                </div>
                              </div>
                              <div className="col-12 col-md-4 col-xl-4">
                                <div className="form-group local-forms">
                                  <label>Teléfono</label>
                                  <div className="input-group">
                                    <div className="input-group-prepend">
                                      <span className="input-group-text">+56</span>
                                    </div>
                                    <input
                                      autoComplete="off"
                                      className="form-control"
                                      type="tel"
                                      onKeyDown={(e) => {
                                        // Solo permite números, '+', '-', '(', ')' y teclas de control
                                        if (!/[0-9+\-()]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                                          e.preventDefault();
                                        }
                                      }}
                                      {...register('contacto2_numero', {
                                        required: {
                                          value: false,
                                        },
                                        validate: (value) => {
                                          value?.length === 0 || value?.length === 9 || "La cantidad de caracteres debe ser igual a 0 o 9."
                                        },
                                      })}
                                      maxLength={9}
                                      minLength={0}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </AccordionDetails>
                        </Accordion>

                        <div className="col-12">
                          <div className="doctor-submit text-end mt-3">
                            <button
                              // type="submit"
                              className="btn btn-primary submit-form me-2"
                              onClick={openWarning}
                            >
                              Actualizar datos
                            </button>
                          </div>
                        </div>


                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <div className="activity">
                      <div className="activity-box" style={{ contentVisibility: 'auto' }}>
                        <ul className="activity-list">


                          {
                            (session?.user?.rol === 'administrador' || session?.user?.rol === 'profesional' || session?.user?.rol === 'blend') && records && records.map((item, index) => (
                              <li key={item.id_alumno + index}>
                                {/* Fila principal con los datos generales */}
                                <div className="activity-user font-blue" style={{ top: '6px' }}>
                                  <i className="fas fa-circle"></i>
                                </div>
                                {index === 0 ? (
                                  <div className="activity-content timeline-group-blk">
                                    <div className="timeline-group flex-shrink-0">
                                      <h4>{formatearFecha(item.fecha)}</h4>
                                    </div>
                                    <div className="comman-activitys flex-grow-1">
                                      <h3>
                                        {item.numero_ficha} {" - "}
                                        Profesional Tratante: {toTitleCase(item?.profesional_evaluador)}
                                      </h3>

                                      <span>
                                        {" "}
                                        <strong>Motivo consulta: {item.motivo_consulta || ''}</strong>
                                      </span>


                                      <h3><span>Observaciones: {item?.observaciones?.replace("-Derivado externamente-", "").trim() || ''}</span></h3>
                                      {/* <h3><span>Acuerdos: {item.acuerdos || ''}</span></h3> */}

                                      {(item?.derivado || item?.observaciones?.includes("-Derivado externamente-")) && (
                                        <h3>
                                          <span>
                                            Derivado a:{" "}
                                            {[
                                              item?.derivado ? item.nombre_derivado : null,
                                              item?.observaciones?.includes("-Derivado externamente-") ? "Derivado externamente" : null
                                            ]
                                              .filter(Boolean)
                                              .join(" / ")}
                                          </span>
                                        </h3>
                                      )}

                                      <button
                                        className="btn btn-primary"
                                        onClick={() => toggleVisibility(index)}
                                      >
                                        {visibleItem === index ? "Ocultar detalles" : "Ver más "}
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="activity-content timeline-group-blk">
                                    <div className="timeline-group flex-shrink-0">
                                      <h4>{formatearFecha(item.fecha)}</h4>
                                    </div>
                                    <div className="comman-activitys flex-grow-1">
                                      <h3>
                                        {item.numero_ficha} {" - "}
                                        Profesional Tratante: {toTitleCase(item.profesional_evaluador)}
                                      </h3>

                                      {" "}
                                      <h3><span><strong>Observaciones:</strong> {item?.observaciones?.replace("-Derivado externamente-", "").trim() || ''}</span></h3>

                                      {" "}
                                      <h3><span><strong>Acuerdos:</strong> {item.acuerdos || ''}</span></h3>

                                      {(item?.derivado || item?.observaciones?.includes("-Derivado externamente-")) && (
                                        <h3>
                                          <span>
                                            Derivado a:{" "}
                                            {[
                                              item?.derivado ? item.nombre_derivado : null,
                                              item?.observaciones?.includes("-Derivado externamente-") ? "Derivado externamente" : null
                                            ]
                                              .filter(Boolean)
                                              .join(" / ")}
                                          </span>
                                        </h3>
                                      )}

                                      <button
                                        className="btn btn-primary"
                                        onClick={() => toggleVisibility(index)}
                                      >
                                        {visibleItem === index ? "Ocultar detalles" : "Ver más "}
                                      </button>
                                    </div>
                                  </div>
                                )
                                }
                                {/* Mostrar detalles en una tabla cuando el item es visible */}
                                {visibleItem === index && (
                                  <div className="activity-content timeline-group-blk mt-2">
                                    <div className="timeline-group flex-shrink-0"></div>
                                    <div className="comman-activitys flex-grow-1">
                                      {/* Tabla con datos específicos */}

                                      {/* Condición para verificar si es el primer elemento */}
                                      {index === 0 ? (
                                        <>

                                          <table className="table">
                                            <caption style={{ captionSide: "top" }}>Antecedentes sociales y familiares</caption>
                                            <tbody>
                                              <tr>
                                                <td><strong>Financiamiento carrera:</strong></td>
                                                <td style={{ width: '50%' }}>{item.financiamiento_carrera || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Dónde y con quién vives? Relación que tienes con ellos. ¿cómo te llevas con ellos?:</strong></td>
                                                <td>{item.vivienda_situacion_actual || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Tienes labores de cuidador? ¿A quién cuidas?:</strong></td>
                                                <td>{item.labores_cuidador || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿De qué manera financias tus gastos personales?:</strong></td>
                                                <td>{item.financiamiento_gastos_personales || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>En caso de que tuvieses que costear tratamiento externo, quién/es podrían apoyarte económicamente?:</strong></td>
                                                <td>{item.apoyo_economico_tratamiento || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Cuánto crees que podrías pagar para acceder a tratamiento semanalmente?:</strong></td>
                                                <td>{item.pago_tratamiento_semanal || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Te has realizado chequeos de salud durante el último año?:</strong></td>
                                                <td>{item.chequeos_salud_ultimo_ano || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Tienes alguna enfermedad de salud física?:</strong></td>
                                                <td>{item.enfermedad_salud_fisica || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Cuál?:</strong></td>
                                                <td>{item.diagnostico_salud_fisica || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Tienes algún diagnóstico de salud mental?:</strong></td>
                                                <td>{item.enfermedad_salud_mental || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Cuál?:</strong></td>
                                                <td>{item.diagnostico_salud_mental || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Tomas alguna medicación de manera permanente? (salud física y/o salud mental):</strong></td>
                                                <td>{item.medicacion_permanente || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Cuál/es?:</strong></td>
                                                <td>{item.medicacion_permanente_nombres || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Tienes atenciones previas en el departamento de salud mental?:</strong></td>
                                                <td>{item.atenciones_previas_salud_mental || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Has estado en tratamientos previos en salud mental? ¿Cuánto tiempo y de qué tipo?:</strong></td>
                                                <td>{item.tratamientos_previos_salud_mental || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Actualmente estás con algún tratamiento en salud mental?:</strong></td>
                                                <td>{item.tratamiento_actual_salud_mental || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Consumes alcohol?:</strong></td>
                                                <td>{item.consume_alcohol || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Qué tipo?:</strong></td>
                                                <td>{item.tipo_alcohol_consumido || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Frecuencia en que consumes:</strong></td>
                                                <td>{item.frecuencia_consumo_alcohol || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Consumes drogas?:</strong></td>
                                                <td>{item.consume_drogas || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Qué tipo?:</strong></td>
                                                <td>{item.tipo_drogas_consumidas || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Frecuencia en que consumes:</strong></td>
                                                <td>{item.frecuencia_consumo_drogas || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Aplicar escala riesgo suicida:</strong></td>
                                                <td>{item.riesgo_suicida_escala || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Descripción motivo de consulta:</strong></td>
                                                <td>{item.motivo_consulta || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Sintomatología asociada al motivo de consulta:</strong></td>
                                                <td>{item.sintomatologia_motivo_consulta || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Cuál es tu expectativa con respecto a la atención en nuestro departamento?:</strong></td>
                                                <td>{item.expectativas_departamento || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Área de atención de preferencia del/la estudiante:</strong></td>
                                                <td>{item.area_atencion_preferencia || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Es tu primera carrera?:</strong></td>
                                                <td>{item.primera_carrera || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Te sientes satisfecho/a con tu decisión de carrera actual?:</strong></td>
                                                <td>{item.satisfecho_decision_carrera || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Cómo consideras que ha sido tu desempeño hasta ahora?:</strong></td>
                                                <td>{item.desempeno_academico || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Cuál ha sido el principal desafío al que te has enfrentado en la universidad?:</strong></td>
                                                <td>{item.desafio_enfrentado_universidad || "N/A"}</td>
                                              </tr>
                                            </tbody>
                                          </table>

                                          <table className="table">
                                            <caption style={{ captionSide: "top" }}>Redes de apoyo disponibles</caption>
                                            <tbody>
                                              <tr>
                                                <td><strong>¿Cuentas con personas significativas que te apoyen hoy en día? ¿Quiénes son?:</strong></td>
                                                <td style={{ width: '50%' }}>{item.redes_apoyo_personas_significativas || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Tipos de apoyo:</strong></td>
                                                <td>{item.tipos_apoyo_actual || "N/A"}</td>
                                              </tr>
                                            </tbody>
                                          </table>

                                          <table className="table">
                                            <caption style={{ captionSide: "top" }}>Intereses y autocuidado</caption>
                                            <tbody>
                                              <tr>
                                                <td><strong>¿Qué tipo de actividades te gusta realizar? ¿Les dedicas tiempo?:</strong></td>
                                                <td style={{ width: '50%' }}>{item.actividades_gustan_realizar || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Tienes espacios de autocuidado? ¿Cómo cuáles?:</strong></td>
                                                <td>{item.espacios_autocuidado || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Dedicas tiempo para descansar? Promedio de horas dedicadas a dormir:</strong></td>
                                                <td>{item.tiempo_descanso_horas_sueno || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Cómo te alimentas? Describe un día de alimentación habitual:</strong></td>
                                                <td>{item.alimentacion_diaria_habitual || "N/A"}</td>
                                              </tr>
                                            </tbody>
                                          </table>

                                          <table className="table">
                                            <caption style={{ captionSide: "top" }}>Evaluación profesional</caption>
                                            <tbody>
                                              <tr>
                                                <td><strong>Modalidad de atención a la cual accede según evaluación:</strong></td>
                                                <td style={{ width: '50%' }}>{item.modalidad_atencion_evaluacion || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Estado de ánimo/ Afectividad (presencia o no de sintomatología asociada a ansiedad/ depresión/ manía, entre otras):</strong></td>
                                                <td>{item.estado_animo_afectividad || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Tipo de pensamiento observado (organizado, desorganizado, obsesivo, entre otros):</strong></td>
                                                <td>{item.tipo_pensamiento_observado || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Detección de posibles condiciones asociadas a déficit cognitivo (TEA, TDHA):</strong></td>
                                                <td>{item.deteccion_condiciones_deficit_cognitivo || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Consciencia de realidad (presencia de delirios, percepción alterada):</strong></td>
                                                <td>{item.consciencia_realidad || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Autoconcepto y autoestima:</strong></td>
                                                <td>{item.autoconcepto_autoestima || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Situaciones de riesgo a nivel relacional:</strong></td>
                                                <td>{item.situaciones_riesgo_relacional || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Situaciones de riesgo a nivel personal:</strong></td>
                                                <td>{item.situaciones_riesgo_personal || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Observaciones:</strong></td>
                                                <td>{item.observaciones || "N/A"}</td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </>
                                      ) : (
                                        <>
                                          <table className="table">
                                            <tbody>
                                              <tr>
                                                <td><strong>Motivo consulta:</strong></td>
                                                <td style={{ width: '50%' }}>{item.motivo_consulta || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Antecedentes generales:</strong></td>
                                                <td>{item.observaciones || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Acuerdos:</strong></td>
                                                <td>{item.acuerdos || "N/A"}</td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </>
                                      )}

                                    </div>
                                  </div>
                                )}
                              </li>
                            ))
                          }
                          {
                            (session?.user?.rol === 'alumno' && session?.user?.id == selectedUserId) && records && records.map((item, index) => (
                              <li key={item.id_alumno + index}>
                                {/* Fila principal con los datos generales */}
                                <div className="activity-user font-blue" style={{ top: '6px' }}>
                                  <i className="fas fa-circle"></i>
                                </div>
                                {index === 0 ? (
                                  <div className="activity-content timeline-group-blk">
                                    <div className="timeline-group flex-shrink-0">
                                      <h4>{formatearFecha(item.fecha)}</h4>
                                    </div>
                                    <div className="comman-activitys flex-grow-1">
                                      <h3>
                                        {item.numero_ficha} {" - "}
                                        Profesional Tratante: {toTitleCase(item.profesional_evaluador)}
                                      </h3>
                                      <span>
                                        {" "}
                                        <strong>Motivo consulta: {item.motivo_consulta || ''}</strong>
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="activity-content timeline-group-blk">
                                    <div className="timeline-group flex-shrink-0">
                                      <h4>{formatearFecha(item.fecha)}</h4>
                                    </div>
                                    <div className="comman-activitys flex-grow-1">
                                      <h3>
                                        {item.numero_ficha} {" - "}
                                        Profesional Tratante: {toTitleCase(item.profesional_evaluador)}
                                      </h3>

                                      {" "}
                                      <h3><span><strong>Acuerdos:</strong> {item.acuerdos || ''}</span></h3>

                                    </div>
                                  </div>
                                )}
                              </li>
                            ))
                          }
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div >

        </div >
      </div >

      {success === 'success' &&
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
            {message}
          </Alert>
          {/* </div> */}
        </div>

      }
      {success === 'fail' &&
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
              onClose={handleCloseModal}
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
              Ha ocurrido un problema. {message}
            </Alert>
          </div>
        </div>
      }

      {success === 'failAccess' &&
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
              No tienes acceso a esta ficha.
            </Alert>
          </div>
        </div>
      }
      {success === 'warning' &&
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
              severity="warning"
              onClose={handleCloseModal}
              sx={{
                zIndex: 'tooltip',
                position: 'absolute',
                left: '30%',
                width: '50%',
                padding: '50px',
                bottom: '50vh'
              }}
            // spacing={2}
            >
              <h4>{message}</h4>
              {
                Object.keys(errors).length > 0
                  ?
                  <> <h5>
                    <span><small>** Quedan campos sin rellenar</small></span>
                  </h5>
                  </>
                  :
                  <Button variant="primary" onClick={(e) => { handleUpdate(e) }}> Confirmar </Button>
              }
            </Alert>
          </div>
        </div>
      }
    </>
  );
};

export default withAuth(FichaAlumno, ['administrador', 'profesional', 'alumno', 'blend']);
