"use client";
import React, { createContext, useContext, useState } from "react";

// Crear el contexto
const SidebarContext = createContext();

// Proveedor del contexto
export const SidebarProvider = ({ children, initialProps = {} }) => {
  const [props, setProps] = useState(initialProps);

  return (
    <SidebarContext.Provider value={{ props, setProps }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Hook para usar el contexto
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar debe ser usado dentro de un SidebarProvider");
  }
  return context;
};
