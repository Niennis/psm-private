"use client";
import { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export const SidebarProvider = ({ children, initialProps = {} }) => {
  const [props, setProps] = useState(initialProps);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ props, setProps, sidebarOpen, setSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("useSidebar debe ser usado dentro de un SidebarProvider");
  return context;
};