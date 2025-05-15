'use client'
import Image from 'next/image';
import Link from 'next/link';
import { logo02_white } from './imagepath';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/system/useMediaQuery';

import ReserveBtn from './ReserveBtn';
import { useEffect } from 'react';
import { acreditacion } from './imagepath';

const FooterDae = () => {
  const matches = useMediaQuery('(min-width:600px)');
  const isMediumSize = useMediaQuery('(min-width:768px)');
  const isLargSize = useMediaQuery('(min-width:1024px)');

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
      <div className="row d-flex justify-content-center title-regular" style={{ backgroundColor: '#2D2D2D', margin: 0, width: '100%' }}>
        <Box className="container col-12 col-lg-10"
          sx={{
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            // maxWidth: '1294px !important'
          }}>

          <div
            className={`row mb-4 ${isMediumSize ? 'justify-content-between' : 'justify-content-center'}`}
            style={{
              padding: '20px 0',
              borderBottom: '1px solid white',
              display: 'flex',
              justifyContent: 'center',
              gap: isMediumSize ? '0px' : '30px',
              borderBottom: '1px solid white',
              // margin:  isMediumSize ? '0' : ''
              margin: 0,
            }}
          >
            <div className={`col-12 col-md-9 ${isMediumSize ? '' : 'mt-4'}`}>
              <div className="row" style={{ height: '80%', margin: 0, }} >

                {
                  LINKS.map((link, index) => (
                    <div
                      key={index}
                      className=' col-12 col-lg-5 links-footer'
                      style={{ borderBottom: '1px solid #fff', width: isLargSize ? '47%' : '90%', margin: '10px 0 10px 10px' }}>
                      <Link href={link.url} style={{ margin: '5px 0', color: '#fff' }}>
                        {link.title}
                      </Link>
                    </div>
                  ))
                }
              </div>
            </div>

            {/* BTN RESERVAR */}
            <div className={`col-10 col-md-3 ${isMediumSize ? '' : 'mt-4'} d-flex flex-column align-items-center justify-content-center`}
              style={{
                backgroundColor: "#fff",
                color: "#000",
                borderRadius: "16px",
                // width: "fit-content",
                paddingBottom: '10px',
                textWrap: 'balance',
                textAlign: 'center'
              }}>
              <p className="title-bold mt-3" >¿Hablemos?</p>
              <p className="body-small-regular mb-3">Si necesitas ayuda, contáctanos y te ayudaremos.</p>
              <ReserveBtn text='Reservar' bgColor="#FABB00" color="#000" />
            </div>
          </div>

          {(isMediumSize || isLargSize)
            ? <>
              <div className="row my-4"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between', margin: 0,
                }}>
                <div className="col-10 col-md-4 col-lg-4 p-0 d-flex flex-column align-items-start">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_IMG}logo02_white.png${process.env.NEXT_PUBLIC_KEY_IMG}`}
                    sizes="100vw"
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxWidth: '285px',
                    }}
                    width={500}
                    height={300}
                    alt="Logo UDP"
                  />
                </div>
                <div className="col-10 col-md-4 col-lg-4 d-flex flex-column align-items-center">
                  <Image
                    src={acreditacion}
                    sizes="100vw"
                    style={{
                      width: '100%',
                      height: 'auto',
                      // maxWidth: '285px',
                    }}
                    width={500}
                    height={300}
                    alt="Logo acreditación"
                  />
                </div>

                {/* REDES SOCIALES */}
                <div className="col-10 col-lg-4 d-flex flex-column align-items-end ">
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
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="https://www.facebook.com/bienestarestudiantiludp/"
                      style={{
                        color: 'white',
                        display: 'flex',
                        alignItems: 'start',
                        fontSize: '25px',
                        margin: '0 10px',
                      }}>
                      <i className="fab fa-facebook-f"></i>
                    </a>

                    <a href="https://www.instagram.com/daeudp"
                      style={{
                        color: 'white',
                        display: 'flex',
                        alignItems: 'start',
                        fontSize: '25px',
                        margin: '0 10px',
                      }}>
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://twitter.com/udp_cl"
                      style={{
                        color: 'white',
                        display: 'flex',
                        alignItems: 'start',
                        fontSize: '25px',
                        margin: '0 10px',
                      }}>
                      <i className="fab fa-twitter"></i>
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
                      <i className="fab fa-youtube"></i>
                    </a>
                  </div>
                </div>
              </div>
            </>

            :
            <>
              <div className="row my-4"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: isMediumSize ? '0px' : '20px'
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
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="https://www.facebook.com/bienestarestudiantiludp/"
                      style={{

                        color: 'white',
                        display: 'flex',
                        alignItems: 'start',
                        fontSize: '30px',
                        margin: '0 14px',
                      }}>
                      <i className="fab fa-facebook-f"></i>
                    </a>

                    <a href="https://www.instagram.com/daeudp"
                      style={{
                        color: 'white',
                        display: 'flex',
                        alignItems: 'start',
                        fontSize: '30px',
                        margin: '0 14px',
                      }}>
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://twitter.com/udp_cl"
                      style={{

                        color: 'white',
                        display: 'flex',
                        alignItems: 'start',
                        fontSize: '30px',
                        margin: '0 14px',
                      }}>

                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="https://www.youtube.com/channel/UCt8RovDPs5pdklo_oBVLuEw"
                      style={{

                        color: 'white',
                        display: 'flex',
                        alignItems: 'start',
                        fontSize: '30px',
                        margin: '0 14px',
                      }}>
                      <i className="fab fa-youtube"></i>
                    </a>
                  </div>
                </div>
                <div className="col-10 col-lg-4 p-0 d-flex justify-content-center">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_IMG}logo02_white.png${process.env.NEXT_PUBLIC_KEY_IMG}`}
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
                <div className="col-12 col-lg-4 d-flex flex-column align-items-center" >
                  <Image
                    src={acreditacion}
                    sizes="100vw"
                    style={{
                      width: '100%',
                      height: 'auto',
                      margin: 0,
                      padding: 0,
                      // maxWidth: '285px',
                    }}
                    width={700}
                    height={500}
                    alt="Logo acreditación"
                  />
                </div>
              </div>
            </>
          }
        </Box>

        {
          isMediumSize || isLargSize
            ?
            <>
              <Box className="container col-10 col-lg-10"
                sx={{
                  bgcolor: '#fff',
                  color: '#000',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  // maxWidth: '1294px !important',
                  textAlign: 'center',
                  minWidth: '100vw',
                }}>
                <div className="row">
                  <div className="col-6">
                    <p className="body-small-regular m-0 px-0 py-2 text-center">
                      Dirección de Asuntos Estudiantiles - Departamento de Salud Mental Estudiantil
                    </p>
                  </div>
                  <div className="col-2">
                    <p className="body-small-regular m-0 px-0 py-2 text-center">
                      · @Daeudp · <a href='https://dae.udp.cl' style={{ color: '#000' }}>https://dae.udp.cl</a>
                    </p>
                  </div>
                  <div className="col-4">
                    <p className="body-small-regular m-0 px-0 py-2 text-center">
                      <i className="fas fa-map-marker-alt"></i> Av. Manuel Rodríguez 343, Santiago, Región Metropolitana
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
                <div className="col-12">
                  <p className="body-small-regular m-0 px-0 py-2 text-center">
                    <i className="fas fa-map-marker-alt"></i> Av. Manuel Rodríguez 343, Santiago, Región Metropolitana
                  </p>
                </div>
                <div className="col-12 align-self-center" style={{ borderRadius: '8px 8px 0 0', backgroundColor: '#A6A6A6' }}>
                  <p className="body-small-regular m-0 px-0 py-2 text-center" style={{ textWrap: 'balance' }}>
                    Dirección de Asuntos Estudiantiles - Departamento de Salud Mental Estudiantil
                  </p>
                  <p className="body-small-regular m-0 px-0 py-2 text-center">
                    @Daeudp · <a href='https://dae.udp.cl' style={{ color: '#000' }}>https://dae.udp.cl</a>
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