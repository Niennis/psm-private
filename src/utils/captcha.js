function ensureReCaptchaLoaded() {
  return new Promise((resolve) => {
    if (typeof grecaptcha !== 'undefined' && typeof grecaptcha.ready === 'function') {
      resolve();
      return;
    }

    // Esperar un poco más si no está disponible inmediatamente
    const checkInterval = setInterval(() => {
      if (typeof grecaptcha !== 'undefined' && typeof grecaptcha.ready === 'function') {
        clearInterval(checkInterval);
        resolve();
      }
    }, 100);

    // Establecer un tiempo máximo de espera
    setTimeout(() => {
      clearInterval(checkInterval);
      console.error("Tiempo de espera para reCAPTCHA excedido");
      resolve(); // Resolvemos de todas formas para no bloquear la aplicación
    }, 5000);
  });
}

export async function getCaptchaToken() {
  await ensureReCaptchaLoaded();

  return new Promise(resolve => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    // Verificar que siteKey existe
    if (!siteKey) {
      console.error("No se encontró la clave del sitio para reCAPTCHA");
      resolve(null);
      return;
    }

    // Verificar que grecaptcha existe
    if (typeof grecaptcha === 'undefined') {
      console.error("El objeto grecaptcha no está disponible");
      resolve(null);
      return;
    }

    // Verificar que el método ready está disponible
    if (typeof grecaptcha.ready !== 'function') {
      console.error("El método grecaptcha.ready no está disponible");
      resolve(null);
      return;
    }
    grecaptcha.ready(async () => {

      try {
        const token = await grecaptcha.execute(siteKey, {
          action: 'login'
        });
        resolve(token);
      } catch (error) {
        console.error("Error al ejecutar reCAPTCHA:", error);
        resolve(null);
      }
    })
  })
}

export async function verifyCaptchaToken(token) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    throw new Error("No se enocntró la key")
  }

  const url = new URL("https://www.google.com/recaptcha/api/siteverify")

  url.searchParams.append('secret', secretKey)

  url.searchParams.append('response', token)

  const res = await fetch(url, { method: 'POST' })
  const captchaData = await res.json()

  if (!res.ok) return null;

  return captchaData;
}