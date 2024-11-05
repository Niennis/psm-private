import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { Today } from '@mui/icons-material';
import { LinkedIn, Facebook, Instagram, Twitter, YouTube, LocationOnSharp } from '@mui/icons-material';
import ReserveBtn from './ReserveBtn';

const Footer = () => {

  return (
    <Box sx={{ width: '90svw', margin: '20px auto', bgcolor: 'background.paper', fontFamily: 'lato' }}>
      <nav aria-label="main mailbox folders" style={{ margin: '20px' }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Link 1" />
            </ListItemButton>
          </ListItem>
          <Divider sx={{ border: '1.5px solid #000000', opacity: 1 }} />
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Link 2" />
            </ListItemButton>
          </ListItem>
          <Divider sx={{ border: '1.5px solid #000000', opacity: 1 }} />
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Link 3" />
            </ListItemButton>
          </ListItem>
          <Divider sx={{ border: '1.5px solid #000000', opacity: 1 }} />
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Link 4" />
            </ListItemButton>
          </ListItem>
          <Divider sx={{ border: '1.5px solid #000000', opacity: 1 }} />
        </List>
      </nav>
      <div
        className="content text-center"
        style={{
          borderRadius: '20px',
          background: '#EEE',
          padding: '15px',
          margin: '10px 20px'
        }}
      >
        <h3 style={{ fontFamily: 'sailec', fontWeight: 700, fontSize: '20px', lineHeight: '27.5px' }}>
          ¿Hablemos?
        </h3>
        <p style={{ fontFamily: 'lato', fontWeight: 400, fontSize: '14px', lineHeight: '21px' }}>
          Si necesitas ayuda, contáctanos y te ayudaremos.
        </p>
        <ReserveBtn text={'Reservar'} bgColor={'#FF5253'} color={'#fff'} />
      </div>
      <div className="content text-center" style={{ margin: '20px' }}>
        <div className="row">
          <div className="col-sm-12 patient-visit">
            {/* <FontAwesomeIcon icon={faLinkedinIn} /> */}
            <LinkedIn sx={{ fontSize: '32px' }} />
            <Facebook sx={{ fontSize: '32px' }} />
            <Instagram sx={{ fontSize: '32px' }} />
            <Twitter sx={{ fontSize: '32px' }} />
            <YouTube sx={{ fontSize: '32px' }} />
          </div>
        </div>
      </div>
      <Divider sx={{ border: '1.5px solid #000000', opacity: 1, width: '80svw' }} />
      <div className="content text-center" style={{ padding: 0, backgroundColor: '#F1F1F1', borderRadius: '8px 8px 0 0', marginTop: '10px' }}>
        <div className="row">
          <div className="col-sm-12 patient-visit">
            <p style={{ fontSize: '14px', lineHeight: '21px', padding: '16px 16px 0 16px' }}>
              <LocationOnSharp /> Av. Manuel Rodríguez 343, Santiago, Región
              Metropolitana
            </p>
            <div
              className="row"
              style={{
                backgroundColor: '#A6A6A6',
                padding: '16px 16px 32px 16px',
                width: '100%',
                margin: 'auto',
                borderRadius: '8px 8px 0 0'
              }}
            >
              <div
                className="col-sm-12 text-center"
                style={{
                  fontSize: '16px',
                  lineHeight: '24px'
                }}
              >
                <p style={{ textWrap: 'balance' }}>
                  Dirección de Asuntos Estudiantiles
                  Departamento de Salud Mental Estudiantil
                </p>
                <p style={{ margin: '16px 0 0' }}>@Daeudp . http://dae.udp.cl/</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );

}

export default Footer;