"use server"

import { verifyCaptchaToken } from "@/utils/captcha"

export async function logInAction(token, formData) {
  if (!token) {
    return {
      success: false,
      message: "Token no encontrado"
    }
  }

  // verificar el token
  const captchaData = await verifyCaptchaToken(token)

  if (!captchaData) {
    return {
      success: false,
      message: "Captcha falló"
    }
  }

  if (!captchaData.success || captchaData.score < 0.5){
    return {
      success: false,
      message: "Captcha falló",
      errors: !captchaData.success ? captchaData["error-codes"] : undefined,
    }
  }

    // success response
  return {
    success: true,
    message: "Verificado"
  }
}
