"use client";

import { createContext, useContext, useState } from 'react';

// Crear el contexto
const DisponibilidadContext = createContext();

// Proveedor de contexto
const DisponibilidadProvider = ({ children }) => {
  const [data, setData] = useState('');
  return (
    <DisponibilidadContext.Provider value={{ data, setData }}>
      {children}
    </DisponibilidadContext.Provider>
  );
};

// Hook para usar el contexto
const useDisponibilidadContext = () => useContext(DisponibilidadContext);

export { DisponibilidadProvider, useDisponibilidadContext };
