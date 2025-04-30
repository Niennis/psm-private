'use client'
import { useState, useEffect } from 'react';
import { signOut } from "next-auth/react";
import { useSearchParams } from 'next/navigation'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

const errors = {
  Signin: "Ocurrió un problema. Revisa tu información o ingresa más tarde.",
  OAuthSignin: "Ocurrió un problema. Revisa tu información o ingresa más tarde.",
  OAuthCallback: "Ocurrió un problema. Revisa tu información o ingresa más tarde.",
  OAuthCreateAccount: "Ocurrió un problema. Revisa tu información o ingresa más tarde.",
  EmailCreateAccount: "Ocurrió un problema. Revisa tu información o ingresa más tarde.",
  Callback: "Ocurrió un problema. Revisa tu información o ingresa más tarde. Recuerda usar tu mail UDP.",
  OAuthAccountNotLinked: "Para confirmar tu identidad, ingresa con la misma cuenta con que ingresasteoriginalmente.",
  EmailSignin: "Revisa el email ingresado. Recuerda usar tu correo UDP.",
  CredentialsSignin: "El ingreso falló. Revisa que tus datos sean correctos.",
  Configuration: "Ocurrió un problema. Intenta más tarde",
  AccessDenied: "Revisa tus datos ingresados. Recuerda que si eres estudiante, debes ingresar con tu mail UDP.",
  Verification: "Vuelve a intentar más tarde.",
  default: "Ocurrió un problema. Revisa tu información o ingresa más tarde.",
  AccesoDenegado: "Tu correo no está registrado. Contacta al soporte o intenta con otra cuenta.",
  DominioNoPermitido: "Recuerda usar tu correo UDP."
}

const Error = () => {
  const [isMounted, setIsMounted] = useState(false)
  const searchParams = useSearchParams()

  // Asegurarse de que el componente se haya montado en el cliente
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const errorKey = searchParams.get('error') // Obtener el parámetro "error" de la URL

  const errorMessage = errorKey && (errors[errorKey] || errors.default);

  const handleUnauthorizedEmail = async () => {

    // Eliminar cookies relacionadas con la sesión de Google
    document.cookie.split(";").forEach((c) => {
      const key = c.split("=")[0].trim();
      if (key.startsWith("next-auth") || key.includes("google")) {
        document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    });

    // Esperar a que signOut termine antes de redirigir
    await signOut({
      redirect: false,
      callbackUrl: '/'
    });

    // Usar un pequeño timeout para asegurar que todo se limpie
    setTimeout(() => {
      window.location.href = '/';
    }, 100);
  };

  // Solo renderizar cuando el componente esté montado y `searchParams` esté disponible
  if (!isMounted) {
    return null // O puedes renderizar un UI de carga
  }

  return (
    <div className='center'>
      <div className="row justify-content-center " style={{ padding: 0, margin: "250px auto 0", width: '500px' }}>
        <div className="col-12 text-center " style={{ padding: 0, margin: '32px 0 0' }}>

          <Card sx={{ minWidth: 275, padding: '20px', }}>
            <CardContent>
              {/* <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Word of the Day
              </Typography> */}
              <Typography variant="h5" component="div">
                {errorMessage}
              </Typography>
              {/* <Typography sx={{ mb: 1.5 }} color="text.secondary">
              </Typography> */}
              <Typography variant="body2">
              </Typography>
            </CardContent>
            <CardActions>
              <button
                className="btn btn-primary"
                size="small"
                onClick={handleUnauthorizedEmail}
                style={{margin: 'auto'}}
                >
                Ir a página inicio
              </button>
            </CardActions>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Error;