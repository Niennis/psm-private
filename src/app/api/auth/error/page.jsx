'use client'
import { useState, useEffect } from 'react';
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
  Callback: "Ocurrió un problema. Revisa tu información o ingresa más tarde.",
  OAuthAccountNotLinked:
    "Para confirmar tu identidad, ingresa con la misma cuenta con que ingresasteoriginalmente.",
  EmailSignin: "Revisa el email ingresado.",
  CredentialsSignin:"El ingreso falló. Revisa que tus datos sean correctos.",
  Configuration: "Ocurrió un problema. Intenta más tarde",
  AccessDenied: "Revisa tus datos ingresados. Recuerda que si eres estudiante, debes ingresar con tu mail UDP.",
  Verification: "Vuelve a intentar más tarde.",
  default: "Ocurrió un problema. Revisa tu información o ingresa más tarde.",
}

const Error = () => {
  const [isMounted, setIsMounted] = useState(false)
  const searchParams = useSearchParams()

  // Asegurarse de que el componente se haya montado en el cliente
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Solo renderizar cuando el componente esté montado y `searchParams` esté disponible
  if (!isMounted) {
    return null // O puedes renderizar un UI de carga
  }

  const error = searchParams.get('error') // Obtener el parámetro "error" de la URL

  const errorMessage = error && (errors[error] ?? errors.default);

  return (
    <div className='center'>
      <div className="row justify-content-center " style={{ padding: 0, margin: "250px auto 0" }}>
        <div className="col-sm-12 col-xl-4 text-center " style={{ padding: 0, margin: '32px 0 0' }}>

          <Card sx={{ minWidth: 275, padding: '20px' }}>
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
              <Link size="small" href="/">Ir a página inicio</Link>
            </CardActions>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Error;