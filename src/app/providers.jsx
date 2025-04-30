'use client'

import AuthProvider from "@/providers/AuthProvider"
import { SectionProvider } from "@/context/SectionContext"
import { SidebarProvider } from "@/context/SidebarContext"
import UserWrapper from "@/providers/UseProvider"
import { DisponibilidadProvider } from "@/context/DisponibilidadContext"
import GoogleReCaptchaWrapper from "@/providers/GoogleCaptchaWrapper"

export default function AppProviders({ children, session }) {
  return (
    <AuthProvider session={session} >
      <GoogleReCaptchaWrapper>
        <SectionProvider>
          <SidebarProvider  >
            <UserWrapper>
              <DisponibilidadProvider>
                {children}
              </DisponibilidadProvider>
            </UserWrapper>
          </SidebarProvider>
        </SectionProvider>
      </GoogleReCaptchaWrapper>
    </AuthProvider>
  )
}