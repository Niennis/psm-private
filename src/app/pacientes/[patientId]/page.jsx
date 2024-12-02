"use client"
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { imagesend } from "@/components/imagepath";
import FeatherIcon from "feather-icons-react";
import Link from "next/link";
import Select from "react-select";
import { fetchUser, updateUser, fetchUserByEmail } from "@/services/UsersServices";
import { useForm, Controller, useController } from 'react-hook-form';
import { Alert } from "@mui/material";

import SimpleBackdrop from "@/components/Backdrop";
import { useSidebar } from "@/context/SidebarContext";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import withAuth from '@/components/withAuth';
import CacheHandler from "@/utils/cache-handler";
import { regiones, comunas, genero, carreras } from "@/utils/selects";
import { formatDateToYYYYMMDD } from "@/utils/managedata";
const cacheHandler = new CacheHandler();

const EditPatients = ({ params }) => {
  const ROL = ["profesional"]
  const { data: session } = useSession()
  const router = useRouter();
  const userRole = session?.user?.rol
  const [menuPortalTarget, setMenuPortalTarget] = useState(null);
  const { setProps } = useSidebar();
  const [initial, setInitial] = useState('')
  const [success, setSuccess] = useState('initial')
  const [error, setError] = useState('')
  const [openBackdrop, setOpenBackdrop] = useState(false);

  useEffect(() => {
    setProps({
      id: "menu-item2",
      id1: "menu-items2",
      activeClassName: "edit-patient",
    });
  }, [setProps]);

  const fetchInitialData = async () => {
    try {
      const { users: user } = await fetchUser(params.patientId)
      const obj = {
        name: user[0].nombre,
        lastName: user[0].apellido,
        mobile: user[0].telefono,
        email: user[0].email,
        password: user[0].contrasena,
        confirmPassword: user[0].contrasena,
        date: formatDateToYYYYMMDD(user[0].fecha_nacimiento),
        genero: user[0].genero,
        status: user[0].status,
        carrera: user[0].carrera,
        address: user[0].direccion,
        region: user[0].region,
        comuna: user[0].comuna,
        tipo_usuario: user[0].tipo_usuario,
        rut: user[0].rut,
        id_emergencia: user[0].id_emergencia,
      }
      setInitial(obj)
      return obj
    } catch (error) {
      console.log('error', error)
    }
  }

  const { register, handleSubmit, watch, control,
    formState: { errors }
  } = useForm({
    defaultValues: async () => await fetchInitialData()
  });

  const [selectedOption, setSelectedOption] = useState(null);

  const [show, setShow] = useState(false);

  const onChange = (date, dateString) => {
    // console.log(date, dateString);
  };


  const gender = [
    { value: "Hombre", label: "Hombre" },
    { value: "Mujer", label: "Mujer" },
    { value: "Hombre trans", label: "Hombre trans" },
    { value: "Mujer trans", label: "Mujer trans" },
    { value: "No binarie", label: "No binarie" }
  ]

  const [department, setDepartment] = useState([
    { value: 2, label: "Orthopedics" },
    { value: 3, label: "Radiology" },
    { value: 4, label: "Dentist" },
  ]);

  useEffect(() => {
    setMenuPortalTarget(document.body);
  }, [])

  const selectedRegion = watch('region')

  const loadFile = (event) => { };

  const onSubmit = handleSubmit(async (data, e) => {
    e.preventDefault()
    const bodyUpdate = {
      "apellido": data.lastName || initial.lastName,
      "aplica_despeje": 1,
      "anoIngresoCarrera": 'NA',
      "campus": data.campus || 'NA',
      "comuna": data.comuna.label || initial.comuna,
      "carrera": data.carrera.label || initial.career,
      "contrasena": 'NA',
      "direccion": data.address || initial.address,
      "email": data.email,
      "entrevistador": 0,
      "fecha_nacimiento": data.birthday || initial.date,
      "genero": data.genero || initial.genero,
      "id": parseInt(params.patientId),
      "jornada": 'NA',
      "mustChangePassword": 0,
      "nombre": data.name || initial.name,
      "region": data.region.label || initial.region,
      "rut": data.rut || initial.rut || ' ',
      "status": initial.status,
      "telefono": data.mobile || initial.mobile,
      "tipo_usuario": initial.tipo_usuario,
      "nombre_social": initial.nombre_social,
      "id_emergencia": initial.id_emergencia || 0,
    }
    try {
      const response = await updateUser(bodyUpdate)
      if (response.validacion === true) {
        setSuccess('success')
      } else {
        setSuccess('fail')
        setError(`Algo falló: ${response.detalle}`);
      }
      setOpenBackdrop(true)
    } catch (error) {
      setSuccess('fail')
      console.error('Algo falló', error)
      setError(`Algo falló: ${error.message}`);
    }
  })

  return (
    < >
      {/* <Headerudp /> */}
      {/* <Sidebar
        id="menu-item2"
        id1="menu-items2"
        activeClassName="edit-patient"
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
                      <Link href="# ">Pacientes </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="feather-chevron-right">
                        <FeatherIcon icon="chevron-right" />
                      </i>
                    </li>
                    <li className="breadcrumb-item active"> Editar Paciente
                    </li>
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
                            <h4>Detalles del Paciente</h4>
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
                              // defaultValue={values.name}
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
                              // defaultValue={values.name}
                              {...register('nombre_social', {
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
                              Apellidos <span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              // defaultValue={values.name}
                              {...register('lastName')}
                            />
                          </div>
                        </div>
                        {/* <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Nombre de usuario <span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              // defaultValue={values.name}
                              {...register('userName')}
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
                              type="tel"
                              {...register('mobile', {
                                minLength: {
                                  value: 9,
                                  message: 'Cantidad de números inválida'
                                },
                                maxLength: {
                                  value: 9,
                                  message: 'Cantidad de números inválida'
                                }
                              })}
                            />
                            {errors.email && <span><small>{errors.email.message}</small></span>}
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
                              // defaultValue={values.email}
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
                              Fecha de nacimiento{" "}
                              <span className="login-danger">*</span>
                            </label>
                            <Controller
                              control={control}
                              name="date"
                              {...register('date')}
                              ref={null}
                              render={({ field: { onChange, onBlur, value } }) => (
                                <input
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
                            {errors.date && <span><small>{errors.date.message}</small></span>}
                            {/* <input
                        className="form-control datetimepicker"
                        type="text"
                        defaultValue="24-11-2022"
                      /> */}
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group local-forms">
                            <label>
                              Género <span className="login-danger">*</span>
                            </label>

                            <Controller
                              control={control}
                              name="genero"
                              {...register('genero')}
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
                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group local-forms">
                            <label>
                              Carrera <span className="login-danger">*</span>
                            </label>

                            <Controller
                              control={control}
                              name="carrera"
                              {...register('carrera')}
                              ref={null}
                              render={({ field: { onChange, onBlur, value } }) => {
                                console.log(value)
                                return (
                                  <Select
                                    instanceId="select-career"
                                    defaultValue={selectedOption}
                                    onChange={onChange}
                                    value={carreras.find(option => option.label === value) || value}
                                    options={carreras}
                                    menuPortalTarget={menuPortalTarget}
                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                    id="select-career"
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
                        {/* <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group local-forms">
                            <label>
                              Campus{" "}
                              <span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              defaultValue=" "
                              {...register('campus')}
                            />
                          </div>
                        </div> */}
                        {/* <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Departmento <span className="login-danger">*</span>
                            </label>
                            <Select
                              defaultValue={selectedOption}
                              onChange={setSelectedOption}
                              options={department}
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
                        <div className="col-12 col-sm-12">
                          <div className="form-group local-forms">
                            <label>
                              Dirección <span className="login-danger"></span>
                            </label>
                            <textarea
                              className="form-control"
                              rows={3}
                              cols={30}
                              {...register('address')}
                            />
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
                              {...register('comuna')}
                              ref={null}
                              render={({ field: { onChange, onBlur, value } }) => {
                                const regionKey = initial?.region?.toLowerCase()
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
                        {/* <div className="col-12 col-md-6 col-xl-3">
                          <div className="form-group local-forms">
                            <label>
                              Postal Code{" "}
                              <span className="login-danger"></span>
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              // defaultValue={91403}
                            />
                          </div>
                        </div> */}{/* 
                        <div className="col-12 col-sm-12">
                          <div className="form-group local-forms">
                            <label>
                              Start Biography{" "}
                              <span className="login-danger">*</span>
                            </label>
                            <textarea
                              className="form-control"
                              rows={3}
                              cols={30}
                              defaultValue={
                                "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliquat enim ad minim veniam, quriesstrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                              }
                            />
                          </div>
                        </div> */}
                        {/* <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group local-top-form"> */}
                        {/* <label className="local-top">
                              Avatar <span className="login-danger">*</span>
                            </label>
                            <div className="settings-btn upload-files-avator">
                              <input
                                type="file"
                                accept="image/*"
                                name="image"
                                id="file"
                                onChange={loadFile}
                                className="hide-input"
                              />
                            </div> */}
                        {/* <div className="settings-btn upload-files-avator">
                              <input
                                type="file"
                                accept="image/*"
                                name="image"
                                id="file"
                                onchange="loadFile(event)"
                                className="hide-input"
                              />
                              <label htmlFor="file" className="upload">
                                Choose File
                              </label>
                            </div> */}
                        {/* <div
                              className="upload-images upload-size"
                              style={{ display: show ? "none" : "flex" }}
                            >
                              <img src={favicon} alt="Image" />
                              <Link href="#" className="btn-icon logo-hide-btn">
                                <i
                                  className="feather-x-circle"
                                  onClick={() => setShow((s) => !s)}
                                >
                                  <FeatherIcon icon="x-circle" />
                                </i>
                              </Link>
                            </div> */}
                        {/* </div>
                        </div> */}
                        {session?.user?.rol === "administrador" &&
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
                                    defaultChecked={initial.status === 'activo'}
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
                                    defaultChecked={initial.status === 'inactivo'}
                                    className="form-check-input"
                                    {...register('status')}
                                  />
                                  Inactivo
                                </label>
                              </div>
                            </div>
                          </div>}
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
                    className="btn btn-white"
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
        <div className="sidebar-overlay" data-reff="" />
        {/* Datepicker Core JS */}
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
                  Ha ocurrido un problema. {error}
                </Alert>
              </div>
            </div>
            : ''
        }
      </>
    </>
  );
};

// export default EditPatients;
export default withAuth(EditPatients, ['administrador', 'profesional']);

