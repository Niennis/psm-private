import GoogleReCaptchaWrapper from "@/providers/GoogleCaptchaWrapper";

export default function LoginLayout({ children }) {
  return (
    <>
      <GoogleReCaptchaWrapper>
        {children}
      </ GoogleReCaptchaWrapper>

    </>
  )

}