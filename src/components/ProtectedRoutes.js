// components/ProtectedPage.js
// import { useUser } from '@/context/auth-context';
'use client'
import { useEffect } from 'react';
import { useSession, getSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

const protectedToRoutes = [
  "/blog",
  "/blog/agregarblog",
  "/blog/editar/:path",
  "/citas",
  "/citas/:path*",
  "/citas/agendarentrevista",
  "/citas/agendarcita",
  "/horarios",
  "/horarios/agregarhorario/:path",
  "/dashboard",
  "/pacientes",
  "/pacientes/:path*",
  "/profesionales",
  "/profesionales/agregarprofesional",
  "/profesionales/:path",
];

const ProtectedPage = ({ children, level }) => {
  // const { user } = useUser();
  const { data: session } = useSession()
  // console.log('PROTECTED', session, level)
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    switch (level) {
      case level.includes('admin'):
        console.log('ENTRÓ COMO ADMIN')
        if ((!session && protectedToRoutes.includes(pathname)) || session.user?.rol !== "admin") {
          router.push('/');
        }
        break;
      case level.includes('profesional'):
        console.log('ENTRÓ COMO PROFESIONAL')
        if ((!session && protectedToRoutes.includes(pathname))
          || (session.user?.rol !== "admin" && session.user?.rol !== "profesional")) {
          router.push('/');
        }
        break;
      case level.includes('alumno'):
        console.log('ENTRÓ COMO ALUMNO')
        if ((!session && protectedToRoutes.includes(pathname))) {
          router.push('/');
        }
        break;

      default:
        if ((!session && protectedToRoutes.includes(pathname))) {
          router.push('/');
        }
        break;
    }

  }, [session, pathname, router]);

  return session ? children : null;
};

export default ProtectedPage;


// const ProtectedPage = ({ children, level }) => {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const pathname = usePathname();
//   useEffect(() => {
//     if (!session) {
//       router.push('/'); return;
//     }

//     const userRole = session.user.rol;
//     // Función para comprobar acceso 
//     const hasAccess = () => {
//       if (level.includes('admin') && userRole === 'admin') return true;
//       if (level.includes('profesional') && (userRole === 'admin' || userRole === 'profesional')) return true;
//       if (level.includes('alumno') && (userRole === 'admin' || userRole === 'profesional' || userRole === 'alumno')) return true;
//       return false;
//     };
//     if (protectedToRoutes.some(route => pathname.startsWith(route)) && !hasAccess()) {
//       router.push('/');

//     }
//   }, [session, pathname, router, level]);
//   return session ? children : null;
// };

// export default ProtectedPage;