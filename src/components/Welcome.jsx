'use client'
import { useSession } from "next-auth/react"
import Image from "next/image"
import { morning_img_01 } from "./imagepath"
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Definir rutas públicas (ajusta según tu aplicación)
const PUBLIC_ROUTES = ['/', '/login', '/register', '/about', '/blogs']

const Welcome = ({ children }) => {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname)

  const showWelcome = session && !isPublicRoute

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return children
  }

  return (
    <>
      {showWelcome && (
        <div className="page-wrapper mt-4 pt-5">
          <div className="content">
            <div className="good-morning-blk m-0">
              <div className="row">
                <div className="col-md-6">
                  <div className="morning-user">
                    <h2>
                      Buen día, <span>{session?.user?.nombre_social}</span>
                    </h2>
                    {
                      session?.user?.rol === 'alumno' ?
                        <p>Ten un buen día en clases</p>
                        :
                        <p>Ten un buen día en el trabajo</p>
                    }
                  </div>
                </div>
                <div className="col-md-6 position-blk" style={{
                  overflow: 'hidden',
                  display: 'flex',
                  justifyContent: 'center', // Centra horizontalmente
                  alignItems: 'flex-end' // Alinea en la parte inferior
                }}>
                  <div className="morning-img desktop" style={{
                    position: 'relative',
                    width: '200px', // Ancho fijo (ajusta según necesites)
                    height: '150px' // Altura fija (ajusta según necesites)
                  }}>
                    <Image
                      src={morning_img_01}
                      alt="#"
                      fill
                      style={{
                        objectFit: 'contain', // Mantiene relación de aspecto sin recortar
                        objectPosition: 'bottom'
                      }}
                      sizes="(max-width: 768px) 200px, 200px" // Tamaño fijo en todos los dispositivos
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {children}
    </>
  )
}

export default Welcome