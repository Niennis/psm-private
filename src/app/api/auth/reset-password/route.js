import jwt from 'jsonwebtoken';
import { sendRecoveryEmail } from '@/services/UsersServices';

export async function POST(req) {

  const headers = {
    'Access-Control-Allow-Origin': process.env.NEXTAUTH_URL,
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const body = await req.json(); // Parsear el cuerpo de la solicitud
    const { email } = body;

    if (!email) {
      return new Response(
        JSON.stringify({ message: 'Email is required' }),
        { status: 400 }
      );
    }

    // Generar un token de restablecimiento (expira en 1 hora)
    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    const resetLink = `${process.env.NEXTAUTH_URL}/cambiar-contrasena?token=${resetToken}`;

    // Llamar al servicio para enviar el email
    await sendRecoveryEmail(email, resetLink);
    
    return new Response(
      JSON.stringify({ message: 'Correo de recuperación enviado. Revisa tu bandeja de entrada' }),
      { status: 200, headers }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Error al enviar el email', error: error.message }),
      { status: 500, headers }
    );
  }
}
