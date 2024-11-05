import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request, response) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY

  const postData = await request.json()

  console.log('POSTDATA', postData)

  const { token } = postData

  let res;

  const formData = `secret=${secretKey}&response=${token}`

  console.log('FOMR DATA', formData)

  try {
    res = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
      }
    )
  } catch (error) {
    return NextResponse.json({ success: false })
  }

  if (res && res.data?.success && res.data?.score > 0.5) {
    console.log('res.data?.score:', res.data?.score)

    return NextResponse.json({
      success: true,
      score: res.data.score
    })

  } else {
    return NextResponse.json({ success: false })
  }

}