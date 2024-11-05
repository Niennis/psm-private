// components/ProtectedPage.js
// import { useUser } from '@/context/auth-context';
'use client'
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
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
  // console.log('PROTECTED', session)
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    switch (level) {
      case level.includes('admin'):
        if ((!session && protectedToRoutes.includes(pathname)) || session.user.rol !== "admin") {
          router.push('/');
        }
        break;
      case level.includes('profesional'):
        if ((!session && protectedToRoutes.includes(pathname))
          || session.user.rol !== "admin" && session.user.rol !== "profesional") {
          router.push('/');
        }
        break;
      case level.includes('alumno'):
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
