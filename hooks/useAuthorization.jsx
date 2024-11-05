import { useRouter } from 'next/router';
import { useEffect } from 'react';

// Hook de autorización
export const useAuthorization = (allowedRoles,userRoles) => {
  const router = useRouter();

  useEffect(() => {
    // Lógica de comprobación de roles
    // Esto normalmente vendría del backend o del contexto de usuario
    // const userRoles = ['admin', 'usuario']; 

    // Verificar si el usuario tiene uno de los roles permitidos
    const hasPermission = allowedRoles.some(role => userRoles.includes(role));

    if (!hasPermission) {
      // Redireccionar a una página de acceso denegado o a la página de inicio de sesión
      router.push('/access-denied');
    }
  }, []);

  return <></>; // No necesitas renderizar nada aquí, solo redirecciona si es necesario
};

