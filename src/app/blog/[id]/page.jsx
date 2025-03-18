'use client'
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
import { useEffect, useState, Fragment } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';
import FeatherIcon from 'feather-icons-react/build/FeatherIcon';
import Select from "react-select";
/* eslint-disable no-unused-vars */
import { fetchBlog } from '@/services/BlogServices';
import FooterDae from '@/components/FooterDae';
import { blogs } from '@/utils/blogs';
import useMediaQuery from '@mui/material/useMediaQuery';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { FaArrowLeft } from "react-icons/fa";
import { FaDownload } from 'react-icons/fa';
import withAuth from '@/components/withAuth';
import CacheHandler from "@/utils/cache-handler";
import ParserImgToImage from '@/components/Parser';

const cacheHandler = new CacheHandler();

const normalizarTexto = (texto) =>{
  // Expresiones regulares dinámicas para base y key
  const baseRegex = new RegExp(`(${process.env.NEXT_PUBLIC_BASE_IMG})`, "i");
  const keyRegex = new RegExp(`(${process.env.NEXT_PUBLIC_KEY_IMG})`, "i");

  // Expresión regular para la URL (nombre de archivo de imagen con extensión)
  const urlRegex = /(\b\w+\.(jpg|png|gif|jpeg|webp)\b)/i;

  // Extraer las partes
  const baseMatch = texto.match(baseRegex);
  const urlMatch = texto.match(urlRegex);
  const keyMatch = texto.match(keyRegex);

  // Verificar que cada parte esté presente
  if (!baseMatch || !urlMatch || !keyMatch) {
    throw new Error("El texto no contiene base, url o key válidos.");
  }

  // Obtener los valores únicos (en caso de que haya duplicados)
  const base = baseMatch[1];
  const url = urlMatch[1];
  const key = keyMatch[1];

  // Reconstruir el texto en el orden correcto
  return `${base} ${url} ${key}`;
}
const prepareImg = (src) => {
  const match_base = src.match(new RegExp(process.env.NEXT_PUBLIC_BASE_IMG)) || [];
  const match_key = src.match(new RegExp(/(process.env.NEXT_PUBLIC_KEY_IMG)/i)) || []

  if (match_base.length > 1 || match_key.length > 1) {
    normalizarTexto(src)
  } else if (src.includes(process.env.NEXT_PUBLIC_BASE_IMG) && src.includes(process.env.NEXT_PUBLIC_KEY_IMG)) {

    return src
  } else if (src.includes(process.env.NEXT_PUBLIC_BASE_IMG) && !src.includes(process.env.NEXT_PUBLIC_KEY_IMG)) {

    return `${src}${process.env.NEXT_PUBLIC_KEY_IMG}`
  } else if (src.includes(process.env.NEXT_PUBLIC_KEY_IMG) && !src.includes(process.env.NEXT_PUBLIC_BASE_IMG)) {

    return `${process.env.NEXT_PUBLIC_BASE_IMG}${src}`
  } else if (!src.includes(process.env.NEXT_PUBLIC_BASE_IMG) && !src.includes(process.env.NEXT_PUBLIC_KEY_IMG)) {

    return `${process.env.NEXT_PUBLIC_BASE_IMG}${src}${process.env.NEXT_PUBLIC_KEY_IMG}`
  }
}

const card = (item) => (
  <Fragment>
    <CardContent sx={{ padding: 0, bgcolor: '#F1F1F1', height: '17rem' }}>
      <Typography variant="h5" component="div" className='sailec-medium'
        sx={{
          bgcolor: "#FABB00",
          height: '6rem',
          padding: '16px 24px 16px 24px'
        }}
      >
        {item.descarga_titulo}
      </Typography>
      <Typography variant="body2" className='lato'
        sx={{
          padding: '16px 24px 16px 24px',
          fontSize: '18px',
          lineHeight: '28px',
          fontWeight: 400
        }}>
        {item.descarga_bajada}
      </Typography>
    </CardContent>
    <CardActions sx={{ backgroundColor: "#F1F1F1", justifyContent: 'flex-end' }}>
      <a href={item.descarga_url}  >

        <button
          className='btn btn-0'
          style={{
            backgroundColor: "#3886FF",
            color: '#FFF',
            height: '48px',
            width: '200px',
            padding: '4px 24px',
            margin: '8px',
            borderRadius: '100px',
            fontSize: '16px',
            fontWeight: 600,
            border: '2px solid #A5C8FF'
          }}>
          Descargar <FaDownload />
        </button>
      </a>

    </CardActions>
  </Fragment>
);

const Blogdetails = ({ params }) => {
  const [blog, setBlog] = useState()
  const [descargas, setDescargas] = useState()
  // const [blog, setBlog] = useState({})
  const matches = useMediaQuery('(min-width:600px)');
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const { blogs } = await fetchBlog(params.id);
      setBlog(blogs[0])
      const newArray = blogs.map(item => ({
        descarga_bajada: item.descarga_bajada,
        descarga_titulo: item.descarga_titulo,
        descarga_url: item.descarga_url
      }));

      setDescargas(newArray)
    }
    fetchData()
    // setBlog(blogs[params.id])
  }, [])

  return (
    <div>
      <>
        <div className="main-wrapper main-blog sailec">
          {matches && <div style={{
            // marginTop: '100px',
            height: '620px',
            overflow: 'hidden',
            // display: 'flex',
            // alignItems: 'center',
          }}>
            {blog?.blog_imagen &&
              <>
                <img
                  alt="#"
                  // src={`${process.env.NEXT_PUBLIC_BASE_IMG}${blog?.blog_imagen}${process.env.NEXT_PUBLIC_KEY_IMG}`}
                  // src={blog?.blog_imagen.includes(process.env.NEXT_PUBLIC_KEY_IMG) ? `${blog?.blog_imagen}` : `${blog?.blog_imagen}${process.env.NEXT_PUBLIC_KEY_IMG}`}
                  src={prepareImg(blog?.blog_imagen)}
                  width={'100%'}
                  style={{
                    backgroundPosition: 'center',
                    // height: 'fit-content'
                  }}
                />
              </>
            }

          </div>}
          {matches &&
            <>
              <button className='btn mt-4 mb-5'
                style={{
                  border: '1px solid #A6A6A6',
                  height: '56px',
                  width: '163px',
                  padding: '0px 24px',
                  borderRadius: '100px',
                  marginLeft: '76px'
                }}
                onClick={() => router.back()}
              >
                <FaArrowLeft /> Volver
              </button>

              <button className='btn mt-4 mb-5'
                style={{
                  border: '1px solid #A6A6A6',
                  height: '56px',
                  width: '163px',
                  padding: '0px 24px',
                  borderRadius: '100px',
                  marginLeft: '76px',
                }}

              >
                <a href={`/blog/editar/${params.id}`} style={{ color: 'black' }}>

                  Editar
                </a>
              </button>
            </>
          }
          <div className="page-wrapper" style={{ marginLeft: 'unset' }}>
            <div className="content" style={{ padding: 0 }}>

              {/* /Page Header */}
              <div className="row d-flex justify-content-center" style={{ margin: 0 }}>

                {/* CONTENIDO DEL BLOG */}
                <div className="col-12 " style={{ padding: matches ? 0 : '24px' }}>
                  <div className="blog-view" style={{ paddingLeft: matches && '96px' }}>
                    <div className="col-lg-12" style={{ padding: matches ? 0 : '32px 0 0 0', margin: matches ? '0' : '80px 0 0 0' }}>
                      <h3 className={matches ? "blog-title" : "blog-title-sm"} style={{ marginLeft: '0px', fontSize: '48px', lineHeight: '60px', fontWeight: 700, textWrap: 'balance' }}>
                        {blog && blog.blog_titulo}
                      </h3>
                    </div>
                    <article className="blog blog-single-post d-flex justify-content-between flex-wrap" >

                      {/*       <div className="blog-info clearfix" style={{ padding: 0, margin: 5 }}>
                        <div className="post-left date-blks">
                          <ul>
                            <li>
                              <Link href="#">
                                <i className="feather-calendar" >
                                  <FeatherIcon icon="calendar" />
                                  {" "}
                                </i>
                                <span>05 Jul 2022</span>
                              </Link>
                            </li>
                             <li>
                              <Link href="#">
                                <i className="feather-message" >
                                  <FeatherIcon icon="message-square" />
                                  {" "}
                                </i>
                                <span>58</span>
                              </Link>
                            </li>
                            <li>
                              <Link href="#">
                                <i className="feather-eye" >
                                  <FeatherIcon icon="eye" />
                                </i>
                                <span>2.8k</span>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div> */}
                      {/* TEXTO */}

                      <div className="sailec col-lg-10 col-12 p-2" style={{ marginLeft: '0px', fontSize: '24px', fontWeight: 400, lineHeight: '32px', letterSpacing: '0em' }}>
                        {/* <div className={matches ? "blog-content" : "blog-content-sm"} dangerouslySetInnerHTML={blog && { __html: blog?.blog_texto }}>
                        </div> */}

                        {blog && <ParserImgToImage classType={matches ? "blog-content" : "blog-content-sm"} htmlContent={blog?.blog_texto} />}


                      </div>

                      {/* {blog && blog?.video ? <div className="col-lg-12 col-12 d-flex flex-wrap" style={{ marginLeft: '0px', marginTop: matches ? '3rem' : 0, border: '1px solid red' }}>
                       
                        <iframe width={matches ? "60%" : "100%"} height="615" src={blog.video} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                      </div>
                        : <></>
                      } */}
                    </article>

                    <div className="row d-flex my-4" style={{ padding: '0', marginLeft: '0px', marginRight: '96px', borderTop: '1px solid grey', textAlign: 'center' }} >
                      <div className="col-12">
                        <h3 className='sailec-medium' style={{ fontWeight: 700, fontSize: '32px', lineHeight: '40px' }}>Contenido descargable</h3>
                      </div>
                      {descargas && descargas?.map((item, index) => (

                        <div className="col-12 col-lg-4 col-md-8 mb-3 mt-3 mt-md-5" key={index} style={{ margin: 'auto' }}>
                          <Box sx={{ minWidth: 275, width: '100%', textAlign: 'left' }}>
                            <Card variant="outlined">{card(item)}</Card>
                          </Box>
                        </div>

                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="sidebar-overlay" data-reff="" />
      </>
      <FooterDae matches={matches} />

    </div>
  )
}

// export default Blogdetails;
export default withAuth(Blogdetails, ['administrador', 'profesional']);

