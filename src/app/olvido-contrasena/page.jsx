"use client"
import { useState, useEffect, useRef } from "react";
import { redirect, useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from 'next/link';
import Image from 'next/image';
import { fetchUserByEmail } from "@/services/UsersServices";


import { logo } from '@/components/imagepath';

import { useMediaQuery } from "@mui/material";

import { Alert } from "@mui/material";

const ForgotPassword = () => {
  // const { token } = router.query;
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('initial')
  const matches = useMediaQuery('(min-width:600px)');
  const [email, setEmail] = useState('')
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDAR usuario como profesional
    const user = await fetchUserByEmail(email)

    if (user.tipo_usuario === 'profesional' || user.tipo_usuario === 'administrador') {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email }),
      });
      const data = await res.json()
      if (res.ok) {
        setSuccess('success')
        setMessage(data?.message || 'Correo de recuperación enviado. Revisa tu bandeja de entrada');
        // router.push('/'); // Redirige al inicio de sesión
      } else {
        setSuccess('fail')
        setMessage(data?.message || 'Algo salió mal.');
      }
    }
    else {
      setSuccess('fail')
      setMessage('No se reconoce el correo electrónico indicado.')
    }
  }
  const handleClose = () => {
    setSuccess('initial')
  }

  return (
    <>
      <div>
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
                        <div className="account-logo pt-5" style={{ maxWidth: '400px', display: !matches ? 'none' : 'block' }}>
                          <div style={{ position: 'relative', width: '100%', height: 'auto' }}>
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
                        </div>
                        <h2>Recuperar Contraseña</h2>
                        {/* Form */}
                        <form >
                          <div className="form-group">
                            <label>
                              Email <span className="login-danger">*</span>
                            </label>
                            <input className="form-control" type="text" onChange={e => { setEmail(e.target.value) }} />
                          </div>
                          <div className="form-group login-btn">
                            <button
                              className="btn btn-primary btn-block"
                              type="button"
                              onClick={e => { handleSubmit(e) }}>
                              {/* <Link href='/' /> */}
                              Enviar mail de recuperación
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

export default ForgotPassword;
