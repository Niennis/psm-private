'use client'
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { redirect } from 'next/navigation';
import Link from "next/link";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import Select from "react-select";
import { useForm, Controller } from 'react-hook-form'
import { fetchProfessionalById, fetchSpecialityById } from "@/services/DoctorsServices";
import { Eye, EyeOff } from "feather-icons-react/build/IconComponents";

import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import withAuth from '@/components/withAuth';
import { updateProfesional, changePassword } from "@/services/DoctorsServices";
import CacheHandler from "@/utils/cache-handler";
import { especialidades } from "@/utils/selects";
import { Alert } from "@mui/material";
import { useSidebar } from "@/context/SidebarContext";

const cacheHandler = new CacheHandler();

const EditDoctor = ({ params }) => {
  const { data: session } = useSession()
  const router = useRouter();
  const { setProps } = useSidebar();

  if (!session) {
    redirect('/citas');
  }
  const userId = params.id;
  if (session.user.id != userId && session?.user?.rol !== "administrador") {
    redirect('/citas');
  }

  const [success, setSuccess] = useState('initial')
  const [error, setError] = useState('')
  const [initial, setInitial] = useState({})
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [initialProfesional, setInitialProfesional] = useState('')
  const [selectedOption, setSelectedOption] = useState(null);

  const [speciality, setSpeciality] = useState([
    { value: "", label: "", name: "", id: 0 },
    { value: "Psicopedagogía", label: "Psicopedagogía", name: "speciality", id: 1 },
    { value: "Psicología", label: "Psicología", name: "speciality", id: 2 },
    { value: "Psiquiatría", label: "Psiquiatría", name: "speciality", id: 3 },
    { value: "Trabajador social", label: "Trabajador social", name: "speciality", id: 4 },
    { value: "Practicante Psicología", label: "Practicante Psicología", name: "speciality", id: 5 },
    { value: "Practicante Psicopedagogía", label: "Practicante Psicopedagogía", name: "speciality", id: 6 },
    { value: "Practicante Psiquiatría", label: "Practicante Psiquiatría", name: "speciality", id: 7 },
    { value: "Practicante Trabajo Social", label: "Practicante Trabajo Social", name: "speciality", id: 8 },
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
    // console.log(date, dateString);
  };
  const loadFile = (event) => {
    // Handle file loading logic here
  };

  // DATOS PRECARGADOS
  const fetchInitialData = async () => {
    try {
      const usersData = await fetchProfessionalById(params.id);
      const { especialidades } = await fetchSpecialityById(params.id);
      const user = usersData.users[0];
      console.log('usersData', usersData)
      const obj = {
        ...user,
        name: user.nombre,
        lastName: user.apellido,
        mobile: user.telefono,
        email: user.email,
        dateOfBirth: user.fecha_nacimiento,
        genero: user.genero,
        speciality: especialidades[0].especialidad,
        status: user.status,
        password: '',
        confirmPassword: ''
      };
      console.log('obj', obj)
      setInitialProfesional(obj)
      return obj
    } catch (error) {
      console.error("Error fetching initial data:", error);
      return {};
    }
  };

  const { register, handleSubmit, watch, control, getValues,
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


  const valores = getValues()

  // FUNCIÓN UPDATE
  const handleEdit = handleSubmit(async (data, e) => {
    console.log('data', data)
    e.preventDefault()
    console.log('Formulario enviado con datos:', data);

    const match = data.password === data.confirmPassword;

    const body = {
      id: initialProfesional.id,
      nombre: data.name || initialProfesional.nombre,
      apellido: data.lastName || initialProfesional.apellido,
      telefono: data.mobile || initialProfesional.telefono,
      email: initialProfesional.email,
      especialidad: data.speciality.value || initialProfesional.speciality,
      contrasena: (data.password && data.confirmPassword && match) && data.password,
      fecha_nacimiento: initialProfesional.fecha_nacimiento,
      genero: data.gender || initialProfesional.genero,
      tipo_usuario: initialProfesional.tipo_usuario,
      status: data.status || initialProfesional.status,
      rut: '12345678-9',
      carrera: 'Psicopedagogia',
      anoIngresoCarrera: '0',
      jornada: 'laboral',
      direccion: 'random',
      region: 'santiago',
      comuna: 'santiago',
      entrevistador: '1',
      mustChangePassword: initialProfesional.mustChangePassword,
      aplica_despeje: '0',
      campus: 'ambas',
      id_emergencia: 0,
    };

    const editPass = {
      contrasena: data.password,
      id: initialProfesional.id
    }
    console.log('dirtyFields', dirtyFields)

    if (data.password && data.confirmPassword && data.password === data.confirmPassword) {
      console.log('ENTRO AQUÍ, contraseña', editPass)
      try {
        const response = await changePassword(editPass)
        console.log('response pass', response)
        if (response.includes('TypeError')) {
          setSuccess('fail')
          setError('Ocurrió un problema. Intenta más tarde')
        } else {
          setSuccess('success')
        }
      } catch (error) {
        console.log('error pass', error)
        setSuccess('fail')
        setError(error)
      }
    }

    else if (Object.keys(dirtyFields).length > 0 && (!data.password || !data.confirmPassword)) {
      console.log('ENTRO ACÁ, todo', body)
      try {
        const response = await updateProfesional(body)
        console.log('response total', response)
        if (response.message === 'Failed to fetch') {
          setSuccess('fail')
          setError('Ocurrió un problema de conexión')
        } else {
          setSuccess('success')
        }
      } catch (error) {
        console.log('error todo', error)
        setSuccess('fail')
        setError(error)
      }
    }

    else {
      console.log('ENTRO POR ACULLÁ, contraseña', editPass)

      try {
        const response = await updateProfesional(body)
        console.log('response', mix)
        if (response.includes('TypeError')) {
          setSuccess('fail')
          setError('Ocurrió un problema. Intenta más tarde')
        } else {
          setSuccess('success')
        }
      } catch (error) {
        console.log('error', error)
        setSuccess('fail')
        setError(error)
      }
    }

  })


  const prepareData = (data) => {
    const match = data.password === data.confirmPassword;

    const body = {
      id: initialProfesional.id,
      nombre: data.name || initialProfesional.nombre,
      apellido: data.lastName || initialProfesional.apellido,
      telefono: data.mobile || initialProfesional.telefono,
      email: initialProfesional.email,
      especialidad: data.speciality.value || initialProfesional.speciality,
      contrasena: (data.password && data.confirmPassword && match) && data.password,
      fecha_nacimiento: "1988-12-12",
      genero: data.genero || initialProfesional.genero,
      tipo_usuario: initialProfesional.tipo_usuario,
      status: data.status || initialProfesional.status,
      rut: '12345678-9',
      carrera: 'Psicopedagogia',
      anoIngresoCarrera: '0',
      jornada: 'laboral',
      direccion: 'random',
      region: 'santiago',
      comuna: 'santiago',
      entrevistador: '1',
      mustChangePassword: initialProfesional.mustChangePassword,
      aplica_despeje: '0',
      campus: 'ambas',
      id_emergencia: 0,
      nombre_social: " "
    };
    console.log('BODY', body)

    const editPass = {
      contrasena: data.password,
      id: initialProfesional.id
    };

    return { body, editPass };
  };


  const handlePasswordChange = async (editPass) => {
    try {
      const response = await changePassword(editPass);
      console.log('response pass', response);
      return response.includes('TypeError') ? { success: false, message: 'Ocurrió un problema. Intenta más tarde' } : { success: true };
    } catch (error) {
      console.log('error pass', error);
      return { success: false, message: error };
    }
  };

  const handleUpdateProfesional = async (body) => {
    try {
      const response = await updateProfesional(body);
      console.log('response total', response);
      return response.message === 'Failed to fetch'
        ? { success: false, message: 'Ocurrió un problema de conexión' }
        : { success: true };
    } catch (error) {
      console.log('error todo', error);
      return { success: false, message: error };
    }
  };

  const handleEditSubmit = async (data) => {
    const { body, editPass } = prepareData(data);

    if (data.password && data.confirmPassword && data.password === data.confirmPassword) {
      console.log('ENTRO AQUÍ, contraseña', editPass);
      const result = await handlePasswordChange(editPass);
      return result;
    } else if (Object.keys(dirtyFields).length > 0 && (!data.password || !data.confirmPassword)) {
      console.log('ENTRO ACÁ, todo', body);
      const result = await handleUpdateProfesional(body);
      return result;
    } else {
      console.log('ENTRO POR ACULLÁ, contraseña', editPass);
      const result = await handleUpdateProfesional(body);
      return result;
    }
  };


  const bleh = handleSubmit(async (data, e) => {
    e.preventDefault();
    console.log('Formulario enviado con datos:', data);
    const { body, editPass } = prepareData(data);

    const result = await handleUpdateProfesional(body);

    if (result.success) {
      setSuccess('success');
    } else {
      setSuccess('fail');
      setError(result.message);
    }
  });



  return (
    < >
      {/* <Headerudp /> */}
      {/* <Sidebar
        id="menu-item1"
        id1="menu-items1"
        activeClassName="edit-doctor"
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
                                  {...register('genero')}
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
                                  {...register('genero')}
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
                                  {...register('genero')}
                                />
                                Hombre trans
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
                                  {...register('genero')}
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
                          </div>
                        }
                        <div className="col-12">
                          <div className="doctor-submit text-end">
                            <button
                              type="button"
                              className="btn btn-primary submit-form me-2"
                              onClick={bleh}
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
                  {error}
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
export default withAuth(EditDoctor, ['administrador', 'profesional']);
