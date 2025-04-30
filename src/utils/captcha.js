function ensureReCaptchaLoaded(timeout = 5000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    console.log('typeof grecaptcha.ready:', typeof grecaptcha.ready);

    (function check() {
      if (typeof grecaptcha !== 'undefined' && typeof grecaptcha.ready === 'function') {
        resolve();
      } else if (Date.now() - start >= timeout) {
        console.error("Tiempo de espera para reCAPTCHA excedido");
        resolve(); // o reject();
      } else {
        setTimeout(check, 100);
      }
    })();
  });
}

export async function getCaptchaToken() {
  await ensureReCaptchaLoaded();

  return new Promise(resolve => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!siteKey) {
      console.error("No se encontró la clave del sitio para reCAPTCHA");
      resolve(null);
      return;
    }

    if (typeof grecaptcha === 'undefined' || typeof grecaptcha.ready !== 'function') {
      console.error("El objeto grecaptcha no está disponible o no tiene ready");
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
    });
  });
}

export async function verifyCaptchaToken(token) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    throw new Error("No se encontró la key");
  }

  const url = new URL("https://www.google.com/recaptcha/api/siteverify");
  url.searchParams.append('secret', secretKey);
  url.searchParams.append('response', token);

  const res = await fetch(url, { method: 'POST' });
  const captchaData = await res.json();
  console.log('captchaData:', captchaData);

  if (!res.ok) return null;

  return captchaData;
}