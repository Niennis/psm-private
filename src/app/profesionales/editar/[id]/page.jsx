'use client'
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { redirect, useRouter } from 'next/navigation';
import Link from "next/link";
import { useSession } from "next-auth/react";
import Select from "react-select";
import { useForm, Controller } from 'react-hook-form'
import { addEspecialidad, fetchProfessionalById, fetchSpecialityById, changeEspecialidad, updateProfesional, changePassword } from "@/services/DoctorsServices";

import withAuth from '@/components/withAuth';
import CacheHandler from "@/utils/cache-handler";
import { Alert } from "@mui/material";

import { useSidebar } from "@/context/SidebarContext";
import { especialidades, genero } from "@/utils/selects";
import { formatDateToYYYYMMDD } from "@/utils/managedata";

import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import { Eye, EyeOff } from "feather-icons-react/build/IconComponents";
import { fetchUserByEmail } from "@/services/UsersServices";
import SimpleBackdrop from "@/components/Backdrop";

const cacheHandler = new CacheHandler();

const EditDoctor = ({ params }) => {
  const { data: session } = useSession()
  const router = useRouter();
  const { setProps } = useSidebar();

  if (!session) {
    redirect('/');
  }
  const userId = params.id;
  if (session.user.id != userId && session?.user?.rol !== "administrador") {
    redirect('/profesionales');
  }

  const [success, setSuccess] = useState('initial')
  const [error, setError] = useState('')
  const [initial, setInitial] = useState({})
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialProfesional, setInitialProfesional] = useState('')
  const [selectedOption, setSelectedOption] = useState(null);

  const [speciality, setSpeciality] = useState([
    { value: "", label: "", name: "", id: 0 },
    { value: "Psicopedagogía", label: "Psicopedagogía", name: "speciality", id: 1 },
    { value: "Psicología", label: "Psicología", name: "speciality", id: 2 },
    { value: "Psiquiatría", label: "Psiquiatría", name: "speciality", id: 3 },
    { value: "Trabajo Social", label: "Trabajo Social", name: "speciality", id: 4 },
    { value: "Practicante Psicología", label: "Practicante Psicología", name: "speciality", id: 5 },
    { value: "Practicante Psicopedagogía", label: "Practicante Psicopedagogía", name: "speciality", id: 6 },
    { value: "Practicante Psiquiatría", label: "Practicante Psiquiatría", name: "speciality", id: 7 },
    { value: "Practicante Trabajo Social", label: "Practicante Trabajo Social", name: "speciality", id: 8 },
  ]);

  useEffect(() => {
    setProps({
      id: "menu-item1",
      id1: "menu-items1",
      activeClassName: "edit-doctor",
    });
  }, [setProps]);

  const [show, setShow] = useState(false);
  const onChange = (date, dateString) => {
  };
  const loadFile = (event) => {
    // Handle file loading logic here
  };

  // DATOS PRECARGADOS
  const fetchInitialData = async () => {
    setLoading(true)
    try {
      let user;
      const { especialidades: especialidad } = await fetchSpecialityById(params.id);
      if (params.id == session?.user?.id) {
        user = await fetchUserByEmail(session?.user?.email)
      } else {
        const usersData = await fetchProfessionalById(params.id);
        user = usersData.users[0];
      }
      const obj = {
        ...user,
        name: user.nombre,
        lastName: user.apellido,
        mobile: user.telefono || "",
        email: user.email,
        dateOfBirth: user.fecha_nacimiento,
        genero: user.genero,
        speciality: especialidad[0]?.especialidad || 'No informada',
        status: user.status,
        password: user.contrasena,
        confirmPassword: user.contrasena
      };
      setInitial(obj)

      return obj
    } catch (error) {
      console.error("Error fetching initial data:", error);
      return {};
    } finally{
      setLoading(false)
    }
  };

  const { register, handleSubmit, watch, control, getValues, setValue,
    formState: { errors, dirtyFields }, reset
  } = useForm({
    defaultValues: async () => await fetchInitialData()
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const formatDateToYYYYDDMM = dateString => {
    const timestamp = Date.parse(dateString);
    const date = new Date(timestamp);

    const formattedDate = date.toISOString().split("T")[0];
    return formattedDate
  }

  const statusPass = (data) => {
    const pass = data.password
    const confirmPass = data.confirmPassword
    if (data.mustChangePassword === 1 && pass && confirmPass && pass === confirmPass) {
      return 0
    } else {
      return data.mustChangePassword
    }
  }

  const mobileValue = watch('mobile'); // Observar cambios en el valor de 'mobile' 
  useEffect(() => {
    setValue('mobile', mobileValue);
  }, [mobileValue, setValue]);

  // FUNCIÓN UPDATE

  // FUNCIÓN UPDATE
  const createUserPayload = (data) => ({
    id: data.id,
    id_emergencia: 0,
    id_emergencia_2: 0,
    anoIngresoCarrera: '0',
    apellido: data.lastName || initial.apellido,
    aplica_despeje: '0',
    campus: 'ambas',
    carrera: 'Psicopedagogia',
    comuna: 'santiago',
    contrasena: (data.password && data.confirmPassword && data.password === data.confirmPassword) ? data.password : undefined,
    direccion: 'random',
    email: initial.email,
    entrevistador: '1',
    fecha_nacimiento: formatDateToYYYYMMDD(initial.fecha_nacimiento),
    genero: data.genero || initial.genero,
    jornada: 'laboral',
    mustChangePassword: initial.mustChangePassword || 0,
    nombre: data.name || initial.nombre,
    nombre_social: data.nombre_social || initial.nombre_social || initial.nombre,
    region: 'santiago',
    rut: '12345678-9',
    status: data.status || initial.status,
    telefono: data.mobile,
    tipo_usuario: initial.tipo_usuario,
  });

  const createPasswordPayload = (data) => ({
    contrasena: data.password,
    id_user: initial.id
  });

  const handleEspecialidad = async (data, especialidades) => {
    // Verificar si hay una especialidad seleccionada
    const newEspecialidad = data.speciality ? especialidades.filter(item => item.value === data.speciality) : [];
    const prevEspecialidad = initial.speciality ? especialidades.filter(item => item.value === initial.speciality) : [];

    // Determinar qué función usar y con qué payload
    if (newEspecialidad.length > 0) {
      // Si hay una nueva especialidad seleccionada
      const especialidadId = newEspecialidad[0].id;

      // Si el usuario ya tenía una especialidad, actualizar
      if (prevEspecialidad.length > 0) {
        const updatePayload = {
          id_user: initial.id,
          id_especialidad: especialidadId
        };
        // validacion y detalle
        return await changeEspecialidad(updatePayload);
      }
      // Si no tenía especialidad, crear nueva
      else {
        const createPayload = {
          id: initial.id,
          especialidad_id: especialidadId
        };
        // message , validacion y detalle
        return await addEspecialidad(createPayload);
      }
    }
    // Si no hay especialidad nueva pero había una previa, mantener la previa
    else if (prevEspecialidad.length > 0) {
      const updatePayload = {
        id_user: initial.id,
        id_especialidad: prevEspecialidad[0].id
      };
      // validacion y detalle
      return await changeEspecialidad(updatePayload);
    }

    // Si no hay especialidad nueva ni previa, retornar un resultado "exitoso"
    // ya que no hay cambios en especialidad que hacer
    return { validacion: true };
  };

  const updateAll = async (userPayload, passwordPayload, data, especialidades) => {
    try {
      // Manejo de especialidad
      const respEspecialidad = await handleEspecialidad(data, especialidades);

      // Actualización de usuario y contraseña
      const [respProfesional, respPass] = await Promise.all([
        updateProfesional(userPayload),
        changePassword(passwordPayload)
      ]);

      return {
        success: respProfesional.validacion && (respEspecialidad.validacion || respEspecialidad.message) && respPass.validacion,
        errors: [
          respProfesional.validacion === false && respProfesional.detalle,
          respEspecialidad.validacion === false && respEspecialidad.detalle,
          respPass.validacion === false && respPass.detalle
        ].filter(Boolean)
      };
    } catch (error) {
      throw new Error(`Problema con el servicio: ${error.message}`);
    }
  };

  const updatePasswordOnly = async (passwordPayload) => {
    try {
      const response = await changePassword(passwordPayload);
      return {
        success: response.validacion === true,
        errors: response.validacion === false ? [response.detalle] : []
      };
    } catch (error) {
      throw new Error(`Ocurrió un problema: ${error.message}`);
    }
  };

  const updateUserAndEspecialidad = async (userPayload, data, especialidades) => {
    try {
      // Manejo de especialidad
      const respEspecialidad = await handleEspecialidad(data, especialidades);

      // Actualización de usuario
      const respProfesional = await updateProfesional(userPayload);

      return {
        success: respProfesional.validacion && (respEspecialidad.validacion || respEspecialidad.message),
        errors: [
          respProfesional.validacion === false && respProfesional.detalle,
          respEspecialidad.validacion === false && respEspecialidad.detalle
        ].filter(Boolean)
      };
    } catch (error) {
      throw new Error(`Problema con el servicio: ${error.message}`);
    }
  };

  // FUNCIÓN UPDATE
  const handleEdit = handleSubmit(async (data, e) => {
    e.preventDefault();

    try {
      const isPasswordValid = data.password && data.confirmPassword && data.password === data.confirmPassword;
      const hasChanges = Object.keys(dirtyFields).length > 0;

      const userPayload = createUserPayload(data, initial);
      const passwordPayload = createPasswordPayload(data, initial);

      let result;

      if (hasChanges && isPasswordValid) {
        // Actualizar todos: datos, especialidad y contraseña
        result = await updateAll(userPayload, passwordPayload, data, especialidades);

      } else if (isPasswordValid) {
        // Actualizar solo contraseña
        result = await updatePasswordOnly(passwordPayload);

      } else if (hasChanges) {
        // Actualizar datos y/o especialidadRF
        result = await updateUserAndEspecialidad(userPayload, data, especialidades);
      }

      if (result.success) {
        setSuccess('success');
      } else {
        setSuccess('fail');
        setError(`Ocurrió un problema: ${result.errors.join(' ')}`);
      }
    } catch (error) {
      setSuccess('fail');
      setError(`${error.message}. Vuelve a intentar más tarde.`);
    }
  });

  const handleClose = () => {
    router.push('/profesionales');
    setSuccess('initial');
  };

  // const handleEdit = handleSubmit(async (data, e) => {
  //   e.preventDefault()

  //   const match = data.password === data.confirmPassword;

  //   const body = {
  //     id: data.id,
  //     id_emergencia: 0,
  //     id_emergencia_2: 0,
  //     anoIngresoCarrera: '0',
  //     apellido: data.lastName || initial.apellido,
  //     aplica_despeje: '0',
  //     campus: 'ambas',
  //     carrera: 'No informada',
  //     comuna: 'santiago',
  //     contrasena: (data.password && data.confirmPassword && match) && data.password,
  //     direccion: 'random',
  //     email: initial.email,
  //     entrevistador: '1',
  //     fecha_nacimiento: formatDateToYYYYMMDD(initial.fecha_nacimiento),
  //     genero: data.genero || initial.genero,
  //     jornada: 'laboral',
  //     mustChangePassword: initial.mustChangePassword || 0,
  //     nombre: data.name || initial.nombre,
  //     nombre_social: data.nombre_social || initial.nombre_social || initial.nombre,
  //     region: 'santiago',
  //     rut: '12345678-9',
  //     status: data.status || initial.status,
  //     telefono: data.mobile,
  //     tipo_usuario: initial.tipo_usuario,
  //   };

  //   const editPass = {
  //     contrasena: data.password,
  //     id_user: initial.id
  //   }

  //   const prevEspecialidad = especialidades.filter(item => item.value === initial.speciality)
  //   const newEspecialidad = especialidades.filter(item => item.value === data.speciality)

  //   const bodyEspecialidad = {
  //     id_user: initial.id,
  //     id_especialidad: newEspecialidad[0]?.id || prevEspecialidad[0]?.id
  //   }

  //   // CAMBIA TODOS LOS DATOS Y/O ESPECIALIDAD + CONTRASEÑA
  //   if (Object.keys(dirtyFields).length > 0 && (data.password && data.confirmPassword && data.password === data.confirmPassword)) {

  //     try {
  //       const [respProfesional, respEspecialidad, respPass] = await Promise.all([
  //         updateProfesional(body), changeEspecialidad(bodyEspecialidad), changePassword(editPass)
  //       ])

  //       if (respProfesional.validacion === true && respEspecialidad.validacion === true && respPass.validacion === true) {
  //         setSuccess('success')
  //       } else {
  //         setSuccess('fail')
  //         setError(`Ocurrió un problema: 
  //           ${respProfesional.validacion === false && respProfesional.detalle} 
  //           ${respEspecialidad.validacion === false && respEspecialidad.detalle}
  //           ${respPass.validacion === false && respPass.detalle}
  //            `)
  //       }
  //     } catch (error) {
  //       setSuccess('fail')
  //       setError(`Problema con el servicio: ${error.message}. Vuelve a intentar más tarde.`)
  //     }
  //   }

  //   //  CAMBIA SOLO CONTRASEÑA
  //   else if (data.password && data.confirmPassword && data.password === data.confirmPassword) {
  //     try {
  //       const response = await changePassword(editPass)
  //       if (response.validacion === true) {
  //         setSuccess('success')
  //       } else {
  //         setSuccess('fail')
  //         setError(`Ocurrió un problema: ${response.detalle}`)
  //       }
  //     } catch (error) {
  //       setSuccess('fail')
  //       setError(`Ocurrió un problema: ${error.message}. Intenta más tarde`)
  //     }
  //   }

  //   // CAMBIA EL RESTO DE CAMPOS Y/O ESPECIALIDAD
  //   else {
  //     try {
  //       const [respProfesional, respEspecialidad] = await Promise.all([
  //         updateProfesional(body), changeEspecialidad(bodyEspecialidad)
  //       ])

  //       if (respProfesional.validacion === true && respEspecialidad.validacion === true) {
  //         setSuccess('success')
  //       } else {
  //         setSuccess('fail')
  //         setError(`Ocurrió un problema:
  //           ${respProfesional.validacion === false && respProfesional.detalle} 
  //           ${respEspecialidad.validacion === false && respEspecialidad.detalle}
  //           `)
  //       }
  //     } catch (error) {
  //       setSuccess('fail')
  //       setError(`Problema con el servicio: ${error.message}. Vuelve a intentar más tarde.`)
  //     }
  //   }
  // })


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
                      <Link href="#">Profesionales </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="feather-chevron-right">
                        <FeatherIcon icon="chevron-right" />
                      </i>
                    </li>
                    <li className="breadcrumb-item active">Editar Profesional</li>
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
                            <h4>Detalles del Profesional</h4>
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group local-forms">
                            <label>
                              Nombre <span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              // defaultValue="Daniel"
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
                              // defaultValue="Bruk"
                              {...register('lastName')}
                            />
                          </div>
                        </div>
                        {/* <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              User Name <span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              defaultValue="Daniel Bruk"
                            />
                          </div>
                        </div> */}
                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group local-forms">
                            <label>
                              Teléfono
                            </label>

                            <div className="input-group">
                              <div className="input-group-prepend">
                                <span className="input-group-text">+56</span>
                              </div>
                              <input
                                className="form-control"
                                // onChange={handleTelefonoChange}
                                type="tel"
                                {...register('mobile', {
                                  validate: (value) => {
                                    if (value.length === 0) {
                                      return true; // Permitir valores vacíos
                                    }
                                    return value.length === 9 || "Cantidad de caracteres debe ser igual a 9, o dejar vacío."; // Validar longitud
                                  },
                                })}
                                maxLength={9}
                                minLength={0}
                              />
                            </div>
                            {errors.mobile && <span><small>{errors.mobile.message}</small></span>}
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group local-forms">
                            <label>
                              Email <span className="login-danger">*</span>
                            </label>
                            <input
                              disabled
                              className="form-control"
                              type="email"
                              // defaultValue="example@email.com"
                              {...register('email', {
                                pattern: {
                                  value: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
                                  message: 'Correo no es válido'
                                }
                              })}
                            />

                          </div>
                        </div>

                        {/* SELECT ESPECIALIDAD */}
                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group local-forms">
                            <label>
                              Especialidad <span className="login-danger">*</span>
                            </label>
                            <Controller
                              control={control}
                              name="speciality"
                              ref={null}
                              render={({ field: { onChange, onBlur, value } }) => {
                                return (
                                  <Select
                                    value={especialidades.find(option => option.value === value) || value}
                                    onChange={(option) => {
                                      onChange(option.value)
                                    }}
                                    options={especialidades}
                                    id="speciality"
                                    components={{
                                      IndicatorSeparator: () => null
                                    }}
                                    isDisabled={session?.user?.rol !== 'administrador'}
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

                        {/* FECHA NACIMIENTO */}
                        {/*  <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group local-forms cal-icon">
                            <label>
                              Fecha de nacimiento h{" "}
                              <span className="login-danger">*</span>
                            </label>
                            <Controller
                              control={control}
                              name="dateOfBirth"
                              {...register('dateOfBirth', {
                                required: {
                                  value: true,
                                  message: 'Fecha es requerido',
                                }
                              })}
                              ref={null}
                              render={({ field: { onChange, onBlur, value } }) => (

                                <DatePicker
                                  className="form-control datetimepicker"
                                  onChange={onChange}
                                  suffixIcon={null}
                                />
                              )}
                            />

                          </div>
                        </div> */}

                        {/* GENERO */}
                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group select-gender">
                            <label className="gen-label">
                              Género<span className="login-danger">*</span>
                            </label>
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                <input
                                  type="radio"
                                  name="genero"
                                  value="hombre"
                                  className="form-check-input"
                                  defaultChecked={initial.genero === 'Hombre'}
                                  {...register('genero')}
                                />
                                Hombre
                              </label>
                            </div>
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                <input
                                  type="radio"
                                  name="genero"
                                  value="mujer"
                                  className="form-check-input"
                                  defaultChecked={initial.genero === "Mujer"}
                                  {...register('genero')}
                                />
                                Mujer
                              </label>
                            </div>
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                <input
                                  type="radio"
                                  name="genero"
                                  value="hombre trans"
                                  className="form-check-input"
                                  defaultChecked={initial.genero === 'Hombre trans'}
                                  {...register('genero')}
                                />
                                Hombre trans
                              </label>
                            </div>
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                <input
                                  type="radio"
                                  name="genero"
                                  value="mujer trans"
                                  className="form-check-input"
                                  defaultChecked={initial.genero === 'Mujer trans'}
                                  {...register('genero')}
                                />
                                Mujer trans
                              </label>
                            </div>
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                <input
                                  type="radio"
                                  name="genero"
                                  value="no binarie"
                                  className="form-check-input"
                                  defaultChecked={initial.genero === 'No binarie'}
                                  {...register('genero')}
                                />
                                No binarie
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Contraseña */}
                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group local-forms">
                            <label>
                              Contraseña <span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type={passwordVisible ? 'password' : ''}
                              placeholder=""
                              name="password"
                              {...register('password', {
                                minLength: {
                                  value: 8,
                                  message: 'Contraseña debe tener al menos 8 caracteres'
                                },
                                validate:
                                  value => {
                                    if (value) {
                                      const regex = /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/;
                                      return regex.test(value) || 'La contraseña debe contener al menos un caracter especial, un número y una mayúscula';
                                    } return true
                                  }
                              })}
                            />

                            <span
                              className="toggle-password"
                              onClick={togglePasswordVisibility}
                            >
                              {passwordVisible ? <EyeOff className="react-feather-custom" /> : <Eye className="react-feather-custom" />}
                            </span>
                            {errors.password && <span className="login-danger">
                              <small>{errors.password.message}</small>
                            </span>}
                          </div>
                        </div>

                        {/* Confirmar contraseña */}
                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group local-forms">
                            <label>
                              Confirmar contraseña{" "}
                              <span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type={passwordVisible ? 'password' : ''}
                              placeholder=""
                              {...register('confirmPassword', {
                                validate: value => {
                                  if (value) {
                                    return (value === watch('password') || 'Las contraseñas no coinciden')
                                  } return true
                                }
                              })}
                            />
                            <span
                              className="toggle-password"
                              onClick={togglePasswordVisibility}
                            >
                              {passwordVisible ? <EyeOff className="react-feather-custom" /> : <Eye className="react-feather-custom" />}
                            </span>
                            {errors.confirmPassword && <span className="login-danger">
                              <small>{errors.confirmPassword.message}</small>
                            </span>}
                          </div>
                        </div>
                        {
                          session?.user?.rol == "administrador" &&
                          <div className="col-12 col-md-6 col-xl-6">
                            <div className="form-group select-gender">
                              <label className="gen-label">
                                Estado <span className="login-danger">*</span>
                              </label>
                              <div className="form-check-inline">
                                <label className="form-check-label">
                                  <input
                                    disabled={session?.user?.rol !== "administrador"}
                                    type="radio"
                                    value="activo"
                                    className="form-check-input"
                                    // defaultChecked={initial.status === 'activo'}
                                    {...register('status')}
                                  />
                                  Activo
                                </label>
                              </div>
                              <div className="form-check-inline">
                                <label className="form-check-label">
                                  <input
                                    disabled={session?.user?.rol !== "administrador"}
                                    type="radio"
                                    value="inactivo"
                                    // defaultChecked={initial.status === 'inactivo'}
                                    className="form-check-input"
                                    {...register('status')}
                                  />
                                  Inactivo
                                </label>
                              </div>
                            </div>
                          </div>
                        }
                        <div className="col-12">
                          <div className="doctor-submit text-end">
                            <button
                              type="button"
                              className="btn btn-primary submit-form me-2"
                              onClick={handleEdit}
                            >
                              Actualizar
                            </button>
                            <Link href={'/profesionales'}>
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
              onClose={() => { handleClose() }}
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
              Tus datos han sido actualizados.
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
                  {error}
                </Alert>
              </div>
            </div>
            : ''
        }
        {loading && <SimpleBackdrop />}
      </>
    </>
  );
};

// export default EditDoctor;
export default withAuth(EditDoctor, ['administrador', 'profesional']);
