'use client'
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import Link from "next/link";

import bcrypt from "bcryptjs";
import { useForm, Controller } from 'react-hook-form';

import Select from "react-select";
import { Alert } from "@mui/material";
import Sidebar from "@/components/Sidebar";

import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import { Eye, EyeOff } from "feather-icons-react/build/IconComponents";

import ChildModal from "@/components/ChildModal";
import { addProfessional } from "../../../services/DoctorsServices";

import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import withAuth from '@/components/withAuth';
import CacheHandler from "@/utils/cache-handler";

const cacheHandler = new CacheHandler();

const AddProfessional = () => {
  const ELEGIR_STATUS = false;
  const { data: session } = useSession()
  const router = useRouter();
  const [menuPortalTarget, setMenuPortalTarget] = useState(null);
  const [errorMessage, setErrorMessage] = useState('')

  const { register, handleSubmit, watch, control, reset, setValue, getValues, setError,
    formState: { errors, isSubmitSuccessful }
  } = useForm({
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      genero: { value: "", label: "" },
      password: "",
      confirmPassword: "",
      campus: null,
      speciality: { value: "", label: "", name: "" },
      status: !ELEGIR_STATUS ? "activo" : ""
    }
  })

  const [passwordVisible, setPasswordVisible] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [dataDoctor, setDataDoctor] = useState(null)
  const [success, setSuccess] = useState('initial')

  const [gender, setGender] = useState([
    { value: "", label: "" },
    { value: 1, label: "Hombre" },
    { value: 2, label: "Mujer" },
    { value: 3, label: "Hombre trans" },
    { value: 4, label: "Mujer trans" },
    { value: 5, label: "No binarie" }
  ]);

  const [department, setDepartment] = useState([
    { value: "", label: "", name: "" },
    { value: "Psicopedagogia", label: "Psicopedagogía", name: "speciality" },
    { value: "Psicologia", label: "Psicología", name: "speciality" },
    { value: "Psiquiatria", label: "Psiquiatría", name: "speciality" },
    { value: "Trabajador social", label: "Trabajador social", name: "speciality" },
    { value: "Practicante - Psicología", label: "Practicante - Psicología", name: "speciality" },
    { value: "Practicante - Psicopedagogía", label: "Practicante - Psicopedagogía", name: "speciality" },
  ]);

  useEffect(() => {
    setMenuPortalTarget(document.body);

    if (isSubmitSuccessful) {
      reset()
      setValue('genero.value', 0)
    }
  }, [isSubmitSuccessful, reset])

  const onChange = (date, dateString) => {
    // console.log(date, dateString);
    setIsClicked(true);
  };

  const onSubmit = handleSubmit(async data => {
    setSuccess('initial')

    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRound)
    const dataWithHashPass = { ...data, password: hashedPassword }
    // console.log('data', dataWithHashPass)

  if (data) {
    try {
      const response = await addProfessional(data)
      // const response = await addProfessional(dataWithHashPass)
      if (response.validacion === false) {
        setSuccess('fail')
        setErrorMessage('Revisa los datos')
      } else if (response.estado === true) {
        setSuccess('success')
        reset()
      }
    } catch (err) {
      console.log('ERR', err)
      setSuccess('fail')
      setErrorMessage('El servicio no está disponible')
    } 

  } else {
    console.log('FAIL')
  }
})

const onConfirm = async () => {
  const response = await addProfessional(dataDoctor)
  console.log(response)
}

const togglePasswordVisibility = () => {
  setPasswordVisible(!passwordVisible);
};

const handleCancel = () => {
  reset({ name: 'Holo' })
}

return (
  < >
    {/* <Headerudp /> */}
    <Sidebar id="menu-item1" id1="menu-items1" activeClassName="add-doctor" />
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
                  <li className="breadcrumb-item active">Agregar Profesional</li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <form onSubmit={onSubmit}>
                    <div className="row">
                      <div className="col-12">
                        <div className="form-heading">
                          <h4>Detalles del Profesional</h4>
                        </div>
                      </div>
                      {/* Nombre */}
                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="form-group local-forms">
                          <label>
                            Nombre <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder=""
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
                            errors.name && <span className="login-danger">
                              <small>{errors.name.message}</small>
                            </span>
                          }
                        </div>
                      </div>

                      {/* Apellido */}
                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="form-group local-forms">
                          <label>
                            Apellido <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder=""
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
                            errors.lastName && <span className="login-danger">
                              <small>{errors.lastName.message}</small>
                            </span>
                          }
                        </div>
                      </div>

                      {/* Género */}
                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="form-group local-forms">
                          <label>
                            Género <span className="login-danger">*</span>
                          </label>
                          <Controller
                            control={control}
                            name="genero"
                            {...register('genero', {
                              required: {
                                value: true,
                                message: 'Género es requerida',
                              }
                            })}
                            ref={null}
                            render={({ field: { onChange, onBlur, value } }) => (
                              <Select
                                instanceId="genero"
                                menuPosition={'fixed'}
                                defaultValue={""}
                                onChange={onChange}
                                options={gender}
                                value={value || ""}
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
                          {errors.genero && <span className="login-danger">
                            <small>{errors.genero.message}</small>
                          </span>}

                        </div>
                      </div>

                      {/* Correo electrónico */}
                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="form-group local-forms">
                          <label>
                            Correo electrónico <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="email"
                            placeholder=""
                            {...register('email', {
                              required: {
                                value: true,
                                message: 'Correo electrónico es requerido'
                              },
                              pattern: {
                                value: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
                                message: 'Correo no es válido'
                              }
                            })}
                          />
                          {
                            errors.email && <span className="login-danger">
                              <small>{errors.email.message}</small>
                            </span>
                          }
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

                      {/* Especialidad */}
                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="form-group local-forms">
                          <label>
                            Especialidad <span className="login-danger">*</span>
                          </label>
                          <Controller
                            control={control}
                            name="speciality"
                            {...register('speciality', {
                              required: {
                                value: true,
                                message: 'Especialidad es requerida',
                              }
                            })}
                            ref={null}
                            render={({ field: { onChange, onBlur, value } }) => (
                              <Select
                                instanceId="search-commodity"
                                defaultValue={''}
                                value={value || ""}
                                onChange={onChange}
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
                            )}
                          />
                          {errors.speciality && <span className="login-danger">
                            <small>{errors.speciality.message}</small>
                          </span>}

                        </div>
                      </div>

                      {/* Campus */}
                      {/* <div className="col-12 col-md-6 col-xl-6">
                        <div className="form-group select-gender">
                          <label className="gen-label">
                            Campus <span className="login-danger">*</span>
                          </label>
                          <div className="form-check-inline">
                            <label className="form-check-label">
                              <input
                                type="radio"
                                value="centro"
                                className="form-check-input"
                                {...register('campus', {
                                  required: {
                                    value: true,
                                    message: 'Campus es requerido'
                                  }
                                })}
                              />
                              Centro
                            </label>
                          </div>
                          <div className="form-check-inline">
                            <label className="form-check-label">
                              <input
                                type="radio"
                                value="huechuraba"
                                className="form-check-input"
                                {...register('campus', {
                                  required: {
                                    value: true,
                                    message: 'Campus es requerido'
                                  }
                                })}
                              />
                              Huechuraba
                            </label>
                          </div>
                          <div className="form-check-inline">
                            <label className="form-check-label">
                              <input
                                type="radio"
                                value="ambas"
                                className="form-check-input"
                                {...register('campus', {
                                  required: {
                                    value: true,
                                    message: 'Campus es requerido'
                                  }
                                })}
                              />
                              Ambas
                            </label>
                          </div>
                          {errors.campus && <span className="login-danger">
                            <small>{errors.campus.message}</small>
                          </span>}
                        </div>
                      </div> */}

                      {
                        session?.user?.rol === "administrador" &&
                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group select-gender">
                            <label className="gen-label">
                              Estado <span className="login-danger">*</span>
                            </label>
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                <input
                                  type="radio"
                                  value="activo"
                                  name="status"
                                  className="form-check-input"
                                  {...register('status', {
                                    required: {
                                      value: true,
                                      message: 'Estado es requerido'
                                    }
                                  })}
                                />
                                Activo
                              </label>
                            </div>
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                <input
                                  type="radio"
                                  value="inactivo"
                                  name="status"
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
                            {errors.status && <span className="login-danger">
                              <small>{errors.status.message}</small>
                            </span>}
                          </div>
                        </div>}

                      <div className="col-12">
                        <div className="doctor-submit text-end">
                          <button
                            type="submit"
                            className="btn btn-primary submit-form me-2"
                          >
                            Enviar
                          </button>
                          {/* } */}
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
        <div className="row">
          <div className="col-sm-12 col-lg-6">
            {success === 'success'
              ?
              <Alert
                severity="success"
                onClose={() => { setSuccess('initial') }}
                sx={{
                  zIndex: 'tooltip',
                  position: 'absolute',
                  bottom: -10,
                  left: '10%',
                  width: '80%'
                }}
                spacing={2}
              >
                El profesional se ha ingresado exitosamente.
              </Alert>

              : success === 'fail'
                ?
                <Alert
                  severity="error"
                  onClose={() => { setSuccess('initial') }}
                  sx={{
                    zIndex: 'tooltip',
                    position: 'absolute',
                    bottom: -10,
                    left: '10%',
                    width: '80%'
                  }}
                  spacing={2}
                >
                  Ha ocurrido un problema. {errorMessage}
                </Alert>
                : ''
            }
          </div>
        </div>
      </div>
    </>
  </>
);
};

// export default AddProfessional;
export default withAuth(AddProfessional, ['administrador']);

