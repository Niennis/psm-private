/* eslint-disable-next-line react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Alert } from "@mui/material";
import { redirect } from 'next/navigation';

import { fetchProfessionalById } from '@/services/DoctorsServices';

export default function PasswordAlert() {
  const { data: session } = useSession();
  const [showAlert, setShowAlert] = useState(false);
  const userId = session?.user?.id

  const hadChangedPassword = async () => {
    if (session?.user?.rol === 'profesional') {
      const { users: profile } = await fetchProfessionalById(session.user.id)
      if (profile[0].mustChangePassword === 1 && localStorage.getItem('passwordAlertShown')) {
        setShowAlert(true);
      }
    }
  }

  useEffect(() => {
    hadChangedPassword()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRedirect = () => {
    localStorage.removeItem('passwordAlertShown');
  }

  const handleCloseAlert = () => {
    setShowAlert(false);
    localStorage.setItem('passwordAlertShown', 'true');
  };

  if (!showAlert) {
    return null;
  }

  return (
    <div className="alert">
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
            <h3>Por favor, recuerda cambiar tu contraseña.</h3>
            <Link href={`/profesionales/editar/${userId}`}>
              <button className='btn btn-danger p-2 m-2' onClick={handleRedirect}>
                Ir a cambiar
              </button>
            </Link>
            <button className='btn btn-secondary p-2 m-2' onClick={handleCloseAlert}>
              Cerrar
            </button>
          </Alert>
        </div>
      </div>
    </div>
  );
}
