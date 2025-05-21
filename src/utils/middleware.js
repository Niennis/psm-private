import { withAuth } from 'next-auth/middleware';

export default withAuth({
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/', // Página de login
    error: '/error/page', // Página de errores
  },
  authorized({ token }) {
    // Optimización: Revisa el token sin roles adicionales.
    return token && ['administrador', 'profesional', 'alumno', 'blend'].includes(token.rol);
  },
});


// import { withAuth } from 'next-auth/middleware'

// export default withAuth({
//   secret: process.env.NEXTAUTH_SECRET,
//   pages: {
//     signIn: '/',
//     error: '/error/page',
//   },
//   async authorized({ token }) {
//     if (token) {
//       if (token.rol === 'administrador') {
//         // Admin tiene acceso a todo
//         return true; 
//       }

//       if (token.rol === 'profesional') {
//         // Validaciones adicionales para profesionales de ser necesarias
//         return true;
//       }

//       if (token.rol === 'alumno') {
//         // Validaciones adicionales para profesionales de ser necesarias
//         return true;
//       }
//     }

//     return false; // No autorizado
//   },
// })
/* 
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  // Si no hay token, redirigir al login
  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Validar roles (ejemplo: acceso solo a admins para rutas específicas)
  if (pathname.startsWith('/calender') && (token.role !== 'profesional' || token.role !== 'administrador')) {
    return NextResponse.redirect(new URL('/citas', req.url));
  }

  if (pathname.startsWith('/citas/agendarcita') && (token.role !== 'profesional' || token.role !== 'administrador')) {
    return NextResponse.redirect(new URL('/citas', req.url));
  }

  if (pathname.startsWith('/fichas') && (token.role !== 'profesional' || token.role !== 'administrador')) {
    return NextResponse.redirect(new URL('/citas', req.url));
  }

  if (pathname.startsWith('/horrios') && (token.role !== 'profesional' || token.role !== 'administrador')) {
    return NextResponse.redirect(new URL('/citas', req.url));
  }

  if (pathname === '/profesionales/agregar' && userRole !== 'administrador') {
    return NextResponse.redirect(new URL('/citas', req.url));
  } if (pathname.startsWith('/profesionales')) {
    if (pathname === '/profesionales' || pathname === '/profesionales/editar' || /^\/profesionales\/\d+$/.test(pathname)) {
      if (userRole !== 'profesional' && userRole !== 'administrador') {
        return NextResponse.redirect(new URL('/citas', req.url));
      }
    } else {
      // Cualquier otra ruta dentro de /profesionales que no esté específicamente manejada 
      return NextResponse.redirect(new URL('/citas', req.url));
    }
  }

  if (pathname.startsWith('/profesionales/agregarprofesional') && (token.role !== 'administrador')) {
    return NextResponse.redirect(new URL('/citas', req.url));
  } else if (pathname.startsWith('/profesionales/') && (token.role !== 'profesional' || token.role !== 'administrador')) {
    return NextResponse.redirect(new URL('/citas', req.url));
  }





  return NextResponse.next();
}

export const config = {
  matcher: [
    '/calender/:path*',
    '/citas/:path*',
    '/fichas/:path*',
    '/horarios/:path*',
    '/pacientes/:path*',
    '/profesionales/:path*',
    '/blog',
    '/blog/agregarblog',
    '/blog/editar',
  ], // Rutas protegidas
};
 */