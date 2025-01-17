"use client"
import { useState } from 'react'
import { useRouter, useSearchParams } from "next/navigation";
import { logo } from '@/components/imagepath';
import { useMediaQuery } from "@mui/material";
import { Alert } from "@mui/material";
import { useForm } from 'react-hook-form'

import { Eye, EyeOff } from "feather-icons-react/build/IconComponents";

const ChangePassword = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const matches = useMediaQuery('(min-width:600px)');
  const [password, setPassword] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState('initial')
  const [passwordVisible, setPasswordVisible] = useState(true);

  const { register, handleSubmit, watch, control, getValues, setValue,
    formState: { errors, dirtyFields }, reset
  } = useForm()

  const handleChange = handleSubmit(async (data, e) => {
    e.preventDefault();
    if (password === confirmPass) {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: data.password }),
      });

      if (res.ok) {
        setSuccess('success')
        setMessage('Contraseña cambiada con éxito. Puedes iniciar sesión');
        
        // router.push('/'); // Redirige al inicio de sesión
      } else {
        setSuccess('fail')
        setMessage(res.message || 'Algo salió mal.');
      }
    };
  })

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleClose = () => {
    setSuccess('initial')
  }

  return (
    <>
      <div className="main-wrapper login-body">
        <div className="container-fluid px-0">
          <div className="row">
            {/* Login logo */}
            <div className="col-lg-6 login-wrap">
              <div className="login-sec">
                <div className="col-lg-6 login-wrap" style={{
                  backgroundImage: 'url(https://dae.udp.cl/cms/wp-content/uploads/2022/05/136.jpg)',
                  backgroundSize: 'cover',
                  backgroundPositionX: 'center',
                  zIndex: 999,
                }}>
                </div>
              </div>
            </div>
            {/* /Login logo */}
            {/* Login Content */}
            <div className="col-lg-6 login-wrap-bg">
              <div className="login-wrapper">
                <div className="loginbox">
                  <div className="login-right">
                    <div className="login-right-wrap">
                      <div className="account-logo pt-5">
                        <img src={logo.src} width="100%" alt="logo udp" style={{ maxWidth: '400px ', display: !matches && 'none' }} />
                      </div>
                      <h2>Cambiar Contraseña</h2>
                      {/* Form */}
                      <form>
                        <div className="form-group">
                          <label>
                            Nueva contraseña <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type={passwordVisible ? 'password' : ''}
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
                        <div className="form-group">
                          <label>
                            Repetir contrasñea <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type={passwordVisible ? 'password' : ''}
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
                        <div className="form-group login-btn">
                          <button className="btn btn-primary btn-block" type="button" onClick={(e) => { handleChange(e) }}>
                            Cambiar Contraseña
                          </button>
                        </div>
                      </form>
                      {/* /Form */}

                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Login Content */}
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
            {message}
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
                {message}
              </Alert>
            </div>
          </div>
          : ''
      }
    </>
  )
}

export default ChangePassword;
