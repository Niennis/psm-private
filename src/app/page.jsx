"use client"
import { useState, useEffect, useRef } from "react";
import { redirect, useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react"

import { useForm } from 'react-hook-form';

import { AuthData } from "@/providers/AuthWrapper";

import { fetchUserMailAndPass } from "@/services/UsersServices";

import { useMediaQuery } from "@mui/material";
import { logo } from "@/components/imagepath";
import { Eye, EyeOff } from "feather-icons-react/build/IconComponents";
import { getCaptchaToken } from "@/utils/captcha";
import { logInAction } from "./actions";

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [isInvalid, setIsInvalid] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const matches = useMediaQuery('(min-width:600px)');
  const [submit, setSubmit] = useState('')
  const [hash, setHash] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHash(window.location.hash.substring(1));
    }
  }, []);

  const { register, handleSubmit, watch,
    formState: { errors }
  } = useForm()
  const { login } = AuthData()

  // const [submitMessage, setSubmitMessage] = useState('');

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleOnSubmit = handleSubmit(async (data) => {
    setSubmit('')
    const token = await getCaptchaToken()
    const response = await logInAction(token, data)

    if (response.success) {
      try {
        const res = await signIn('credentials', { 
          callbackUrl: '/citas',
          // redirect: false,
          email: data.email,
          password: data.password
        })
        console.log('SIGNIN', res);
        if (res.validacion === false) {
          setIsInvalid(true)
        } else {
          setIsInvalid(false)
          setIsLoggedIn(true)
        }
      } catch (err) {
        console.log('en login', err)
      }
    } else {
      console.log('NO PUDO LOGEAR')
    }
  })

  const handleTabClick = (tabId) => {
    setHash(tabId);
  };

  const handleSignIn = async () => {
    try {
      // Realiza la autenticación
      await signIn('google', { callbackUrl: '/citas' }) // Se puede pasar el nombre del proveedor que se esté utilizando
      // Si la autenticación es exitosa, se redirigirá automáticamente a la página de destino configurada en NextAuth
    } catch (error) {
      // Maneja el error de autenticación
      console.log('ERRRR', error);
      if (error.message === 'No se pudo acceder. Correo no autorizado.') {
        // Muestra un mensaje de error personalizado al usuario
        alert('No tienes acceso. Tu correo no está autorizado.');
      } else {
        // Maneja otros errores de autenticación
        console.error('Error de autenticación:', error);
        // Muestra un mensaje de error genérico al usuario
        alert('Ha ocurrido un error durante la autenticación. Por favor, inténtalo de nuevo.');
      }
      redirect('/login')
    }
  }

  return (
    <>
      <div className="main-wrapper login-body sailec">
        <div className="container-fluid px-0">
          <div className="row ">
            {/* Login logo */}
            <div className="col-lg-6 login-wrap" style={{
              backgroundImage: 'url(https://dae.udp.cl/cms/wp-content/uploads/2022/05/136.jpg)',
              backgroundSize: 'cover',
              backgroundPositionX: 'center'
            }}>
            </div>

            <div className="col-12 col-lg-6 login-wrap-bg" style={{ padding: '15px 20px 15px' }}>
              <div className="login-wrapper">
                <div className="loginbox"
                  style={{
                    background: 'white !important',
                    width: matches ? '70%' : 'unset',
                  }}>
                  <div className="login-right mx-2 p-0">
                    <div className="login-right-wrap">
                      <div className="account-logo">
                        <Link href="#">
                          <img src={logo.src} width="100%" alt="logo udp" style={{ maxWidth: '-webkit-fill-available', display: !matches && 'none' }} />
                        </Link>
                      </div>

                      <section className="comp-section mt-5" id="comp_tabs">
                        <div className="row">
                          <div className="col-12">
                            <div className="card" style={{ border: 'none' }}>
                              <div className="card-body" style={{ width: !matches && '90vw' }}>
                                {/* <h4 className="card-title">Login</h4> */}
                                <h3 className="section-title">Login</h3>

                                <ul className="nav nav-tabs">
                                  <li className="nav-item">
                                    <a
                                      className={`sailec-medium nav-link ${hash === 'estudiantes' ? 'active' : hash === '' ? 'active' : ''}`}
                                      onClick={() => handleTabClick('estudiantes')}
                                      href="#estudiantes"
                                      style={{
                                        background: hash === 'estudiantes' ? '#A6A6A6 ' : '',
                                        color: hash === 'estudiantes' ? '#FFF ' : '',
                                        border: 'none'
                                      }}
                                    >
                                      Estudiantes
                                    </a>
                                  </li>
                                  <li className="nav-item">
                                    <a
                                      className={`sailec-medium nav-link ${hash === 'profesionales' ? 'active' : ''}`}
                                      onClick={() => handleTabClick('profesionales')}
                                      href="#profesionales"
                                      style={{
                                        background: hash === 'profesionales' ? '#A6A6A6 ' : '',
                                        color: hash === 'profesionales' ? '#FFF ' : '',
                                        border: 'none',
                                      }}
                                    >
                                      Profesionales
                                    </a>
                                  </li>
                                </ul>
                                <div className="tab-content" style={{ height: '250px' }}>

                                  <div className={`tab-pane ${hash === 'estudiantes' ? 'show active d-flex flex-column justify-content-evenly ' : hash === '' ? 'show active d-flex flex-column justify-content-evenly ' : ''}`} id="profesionales" style={{ height: '100%', textAlign: 'center', }}>
                                    <p>Ingresa con tu mail UDP para poder realizar una reserva.</p>
                                    <div>
                                      <button className="gsi-material-button btn btn-primary btn-block"
                                        onClick={() => handleSignIn()}
                                        style={{
                                          color: '#fff', background: '#4e57cd',
                                          width: '100%',
                                        }}
                                      >
                                        <div className="gsi-material-button-state"></div>
                                        <div className="gsi-material-button-content-wrapper">
                                          <div className="gsi-material-button-icon">
                                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" style={{ display: 'block' }}>
                                              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                              <path fill="none" d="M0 0h48v48H0z"></path>
                                            </svg>
                                          </div>
                                          <span className="gsi-material-button-contents">Inicia sesión con Google</span>
                                          <span style={{ display: 'none' }}>Inicia sesión con Google</span>
                                        </div>
                                      </button>
                                    </div>

                                  </div>
                                  <div className={`tab-pane ${hash === 'profesionales' ? 'show active' : ''}`} id="estudiantes">

                                    <form >
                                      <div className="form-group">
                                        <label>
                                          Correo electrónico <span className="login-danger">*</span>
                                        </label>
                                        <input
                                          className="form-control"
                                          type="email"
                                          {...register('email', {
                                            required: {
                                              value: true,
                                              message: 'Correo es requerido'
                                            },
                                            pattern: {
                                              value: /^[A-Za-z0-9._%+-]+@gmail\.com$/,
                                              message: 'Correo no es válido'
                                            }
                                          })}
                                        />
                                        {errors.email && <span><small>{errors.email.message}</small></span>}

                                      </div>
                                      <div className="form-group">
                                        <label>
                                          Contraseña <span className="login-danger">*</span>
                                        </label>
                                        <input
                                          className="form-control pass-input"
                                          type={passwordVisible ? 'password' : ''}
                                          {...register('password', {
                                            required: {
                                              value: true,
                                              message: 'Contraseña es requerida'
                                            },
                                            minLength: {
                                              value: 6,
                                              message: 'Contraseña incorrecta'
                                            }
                                          })}
                                        />
                                        {
                                          errors.password && <span><small>{errors.password.message}</small></span>
                                        }

                                        <span
                                          className="toggle-password"
                                          onClick={togglePasswordVisibility}
                                        >
                                          {passwordVisible ? <EyeOff className="react-feather-custom" /> : <Eye className="react-feather-custom" />}
                                        </span>
                                      </div>
                                      {/* <GoogleReCaptchaProvider
                                        reCaptchaKey={siteKey} /> */}

                                      <div className="forgotpass">
                                        {/* <div className="remember-me">
                            <label className="custom_check mr-2 mb-0 d-inline-flex remember-me">
                              {" "}
                              Remember me
                              <input type="checkbox" name="radio" />
                              <span className="checkmark" />
                            </label>
                          </div>
                          <Link href="/forgotpassword">¿Olvidaste la contraseña?</Link> */}
                                      </div>
                                      <div>
                                        {isInvalid && <span style={{ color: 'red' }}><small>Usuario no encontrado</small></span>}
                                      </div>
                                      <div className="form-group login-btn">
                                        <button
                                          className="btn btn-primary btn-block sailec-medium"
                                          onClick={handleOnSubmit}
                                        >
                                          Iniciar sesión
                                        </button>
                                      </div>
                                    </form>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* <form >
                        <div className="form-group">
                          <label>
                            Correo electrónico <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="email"
                            {...register('email', {
                              required: {
                                value: true,
                                message: 'Correo es requerido'
                              },
                              pattern: {
                                value: /^[A-Za-z0-9._%+-]+@gmail\.com$/,
                                message: 'Correo no es válido'
                              }
                            })}
                          />
                          {errors.email && <span><small>{errors.email.message}</small></span>}

                        </div>
                        <div className="form-group">
                          <label>
                            Contraseña <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control pass-input"
                            type={passwordVisible ? 'password' : ''}
                            {...register('password', {
                              required: {
                                value: true,
                                message: 'Contraseña es requerida'
                              },
                              minLength: {
                                value: 6,
                                message: 'Contraseña incorrecta'
                              }
                            })}
                          />
                          {
                            errors.password && <span><small>{errors.password.message}</small></span>
                          }

                          <span
                            className="toggle-password"
                            onClick={togglePasswordVisibility}
                          >
                            {passwordVisible ? <EyeOff className="react-feather-custom" /> : <Eye className="react-feather-custom" />}
                          </span>
                        </div>

                        <div className="forgotpass">
                  
                        </div>
                        <div>
                          {isInvalid && <span style={{ color: 'red' }}><small>Usuario no encontrado</small></span>}
                        </div>
                        <div className="form-group login-btn">
                          <button
                            className="btn btn-primary btn-block"
                            onClick={handleOnSubmit}
                          >
                            Iniciar sesión
                          </button>
                        </div>
                      </form> */}
                      {/* /Form */}
                      <div className="next-sign">
                        <p className="account-subtitle">
                          {/* ¿No tienes una cuenta? <Link href="/signup">Regístrate</Link> */}
                        </p>
                        {/* Social Login */}

                        {/* /Social Login */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Login Content */}
          </div>
        </div>
      </div>

    </>
  );
};

export default Login;
