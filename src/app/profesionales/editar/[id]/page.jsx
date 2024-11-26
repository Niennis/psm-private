'use client'
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { redirect } from 'next/navigation';
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { favicon, imagesend } from "@/components/imagepath";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import { DatePicker } from "antd";
import Select from "react-select";
import { useForm, Controller } from 'react-hook-form'
import { fetchProfessionalById, fetchSpecialityById } from "@/services/DoctorsServices";
import { Eye, EyeOff } from "feather-icons-react/build/IconComponents";

import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import withAuth from '@/components/withAuth';
import { updateUser } from "@/services/UsersServices";
import CacheHandler from "@/utils/cache-handler";
import { Alert } from "@mui/material";

const cacheHandler = new CacheHandler();

const EditDoctor = ({ params }) => {
  const { data: session } = useSession()
  const router = useRouter();

  if (!session) {
    redirect('/citas');
  }

  const userId = params.id;
  if (session.user.id != userId) {
    redirect('/citas');
  }

  const [success, setSuccess] = useState('initial')
  const [error, setError] = useState('')

  const [initial, setInitial] = useState({})
  const [passwordVisible, setPasswordVisible] = useState(true);

  const [selectedOption, setSelectedOption] = useState(null);

  const [speciality, setSpeciality] = useState([
    { value: "Psicopedagogía", label: "Psicopedagogía", name: "speciality" },
    { value: "Psicología", label: "Psicología", name: "speciality" },
    { value: "Psiquiatría", label: "Psiquiatría", name: "speciality" },
    { value: "Trabajador social", label: "Trabajador social", name: "speciality" },
  ]);

  const [show, setShow] = useState(false);
  const onChange = (date, dateString) => {
    // console.log(date, dateString);
  };
  const loadFile = (event) => {
    // Handle file loading logic here
  };

  const fetchInitialData = async () => {
    try {
      const usersData = await fetchProfessionalById(params.id);
      // const speciality = await fetchSpecialityById(params.id); 
      const speciality = 'Trabajador social';

      const user = usersData.users[0];
      return {
        ...user,
        name: user.nombre,
        lastName: user.apellido,
        mobile: user.telefono,
        email: user.email,
        password: user.contrasena,
        confirmPassword: user.contrasena,
        dateOfBirth: user.fecha_nacimiento,
        gender: user.genero,
        speciality: speciality,
        status: user.status,
      };
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

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const onSubmit = handleSubmit(async (data) => {
    console.log('DATA', data)

    const formatDateToYYYYDDMM = dateString => {
      const timestamp = Date.parse(dateString);
      // console.log('timestamp', timestamp)
      // if (isNaN(timestamp)) {
      //   throw new Error("Formato de fecha no válido");
      // }

      // const date = new Date(timestamp);
      // const year = date.getFullYear();
      // const day = String(date.getDate()).padStart(2, '0');
      // const month = String(date.getMonth() + 1).padStart(2, '0');

      // return `${year}-${day}-${month}`;
      const date = new Date(timestamp);

      // Formatear la fecha a YYYY-MM-DD
      const formattedDate = date.toISOString().split("T")[0];
      return formattedDate
    }

    const pass = data.password === data.confirmPassword
    const body = {
      id: `${session.user.id}`,
      nombre: data.name,
      apellido: data.lastName,
      telefono: `${data.mobile}`,
      email: data.email,
      contrasena: pass && data.password,
      fecha_nacimiento: formatDateToYYYYDDMM(data.fecha_nacimiento),
      genero: data.gender,
      tipo_usuario: session.user.rol,
      status: 'activo',
      rut: '16332702-3',
      carrera: 'Psicopedagogia',
      anoIngresoCarrera: '0',
      jornada: 'laboral',
      direccion: 'random',
      region: 'santiago',
      comuna: 'santiago',
      entrevistador: '1',
      mustChangePassword: '0',
      aplica_despeje: '0',
      campus: 'ambas',
    }

    try {
      const response = await updateUser(body, session.user.id)
      console.log('response', response)
      if (response.validacion === false) {
        setSuccess('fail')
        setError('Ocurrió un problema. Intenta más tarde')
      } else {
        setSuccess('success')
      }
    } catch (error) {
      console.log('error', error)
    }
  })

  return (
    < >
      {/* <Headerudp /> */}
      <Sidebar
        id="menu-item1"
        id1="menu-items1"
        activeClassName="edit-doctor"
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
                              Teléfono <span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              // defaultValue="+1 23 456890"
                              {...register('mobile')}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group local-forms">
                            <label>
                              Email <span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="email"
                              // defaultValue="example@email.com"
                              {...register('email', {
                                required: {
                                  value: true,
                                  message: 'Corre es requerido'
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
                        {/* <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group local-forms">
                            <label>
                              Contraseña <span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="password"
                              // defaultValue="password"
                              {...register('password', {
                                required: {
                                  value: true,
                                  message: 'Password es requerida'
                                },
                                minLength: {
                                  value: 6,
                                  message: 'Contraseña debe tener al menos 6 caracteres'
                                }
                              })}
                            />
                            {errors.password && <span><small>{errors.password.message}</small></span>}

                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group local-forms">
                            <label>
                              Confirmar Contraseña{" "}
                              <span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="password"
                              // defaultValue="password"
                              {...register('confirmPassword', {
                                required: {
                                  value: true,
                                  message: 'Confirmación requerida'
                                },
                                validate: value => value === watch('password') || 'Las contraseñas no coinciden'
                              })}
                            />
                            {errors.confirmPassword && <span><small>{errors.confirmPassword.message}</small></span>}

                          </div>
                        </div> */}

                        {/* SELECT ESPECIALIDAD */}
                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group local-forms">
                            <label>
                              Especialidad <span className="login-danger">*</span>
                            </label>
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
                                  name="gender"
                                  value="hombre"
                                  className="form-check-input"
                                  defaultChecked={initial.genero === 'hombre'}
                                />
                                Hombre
                              </label>
                            </div>
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                <input
                                  type="radio"
                                  name="gender"
                                  value="mujer"
                                  className="form-check-input"
                                  defaultChecked={initial.genero === 'mujer'}
                                />
                                Mujer
                              </label>
                            </div>
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                <input
                                  type="radio"
                                  name="gender"
                                  value="hombre trans"
                                  className="form-check-input"
                                  defaultChecked={initial.genero === 'hombre trans'}
                                />
                                Femenino
                              </label>
                            </div>
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                <input
                                  type="radio"
                                  name="gender"
                                  value="mujer trans"
                                  className="form-check-input"
                                  defaultChecked={initial.genero === 'mujer trans'}
                                />
                                Mujer trans
                              </label>
                            </div>
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                <input
                                  type="radio"
                                  name="gender"
                                  value="otro"
                                  className="form-check-input"
                                  defaultChecked={initial.genero === 'no binarie' || 'personalizado'}
                                />
                                No binarie
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* EDUCACION */}
                        {/*  <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Educación <span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="text"
                            // defaultValue="M.B.B.S, M.S."
                            />
                          </div>
                        </div> */}

                        {/* DESIGNACION */}
                        {/*  <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Designación{" "}
                              <span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="text"
                            // defaultValue="Physician"
                            />
                          </div>
                        </div> */}

                        {/* DIRECCION */}
                        {/*  <div className="col-12 col-sm-12">
                          <div className="form-group local-forms">
                            <label>
                              Dirección <span className="login-danger">*</span>
                            </label>
                            <textarea
                              className="form-control"
                              rows={3}
                              cols={30}
                            />
                          </div>
                        </div> */}

                        {/* CIUDAD */}
                        {/* <div className="col-12 col-md-6 col-xl-3">
                          <div className="form-group local-forms">
                            <label>
                              Ciudad <span className="login-danger">*</span>
                            </label>
                            <Select
                              // menuPortalTarget={document.body}
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                              }}
                              defaultValue={selectedOption}
                              onChange={setSelectedOption}
                              options={options}
                              id="search-commodity"
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
                          </div>
                        </div> */}
                        {/* PAIS */}
                        {/* <div className="col-12 col-md-6 col-xl-3">
                          <div className="form-group local-forms">
                            <label>
                              País <span className="login-danger">*</span>
                            </label>
                            <Select
                              // menuPortalTarget={document.body}
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                              }}
                              defaultValue={selectedOption}
                              onChange={setSelectedOption}
                              options={option}
                              id="search-commodity"
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
                          </div>
                        </div> */}
                        {/* REGION */}
                        {/* <div className="col-12 col-md-6 col-xl-3">
                          <div className="form-group local-forms">
                            <label>
                              Región{" "}
                              <span className="login-danger">*</span>
                            </label>
                            <Select
                              // menuIsOpen={true}
                              defaultValue={selectedOption}
                              onChange={setSelectedOption}
                              options={statevalue}
                              // menuPortalTarget={document.body}
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                              }}
                              id="search-commodity"
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
                          </div>
                        </div> */}
                        {/* CODIGO POSTAL */}
                        {/* <div className="col-12 col-md-6 col-xl-3">
                          <div className="form-group local-forms">
                            <label>
                              Código Postal{" "}
                              <span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="text"
                            // defaultValue={91403}
                            />
                          </div>
                        </div> */}

                        {/* BIOGRAFIA */}
                        {/* <div className="col-12 col-sm-12">
                          <div className="form-group local-forms">
                            <label>
                              Biografía {" "}
                              <span className="login-danger">*</span>
                            </label>
                            <textarea
                              className="form-control"
                              rows={3}
                              cols={30}
                            />
                          </div>
                        </div> */}


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
                                required: {
                                  value: true,
                                  message: 'Contraseña es requerida'
                                },
                                minLength: {
                                  value: 8,
                                  message: 'Contraseña debe tener al menos 8 caracteres'
                                },
                                validate:
                                  value => {
                                    const regex = /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/;
                                    return regex.test(value) || 'La contraseña debe contener al menos un caracter especial, un número y una mayúscula';
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
                                required: {
                                  value: true,
                                  message: 'Confirmación requerida'
                                },
                                validate: value => value === watch('password') || 'Las contraseñas no coinciden'
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

                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group select-gender">
                            <label className="gen-label">
                              Estado <span className="login-danger">*</span>
                            </label>
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                <input
                                  type="radio"
                                  // name="status"
                                  value="activo"
                                  className="form-check-input"
                                  defaultChecked={initial.status === 'activo'}
                                  {...register('status', {
                                    required: {
                                      value: true,
                                      message: 'Estado es requerido'
                                    }
                                  })}
                                />
                                {initial.status}
                                Activo
                              </label>
                            </div>
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                <input
                                  type="radio"
                                  // name="status"
                                  value="inactivo"
                                  defaultChecked={initial.status === 'inactivo'}
                                  className="form-check-input"
                                  {...register('status', {
                                    required: {
                                      value: true,
                                      message: 'Estado es requerido'
                                    }
                                  })}
                                />
                                Inactivo
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="doctor-submit text-end">
                            <button
                              // type="submit"
                              className="btn btn-primary submit-form me-2"
                              onClick={onSubmit}
                            >
                              Actualizar
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
          <div className="notification-box">
            <div className="msg-sidebar notifications msg-noti">
              <div className="topnav-dropdown-header">
                <span>Messages</span>
              </div>
              <div className="drop-scroll msg-list-scroll" id="msg_list">
                <ul className="list-box">
                  <li>
                    <Link href="chat.html">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">R</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">Richard Miles </span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="chat.html">
                      <div className="list-item new-message">
                        <div className="list-left">
                          <span className="avatar">J</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">John Doe</span>
                          <span className="message-time">1 Aug</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="chat.html">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">T</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">
                            {" "}
                            Tarah Shropshire{" "}
                          </span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="chat.html">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">M</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">Mike Litorus</span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="chat.html">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">C</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">
                            {" "}
                            Catherine Manseau{" "}
                          </span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="chat.html">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">D</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">
                            {" "}
                            Domenic Houston{" "}
                          </span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="chat.html">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">B</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">
                            {" "}
                            Buster Wigton{" "}
                          </span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="chat.html">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">R</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">
                            {" "}
                            Rolland Webber{" "}
                          </span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="chat.html">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">C</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author"> Claire Mapes </span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="chat.html">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">M</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">Melita Faucher</span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="chat.html">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">J</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">Jeffery Lalor</span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="chat.html">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">L</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">Loren Gatlin</span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="chat.html">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">T</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">
                            Tarah Shropshire
                          </span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="topnav-dropdown-footer">
                <Link href="chat.html">See all messages</Link>
              </div>
            </div>
          </div>
        </div>
        <div
          id="delete_patient"
          className="modal fade delete-modal"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body text-center">
                <img src={imagesend} alt="" width={50} height={46} />
                <h3>Are you sure want to delete this ?</h3>
                <div className="m-t-20">
                  {" "}
                  <Link
                    href="#"
                    className="btn btn-white me-2"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </Link>
                  <button type="submit" className="btn btn-danger">
                    Delete
                  </button>
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
              Tu contraseña ha sido actualizada.
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
                  Ha ocurrido un problema. Intenta más tarde.
                </Alert>
              </div>
            </div>
            : ''
        }
      </>
    </>
  );
};

// export default EditDoctor;
export default withAuth(EditDoctor, ['admin', 'profesional']);
