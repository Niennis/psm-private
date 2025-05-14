"use client"
import { useState, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react"
import { useForm } from 'react-hook-form';
import { signOut } from "next-auth/react";

import { useMediaQuery } from "@mui/material";
import { logo } from "@/components/imagepath";
import { Eye, EyeOff } from "feather-icons-react/build/IconComponents";
import { logInAction } from "@/app/actions";
import SimpleBackdrop from "./Backdrop";
import { useSession } from "next-auth/react";
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [submit, setSubmit] = useState('')
  const [hash, setHash] = useState('');
  const matches = useMediaQuery('(min-width:600px)');
  const isSmallDevice = useMediaQuery('(max-width: 599px)')
  const [error, setError] = useState('')
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();
  const [captchaToken, setCaptchaToken] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHash(window.location.hash.substring(1));
    }
  }, []);

  useEffect(() => {
    if (session?.user?.rol === 'profesional' || session?.user?.rol === 'administrador') {
      router.push('/pacientes')
    } else if (session?.user?.rol === 'alumno') {
      router.push('/citas')
    }
  })

  const { register, handleSubmit, watch,
    formState: { errors }
  } = useForm()

  // const { login } = AuthData()

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  /* LOGIN CON CREDENCIALES */
  const handleOnSubmit = handleSubmit(async (data) => {
    setIsLoading(true)
    setSubmit('')
    setError('')

    if (!captchaToken) {
      setError("Por favor completa el reCAPTCHA.")
      setIsLoading(false)
      return
    }
    try {
      const response = await logInAction(captchaToken, data)

      if (!response?.success) {
        setError("Captcha inválido")
        setIsLoading(false)
        return
      }

      const res = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
        callbackUrl: "/pacientes"
      })

      if (res?.ok) {
        setIsLoggedIn(true)
      } else {
        if (res.error === 'cuenta-no-validada') {
          setError("El mail y la contraseña no coinciden")
        }
      }

    } catch (err) {
      console.error("Hubo un error:", err)
      setError("Ocurrió un problema inesperado")
    } finally {
      setIsLoading(false)
    }

  });

  const handleTabClick = (tabId) => {
    setHash(tabId);
  };

  /* LOGIN CON GOOGLE */
  const handleSignIn = async () => {
    try {
      await signIn('google', {
        callbackUrl: '/citas',
        prompt: 'select_account' // Esto es clave: fuerza a Google a mostrar la selección de cuentas
      });
      // setIsLoading(true);

    } catch (error) {
      console.log('Error:', error)
      signOut()
      if (error.message === 'No se pudo acceder. Correo no autorizado.') {
        setError('No tienes acceso. Tu correo no está autorizado.');
      } else {
        console.error('Error de autenticación:', error);
        setError('Ha ocurrido un error durante la autenticación. Por favor, inténtalo de nuevo.');
      }
      redirect('/')
    }
    finally {
      setIsLoading(false)
    }
  }
  const URL_RESERVAR = process.env.NEXT_PUBLIC_URL_RESERVAR

  if (status === "loading") return <SimpleBackdrop />
  // if (status === "authenticated") router.push('/pacientes')

  return (
    <>
      {isLoading && <SimpleBackdrop text={'el login'} />}
      <div className="main-wrapper login-body sailec">
        <div className="container-fluid px-0">
          <div className="row ">
            {/* Login logo */}
            <div className="col-lg-6 login-wrap" style={{
              backgroundImage: 'url(https://dae.udp.cl/cms/wp-content/uploads/2022/05/136.jpg)',
              backgroundSize: 'cover',
              backgroundPositionX: 'center',
              zIndex: 999,
            }}>
            </div>

            <div className="col-12 col-lg-6 login-wrap-bg" style={{ padding: '15px 20px 15px' }}>
              <div className="login-wrapper">

                {(matches || isSmallDevice) &&

                  <div className="loginbox"
                    style={{
                      background: 'white !important',
                      width: matches ? '70%' : 'unset',
                    }}>
                    <div className="login-right mx-2 p-0">
                      <div className="login-right-wrap">
                        <div className="account-logo pt-5" style={{ display: !matches ? 'none' : 'block' }}>
                          <Link href="#" style={{ display: 'block', maxWidth: '400px' }}>
                            <div style={{
                              position: 'relative',
                              width: '100%',
                              height: '80px'
                            }}>
                              <Image
                                src={logo.src}
                                alt="logo udp"
                                width={400}
                                height={200}
                                style={{
                                  width: '100%',
                                  height: 'auto',
                                  objectFit: 'contain',
                                }}
                                priority
                              />
                            </div>
                          </Link>
                        </div>

                        <section className="comp-section mt-5" id="comp_tabs">
                          <div className="row">
                            <div className="col-12">
                              <div className="card px-lg-5" style={{ border: 'none' }}>
                                <div className="card-body" style={{ width: !matches && '90vw' }}>
                                  {/* ENCABEZADO */}
                                  <h3 className="section-title">Login</h3>

                                  <ul className="nav nav-tabs underline">
                                    {URL_RESERVAR.includes('agendaelectronica') && <li className="nav-item ">
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
                                    </li>}
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
                                  <div className="tab-content" style={{ minHeight: '200px' }}>


                                    {/* LOGIN ESTUDIANTES */}
                                    {
                                      URL_RESERVAR.includes('agendaelectronica') && <div className={`tab-pane ${hash === 'estudiantes' ? 'show active d-flex flex-column justify-content-evenly ' : hash === '' ? 'show active d-flex flex-column justify-content-evenly ' : ''}`} id="profesionales" style={{ height: '100%', textAlign: 'center', padding: 'inherit'}}>
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
                                    }

                                    {/* LOGIN PROFESIONALES */}
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
                                                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                                                message: 'Correo no es válido'
                                              }
                                            })}
                                          />
                                          {errors.email && <span className="font-red"><small>{errors.email.message}</small></span>}

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
                                            errors.password && <span className="font-red"><small>{errors.password.message}</small></span>
                                          }

                                          {error &&
                                            <p className="account-subtitle font-red">
                                              {error}
                                            </p>}
                                          <span
                                            className="toggle-password"
                                            onClick={togglePasswordVisibility}
                                          >
                                            {passwordVisible ? <EyeOff className="react-feather-custom" /> : <Eye className="react-feather-custom" />}
                                          </span>
                                        </div>
                                        {/* <GoogleReCaptchaProvider
                                        reCaptchaKey={siteKey} /> */}

                                        <div className="forgotpass" >
                                          <div className="remember-me">
                                            {/* <label className="custom_check mr-2 mb-0 d-inline-flex remember-me">
                                              {" "}
                                              Remember me
                                              <input type="checkbox" name="radio" />
                                              <span className="checkmark" />
                                            </label> */}
                                          </div>
                                          <Link href="/olvido-contrasena">¿Olvidaste la contraseña?</Link>
                                        </div>

                                        {/* <input type="hidden" name="recaptcha_token" value={token || ''} /> */}
                                        <div className="form-group login-btn" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                          <ReCAPTCHA
                                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                                            onChange={(token) => {
                                              setCaptchaToken(token)
                                              setError('') // Limpia errores anteriores si hay
                                            }}
                                            style={{ margin: '5px'}}
                                          />

                                          <button disabled={!captchaToken}
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
                        <div className="next-sign">

                        </div>
                      </div>
                    </div>
                  </div>
                }
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
