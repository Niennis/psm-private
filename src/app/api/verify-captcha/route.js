// v2

// app/api/verify-captcha/route.js
export async function POST(request) {
  const body = await request.json()
  const token = body.token

  const secret = process.env.RECAPTCHA_SECRET_KEY

  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secret}&response=${token}`,
    }
  )

  const data = await response.json()
  return Response.json(data)
}
