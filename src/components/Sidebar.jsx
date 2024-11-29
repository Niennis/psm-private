/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
"use client"
import React, { useEffect, useState, useContext } from 'react'
import Link from "next/link";
import { blog, doctor, doctorschedule, logout, menuicon04, patients } from './imagepath';
import { signOut } from "next-auth/react";
import SidebarSkeleton from './skeletons/Sidebar-skeleton';
// import Scrollbars from "react-custom-scrollbars-2";
import { useRouter } from 'next/navigation';
import ProtectedPage from './ProtectedRoutes';
import { useSession } from 'next-auth/react';
import { useSidebar } from '@/context/SidebarContext';

const Sidebar = () => {
  const { data: session, status } = useSession()
  const { props } = useSidebar();
  const ROL = ["alumno"]
  const router = useRouter();

  const handleClick = (e, item, item1, item3) => {
    const div = document.querySelector(`#${item}`);
    const ulDiv = document.querySelector(`.${item1}`);
    e?.target?.className ? ulDiv.style.display = 'none' : ulDiv.style.display = 'block'
    e?.target?.className ? div.classList.remove('subdrop') : div.classList.add('subdrop');
  }

  const handleSignOut = () => {
    console.log('session', session)
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


  if (!session || !props) {
    return <p>Loading...</p>;
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
        {/* <Scrollbars
          autoHide
          autoHideTimeout={1000}
          autoHideDuration={200}
          autoHeight
          autoHeightMin={0}
          autoHeightMax="95vh"
          thumbMinSize={30}
          universal={false}
          hideTracksWhenNotNeeded={true}
        > */}


        <div className="sidebar-inner slimscroll">
          <div id="sidebar-menu" className="sidebar-menu"
            onMouseLeave={expandMenu}
            onMouseOver={expandMenuOpen}
          >
            {
              <ul>

                {/* {
                  !session?.user?.rol && <SidebarSkeleton />
                } */}

                {
                  session.user?.rol && session.user?.rol === "alumno" &&
                  <>
                    {/* <li className="submenu"> */}
                    {/* <Link href="#" id="menu-item4" onClick={(e) => handleClick(e, "menu-item4", "menu-items4")}>
                        <span className="menu-side">
                          <img src={menuicon04.src} alt="" />
                        </span>{" "}
                        <span> Citas </span> <span className="menu-arrow" />
                      </Link> */}
                    {/* <ul style={{ display: "none" }} className="menu-items4"> */}
                    <li>
                      <Link className={props?.activeClassName === 'appoinment-list' ? 'active' : ''} href="/citas">Lista de Citas</Link>
                    </li>
                    {/* <li>
                          <Link className={props?.activeClassName === 'add-appoinment' ? 'active' : ''} href="/citas/agendarcita">Agendar Cita</Link>
                        </li> */}
                    <li>
                      <Link className={props?.activeClassName === 'add-first-appoinment' ? 'active' : ''} href="/citas/agendarentrevista">Agendar Entrevista</Link>
                    </li>
                    {/* <li>
                      <Link className={props?.activeClassName === 'edit-appoinment' ? 'active' : ''} href="/editappoinments">Edit Appointment</Link>
                    </li> */}
                    {/* </ul> */}
                    {/* </li> */}
                  </>
                }


                {
                  session.user?.rol && session.user?.rol === "profesional" &&
                  <>
                    <li className="submenu">
                      <Link href="#" id="menu-item1" onClick={(e) => {
                        // setSidebar('Doctors')
                        handleClick(e, "menu-item1", "menu-items1")
                      }}>
                        <span className="menu-side">
                          <img src={doctor.src} alt="" />
                        </span>{" "}
                        <span> Profesionales </span> <span className="menu-arrow" />
                      </Link>
                      <ul style={{ display: "none"  }} className="menu-items1">
                       {/*  <li>
                          <Link className={props?.activeClassName === 'doctor-list' ? 'active' : ''} href="/profesionales">Lista de Profesionales</Link>
                        </li>
                        <li>
                          <Link className={props?.activeClassName === 'add-doctor' ? 'active' : ''} href="/profesionales/agregarprofesional">Agregar Profesional</Link>
                        </li> */}
                        <li>
                          <Link className={props?.activeClassName === 'edit-doctor' ? 'active' : ''} href={`/profesionales/editar/${session.user?.sub}`}>Editar Perfil</Link>
                        </li>
                        {/* <li>
                    <Link className={props?.activeClassName === 'doctor-profile' ? 'active' : ''} href="/doctorprofile">Perfil Profesional</Link>
                  </li> */}
                      </ul>
                    </li>

                    <li className="submenu">
                      <Link href="#" id="menu-item2" onClick={(e) => handleClick(e, "menu-item2", "menu-items2")}>
                        <span className="menu-side">
                          <img src={patients.src} alt="" />
                        </span>{" "}
                        <span>Pacientes </span> <span className="menu-arrow" />
                      </Link>
                      <ul style={{ display: "none" }} className="menu-items2">
                        <li>
                          <Link className={props?.activeClassName === 'patient-list' ? 'active' : ''} href="/pacientes">Lista de Pacientes</Link>
                        </li>
                        {/* <li>
                    <Link className={props?.activeClassName === 'add-patient' ? 'active' : ''} href="/pacientes">Agregar Pacientes</Link>
                  </li> */}
                        {/* <li>
                      <Link className={props?.activeClassName === 'edit-patient' ? 'active' : ''} href="/editpatients">Editar Pacientes</Link>
                    </li> */}
                        {/* <li>
                    <Link className={props?.activeClassName === 'patient' ? 'active' : ''} href="/patientsprofile">Perfil Paciente</Link>
                  </li> */}
                      </ul>
                    </li>
                    <li className="submenu">
                      <Link href="#" id="menu-item4" onClick={(e) => handleClick(e, "menu-item4", "menu-items4")}>
                        <span className="menu-side">
                          <img src={menuicon04.src} alt="" />
                        </span>{" "}
                        <span> Citas </span> <span className="menu-arrow" />
                      </Link>
                      <ul style={{ display: "none" }} className="menu-items4">
                        <li>
                          <Link className={props?.activeClassName === 'appoinment-list' ? 'active' : ''} href="/citas">Lista de Citas</Link>
                        </li>
                        <li>
                          <Link className={props?.activeClassName === 'add-appoinment' ? 'active' : ''} href="/citas/agendarcita">Agendar Cita</Link>
                        </li>
                        <li>
                          <Link className={props?.activeClassName === 'add-first-appoinment' ? 'active' : ''} href="/citas/agendarentrevista">Agendar Entrevista</Link>
                        </li>
                        {/* <li>
                      <Link className={props?.activeClassName === 'edit-appoinment' ? 'active' : ''} href="/editappoinments">Edit Appointment</Link>
                    </li> */}
                      </ul>
                    </li>
                    <li className="submenu">
                      {/*  <Link href="#" id="menu-item5" onClick={(e) => handleClick(e, "menu-item5", "menu-items5")}>
                  <span className="menu-side">
                    <img src={doctorschedule.src} alt="" />
                  </span>{" "}
                  <span> Horario Profesionales </span> <span className="menu-arrow" />
                </Link> */}
                      {/* <ul style={{ display: "none" }} className="menu-items5"> */}
                      {/* <li>
                    <Link className={props?.activeClassName === 'shedule-list' ? 'active' : ''} href="/horarios">Lista de Horarios</Link>
                  </li> */}
                      {/* <li> */}
                      <Link className={`submenu ${props?.activeClassName === 'add-shedule' ? 'active' : ''}`} href={`/horarios/agregarhorario/${session.user?.sub}`} >
                        <span className="menu-side">
                          <img src={doctorschedule.src} alt="" />
                        </span>{" "}
                        <span> Agregar Horario</span> <span className="menu-arrow" />
                      </Link>
                      {/* </li> */}
                      {/* <li>
                      <Link className={props?.activeClassName === 'edit-shedule' ? 'active' : ''} href="/editschedule">Editar Horario</Link>
                    </li> */}
                      {/* </ul> */}
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
                          <img src={doctor.src} alt="" />
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
                        {/* <li>
                      <Link className={props?.activeClassName === 'edit-doctor' ? 'active' : ''} href="/editdoctor">Editar Doctor</Link>
                    </li> */}
                        {/* <li>
                    <Link className={props?.activeClassName === 'doctor-profile' ? 'active' : ''} href="/doctorprofile">Perfil Profesional</Link>
                  </li> */}
                      </ul>
                    </li>
                    <li className="submenu">
                      <Link href="#" id="menu-item2" onClick={(e) => handleClick(e, "menu-item2", "menu-items2")}>
                        <span className="menu-side">
                          <img src={patients.src} alt="" />
                        </span>{" "}
                        <span>Pacientes </span> {/* <span className="menu-arrow" /> */}
                      </Link>
                      <ul style={{ display: "none" }} className="menu-items2">
                        <li>
                          <Link className={props?.activeClassName === 'patient-list' ? 'active' : ''} href="/pacientes">Lista de Pacientes</Link>
                        </li>
                        {/* <li>
                    <Link className={props?.activeClassName === 'add-patient' ? 'active' : ''} href="/pacientes">Agregar Pacientes</Link>
                  </li> */}
                        {/* <li>
                      <Link className={props?.activeClassName === 'edit-patient' ? 'active' : ''} href="/editpatients">Editar Pacientes</Link>
                    </li> */}
                        {/* <li>
                    <Link className={props?.activeClassName === 'patient' ? 'active' : ''} href="/patientsprofile">Perfil Paciente</Link>
                  </li> */}
                      </ul>
                    </li>
                    <li className="submenu">
                      <Link href="#" id="menu-item4" onClick={(e) => handleClick(e, "menu-item4", "menu-items4")}>
                        <span className="menu-side">
                          <img src={menuicon04.src} alt="" />
                        </span>{" "}
                        <span> Citas </span> <span className="menu-arrow" />
                      </Link>
                      <ul style={{ display: "none" }} className="menu-items4">
                        <li>
                          <Link className={props?.activeClassName === 'appoinment-list' ? 'active' : ''} href="/citas">Lista de Citas</Link>
                        </li>
                        <li>
                          <Link className={props?.activeClassName === 'add-appoinment' ? 'active' : ''} href="/citas/agendarcita">Agendar Cita</Link>
                        </li>
                        <li>
                          <Link className={props?.activeClassName === 'add-first-appoinment' ? 'active' : ''} href="/citas/agendarentrevista">Agendar Entrevista</Link>
                        </li>
                        {/* <li>
                      <Link className={props?.activeClassName === 'edit-appoinment' ? 'active' : ''} href="/editappoinments">Edit Appointment</Link>
                    </li> */}
                      </ul>
                    </li>
                    <li className="submenu">
                      {/*  <Link href="#" id="menu-item5" onClick={(e) => handleClick(e, "menu-item5", "menu-items5")}>
                  <span className="menu-side">
                    <img src={doctorschedule.src} alt="" />
                  </span>{" "}
                  <span> Horario Profesionales </span> <span className="menu-arrow" />
                </Link> */}
                      <ul style={{ display: "none" }} className="menu-items5">
                        {/* <li>
                    <Link className={props?.activeClassName === 'shedule-list' ? 'active' : ''} href="/horarios">Lista de Horarios</Link>
                  </li> */}
                        {/* <li>
                    <Link className={props?.activeClassName === 'add-shedule' ? 'active' : ''} href="/addschedule">Agregar Horarios</Link>
                  </li> */}
                        {/* <li>
                      <Link className={props?.activeClassName === 'edit-shedule' ? 'active' : ''} href="/editschedule">Editar Horario</Link>
                    </li> */}
                      </ul>
                    </li>
                    {/*    <li className="submenu">
                      <Link href="#" id="menu-item11" onClick={(e) => handleClick(e, "menu-item11", "menu-items11")}>
                        <span className="menu-side">
                          <img src={blog.src} alt="" />
                        </span>{" "}
                        <span> Blog</span> <span className="menu-arrow" />
                      </Link>
                      <ul style={{ display: "none" }} className="menu-items11"> */}
                    {/* <li>
                    <Link className={props?.activeClassName === 'blog-grid' ? 'active' : ''} href="/blogview">Blogs</Link>
                  </li> */}
                    {/* <li>
                          <Link className={props?.activeClassName === 'blog-details' ? 'active' : ''} href="/blog/1">
                            Blog
                          </Link>
                        </li>
                        <li>
                          <Link className={props?.activeClassName === 'add-blog' ? 'active' : ''} href="/blog/agregarblog">Agregar Blog</Link>
                        </li> */}
                    {/* <li>
                    <Link className={props?.activeClassName === 'edit-blog' ? 'active' : ''} href="/editblog">Edit Blog</Link>
                  </li> */}
                    {/* </ul>
                    </li>*/}
                  </>
                }

              </ul>
            }
            <div className="logout-btn">
              <Link href="/" onClick={handleSignOut}>
                <span className="menu-side">
                  <img src={logout.src} alt="" />
                </span>{" "}
                <span>Logout</span>
              </Link>
            </div>
          </div>
        </div>


        {/* </Scrollbars> */}
      </div>
    </ProtectedPage>
  )
}
export default Sidebar
