"use server"

import { verifyCaptchaToken } from '@/utils/verifyCaptchaToken'

export async function logInAction(token, formData) {
  if (!token) {
    return {
      success: false,
      message: "Token no encontrado"
    }
  }

  const captchaData = await verifyCaptchaToken(token)

  if (!captchaData || !captchaData.success) {
    return {
      success: false,
      message: "Captcha falló",
      errors: captchaData?.["error-codes"],
    }
  }

  return {
    success: true,
    message: "Captcha verificado correctamente",
  }
}


let serverData;
export const setServerData = data => {
  serverData = data;
}

export const getServerData = () => {
  return serverData;
}