'use client'
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
// import Headerudp from "../Headerudp";
import Sidebar from "@/components/Sidebar"
import { imagesend } from "@/components/imagepath";
import { DatePicker } from "antd";
import FeatherIcon from "feather-icons-react";
// import { Link, useParams } from "react-router-dom";
import Link from "next/link";
import dayjs from "dayjs";
import Select from "react-select";
import { TextField, Alert } from "@mui/material";
import { useForm, Controller, useController } from 'react-hook-form';
import { fetchAppointment, changeStatusAppointment, fetchAppointments } from "@/services/AppointmentsServices";
import { fetchProfessionals } from "@/services/DoctorsServices";
import { fetchUsers, fetchUserByEmail } from "@/services/UsersServices";

import { useSidebar } from "@/context/SidebarContext";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import ProtectedPage from "@/components/ProtectedRoutes";
import withAuth from '@/components/withAuth';
import CacheHandler from "@/utils/cache-handler";

const cacheHandler = new CacheHandler();

const EditAppoinments = ({ params }) => {
  const { data: session, status } = useSession()
  const userRole = session?.user?.rol
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [show, setShow] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [appointment, setAppointment] = useState('');
  const [dataPatient, setDatapatient] = useState('')
  const [success, setSuccess] = useState('initial')
  const { setProps } = useSidebar();

  const [speciality, setSpeciality] = useState([
    { value: "Psicopedagogía", label: "Psicopedagogía", name: "speciality" },
    { value: "Psicología", label: "Psicología", name: "speciality" },
    { value: "Psiquiatría", label: "Psiquiatría", name: "speciality" },
    { value: "Trabajo Social", label: "Trabajo Social", name: "speciality" },
  ]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [profesional, setProfesional] = useState([]);

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
        name: doc.nombre + ' ' + doc.apellido
      }
    })
    setProfesional(docs)
  }

  const formatearHora = (hora) => {
    const [h, m, s] = hora.split(':').map(Number);
    const horaFormateada = [
      String(h).padStart(2, '0'),
      String(m).padStart(2, '0'),
      String(s).padStart(2, '0')
    ].join(':');
    return horaFormateada;
  }

  const getAppointments = async () => {
    try {
      const response = await fetchAppointments()
      const filteredResponse = response.filter(item => (item.id_cita == params.appointmentId) /* && (item.id_profesional == session.user?.id) */)
      console.log(filteredResponse)
      const obj = {
        speciality: filteredResponse[0].especialidad_profesional,
        appointment_date: dayjs(filteredResponse[0]['fecha']).format('YYYY-MM-DD'),
        start_time: formatearHora(filteredResponse[0]['hora']),
        // end_time: horaFin,
        id: filteredResponse[0].id_cita,
        email: filteredResponse[0].email_estudiante,
        name: filteredResponse[0]['nombre_alumno'].split(' ')[0],
        lastName: filteredResponse[0]['nombre_alumno'].split(' ')[1],
        selected_doctor: filteredResponse[0].nombre_profesional,
        female: filteredResponse[0].genero === 'femenino' ? 'on' : null,
        male: filteredResponse[0].genero === 'masculino' ? 'on' : null,
        other: filteredResponse[0].genero === 'otro' ? 'on' : null,
        mobile: filteredResponse[0].telefono_estudiante
      }
      if (filteredResponse.length === 0) {
      } else {
        setDatapatient(obj)
        return obj;
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchDataProfessionals()
    // getAppointments()
  }, [])

  // const { register, handleSubmit, watch, control,
  //   formState: { errors }
  // } = useForm({
  //   defaultValues: async () => await getAppointments()
  // })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: async () => {
      if (status === "loading") {
        return {}; // Retorna un objeto vacío mientras se carga la sesión
      }
      if (!session) {
        router.push("/"); // Redirige si no hay sesión
        return {}; // Detiene la ejecución
      }

      setLoading(true); // Indica que la carga está en progreso
      try {
        const data = await getAppointments();
        return data
      } catch (error) {
        console.error("Error al cargar datos:", error);
        return { data: [] };
      } finally {
        setLoading(false); // Finaliza la carga
      }
    },
  });

  // const { field } = useController({ name: 'especialidad', control })

  const onChange = (date, dateString) => {
    // console.log(date, dateString);
  };
  const loadFile = (event) => {
    // Handle file loading logic here
  };

  const onSubmit = handleSubmit(async data => {
    setSuccess('initial')
    try {
      const patientByEmail = await fetchUserByEmail(data.email)

      data.validacion = patientByEmail.validacion
      data.alumndo_id = patientByEmail.id

      const status = session.user?.rol === 'alumno' ? 'cancelada por alumno' : 'cancelada por profesional'
      if (data.status === "status") {
        try {
          const response = await changeStatusAppointment(data.id, status)
          console.log('response', response)
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
    }

    // return updateAppointment({ ...data, "patient_id": patient[0].id }, id)
  })

  return (
    <div>
      {/* <Headerudp /> */}
      {/* <Sidebar
        id="menu-item4"
        id1="menu-items4"
        activeClassName="edit-appoinment"
      /> */}
      <>
        <div className="page-wrapper mt-5 pt-5">
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
                            <input
                              disabled
                              className="form-control"
                              type="tel"
                              maxLength={9}
                              minLength={9}
                              // defaultValue="+1 23 456890"
                              {...register('mobile', {
                                required: {
                                  value: true,
                                  message: 'Teléfono es requerido'
                                }
                              })}
                            />
                            {errors.mobile && <span><small>{errors.mobile.message}</small></span>}
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
                        <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms cal-icon">
                            <label>
                              Fecha de la Cita{" "}
                              <span className="login-danger">*</span>
                            </label>
                            <Controller
                              control={control}
                              name="appointment_date"
                              {...register('appointment_date', {
                                required: {
                                  value: true,
                                  message: 'Fecha es requerido',
                                }
                              })}
                              ref={null}
                              render={({ field: { onChange, onBlur, value } }) => (
                                <input
                                  disabled={userRole === 'profesional' ? false : true}
                                  className="form-control datetimepicker"
                                  type="date"
                                  defaultValue={value}
                                />
                                // <DatePicker
                                //   className="form-control datetimepicker"
                                //   onChange={onChange}
                                //   suffixIcon={null}

                                // // value={appoinmentDate['fecha_cita']}
                                // />
                              )}
                            />
                            {
                              errors.appointment_date && <span><small>{errors.appointment_date.message}</small></span>
                            }
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Desde <span className="login-danger">*</span>
                            </label>
                            <div className="">
                              <TextField
                                disabled={userRole === 'profesional' ? false : true}
                                className="form-control"
                                id="outlined-controlled"
                                type="time"
                                // value={startTime}
                                name='start_time'
                                onChange={(event) => {
                                  setStartTime(event.target.value);
                                }}
                                {...register('start_time', {
                                  required: {
                                    value: true,
                                    message: 'Hora es requeruda'
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
                              {...register('selected_doctor', {
                                required: {
                                  value: true,
                                  message: 'Profesional es requerido',
                                }
                              })}
                              ref={null}
                              render={({ field: { onChange, onBlur, value } }) => {
                                return (
                                  <Select
                                    isDisabled={userRole === 'profesional' ? false : true}
                                    value={profesional.find(option => option.name === value) || value}
                                    onChange={(option) => onChange(option.value)}
                                    instanceId={'select_doctor'}
                                    options={profesional}
                                    // menuPortalTarget={document.body}
                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                    id="selected_doctor"
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
                                return (
                                  <Select
                                    isDisabled={userRole === 'profesional' ? false : true}
                                    instanceId={'especialidadprofesional'}
                                    value={speciality.find(option => option.value === value) || null}
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
                        {/*     <div className="col-12 col-sm-12">
                          <div className="form-group local-forms">
                            <label>
                              Notas <span className="login-danger">*</span>
                            </label>
                            <textarea
                              disabled={userRole === 'profesional' ? false : true}
                              className="form-control"
                              rows={3}
                              cols={30}
                            />
                          </div>
                        </div> */}

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
                              onClick={onSubmit}
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
