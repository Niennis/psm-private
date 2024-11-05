"use client"

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3"

export default function GoogleReCaptchaWrapper({ children }) {
  const recaptchaKey = process?.env?.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={recaptchaKey ?? "NOT DEFINED"}>
      {children}
    </GoogleReCaptchaProvider>
  )
}