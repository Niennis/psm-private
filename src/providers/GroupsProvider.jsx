'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const GroupContext = createContext()

export function GroupProvider({ children }) {
  const [selectedGroupId, setSelectedGroupId] = useState(null)

  // Cargar el ID guardado al iniciar
  useEffect(() => {
    const savedId = localStorage.getItem('selectedGroupId')
    if (savedId) setSelectedGroupId(savedId)
  }, [])

  // Guardar en localStorage cuando cambie
  const updateSelectedGroupId = (id) => {
    setSelectedGroupId(id)
    localStorage.setItem('selectedGroupId', id)
  }

  return (
    <GroupContext.Provider 
      value={{ 
        selectedGroupId, 
        setSelectedGroupId: updateSelectedGroupId 
      }}
    >
      {children}
    </GroupContext.Provider>
  )
}

export function useGroupContext() {
  const context = useContext(GroupContext)
  if (!context) {
    throw new Error('useGroupContext debe usarse dentro de un GroupProvider')
  }
  return context
}