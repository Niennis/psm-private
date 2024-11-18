import { withAuth } from 'next-auth/middleware'

export default withAuth({
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/',
    error: '/error/page',
  },
  async authorized({ token }) {
    if (token) {
      if (token.rol === 'admin') {
        // Admin tiene acceso a todo
        return true; 
      }

      if (token.rol === 'profesional') {
        // Validaciones adicionales para profesionales de ser necesarias
        return true;
      }

      if (token.rol === 'alumno') {
        // Validaciones adicionales para profesionales de ser necesarias
        return true;
      }
    }

    return false; // No autorizado
  },
})
