import "./globals.css";
import "../assets/css/bootstrap.css"
import Header from "@/components/Header";
import Script from 'next/script'
import Sidebar from "@/components/Sidebar";
import AuthProvider from "@/providers/AuthProvider";
import { getServerSession } from "next-auth";
import { SectionProvider } from "@/context/SectionContext";
import { SidebarProvider } from '@/context/SidebarContext';
import { DisponibilidadProvider } from "@/context/DisponibilidadContext";
import UserWrapper from "@/providers/UseProvider";
import Welcome from "@/components/Welcome";

// import Hotjar from '@hotjar/browser';

const siteId = 3920275;
// const hotjarVersion = 6;

// Hotjar.init(siteId, hotjarVersion);

// export const metadata = {
//   title: "UDP Portal Salud Mental",
// };

export default async function RootLayout({ children, props }) {

  const session = await getServerSession();
  return (
    <AuthProvider session={session}>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <title>Salud Mental Estudiantil UDP</title>

          <Script src="https://kit.fontawesome.com/7a6fedca6c.js" ></Script>
          <Script id="fontawesome" src="https://kit.fontawesome.com/a790242b27.js" ></Script>
          <Script id="hotjar" strategy="afterInteractive" dangerouslySetInnerHTML={{
            __html:
              `(function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:3921307,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=')`
          }}></Script>
          <Script
            strategy="beforeInteractive"
            src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          />
        </head>
        <body>

          <SectionProvider>
            <SidebarProvider>
              <UserWrapper>
                <DisponibilidadProvider>
                  {/* <LoadingProvider> */}
                  <Header />

                  {session && <Sidebar />}
                  <Welcome session={session}>
                    {children}
                  </Welcome>
                  {/* </LoadingProvider> */}
                </DisponibilidadProvider>
              </UserWrapper>
            </SidebarProvider>
          </SectionProvider>
          {/* <Script src="./bot.js" data-args="Salud mental, #FFFFFF, #AA3C80FF, ./bot_salud_mental.png" id="bot"></Script> */}
        </body>
      </html>
    </AuthProvider>
  );
}
