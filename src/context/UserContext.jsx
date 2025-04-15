'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [selectedUserId, setSelectedUserId] = useState(null)

  // Cargar el ID guardado al iniciar
  useEffect(() => {
    const savedId = localStorage.getItem('selectedUserId')
    if (savedId) setSelectedUserId(savedId)
  }, [])

  // Guardar en localStorage cuando cambie
  const updateSelectedUserId = (id) => {
    setSelectedUserId(id)
    localStorage.setItem('selectedUserId', id)
  }

  return (
    <UserContext.Provider 
      value={{ 
        selectedUserId, 
        setSelectedUserId: updateSelectedUserId 
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUserContext() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUserContext debe usarse dentro de un UserProvider')
  }
  return context
}