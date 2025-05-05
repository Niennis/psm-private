'use client'
import Login from "@/components/Login";
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { useSession } from "next-auth/react";

const Home = () => {
  const {data: session} = useSession()
  // Redirección directa en el servidor si hay sesión
  if (session) {
    if(session?.user?.rol === 'administrador' || session?.user?.rol === 'profesional')
    redirect('/pacientes')
  } else if( session?.user?.rol === 'alumno') {
    redirect('/citas')
  }

  return (
      <Login />

  );
};

export default Home;
