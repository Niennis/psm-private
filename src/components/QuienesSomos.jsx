import { useState } from "react";
import Link from "next/link";
import { CircleRounded } from "@mui/icons-material";
import { Grid, Box, Card } from "@mui/material";
// import TestCard from './Card'
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import ReserveBtn from "./ReserveBtn";
import useMediaQuery from '@mui/material/useMediaQuery';
import { profesional01 } from "./imagepath";

const QuienesSomos = () => {

  const matches = useMediaQuery('(min-width:600px)');


  return (
    <div className={`container col-12 col-lg-10 align-self-center p-0 ${matches && 'mb-5'}`} >

      {/* <TestCard test={slides} /> */}

      <div>
        <Box sx={{
          // height: '45svh',
          // width: '90svw',
          borderRadius: '32px',
          // padding: '24px 16px',
          textWrap: 'pretty',
          margin: '0 auto',
        }}>
          <div className="row" style={{ margin: 0 }} >
            {
              matches
                ?
                <div
                  className={`container col-12  d-flex  justify-content-center`}
                  style={{
                    fontSize: '24px',
                    fontWeight: 400,
                    lineHeight: '32px',
                    borderRadius: '12px',
                    marginTop: '20px',
                  }}
                >
                  <Card
                    className='col-12 col-lg-8'
                    sx={{
                      boxShadow: 0,
                      display: 'inline-block',
                      height: matches ? "100%" : "fit-content",
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      paddingBottom: '10px',
                      padding: '2em',
                    }}>
                    <Typography
                      variant="body2"
                      className="sailec"
                      sx={{
                        color: '#000',
                        // textWrap: 'balance',
                        fontSize: '32px',
                        lineHeight: '40px',
                        fontWeight: 700
                      }}>
                      Quiénes somos
                    </Typography>
                    <Typography
                      variant="body2"
                      className="sailec"
                      sx={{
                        color: '#000',
                        // textWrap: 'balance',
                        fontSize: '20px',
                        lineHeight: '28px'
                      }}>
                      El Departamento de Salud Mental Estudiantil (DSME) de la UDP se dedica a fomentar el bienestar psicológico y emocional del estudiantado. Su enfoque incluye promoción, prevención, atención grupal y clínica individual para abordar problemas psicosociales durante la vida universitaria.
                    </Typography>
                    <CardActions sx={{ padding: '0px' }}>
                      <Typography size="medium" sx={{ padding: '0 5px', color: '#000' }}>
                        <Link href={`/quienes_somos`}>
                          <button
                            className={`btn submit-form me-2 sailec-medium `}
                            style={{
                              width: '209px',
                              height: '56px',
                              backgroundColor: '#1abc9c',
                              border: `1px solid #73cdcd`,
                              borderRadius: '100px',
                              color: '#fff',
                              fontWeight: 500,
                              fontSize: '16px',
                            }}> Ver más + </button>
                        </Link>
                      </Typography>
                    </CardActions>
                  </Card>

                  <Card
                    className='col-12 col-lg-4'
                    sx={{
                      boxShadow: 0,
                      display: 'inline-block',
                      padding: '2em 0',
                    }}>
                    <CardMedia
                      component="img"
                      height="240"
                      width="240"
                      image="https://github.com/Niennis/imagesudp/blob/main/home_quienes_somos.jpg?raw=true"
                      sx={{ borderRadius: '8px' }}
                    />
                  </Card>

                </div>

                :
                <div
                  className={`container col-12 ${matches ? 'd-flex' : ''} justify-content-center`}
                  style={{
                    fontSize: '24px',
                    fontWeight: 400,
                    lineHeight: '32px',
                    borderRadius: '12px',
                    padding: 0,
                  }}
                >
                  <Box sx={{ bgcolor: '#f1f1f1', fontFamily: 'sailec', lineHeight: '30px', }}>
                    <div className="media-body sailec" style={{ margin: '0 20px', padding: '10px 0', fontSize: '20px', fontWeight: 400, lineHeight: '28px' }}>
                      <Typography
                        variant="body2"
                        className="sailec"
                        sx={{
                          color: '#000',
                          // textWrap: 'balance',
                          fontSize: '32px',
                          lineHeight: '40px',
                          fontWeight: 700,
                          margin: '16px 0'
                        }}>
                        Quiénes somos
                      </Typography>

                      <p className="media-body sailec" style={{ textWrap: 'pretty' }}>
                        El Departamento de Salud Mental Estudiantil (DSME) de la UDP se dedica a fomentar el bienestar psicológico y emocional del estudiantado. Su enfoque incluye promoción, prevención, atención grupal y clínica individual para abordar problemas psicosociales durante la vida universitaria.
                      </p>
                      <Link href={`/quienes_somos`}>
                        <button
                          className="btn submit-form me-2"
                          style={{
                            backgroundColor: 'transparent',
                            border: '1px solid #000',
                            borderRadius: '100px',
                            color: '#000',
                            width: '116px',
                            height: '40px',
                            margin: '8px'
                          }}> Ver más + </button>
                      </Link>
                    </div>
                  </Box>
                </div>
            }
          </div>
        </Box>
      </div >
    </div >
  )
}

export default QuienesSomos;