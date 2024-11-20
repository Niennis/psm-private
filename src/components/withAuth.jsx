"use client";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SimpleBackdrop from './Backdrop';

const withAuth = (WrappedComponent, allowedRoles) => {
  const WithAuthComponent = (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      if (status === 'loading') return; // Espera a que la sesión esté cargada

      if (session && session.user?.rol) {
        // console.log('Client - session:', session);

        // Si la sesión y el rol están presentes, verifica el rol del usuario
        if (allowedRoles.includes(session.user?.rol)) {
          setIsReady(true);
        } else {
          console.log('Rol no permitido:', session.user?.rol);
          router.push('/citas');
        }
      } else if (!session) {
        // Si no hay sesión, redirige al usuario
        console.log('No hay sesión, redirigiendo...');
        router.push('/');
      }
    }, [session, status, router, allowedRoles]);

    if (status === 'loading' || !isReady) {
      return <SimpleBackdrop />;
    }

    return <WrappedComponent {...props} />;
  };

  // Asignar un nombre de display para ayudar en el debug
  WithAuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuthComponent;
};

export default withAuth;
