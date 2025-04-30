"use client";
import React, { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export const SidebarProvider = ({ children, initialProps = {} }) => {
  const [props, setProps] = useState(initialProps);

  return (
    <SidebarContext.Provider value={{ props, setProps }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar debe ser usado dentro de un SidebarProvider");
  }
  return context;
};