/* eslint-disable no-unused-vars */
/* eslint-disable-next-line react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
"use client"
import React, { useEffect, useState, useContext } from 'react'
import Link from "next/link";
import Image from 'next/image';
import { blog, doctor, doctorschedule, logout, menuicon04, patients, dashboard, menuicon06 } from './imagepath';
import { signOut } from "next-auth/react";

import { fetchUser } from '@/services/UsersServices';
// import Scrollbars from "react-custom-scrollbars-2";
import { useRouter } from 'next/navigation';
import ProtectedPage from './ProtectedRoutes';
import { useSession } from 'next-auth/react';
import { useSidebar } from '@/context/SidebarContext';
import SimpleBackdrop from './Backdrop';
import Scrollbars from "react-custom-scrollbars-2";
import { useUserContext } from '@/context/UserContext';

const Sidebar = () => {
  const { data: session, status } = useSession()
  const { props } = useSidebar();
  const ROL = ["alumno"]
  const router = useRouter();
  const [alumno, setAlumno] = useState('')
  const { setSelectedUserId } = useUserContext()
  const [sidebar, setSidebar] = useState("");

  const handleClick = (e, item, item1, item3) => {
    const div = document.querySelector(`#${item}`);
    const ulDiv = document.querySelector(`.${item1}`);
    e?.target?.className ? ulDiv.style.display = 'none' : ulDiv.style.display = 'block'
    e?.target?.className ? div.classList.remove('subdrop') : div.classList.add('subdrop');
  }

  const handleSignOut = () => {
    signOut({
      callbackUrl: '/'
    })
  }

  useEffect(() => {
    if (props?.id && props?.id1) {
      const ele = document.getElementById(props.id);
      if (ele) {
        handleClick(null, props.id, props.id1); // Call handleClick with default action (no event)
      }
    }

  }, [props]); // Use `props` in dependency array to re-run the effect when they change

  const patientLoggedIn = async () => {
    try {
      const { users: response } = await fetchUser(session?.user?.id)
      setAlumno(response[0])
    } catch (error) {
      console.log('Error:', error)
    }
  }

  useEffect(() => {
    if (session?.user?.rol === 'alumno') {
      patientLoggedIn()
    }
  }, [session])

  if (!session || !props) {
    return <SimpleBackdrop />;
  }


  const expandMenu = () => {
    document.body.classList.remove("expand-menu");
  };
  const expandMenuOpen = () => {
    document.body.classList.add("expand-menu");
  };

  return (
    <ProtectedPage level={ROL}>

      <div className="sidebar mt-5" id="sidebar" style={{ zIndex: 99 }}>
        <Scrollbars
          autoHide={true}
          autoHideTimeout={1000}
          autoHideDuration={200}
          style={{ height: 'calc(100vh - 90px)' }}
          renderThumbVertical={props => (
            <div
              {...props}
              style={{
                backgroundColor: '#2e37a4',
                borderRadius: '4px',
                width: '6px'
              }}
            />
          )}
        >
          <div className="sidebar-inner" style={{ minHeight: '200vh' }}>
            <div id="sidebar-menu" className="sidebar-menu"
              onMouseLeave={expandMenu}
              onMouseOver={expandMenuOpen}
            >
              {
                <ul>
                  {
                    /* ------ MENU SIDEBAR ALUMNO */
                    session.user?.rol && session.user?.rol === "alumno" &&
                    <>
                      <li>
                        <Link className={props?.activeClassName === 'appoinment-list' ? 'active' : ''} href="/citas">Lista de Citas</Link>
                      </li>
                      <li>
                        <Link
                          className={props?.activeClassName === 'ficha' ? 'active' : ''}
                          onClick={() => setSelectedUserId(session?.user?.id)}
                          href={`/fichas/ver`}>
                          Ficha
                        </Link>
                      </li>
                      {(alumno && alumno?.aplica_despeje) == 1 &&
                        <li>
                          <Link className={props?.activeClassName === 'add-first-appoinment' ? 'active' : ''} href="/citas/agendarentrevista">Agendar Entrevista</Link>
                        </li>
                      }
                    </>
                  }

                  {
                    /* ------ MENU SIDEBAR PROFESIONAL */
                    session.user?.rol && session.user?.rol === "profesional" &&
                    <>
                      <li className="submenu">
                        <Link href="#" id="menu-item1" onClick={(e) => {
                          // setSidebar('Doctors')
                          handleClick(e, "menu-item1", "menu-items1")
                        }}>
                          <span className="menu-side">
                            <Image src={doctor} alt="" />
                          </span>{" "}
                          <span> Profesionales </span> <span className="menu-arrow" />
                        </Link>
                        <ul style={{ display: "none" }} className="menu-items1">

                          <li>
                            <Link className={props?.activeClassName === 'edit-doctor' ? 'active' : ''} href={`/profesionales/editar/${session.user?.id}`}>Editar Perfil</Link>
                          </li>

                        </ul>
                      </li>

                      <li className="submenu">
                        <Link href="#" id="menu-item2" onClick={(e) => handleClick(e, "menu-item2", "menu-items2")}>
                          <span className="menu-side">
                            <Image src={patients} alt="" />
                          </span>{" "}
                          <span>Pacientes </span> <span className="menu-arrow" />
                        </Link>
                        <ul style={{ display: "none" }} className="menu-items2">
                          <li>
                            <Link className={props?.activeClassName === 'patient-list' ? 'active' : ''} href="/pacientes">Lista de Pacientes</Link>
                          </li>

                        </ul>
                      </li>


                      <li className="submenu">
                        <Link href="#" id="menu-item3" onClick={(e) => handleClick(e, "menu-item3", "menu-items3")}>
                          <span className="menu-side">
                            <Image src={menuicon06} alt="" />
                          </span>{" "}
                          <span>Grupos </span> <span className="menu-arrow" />
                        </Link>
                        <ul style={{ display: "none" }} className="menu-items3">
                          <li>
                            <Link className={props?.activeClassName === 'group-list' ? 'active' : ''} href="/grupos">Lista de Grupos</Link>
                          </li>
                          <li>
                            <Link className={props?.activeClassName === 'add-group' ? 'active' : ''} href="/grupos/crear">Crear Grupos</Link>
                          </li>
                          <li>
                            <Link className={props?.activeClassName === 'edit-group' ? 'active' : ''} href="/grupos/editar">Editar Grupos</Link>
                          </li>
                        </ul>
                      </li>


                      <li className="submenu">
                        <Link href="#" id="menu-item4" onClick={(e) => handleClick(e, "menu-item4", "menu-items4")}>
                          <span className="menu-side">
                            <Image src={menuicon04} alt="" />
                          </span>{" "}
                          <span> Citas </span> <span className="menu-arrow" />
                        </Link>
                        <ul style={{ display: "none" }} className="menu-items4">

                          <li>
                            <Link className={props?.activeClassName === 'add-appoinment' ? 'active' : ''} href="/citas/agendarcita">Agendar Cita</Link>
                          </li>

                        </ul>
                      </li>
                      <li className="submenu">

                        <Link className={`submenu ${props?.activeClassName === 'add-shedule' ? 'active' : ''}`} href={`/horarios/agregarhorario`} >
                          <span className="menu-side">
                            <Image src={doctorschedule} alt="" />
                          </span>{" "}
                          <span>Horario</span> <span className="menu-arrow" />
                        </Link>

                      </li>
                      <li className="submenu">
                        <Link href="#" id="menu-item11" onClick={(e) => handleClick(e, "menu-item11", "menu-items11")}>
                          <span className="menu-side">
                            <Image src={blog} alt="" />
                          </span>{" "}
                          <span> Blog</span> <span className="menu-arrow" />
                        </Link>
                        <ul style={{ display: "none" }} className="menu-items11">
                          <li>
                            <Link className={props?.activeClassName === 'blog-grid' ? 'active' : ''} href="/blog">Blogs</Link>
                          </li>

                          <li>
                            <Link className={props?.activeClassName === 'add-blog' ? 'active' : ''} href="/blog/agregarblog">Agregar Blog</Link>
                          </li>

                        </ul>
                      </li>

                    </>
                  }

                  {
                    session.user?.rol && session.user?.rol === "administrador" &&
                    <>
                      <li className="submenu">
                        <Link href="#" id="menu-item1" onClick={(e) => {
                          // setSidebar('Doctors')
                          handleClick(e, "menu-item1", "menu-items1")
                        }}>
                          <span className="menu-side">
                            <Image src={doctor} alt="" />
                          </span>{" "}
                          <span> Profesionales </span> <span className="menu-arrow" />
                        </Link>
                        <ul style={{ display: 'none' }} className="menu-items1">
                          <li>
                            <Link className={props?.activeClassName === 'doctor-list' ? 'active' : ''} href="/profesionales">Lista de Profesionales</Link>
                          </li>
                          <li>
                            <Link className={props?.activeClassName === 'add-doctor' ? 'active' : ''} href="/profesionales/agregarprofesional">Agregar Profesional</Link>
                          </li>


                          <li>
                            <Link className={props?.activeClassName === 'edit-doctor' ? 'active' : ''} href={`/profesionales/editar/${session.user?.id}`}>Editar Perfil</Link>
                          </li>
                        </ul>
                      </li>
                      <li className="submenu">
                        <Link href="#" id="menu-item2" onClick={(e) => handleClick(e, "menu-item2", "menu-items2")}>
                          <span className="menu-side">
                            <Image src={patients} alt="" />
                          </span>{" "}
                          <span>Pacientes </span> {/* <span className="menu-arrow" /> */}
                        </Link>
                        <ul style={{ display: "none" }} className="menu-items2">
                          <li>
                            <Link className={props?.activeClassName === 'patient-list' ? 'active' : ''} href="/pacientes">Lista de Pacientes</Link>
                          </li>
                        </ul>
                      </li>

                      <li className="submenu">
                        <Link href="#" id="menu-item3" onClick={(e) => handleClick(e, "menu-item3", "menu-items3")}>
                          <span className="menu-side">
                            <Image src={menuicon06} alt="" />
                          </span>{" "}
                          <span>Grupos </span> <span className="menu-arrow" />
                        </Link>
                        <ul style={{ display: "none" }} className="menu-items3">
                          <li>
                            <Link className={props?.activeClassName === 'group-list' ? 'active' : ''} href="/grupos">Lista de Grupos</Link>
                          </li>
                          <li>
                            <Link className={props?.activeClassName === 'add-group' ? 'active' : ''} href="/grupos/crear">Crear Grupos</Link>
                          </li>
                          <li>
                            <Link className={props?.activeClassName === 'edit-group' ? 'active' : ''} href="/grupos/editar">Editar Grupos</Link>
                          </li>
                        </ul>
                      </li>

                      <li className="submenu">
                        <Link href="#" id="menu-item4" onClick={(e) => handleClick(e, "menu-item4", "menu-items4")}>
                          <span className="menu-side">
                            <Image src={menuicon04} alt="" />
                          </span>{" "}
                          <span> Citas </span> <span className="menu-arrow" />
                        </Link>
                        <ul style={{ display: "none" }} className="menu-items4">

                          <li>
                            <Link className={props?.activeClassName === 'add-appoinment' ? 'active' : ''} href="/citas/agendarcita">Agendar Cita</Link>
                          </li>
                          <li>
                            <Link className={props?.activeClassName === 'add-first-appoinment' ? 'active' : ''} href="/citas/agendarentrevista">Agendar Entrevista</Link>
                          </li>
                        </ul>
                      </li>
                      <li className="submenu">
                        <Link className={`submenu ${props?.activeClassName === 'add-shedule' ? 'active' : ''}`} href={`/horarios/agregarhorario`} >
                          <span className="menu-side">
                            <Image src={doctorschedule} alt="" />
                          </span>{" "}
                          <span>Horario</span> <span className="menu-arrow" />
                        </Link>
                      </li>
                      <li className="submenu">
                        <Link className={`submenu ${props?.activeClassName === 'admin-dashboard' ? 'active' : ''}`} href={`/reportes`} >
                          <span className="menu-side">
                            <Image src={dashboard} alt="" />
                          </span>{" "}
                          <span>Reportes</span> <span className="menu-arrow" />
                        </Link>
                      </li>
                      <li className="submenu">
                        <Link href="#" id="menu-item11" onClick={(e) => handleClick(e, "menu-item11", "menu-items11")}>
                          <span className="menu-side">
                            <Image src={blog} alt="" />
                          </span>{" "}
                          <span> Blog</span> <span className="menu-arrow" />
                        </Link>
                        <ul style={{ display: "none" }} className="menu-items11">
                          <li>
                            <Link className={props?.activeClassName === 'blog-grid' ? 'active' : ''} href="/blog">Blogs</Link>
                          </li>
                          <li>
                            <Link className={props?.activeClassName === 'add-blog' ? 'active' : ''} href="/blog/agregarblog">Agregar Blog</Link>
                          </li>
                        </ul>
                      </li>
                    </>
                  }
                  <li>
                    <Link href="/" onClick={handleSignOut}>
                      <span className="menu-side">
                        <Image src={logout} alt="" />
                      </span>{" "}
                      <span>Logout</span>
                    </Link>
                  </li>

                </ul>
              }
              {/* <div className="logout-btn">
              <Link href="/" onClick={handleSignOut}>
                <span className="menu-side">
                  <Image src={logout} alt="" />
                </span>{" "}
                <span>Logout</span>
              </Link>
            </div> */}
            </div>
          </div>


        </Scrollbars>
      </div>

    </ProtectedPage >
  )
}
export default Sidebar
