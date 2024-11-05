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

const ReservaTuHora = () => {
  const matches = useMediaQuery('(min-width:600px)');


  return (
    <div className={`container col-12 col-lg-10 align-self-center p-0 ${matches && 'mb-5'}`} style={{ background: '#f1f1f1' }}>

      {/* <TestCard test={slides} /> */}

      <div>
        <Box sx={{
          // height: '45svh',
          // width: '90svw',
          borderRadius: '32px',
          // padding: '24px 16px',
          textWrap: 'pretty',
          margin: '0 auto'
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
                    marginTop: '20px'
                  }}
                >
                  <Card
                    className='col-12 col-lg-4'
                    sx={{
                      boxShadow: 0,
                      display: 'inline-block',
                      padding: '2em 0',
                      bgcolor: '#f1f1f1'
                    }}>
                    <CardMedia
                      component="img"
                      height="240"
                      width="240"
                      image="https://github.com/Niennis/imagesudp/blob/main/profesional01.jpg?raw=true"
                      sx={{ borderRadius: '8px' }}
                    />
                  </Card>

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
                      bgcolor: '#f1f1f1'
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
                      Reserva tu hora
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
                      Si necesitas ayuda psicológica o psicopedagógica, reserva una hora con un profesional.
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
                      Un psicólogo puede ayudarte a mejorar tu salud mental y emocional. Reservar una hora es fácil y cómodo.
                    </Typography>
                    <CardActions sx={{ padding: '0px' }}>
                      <Typography size="medium" sx={{ padding: '0 5px', color: '#000' }}>
                        <ReserveBtn text={'Reservar'} bgColor={'#FABB00'} color={'#000'} />
                      </Typography>
                    </CardActions>
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
                  <Box sx={{ bgcolor: '#99D6E9', fontFamily: 'sailec', lineHeight: '30px', }}>
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
                        Reserva tu hora
                      </Typography>

                      <p className="media-body sailec" style={{ textWrap: 'pretty' }}>
                        Si necesitas ayuda psicológica o psicopedagógica, reserva una hora con un profesional.
                      </p>
                      <p>
                        Un psicólogo puede ayudarte a mejorar tu salud mental y emocional. Reservar una hora es fácil y cómodo.

                      </p>
                      <ReserveBtn text={'Reservar'} bgColor={'#FABB00'} color={'#000'} />
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

export default ReservaTuHora;