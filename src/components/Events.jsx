'use client'
import { useState, useRef, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Card, CardMedia, CardContent, CardActions, Typography, Box } from "@mui/material";
import { ChevronLeft, ChevronRight, CircleRounded, LocationOnOutlined, AccessTimeOutlined } from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";

import { blogs } from '@/utils/blogs';

import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import { FaStar } from "react-icons/fa";
import { createTheme, ThemeProvider } from '@mui/material/styles';
const theme = createTheme({
  palette: {
    success: {
      light: '#ff7961',
      main: '#ffffff',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
});

const Events = ({ events, innerRef }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = events.length;
  const timeoutRef = useRef(null);
  const matches = useMediaQuery('(min-width:600px)');
  const divRef = useRef();

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () => setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides),
      5500 // Cambiar el slide cada 3 segundos
    );

    return () => {
      resetTimeout();
    };
  }, [currentIndex, totalSlides]);

  const sliderStyles = {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const sliderStylesMobile = {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const dotsContainerStyles = {
    display: 'flex',
    justifyContent: 'center',
  }

  const dotStyles = {
    margin: '0 8px',
    cursor: 'pointer'
    // color: '#fff'
  }

  const cardContainerStyles = {
    display: 'flex',
    transition: 'transform 0.5s ease-in-out',
    transform: `translateX(-${currentIndex * (100 / events.length)}%)`,
    width: `${totalSlides * (100 / events.length)}%`,
  };

  const cardContainerStylesMobile = {
    display: 'flex',
    transition: 'transform 0.5s ease-in-out',
    transform: `translateX(-${currentIndex * 100}%)`,
    width: 'calc(100%)',
  };

  const arrowStyles = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    zIndex: 2,
    color: '#A6A6A6',
    fontSize: '40px',
    backgroundColor: '#F1F1F1',
    borderRadius: '72px'
  };

  const leftArrowStyles = {
    ...arrowStyles,
    left: '-10%'
  };

  const rightArrowStyles = {
    ...arrowStyles,
    right: '-10%'
  };

  const goToSlide = slideIndex => {
    setCurrentIndex(slideIndex)
  }

  return (
    <div className='container col-12 align-self-center sailec' id="eventos" ref={innerRef}>
      <div className="row" style={{ padding: 0, margin: 0 }}>
        <div className="col-sm-12 text-center" style={{ padding: 0 }}>
          <h2 style={{ fontSize: '32px', fontWeight: 700, lineHeight: '40px', paddingTop: '32px' }}>Eventos</h2>
        </div>
      </div>
      {
        matches
          ? <>
            <div className={`container col-12 ${matches ? 'd-flex' : ''} justify-content-start`} style={{ position: 'relative' }}>
              <ChevronLeft sx={leftArrowStyles} onClick={prevSlide} />
              <Box sx={sliderStyles}>
                <div style={cardContainerStyles}>
                  {
                    [...events, ...events].map((event, i) => ( // Duplica las tarjetas
                      <Card
                        className='col-sm-12 col-lg-4'
                        key={i}
                        sx={{
                          // minWidth: 'calc(100% / 3)',
                          boxShadow: 0,
                          display: 'inline-block',
                          margin: '0 10px',
                        }}>
                        <IconButton aria-label={'Destacado'}>
                          <ThemeProvider theme={theme}>
                            <Badge
                              badgeContent={event.highlight ? `⭐DESTACADO` : 0}
                              color="success"
                              sx={{
                                zIndex: '999',
                                width: '100%',
                                right: '-300px',
                                zIndex: 999,
                                marginTop: '30px',
                                position: 'absolute'
                              }}
                            >
                            </Badge>
                          </ThemeProvider>
                        </IconButton>
                        <CardMedia
                          sx={{ fontSize: '20px', fontWeight: 700 }}
                          component="img"
                          alt={blogs[i % totalSlides]?.titulo}
                          height="200"
                          image={blogs[i % totalSlides]?.imagen}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            bgcolor: '#FF5253',
                            borderRadius: '0 50px 50px 0',
                            color: '#fff',
                            padding: '12px',
                            width: 'fit-content',
                            maxWidth: '75%',
                            minWidth: '50%',
                            marginTop: "-55px",
                            position: 'relative',
                            fontWeight: 400,
                            fontSize: '16px',
                            lineHeight: '24px',
                            height: '48px',
                            overflow: 'hidden',
                            textWrap: 'nowrap',
                            zIndex: 999
                          }}>
                          {`${event.location} ${event.campus}`}
                        </Typography>
                        <CardContent>

                          <Typography gutterBottom variant="h5" component="div" sx={{ margin: 0, height: '3rem', fontSize: '20px', fontWeight: 700 }}>
                            {`Conferencia ${(blogs[i % totalSlides]?.titulo).split(':')[0]}`}
                          </Typography>
                        </CardContent>
                        <CardActions sx={{ marginBottom: '10px' }}>
                          <Typography size="medium" sx={{ padding: '0 5px', color: '#000', borderRight: '1px solid #A6A6A6' }}>
                            <LocationOnOutlined sx={{ marginRight: '5px' }} /> {event.address}
                          </Typography>
                          <Typography size="medium" sx={{ padding: '0 5px', color: '#000' }}>
                            <AccessTimeOutlined sx={{ marginRight: '5px' }} /> {event.time}
                          </Typography>
                        </CardActions>
                      </Card>
                    ))
                  }

                </div>
              </Box>
              <ChevronRight sx={rightArrowStyles} onClick={nextSlide} />
            </div>

            <div style={dotsContainerStyles}>
              {Array(Math.ceil(events.length / 3)).fill().map((_, dotIndex) => (
                <div key={dotIndex} style={dotStyles} onClick={() => goToSlide(dotIndex)}>
                  <CircleRounded sx={{ fontSize: '20px', color: dotIndex === currentIndex ? '#B82925' : '#FF5253' }} />
                </div>
              ))}
            </div>
          </>
          :
          <>
            <div className={`container col-12 ${matches ? 'd-flex' : ''} justify-content-start`} style={{ position: 'relative', width: `${matches ? '840px' : '100%'}` }}>
              <Box sx={sliderStylesMobile}>
                <div style={cardContainerStylesMobile}>
                  {
                    events.map((event, i) => (
                      <Card
                        className='col-12 col-lg-4'
                        key={i}
                        sx={{
                          minWidth: `calc(100% / ${events.length})`,
                          boxShadow: 0,
                          display: 'inline-block',
                          width: '100%'
                        }}>
                        <IconButton aria-label={'Destacado'}>
                          <ThemeProvider theme={theme}>
                            <Badge
                              badgeContent={event.highlight ? `⭐DESTACADO` : 0}
                              color="success"
                              sx={{
                                zIndex: '999',
                                width: '100%',
                                right: '-300px',
                                zIndex: 999,
                                marginTop: '30px',
                                position: 'absolute'
                              }}
                            >
                            </Badge>
                          </ThemeProvider>
                        </IconButton>
                        <CardMedia
                          sx={{ fontSize: '20px', fontWeight: 700 }}
                          component="img"
                          alt={blogs[i]?.titulo}
                          height="200"
                          image={blogs[i]?.imagen}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            bgcolor: '#FF5253',
                            borderRadius: '0 50px 50px 0',
                            color: '#fff',
                            padding: '12px',
                            width: '60%',
                            marginTop: "-55px",
                            position: 'relative',
                            fontWeight: 400,
                            fontSize: '16px',
                            lineHeight: '24px'
                          }}>
                          {`${event.location} ${event.campus}`}
                        </Typography>
                        <CardContent>

                          <Typography gutterBottom variant="h5" component="div" sx={{ margin: 0, height: '3rem', fontSize: '20px', fontWeight: 700 }}>
                            {`Conferencia ${(blogs[i % totalSlides]?.titulo).split(':')[0]}`}
                          </Typography>
                        </CardContent>
                        <CardActions sx={{ marginBottom: '10px' }}>
                          <Typography size="medium" sx={{ padding: '0 5px', color: '#000', borderRight: '1px solid #A6A6A6' }}>
                            <LocationOnOutlined sx={{ marginRight: '5px' }} /> {event.address}
                          </Typography>
                          <Typography size="medium" sx={{ padding: '0 5px', color: '#000' }}>
                            <AccessTimeOutlined sx={{ marginRight: '5px' }} /> {event.time}
                          </Typography>
                        </CardActions>
                      </Card>
                    ))
                  }

                </div>
              </Box>
            </div>

            <div style={dotsContainerStyles}>
              {Array(Math.ceil(events.length)).fill().map((_, dotIndex) => (
                <div key={dotIndex} style={dotStyles} onClick={() => goToSlide(dotIndex)}>
                  <CircleRounded sx={{ fontSize: '16px', color: dotIndex === currentIndex ? '#B82925' : '#FF5253' }} />
                </div>
              ))}
            </div>
          </>
      }
    </div>
  );
}

export default Events;