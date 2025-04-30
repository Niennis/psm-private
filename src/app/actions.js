"use server"

import { verifyCaptchaToken } from "@/utils/captcha"

export async function logInAction(token, formData) {
  if (!token) {
    return {
      success: false,
      message: "Token no encontrado"
    }
  }

  const captchaData = await verifyCaptchaToken(token)
console.log('captchaData:', captchaData.score);

  if (!captchaData || !captchaData.success || captchaData.score < 0.5) {
    return {
      success: false,
      message: "Captcha falló",
      errors: !captchaData?.success ? captchaData?.["error-codes"] : undefined,
    }
  }

  return {
    success: true,
    message: "Verificado",
    score: captchaData.score
  }
}

let serverData;
export const setServerData = data => {
  serverData = data;
}

export const getServerData = () => {
  return serverData;
}