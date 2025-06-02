'use client'
/* eslint-disable no-unused-vars */
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSection } from "@/context/SectionContext";
import ReserveBtn from "./ReserveBtn";
import Link from "next/link";
import { useMediaQuery } from "@mui/material";
import { Tooltip, Avatar } from '@mui/material';

import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Button, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
// import { FaUserCircle } from "react-icons/fa";
// import { FaChevronDown } from "react-icons/fa";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useSession } from "next-auth/react";


const URL = "https://saludmental.udp.cl/"

const pagesWithEvents = [
  // { title: 'INICIO', url: '/#inicio', label: 'inicio' },
  { title: 'QUIÉNES SOMOS', url: URL + 'quienes-somos', label: 'quienes_somos' },
  // { title: 'CÓMO TRABAJAMOS', url: URL + 'como-trabajamos', label: 'como-trabajamos' },
  { title: 'TEST AUTODIAGNÓSTICO?', url: URL + '#test_autodiagnostico', label: 'test_autodiagnostico' },
  { title: 'EVENTOS', url: '/#', label: 'eventos' },
  { title: 'MATERIAL DESCARGABLE', url: URL + 'material-descargable', label: 'material_descargable' },
  { title: 'PREGUNTAS FRECUENTES', url: URL + '#preguntas-frecuentes', label: 'preguntas_frecuentes' },
];

const pagesWithoutEvents = [
  // { title: 'INICIO', url: '/#inicio', label: 'inicio' },
  { title: 'QUIÉNES SOMOS', url: URL + 'quienes-somos', label: 'quienes_somos' },
  // { title: 'CÓMO TRABAJAMOS', url: URL + 'como-trabajamos', label: 'como-trabajamos' },
  { title: 'TEST AUTODIAGNÓSTICO', url: URL + '#test_autodiagnostico', label: 'test_autodiagnostico' },
  { title: 'MATERIAL DESCARGABLE', url: URL + 'material-descargable', label: 'material_descargable' },
  { title: 'PREGUNTAS FRECUENTES', url: URL + '#preguntas-frecuentes', label: 'preguntas_frecuentes' },
];

const subMenu = [
  { title: 'Intervenciones', url: URL + 'como-trabajamos', label: '/como_trabajamos' },
  { title: 'Plan de Acción', url: URL + 'plan-de-accion-en-salud-mental', label: '/plan-de-accion-en-salud-mental' },
  { title: 'Prevención', url: URL + 'intervencion-en-promocion-y-prevencion', label: '/intervencion-en-promocion-y-prevencion' },
  { title: 'Convenios y profesionales', url: URL + 'como-trabajamos/convenios-y-profesionales', label: '/convenios-y-profesionales' },
];

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0, // 640
      sm: 641, // 767
      md: 768, // 1023
      lg: 1024, // 1279
      xl: 1280,
    },
  },
});

const Header = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { activeSection, setActiveSection } = useSection();
  const open = Boolean(anchorEl);
  const EVENTS = 0;
  const pages = EVENTS !== 0 ? pagesWithEvents : pagesWithoutEvents
  const [style, setStyle] = useState({ width: 'min-content' });

  const BOTON_RESERVAR = process.env.NEXT_PUBLIC_ACTIVATE_BUTTON === "true"

  const matches = useMediaQuery("(max-width : 767px)");
  const isMediumSize = useMediaQuery("(min-width : 768px) and (max-width : 1023px)");
  const isLargeSize = useMediaQuery("(min-width: 1024px) ");
  const { session } = useSession();
  // const isXXLargeSize = useMediaQuery("(min-width:1281px)")

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 900) {
        setStyle({ width: '6px' });
      } else if (width < 1450) {
        setStyle({ width: 'min-content' });
      } else {
        setStyle({ width: 'fit-content' });
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      handleResize();
    }

    // Limpia el event listener cuando el componente se desmonte
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
    // setActiveSection(id);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavClick = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(id);
  };
  // Controla el padding del body al abrir/cerrar el menú
  useEffect(() => {
    if (anchorElNav) {
      document.body.style.paddingRight = '0px';
      const header = document.querySelector('header');
      if (header) {
        header.style.paddingRight = '0px';
      }
    } else {
      document.body.style.paddingRight = '';
      const header = document.querySelector('header');
      if (header) {
        header.style.paddingRight = '';
      }
    }
  }, [anchorElNav]);

  return (
    // <ThemeProvider theme={theme}>
    <AppBar position="fixed" style={{ background: 'white', color: 'black', margin: 0, height: matches ? '112px' : '98px', justifyContent: matches ? 'center' : 'flex-end' }}>
      <Container maxWidth="false" style={{ background: 'white', color: 'black', padding: matches && 0, margin: 0 }}>
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          {isLargeSize ? (
            <>
              {/* MENU DASHBOARD */}
              <Box sx={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                // Tamaños responsivos con límites:
                width: { sm: '150px', md: '180px', lg: '200px', xl: '263px' },
                // Altura proporcional (ajusta según necesidad):
                height: { xs: '40px', sm: '48px', md: '53px', lg: '70px' },
                position: 'relative', // Necesario para Image con fill
                overflow: 'hidden', // Previene desbordamientos
              }}>
                <Typography
                  variant="h6"
                  noWrap
                  component="a"
                  href={URL}
                >
                  <Image
                    alt="Logo"
                    src={`/api/file-proxy?filePath=${process.env.NEXT_PUBLIC_BASE_IMG}logo02.png`}
                    height={70}
                    width={263}
                    priority
                    style={{
                      height: 'auto',
                      width: '100%',
                      maxWidth: '263px',
                      objectFit: 'contain'
                    }}
                  />
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Box sx={{
                  flexGrow: 1,
                  display: { xs: 'none', md: 'flex' },
                  justifyContent: 'center',
                  alignItems: 'center',
                  maxWidth: '800px',
                  margin: '0 16px'
                }}>
                  {pages.map((page) => {
                    return (
                      <Link
                        style={{
                          color: 'black',
                          textDecoration: 'none',
                          flexShrink: 0
                        }}
                        href={page.url}
                        key={page.title}
                      >
                        <Button
                          className={`ui-small ${activeSection === page.label
                            ? 'active-header'
                            : ''
                            }`}

                          onClick={() => handleNavClick(page.label)}
                          sx={{
                            ...style, my: 2, mx: { lg: '4px', xl: 1 },
                            color: 'black',
                            display: 'block',
                            width: 'min-content'

                          }}
                        >
                          {page.title}
                        </Button>
                      </Link>
                    )
                  }
                  )}
                  <Tooltip title="Como trabajamos">
                    <Button
                      className={`ui-small ${activeSection === 'como_trabajamos'
                        ? 'active-header'
                        : ''
                        }`}
                      onMouseOver={handleOpenUserMenu} sx={{ ...style, p: 0, my: 2, mx: 1, width: 'min-content', color: 'black', marginTop: '16px', marginBottom: '16px' }}
                    >
                      CÓMO TRABAJAMOS
                    </Button>
                  </Tooltip>

                  <Box sx={{ flexGrow: 0, }} className="ui-medium" >
                    <Menu
                      sx={{ mt: '45px' }}
                      id="menu-appbar"
                      anchorEl={anchorElUser}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={Boolean(anchorElUser)}
                      onClose={handleCloseUserMenu}
                    >
                      {subMenu.map((setting) => (
                        <MenuItem key={setting.url} onClick={handleCloseUserMenu}>
                          <Typography textAlign="center" className="ui-medium"
                            onMouseLeave={handleCloseUserMenu}>
                            <a href={setting.url} style={{ color: 'black', textDecoration: 'none' }}>
                              {setting.title}
                            </a>
                          </Typography>
                        </MenuItem>
                      ))}
                    </Menu>
                  </Box>
                </Box>
                {/* BOTON RESERVAR DESKTOP */}
                <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
                  <ReserveBtn text={'Reservar'} bgColor={'#FABB00'} color={'#000'} />
                  <Link href={`${URL}#profesionales`} style={{ textDecoration: 'none' }} >
                    {/* <FaUserCircle className={`btn-fa-user ${isSmallSize ? "btn-fa-user-mobile" : "btn-fa-user-desktop"}`} /> */}
                  </Link>
                </Box>
                {/* USER MENU */}
                {
                  !session
                    ? <>
                      {/* <ReserveBtn text={'Reservar'} bgColor={'#FABB00'} color={'#000'} /> */}
                      <Link href="/#profesionales" style={{ textDecoration: 'none' }}>
                        <i className=" fas fa-user-circle" style={{ fontSize: '50px', color: "#b82925", background: '#fff', padding: '5px', marginLeft: '5px' }}></i>
                      </Link>
                    </>
                    : session.user?.picture ?
                      <button className="btn">
                        <Link href={session?.user?.rol === 'profesional' || session?.user?.rol === 'administrador' ? '/pacientes' : '/citas'} style={{ textDecoration: 'none' }}>
                          <Image
                            className="avatar-img rounded-circle"
                            src={session?.user?.picture}
                            alt="avatar"
                            height={40}
                            width={40}
                          />
                        </Link>
                        <small style={{ display: 'block', textAlign: 'right', width: 'min-content', fontFamily: 'Work Sans' }}>
                          {`Bienvenido, 
                      ${(session.user?.nombre_social)}`}
                        </small>
                      </button>
                      :
                      <Link href={session?.user?.rol === 'profesional' || session?.user?.rol === 'administrador' ? '/pacientes' : '/citas'} style={{ padding: 0, margin: 0, textAlign: 'right' }}>
                        <i className="fas fa-user-circle" style={{ fontSize: '40px', marginLeft: '5px', display: 'block', justifySelf: 'flex-end' }} ></i>
                        <small style={{ display: 'block', textAlign: 'right', width: 'min-content', fontFamily: 'Work Sans' }}>
                          {`Bienvenido, 
                      ${(session.user?.nombre_social)}`}
                        </small>
                      </Link>
                }
              </Box>
            </>
          ) : (
            <>
              {/*  MENU MOBILE */}
              <Box sx={{ display: 'flex', flexDirection: 'row', width: 'fit-content', alignItems: 'center' }}>
                <Box sx={{
                  flexGrow: 'unset', display: { xs: 'flex', sm: 'flex', md: 'flex', lg: 'none' },
                }}>
                  <IconButton
                    size="small"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{
                      display: { xs: 'block', lg: 'none', margin: 0 },
                    }}
                  >
                    {
                      pages.map((page) => (
                        <MenuItem key={page.title} onClick={handleCloseNavMenu}>
                          <Typography textAlign="center" className="ui-medium">
                            <a href={page.url} style={{ color: 'black', }}>
                              {page.title}
                            </a>
                          </Typography>
                        </MenuItem>
                      ))
                    }
                    <MenuItem onClick={handleOpenUserMenu}>
                      <Typography textAlign="center" className="ui-medium font-black" >
                        CÓMO TRABAJAMOS{/*  <FaChevronDown /> */}
                      </Typography>
                    </MenuItem>

                    <Box sx={{ flexGrow: 0 }} >
                      <Menu
                        sx={{ mt: '45px', }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                      >
                        {subMenu.map((setting) => (
                          <MenuItem key={setting.url} onClick={handleCloseUserMenu}>
                            <Typography textAlign="center" className="ui-medium">
                              <a href={setting.url} style={{ color: 'black', textDecoration: 'none' }}>
                                {setting.title}
                              </a>
                            </Typography>
                          </MenuItem>
                        ))}
                      </Menu>
                    </Box>
                  </Menu>
                </Box>
                <Typography
                  variant="h5"
                  noWrap
                  component="a"
                  href={URL}
                  sx={{
                    // mr: { xs: 0, lg: 2 },
                    display: { xs: 'flex', lg: 'none' },
                    /* flexGrow: 1, temporal mientras botones están desactivados */
                    color: 'inherit',
                    overflow: 'unset',
                    // Tamaños responsivos con límites:
                    width: { xs: '100px', sm: '200px', md: '250px', lg: '200px', xl: '263px' },
                    // Altura proporcional (ajusta según necesidad):
                    height: { xs: '45px', sm: '40px', md: '60px', lg: '53px', xl: '70px' },
                  }}
                >
                  <Image
                    src={`/api/file-proxy?filePath=${process.env.NEXT_PUBLIC_BASE_IMG}logo02.png`}
                    height={0}
                    width={0}
                    alt="logo udp"
                    sizes="100%"
                    style={{
                      height: 'auto',
                      width: 'auto',
                    }} />{" "}
                </Typography>
              </Box>
              {/* BOTON RESERVAR MOBILE */}
              <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
                <ReserveBtn text={'Reservar'} bgColor={'#FABB00'} color={'#000'} />
                <Link href={`${URL}#profesionales`} style={{ textDecoration: 'none' }} >
                  {/* <FaUserCircle className={`btn-fa-user ${isSmallSize ? "btn-fa-user-mobile" : "btn-fa-user-desktop"}`} /> */}
                </Link>
                {/* USER MENU */}
                {
                  !session
                    ? <>
                      {/* <ReserveBtn text={'Reservar'} bgColor={'#FABB00'} color={'#000'} /> */}
                      <Link href="/#profesionales" style={{ textDecoration: 'none' }}>
                        <i className=" fas fa-user-circle" style={{ fontSize: '40px' , color: "#b82925", background: '#fff', padding: '5px', }}></i>
                      </Link>
                    </>
                    : session.user?.picture ?
                      <button className="btn">
                        <Link href={session?.user?.rol === 'profesional' || session?.user?.rol === 'administrador' ? '/pacientes' : '/citas'} style={{ textDecoration: 'none' }}>
                          <Image
                            className="avatar-img rounded-circle"
                            src={session?.user?.picture}
                            alt="avatar"
                            height={40}
                            width={40}
                          />
                        </Link>
                        <small style={{ display: 'block', textAlign: 'right', width: 'min-content', fontFamily: 'Work Sans' }}>
                          {`Bienvenido, 
                      ${(session.user?.nombre_social)}`}
                        </small>
                      </button>
                      :
                      <Link href={session?.user?.rol === 'profesional' || session?.user?.rol === 'administrador' ? '/pacientes' : '/citas'} style={{ padding: 0, margin: 0, textAlign: 'right' }}>
                        <i className="fas fa-user-circle" style={{ fontSize: '40px', marginLeft: '5px', display: 'block', justifySelf: 'flex-end' }} ></i>
                        <small style={{ display: 'block', textAlign: 'right', width: 'min-content', fontFamily: 'Work Sans' }}>
                          {`Bienvenido, 
                      ${(session.user?.nombre_social)}`}
                        </small>
                      </Link>
                }
              </Box>

            </>
          )}


        </Toolbar>
      </Container>
    </AppBar >
    // </ThemeProvider>
  );
};

export default Header;
