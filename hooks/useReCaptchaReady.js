import { useEffect, useState } from "react"

export function useReCaptchaReady() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let intervalId
    let timeoutId

    function checkReady() {
      if (typeof grecaptcha !== 'undefined' && typeof grecaptcha.ready === 'function') {
        grecaptcha.ready(() => {
          setIsReady(true)
        })
        return true
      }
      return false
    }

    if (!checkReady()) {
      intervalId = setInterval(() => {
        if (checkReady()) {
          clearInterval(intervalId)
          clearTimeout(timeoutId)
        }
      }, 300)

      timeoutId = setTimeout(() => {
        clearInterval(intervalId)
        setIsReady(false)
        console.error("reCAPTCHA no está disponible después del tiempo de espera")
      }, 5000)
    }

    return () => {
      clearInterval(intervalId)
      clearTimeout(timeoutId)
    }
  }, [])

  return isReady
}
