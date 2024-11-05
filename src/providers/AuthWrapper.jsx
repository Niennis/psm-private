"use client"
import { createContext, useContext, useState } from "react";
// import Headerupd from "../../Headerudp";
// import Approuter from "../../../approuter";
// import { RenderRoutes } from "../../../RenderNavigation";
import RootLayout from "@/app/layout";
import { fetchUserMailAndPass } from "../services/UsersServices"

const AuthContext = createContext({})
export const AuthData = () => useContext(AuthContext)

export const AuthWrapper = () => {
  const [user, setUser] = useState({ name: "", usAuthenticated: false })

  const login = async (data) => {
    console.log(('DATA del wrapper', data));
    try {
      const res = await fetchUserMailAndPass(data)
      console.log(res.contrasena);
      return new Promise((resolve, reject) => {
        if (data.password === res.contrasena){
          setUser({name: res.nombre, isAuthenticated: true})
          resolve('success')
        } else {
          reject('Contraseña incorrecta')
        }
    })
    } catch (err) {
      console.log(err)
    }
  }

  const logout = () => {
    setUser({...user, isAuthenticated: false})
  }

  return (
    <AuthContext.Provider value={{user, login, logout}}>
      <>
        <RootLayout />
      </>
    </AuthContext.Provider>
  )

}