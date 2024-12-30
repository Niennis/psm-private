'use client'
import Divider from '@mui/material/Divider';
import Image from 'next/image';
import Link from 'next/link';
import { white_logo, white_acreditacion, logo02_white } from './imagepath';
import FacebookIcon from '@mui/icons-material/Facebook';
import { LinkSharp, LocationCity } from '@mui/icons-material';
import Map from 'feather-icons-react/build/IconComponents/Map';
import Phone from 'feather-icons-react/build/IconComponents/Phone';
import Mail from 'feather-icons-react/build/IconComponents/Mail';
import { Box, useMediaQuery } from '@mui/material';

import { FaFacebookF, FaLinkedinIn, FaTwitter, FaYoutube } from "react-icons/fa";
import { BsInstagram, BsTwitterX } from "react-icons/bs";
import { FaXTwitter } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import ReserveBtn from './ReserveBtn';
import { useEffect } from 'react';

const FooterDae = () => {
  const matches = useMediaQuery('(min-width:600px)');

  const LINKS = [
    {
      title: 'Departamento de vida universitaria',
      url: 'https://dae.udp.cl/vida-universitaria/',
    },
    {
      title: 'Departamento de bienestar',
      url: 'https://dae.udp.cl/bienestar-estudiantil/',
    },
    {
      title: 'Inclusión UDP',
      url: 'https://inclusiva.udp.cl/',
    },
    {
      title: 'Departamento de género UDP',
      url: 'https://genero.udp.cl/',
    },
  ]

  useEffect(() => {
    let lastCheckedLink = null;

    const handleTouch = e => {
      var touch = e.touches[0];

      // get the DOM element
      var element = document.elementFromPoint(touch.clientX, touch.clientY);

      // make sure an element was found and it is a link
      if (element && element.tagName === 'A') {
        // interact with the DOM element
        if (lastCheckedLink) {
          lastCheckedLink.parentElement.style.backgroundColor = '';
        }

        element.parentElement.style.backgroundColor = 'grey';
        element.parentElement.style.color = 'black';
        lastCheckedLink = element;
      } else {
        if (lastCheckedLink) {
          lastCheckedLink.parentElement.style.backgroundColor = '';
          lastCheckedLink = null;
        }
      }
    };

    document.addEventListener('touchstart', handleTouch);

    return () => {
      document.removeEventListener('touchstart', handleTouch);
    };
  }, []);

  return (
    <>
      <div className="row d-flex justify-content-center sailec" style={{ backgroundColor: '#2D2D2D', margin: 0 }}>
        <Box className="container col-12 col-lg-10"
          sx={{
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            maxWidth: '1294px !important'
          }}>

          <div
            className={`row mb-4 ${matches ? 'justify-content-between' : 'justify-content-center'}`}
            style={{
              padding: '20px 0',
              borderBottom: '1px solid white',
              display: 'flex',
              justifyContent: 'center',
              gap: matches ? '0px' : '20px',
              borderBottom: '1px solid white',
            }}
          >
            <div className={`col-10 col-md-8 ${matches ? '' : 'mt-4'}`}>
              <div className="row" style={{ height: '80%' }} >

                {
                  LINKS.map((link, index) => (
                    <div
                      key={index}
                      className='col-lg-6 col-12 links-footer'
                      style={{ borderBottom: '1px solid #fff', width: matches ? '47%' : '90%', margin: '10px' }}>
                      <Link href={link.url} style={{ margin: '10px', color: '#fff' }}>
                        {link.title}
                      </Link>
                    </div>
                  ))
                }
              </div>
            </div>


            {/* BTN RESERVAR */}
            <div className={`col-10 col-md-3 ${matches ? '' : 'mt-4'} d-flex flex-column align-items-center justify-content-center`}
              style={{
                backgroundColor: "#fff",
                color: "#000",
                borderRadius: "16px",
                // width: "fit-content",
                paddingBottom: '10px',
                textWrap: 'balance',
                textAlign: 'center'
              }}>
              <p style={{ fontWeight: 700, fontSize: "20px", lineHeight: "28px", margin: "10px 0 0" }}>¿Hablemos?</p>
              <p style={{ fontSize: "14px", lineHeight: "20px", marginBottom: "8px" }}>Si necesitas ayuda, contáctanos y te ayudaremos.</p>
              <ReserveBtn text='Reservar' bgColor="#FABB00" color="#000" />
            </div>
          </div>
          {matches
            ? <>
              <div className="row my-4"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: matches ? '0px' : '20px'
                }}>
                <div className="col-10 col-lg-4 p-0">
                  <Image
                    src={logo02_white}
                    sizes="100vw"
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxWidth: '285px',
                    }}
                    width={500}
                    height={300}
                    alt=""
                  />
                </div>
                {/* REDES SOCIALES */}
                <div className="col-10 col-lg-2 d-flex flex-column align-items-end ">
                  <p>Síguenos en</p>
                  <div style={{ display: 'inline-flex' }}>
                    <a href="https://www.linkedin.com/company/udiegoportales"
                      style={{
                        color: 'white',
                        display: 'flex',
                        alignItems: 'start',
                        fontSize: '25px',
                        margin: '0 10px',
                      }}>
                      <FaLinkedinIn />
                    </a>
                    <a href="https://www.facebook.com/bienestarestudiantiludp/"
                      style={{
                        color: 'white',
                        display: 'flex',
                        alignItems: 'start',
                        fontSize: '25px',
                        margin: '0 10px',
                      }}>
                      <FaFacebookF />
                    </a>

                    <a href="https://www.instagram.com/daeudp"
                      style={{
                        color: 'white',
                        display: 'flex',
                        alignItems: 'start',
                        fontSize: '25px',
                        margin: '0 10px',
                      }}>
                      <BsInstagram />
                    </a>
                    <a href="https://twitter.com/udp_cl"
                      style={{
                        color: 'white',
                        display: 'flex',
                        alignItems: 'start',
                        fontSize: '25px',
                        margin: '0 10px',
                      }}>

                      <FaTwitter />
                      {/* <BsTwitterX  /> */}
                    </a>
                    <a href="https://www.youtube.com/channel/UCt8RovDPs5pdklo_oBVLuEw"
                      style={{
                        color: 'white',
                        display: 'flex',
                        alignItems: 'start',
                        fontSize: '25px',
                        margin: '0 10px',
                      }}>
                      <FaYoutube />
                    </a>
                  </div>
                </div>
              </div>
            </>
            : <>
              <div className="row my-4"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: matches ? '0px' : '20px'
                }}>

                {/* REDES SOCIALES */}
                <div className="col-10 col-lg-2 d-flex flex-column align-items-center ">
                  <div style={{ display: 'inline-flex' }}>
                    <a href="https://www.linkedin.com/company/udiegoportales"
                      style={{

                        color: 'white',
                        display: 'flex',
                        alignItems: 'start',
                        fontSize: '30px',
                        margin: '0 14px',
                      }}>
                      <FaLinkedinIn />
                    </a>
                    <a href="https://www.facebook.com/bienestarestudiantiludp/"
                      style={{

                        color: 'white',
                        display: 'flex',
                        alignItems: 'start',
                        fontSize: '30px',
                        margin: '0 14px',
                      }}>
                      <FaFacebookF />
                    </a>

                    <a href="https://www.instagram.com/daeudp"
                      style={{
                        color: 'white',
                        display: 'flex',
                        alignItems: 'start',
                        fontSize: '30px',
                        margin: '0 14px',
                      }}>
                      <BsInstagram />
                    </a>
                    <a href="https://twitter.com/udp_cl"
                      style={{

                        color: 'white',
                        display: 'flex',
                        alignItems: 'start',
                        fontSize: '30px',
                        margin: '0 14px',
                      }}>

                      <FaTwitter />
                      {/* <BsTwitterX  /> */}
                    </a>
                    <a href="https://www.youtube.com/channel/UCt8RovDPs5pdklo_oBVLuEw"
                      style={{

                        color: 'white',
                        display: 'flex',
                        alignItems: 'start',
                        fontSize: '30px',
                        margin: '0 14px',
                      }}>
                      <FaYoutube />
                    </a>
                  </div>
                </div>
                <div className="col-10 col-lg-4 p-0 d-flex justify-content-center">
                  <Image
                    src={logo02_white}
                    sizes="100vw"
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxWidth: '285px',
                    }}
                    width={500}
                    height={300}
                    alt=""
                  />
                </div>
              </div>
            </>
          }
        </Box>

        {
          matches
            ?
            <>
              <Box className="container col-12 col-lg-10"
                sx={{
                  color: '#000',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  maxWidth: '1294px !important',
                  bgcolor: '#fff'
                }}>
                <div className="row">
                  <div className="col-6" style={{ alignSelf: "center" }}>
                    <p style={{ fontSize: "14px", margin: "0px", padding: "10px 0" }}>
                      Dirección de Asuntos Estudiantiles - Departamento de Salud Mental Estudiantil
                    </p>
                  </div>
                  <div className="col-2" style={{ alignSelf: "center" }}>
                    <p style={{ fontSize: "12px", margin: "0px", padding: "10px 0" }}>
                      · @Daeudp · <a href='https://dae.udp.cl' style={{ color: '#000' }}>https://dae.udp.cl</a>
                    </p>
                  </div>
                  <div className="col-4" style={{ alignSelf: "center" }}>
                    <p style={{ fontSize: "12px", margin: "0px", padding: "10px 0" }}>
                      <FaLocationDot /> Av. Manuel Rodríguez 343, Santiago, Región Metropolitana
                    </p>
                  </div>
                </div>
              </Box>
            </>
            :
            <>
              <Box className="container col-10"
                sx={{
                  color: '#000',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  maxWidth: '1294px !important',
                  bgcolor: '#fff',
                  borderRadius: '8px 8px 0 0',
                }}>
                <div className="col-12" style={{ alignSelf: "center" }}>
                  <p style={{ fontSize: "12px", margin: "0px", padding: "10px 0" }}>
                    <FaLocationDot /> Av. Manuel Rodríguez 343, Santiago, Región Metropolitana
                  </p>
                </div>
                <div className="col-12" style={{ alignSelf: "center", borderRadius: '8px 8px 0 0', backgroundColor: '#A6A6A6' }}>
                  <p style={{ fontSize: "14px", margin: "0px", padding: "10px " }}>
                    Dirección de Asuntos Estudiantiles - Departamento de Salud Mental Estudiantil
                  </p>
                  <p style={{ fontSize: "12px", margin: "0px", padding: "10px " }}>
                    · @Daeudp · <a href='https://dae.udp.cl' style={{ color: '#000' }}>https://dae.udp.cl</a>
                  </p>
                </div>

              </Box>
            </>
        }
      </div>
      {/* </div> */}
    </>
  );

}

export default FooterDae;