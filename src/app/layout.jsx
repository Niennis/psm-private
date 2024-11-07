import { Inter } from "next/font/google";
import { Roboto } from "next/font/google";
import "./globals.css";
import "../assets/css/bootstrap.css"
import Header from "@/components/Header";
import Script from 'next/script'
// import TanstackProvider from "@/providers/TanstackProvider";
import AuthProvider from "@/providers/AuthProvider";
import { SectionProvider } from "@/context/SectionContext";
import { getServerSession } from "next-auth";
const inter = Inter({ subsets: ["latin"] });
// import Hotjar from '@hotjar/browser';
import GoogleReCaptchaWrapper from "@/providers/GoogleCaptchaWrapper";

const siteId = 3920275;
// const hotjarVersion = 6;

// Hotjar.init(siteId, hotjarVersion);

// export const metadata = {
//   title: "UDP Portal Salud Mental",
// };

const roboto_init = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '700'],
  variable: '--font-roboto'
})

export default async function RootLayout({ children }) {

  const session = await getServerSession()

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <title>Salud Mental Estudiantil UDP</title>
        {/* <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" integrity="sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N" as="script" crossOrigin="anonymous" /> */}

        {/* <Script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" as="script" crossOrigin="anonymous"></Script> */}
        {/* <Script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-Fy6S3B9q64WdZWQUiU+q4/2Lc9npb8tCaSX9FK7E8HnRr0Jz8D6OP9dO5Vg3Q9ct" as="script" crossOrigin="anonymous"></Script> */}
        
        <Script src="https://kit.fontawesome.com/7a6fedca6c.js" ></Script>
        <Script id="fontawesome" src="https://kit.fontawesome.com/a790242b27.js" ></Script>
        {/* <Script id="hotjar" strategy="afterInteractive" dangerouslySetInnerHTML={{
          __html:
            `(function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:3921307,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=')`
        }}></Script> */}
      </head>
      <body className={`${roboto_init.variable}`}>
      <Script
          strategy="beforeInteractive"
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        />
        <AuthProvider session={session}>
          <SectionProvider>
            {/* <TanstackProvider> */}
            <Header />
            <GoogleReCaptchaWrapper>

              {children}
            </GoogleReCaptchaWrapper>

            {/* </TanstackProvider> */}
          </SectionProvider>
        </AuthProvider>
        <Script src="./bot.js" data-args="Salud mental, #FFFFFF, #AA3C80FF, ./bot_salud_mental.png" id="bot"></Script>
      </body>
    </html>
  );
}
