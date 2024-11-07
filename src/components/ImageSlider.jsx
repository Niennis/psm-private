'use client'
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { CircleRounded } from "@mui/icons-material";
import { Grid, Box, Typography, Tab, Tabs, useMediaQuery } from "@mui/material";
import { banner04, banner05, banner06, banner07 } from "./imagepath";
import Image from "next/image";
import { MdOutlineChromeReaderMode } from "react-icons/md";
import { blogs } from "@/utils/blogs";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { fontSize } from "@mui/system";

const theme = createTheme({
  palette: {
    primary: {
      light: '#ff7961',
      main: '#ffffff',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
});

const styles = [
  {
    id: 0,
    key: 'banner01',
    color: '#3886FF',
    border: '#A5C8FF',
  },
  {
    id: 1,
    key: 'banner02',
    color: '#FABB00',
    border: '#FFCB7E',
  },
  {
    id: 2,
    key: 'banner03',
    color: '#1ABC9C',
    border: '#73CDCD',
  },
  {
    id: 3,
    key: 'banner04',
    color: '#B82925',
    border: '#FF5253',
  },

]

const estimateReadingTime = text => {
  const wordsPerMinute = 250; // Puedes ajustar este valor según la velocidad de lectura deseada
  const words = text.split(/\s+/).length; // Divide el texto en palabras por los espacios en blanco
  const readingTimeMinutes = words / wordsPerMinute;

  return Math.ceil(readingTimeMinutes); // Retorna el tiempo estimado de lectura en minutos, redondeado al entero superior
}

const CustomTabPanel = ({ children, value, index, isShort, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography
            className="sailec-medium"
            sx={{
              fontWeight: 400,
              fontSize: isShort ? '18px' : '20px',
              lineHeight: '28px',
              fontFamily: 'sailec'
            }}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const ImageSlider = ({ innerRef }) => {
  const [slides, setSlides] = useState(blogs.slice(0, 4))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [title, setTitle] = useState(blogs[0].titulo)
  const [content, setContent] = useState(blogs[0].bajada)
  const [color, setColor] = useState(blogs[0].color)
  const [idBlog, setIdBlog] = useState(blogs[0].id)
  const matches = useMediaQuery('(min-width:600px)');
  const [isShort, setIsShort] = useState(false);

  const [value, setValue] = useState(0);
  const divRef = useRef();
  const totalSlides = slides.length;
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    // Función para manejar el cambio de slide
    const changeSlide = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    };

    // Función para manejar el cambio de tamaño de la ventana
    const handleResize = () => {
      const height = window.innerHeight;
      if (height < 800) {
        setIsShort(true);
        // } else if (height < 1450) {
        //   setIsShort(true);
      } else {
        setIsShort(false);
      }
    };

    // Configurar el timeout para cambiar el slide cada 8 segundos
    resetTimeout();
    timeoutRef.current = setTimeout(changeSlide, 8000);

    // Agregar el event listener para el cambio de tamaño de la ventana
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      handleResize(); // Llama a handleResize inicialmente para configurar el tamaño correcto
    }

    // Cleanup: Limpia el timeout y el event listener cuando el componente se desmonte o los valores dependientes cambien
    return () => {
      resetTimeout();
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, [currentIndex, totalSlides]);


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const imgHeightMobile = '83vh'
  const imgHeightDesktop = '100vh'

  const sliderStyles = {
    position: 'relative',
    margin: 0,
    padding: 0,
    width: '100%',
  }

  const slideStyles = {
    backgroundImage: `url(${slides[currentIndex].imagen})`,
    width: '100%',
    height: matches ? imgHeightDesktop : imgHeightMobile,
    backgroundPosition: 'top',
    backgroundSize: 'cover',
  }

  const slideStylesMobile = {
    backgroundColor: styles[currentIndex].color,
    width: '100%',
    height: matches ? imgHeightDesktop : imgHeightMobile,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  }

  const dotsContainerStyles = {
    display: 'flex',
    justifyContent: 'center',
  }

  const dotStyles = {
    margin: '-60px 8px',
    cursor: 'pointer',
    // color: '#fff'
  }

  const truncarPalabras = (texto, num) => {
    // const textoParrafo = texto.match(/<p>(.*?)<\/p>/);
    const aux = texto[0].split('');
    if (aux.length > num) {
      const sliced = aux.slice(0, num)
      const indexLastBlankSpace = sliced.lastIndexOf(' ')
      return (aux.slice(3, indexLastBlankSpace).join('') + '...')
    } else {
      return texto;
    }
  }

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
    setTitle(slides[newIndex].titulo)
    setContent(truncarPalabras(slides[newIndex].bajada, 205))
    setColor(styles[newIndex].color)
    setIdBlog(slides[newIndex].id)
  }

  const goToNext = () => {
    const isLastSlide = currentIndex === slides.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
    setTitle(slides[newIndex].titulo)
    setContent(truncarPalabras(slides[newIndex].bajada, 205))
    setColor(styles[newIndex].color)
    setIdBlog(slides[newIndex].id)
  }

  const goToSlide = slideIndex => {
    setCurrentIndex(slideIndex)
    setTitle(slides[slideIndex].titulo)
    setContent(truncarPalabras(slides[slideIndex].bajada, 205))
    setColor(styles[slideIndex].color)
    setIdBlog(slides[slideIndex].id)
  }

  const boxStyleDesktop = {
    padding: '32px 0 32px 0',
    textWrap: 'pretty',
    margin: `calc(-${imgHeightDesktop} - 50px) auto 0px`,
    backgroundColor: '#00000089',
    height: imgHeightDesktop,
    display: 'flex',
    alignItems: 'flex-start',
    paddingTop: '150px',
    width: '100%',
  }

  const boxStyleMobile = {
    padding: '24px 16px',
    textWrap: 'pretty',
    margin: `-${imgHeightMobile} auto 0px`,
    // padding: '24px ',
    height: imgHeightMobile,
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  }

  return (
    <div id="inicio" style={matches ? { ...sliderStyles, height: imgHeightDesktop } : sliderStyles} ref={innerRef}>
      <div style={matches ? slideStyles : {}}></div>

      {matches ?
        <>
          <Box sx={boxStyleDesktop}>
            <div className="row" >
              <div className="col-sm-12 sailec" style={{
                width: `${matches ? '90vw' : '100%'}`,
                marginLeft: '60px'
              }}>
                <div className="d-flex flex-column">
                  <h2
                    className="sailec"
                    style={{
                      marginTop: '1em',
                      color: 'white',
                      fontSize: isShort ? '48px' : '72px',
                      fontWeight: 700,
                      lineHeight: isShort ? '52px' : '116px',
                      textWrap: 'balance',
                      fontFamily: 'sailec'
                    }}>
                    {slides[currentIndex].titulo}
                  </h2>
                  <p style={{ color: '#FFF' }}> 
                    <MdOutlineChromeReaderMode style={{ marginTop: '-3px' }} />
                    {estimateReadingTime(slides[currentIndex].texto)} min.
                  </p>
                </div>
                <Grid
                  container
                  direction="row"
                >
                  <Link href={`/blog/${idBlog}`}>
                    <button
                      className={`btn submit-form me-2 sailec-medium ${'btn-' + currentIndex}`}
                      style={{
                        width: '209px',
                        height: !isShort && '56px',
                        backgroundColor: styles[currentIndex].color,
                        border: `1px solid ${styles[currentIndex].border}`,
                        borderRadius: '100px',
                        color: '#fff',
                        fontWeight: 500,
                        fontSize: '16px',
                      }}> Ver más + </button>
                  </Link>
                </Grid>
              </div>
            </div>
          </Box>
          <div
            key={slides[currentIndex].key}
            className="col col-3"
            style={{
              borderBottom: '1px solid white',
              height: isShort ? '180px' : '200px',
              marginTop: isShort ? '-210px' : '-240px',
              marginLeft: `calc(25vw * ${slides[currentIndex].id})`,
              backgroundColor: styles[currentIndex].color,
              color: "#fff",
              display: 'flex',
              alignItems: 'center',
              '&:hover': {
                color: 'yellowgreen'
              },
              '&:active': {
                color: 'yellowgreen'
              },
              '&:visited': {
                color: 'yellowgreen'
              }
            }}
          >
            <CustomTabPanel
              value={slides[currentIndex].key}
              index={slides[currentIndex].key}
              isShort={isShort}
            >
              {slides[currentIndex].bajada.slice(0, 200)}
            </CustomTabPanel>
          </div>
          <ThemeProvider theme={theme}>

            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              textColor="primary"
              indicatorColor="white"
            >
              {slides.map((slide, slideIndex) => (
                <Tab
                  key={slideIndex}
                  className="col-3 sailec white_menu_urls"
                  onClick={() => goToSlide(slideIndex)}
                  sx={{
                    height: '97px',
                    bgcolor: styles[slideIndex].color,
                    color: '#fff',
                    textTransform: 'capitalize',
                    fontWeight: 700,
                    fontSize: isShort ? '20px' : '24px',
                    lineHeight: '32px',
                    maxWidth: 'unset',
                    alignItems: 'baseline',
                    textAlign: 'left',
                    fontFamily: 'sailec'
                  }}
                  label={slide.titulo}
                  {...a11yProps(slideIndex)}
                />
              ))}
            </Tabs>
          </ThemeProvider>

        </> :
        <>
          <div style={slideStylesMobile}></div>
          <div style={dotsContainerStyles}>
            {slides.map((slide, slideIndex) => (
              <div
                key={slideIndex}
                style={dotStyles}
                onClick={() => goToSlide(slideIndex)}
              >
              </div>
            ))}
          </div>
          <Box sx={matches ? boxStyleDesktop : boxStyleMobile}>
            <div className="row" >
              <div className="col-sm-12 sailec">
                <div style={{ minHeight: '2rem' }}>
                  <h2 style={{ color: 'white', fontSize: '30px', fontWeight: 700, lineHeight: '40px' }}>{title}</h2>
                  <p style={{
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: 400,
                    lineHeight: '32px',
                  }}
                  >
                    {content.slice(0, 205)}
                  </p>
                </div>
                <Grid
                  container
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="baseline"
                >
                  <Link href={`/blog/${idBlog}`}>
                    <button
                      className="btn submit-form me-2"
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #FFF',
                        borderRadius: '100px',
                        color: '#FFF',
                        width: '116px',
                        height: '40px',
                        margin: '8px'
                      }}> Ver más + </button>
                  </Link>
                  <img
                    src={slides[currentIndex].imagen}
                    alt=""
                    width={'90%'}
                    height={250}
                    style={{
                      overflow: 'hidden',
                      margin: 'auto',
                      borderRadius: '8px',
                      WebkitBoxShadow: '12px 12px 0px 0px rgba(166,166,166,1)',
                      MozBoxShadow: '12px 12px 0px 0px rgba(166,166,166,1)',
                      BoxShadow: '12px 12px 0px 0px rgba(166,166,166,1)',
                    }}
                  />

                </Grid>
              </div>
            </div>
          </Box>
          <div style={dotsContainerStyles}>
            {slides.map((slide, slideIndex) => (
              <div
                key={slideIndex}
                style={dotStyles}
                onClick={() => goToSlide(slideIndex)}
              >
                <CircleRounded sx={{ fontSize: '16px', color: slideIndex === currentIndex ? '#A6A6A6' : '#FFF' }} />
              </div>
            ))}
          </div>

        </>
      }
    </div>
  )
}

export default ImageSlider;