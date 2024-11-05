'use client'
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { CircleRounded } from "@mui/icons-material";
import { ChevronLeftRounded, ChevronRightOutlined } from "@mui/icons-material";
import { Box } from "@mui/material";

const Carrousel = ({ slides, matches, parentWidth }) => {
  const timeRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [title, setTitle] = useState(slides[0].titulo)
  const [content, setContent] = useState(slides[0].texto)
  const [idBlog, setIdBlog] = useState(slides[0].id)

  const TIMEOUT = 3000;

  const sliderStyles = {
    position: 'relative',
    margin: 0,
    padding: 0,
    width: matches ? 'unset' : '100%',
    maxWidth: '1200px',
  }

  const slideStyles = {
    backgroundImage: `url(${slides[currentIndex].imagen.src})`,
    width: '100%',
    height: matches ? 384 : 480,
    backgroundPosition: 'center',
    backgroundSize: 'cover'
  }

  const leftArrowStyles = {
    position: 'absolute',
    top: '200px',
    transform: 'translate(0, -50%)',
    left: '32px',
    color: 'white',
    zIndex: 1,
    cursor: 'pointer',
    border: '1px solid white',
    borderRadius: '20%',
    backgroundColor: "#fff4"
  }

  const righttArrowStyles = {
    position: 'absolute',
    top: '200px',
    transform: 'translate(0, -50%)',
    right: '32px',
    color: 'white',
    zIndex: 1,
    cursor: 'pointer',
    border: '1px solid white',
    borderRadius: '20%',
    backgroundColor: "#fff4"
  }

  const dotsContainerStyles = {
    display: 'flex',
    justifyContent: 'center',
  }

  const dotStyles = {
    margin: '0 8px',
    cursor: 'pointer',
    // color: '#fff'
  }

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
    setTitle(slides[newIndex].titulo, 20)
    setContent(slides[newIndex].texto, 40)
    setIdBlog(slides[newIndex].id)
  }

  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === slides.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
    setTitle(slides[newIndex].titulo, 20)
    setContent(slides[newIndex].texto, 40)
    setIdBlog(slides[newIndex].id)
  }, [currentIndex, slides])

  const goToSlide = slideIndex => {
    setCurrentIndex(slideIndex)
    setTitle(slides[slideIndex].titulo, 20)
    setContent(slides[slideIndex].texto, 40)
    setIdBlog(slides[slideIndex].id)
  }

  const boxStyleDesktop = {
    padding: ' 100px',
    textWrap: 'pretty',
    backgroundColor: '#00000080',
    backgroundSize: 'cover',
    width: '100%',
    height: '100%',
    color: 'white'
  }

  const boxStyleMobile = {
    backgroundColor: '#00000080',
    padding: '24px ',
    textWrap: 'pretty',
    width: '32%',
    color: 'white'
  }

  const getSlideStylesWithBackground = (slideIndex) => ({
    ...slideStyles,
    backgroundImage: `url(${slides[slideIndex].imagen.src})`,
    width: matches ? `${parentWidth}px` : '100%',
    backgroundPosition: 'center',
    display: 'flex',

  })

  const slidesContainerStyles = {
    display: 'flex',
    height: '100%',
    transition: 'transform ease-out 0.3s'
  }

  const slideContent = {
    
  }

  const slidesContainerOverflowStyles = {
    overflow: 'hidden',
    height: '100%',
    width: matches ? `${parentWidth}px` : '100%'
  }

  const getSlidesContainerStylesWithWidth = () => ({
    ...slidesContainerStyles,
    width: parentWidth * slides.length,
    transform: `translateX(${-(currentIndex * parentWidth)}px)`
  })

  useEffect(() => {
    if (timeRef.current) {
      clearTimeout(timeRef.current)
    }
    timeRef.current = setTimeout(() => {
      goToNext()
    }, TIMEOUT);

    return () => clearTimeout(timeRef.current)
  }, [goToNext])

  return (
    <div style={sliderStyles}>
      {matches && <div style={leftArrowStyles} onClick={goToPrevious}> <ChevronLeftRounded /></div>}
      {matches && <div style={righttArrowStyles} onClick={goToPrevious}> <ChevronRightOutlined /></div>}
      {/* <div style={slideStyles}></div> */}
      <div style={slidesContainerOverflowStyles}>
        <div style={getSlidesContainerStylesWithWidth()}>
          {slides.map((slide, slideIndex) => (
            <div key={slideIndex} style={getSlideStylesWithBackground(slideIndex)}>
              <Box sx={matches ? boxStyleDesktop : boxStyleMobile}>
                <div className="row" >
                  <div className="col-sm-12 roboto">
                    <div
                      // className='slide-content'
                      style={slideContent}
                    >
                      <h2
                        style={{ fontSize: '35px', fontWeight: 700, lineHeight: '40px' }}>
                        {title}
                      </h2>
                      <p
                        style={{ fontSize: '17px', fontWeight: 400, lineHeight: '32px' }}>
                        {content}
                      </p>
                      {slide?.link &&
                        <button className="btn btn-outline-light">Descárgalo aquí</button>
                      }
                    </div>
                  </div>
                </div>
              </Box>
            </div>
          ))}
        </div>
      </div>

      <div style={dotsContainerStyles}>
        {slides.map((_, slideIndex) => (
          <div
            key={slideIndex}
            style={dotStyles}
            onClick={() => goToSlide(slideIndex)}
          >
          </div>
        ))}
      </div>

      {/* Dots */}
      <div style={dotsContainerStyles}>
        {slides.map((_, slideIndex) => (
          <div
            key={slideIndex}
            style={dotStyles}
            onClick={() => goToSlide(slideIndex)}
          >
            <CircleRounded sx={{ fontSize: '12px', margin: '-40px 0 0 0', color: slideIndex === currentIndex ? '#FF5253' : 'darkgrey' }} />
          </div>
        ))}
      </div>

    </div>
  )
}

export default Carrousel;