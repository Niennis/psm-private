"use client"
import Link from "next/link";
import { logo, baricon, baricon1 } from "./imagepath";
import ReserveBtn from "./ReserveBtn";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const handlesidebar = () => {
    document.body.classList.toggle("mini-sidebar");
  };

  const handlesidebarmobilemenu = () => {
    document.body.classList.toggle("slide-nav");
    document.getElementsByTagName("html")[0].classList.toggle('menu-opened');
    document.getElementsByClassName("sidebar-overlay")[0].classList.toggle("opened");
  };

  const { status, data: session } = useSession()

  return (
    <div className="main-wrapper">
      <div className="header" style={{ justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}>
        <div className="header-left">
          <Link id="toggle_btn" href="#" onClick={handlesidebar}>
            <img src={baricon.src} alt="" />
          </Link>
          <Link id="mobile_btn" className="mobile_btn float-start" href="#" onClick={handlesidebarmobilemenu}>
            <img src={baricon1.src} alt="" />
          </Link>
          <Link href="/" className="logo">
            <img src={logo.src} width={263} height={70} alt="" />{" "}
          </Link>
        </div>
        <ul className="nav user-menu float-end ">
          <li>
            <Link className="sailec" href="#" style={{ backgroundColor: 'white', color: 'black', fontWeight: 500, fontSize: '14px' }}>
              TÓPICOS
            </Link>
          </li>
          <li>
            <Link className="sailec" href="#" style={{ backgroundColor: 'white', color: 'black', fontWeight: 500, fontSize: '14px' }}>
              TEST AUTODIAGNÓSTICO
            </Link>
          </li>
          <li>
            <Link className="sailec" href="#" style={{ backgroundColor: 'white', color: 'black', fontWeight: 500, fontSize: '14px' }}>
              EVENTOS
            </Link>
          </li>
          <li>
            <Link className="sailec" href="#" style={{ backgroundColor: 'white', color: 'black', fontWeight: 500, fontSize: '14px' }}>
              PREGUNTAS FRECUENTES
            </Link>
          </li>
          <li>
            <Link className="sailec" href="/quienes-somos" style={{ backgroundColor: 'white', color: 'black', fontWeight: 500, fontSize: '14px' }}>
              QUIÉNES SOMOS
            </Link>
          </li>
          <li>
            <Link className="sailec" href="material-descargable" style={{ backgroundColor: 'white', color: 'black', fontWeight: 500, fontSize: '14px' }}>
              MATERIAL DESCARGABLE
            </Link>
          </li>
          <li>
            <ReserveBtn text={'Reservar'} bgColor={'#FF5253'} color={'#fff'} />
          </li>
          {/* <Link className="sailec" href="/middlewareside" style={{ backgroundColor: 'white', color: 'black', fontWeight: 500, fontSize: '14px' }}>
            <li>MIDDLEWARE</li>
          </Link> */}

        </ul>
      </div>
    </div>
  )
}

export default Navbar;