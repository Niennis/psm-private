import jwt from 'jsonwebtoken';
import { changePassword } from '@/services/DoctorsServices';
import { fetchUserByEmail } from '@/services/UsersServices';

export async function POST(req) {
  try {
    const body = await req.json(); // Parsear el cuerpo de la solicitud
    const { token, password } = body;
    if (!token || !password) {
      return new Response(
        JSON.stringify({ message: 'Token and password are required' }),
        { status: 400 }
      );
    }
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;
    const foundUser = await fetchUserByEmail(email)

    const user = {
      contrasena: password,
      id_user: foundUser.id,
    }
    // Llamar a la API externa para cambiar la contraseña
    const response = await changePassword(user)

    if (!response.validacion) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to change password');
    }

    return new Response(
      JSON.stringify({ message: 'Password changed successfully' }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: 'Invalid or expired token',
        error: error.message,
      }),
      { status: 400 }
    );
  }
}
