'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link';

import Sidebar from '@/components/Sidebar'
import FeatherIcon from "feather-icons-react";
import {
  blogimg1, blogimg10, blogimg11, blogimg12, blogimg2, blogimg3, blogimg4, blogimg5,
  blogimg6, blogimg7, blogimg8, blogimg9,
} from '@/components/imagepath'

import { fetchBlogs } from '@/services/BlogServices';

import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import ProtectedPage from '@/components/ProtectedRoutes';

const truncarPalabras = (texto, num) => {
  const aux = texto.split(' ');

  if (aux.length > num) {
    return aux.slice(0, num).join(' ') + '...';
  } else {
    return texto;
  }
}

const BlogView = () => {
  const ROL = ["admin"]
  const { data: session } = useSession()
  const router = useRouter();
  // useAuthorization(['alumno'])
  const data = async () => {
    try {
      const response = await fetchBlogs()
      console.log('response', response.slice(0, 5));
      setBlogs(response.slice(0, 5))
    } catch (error) {
      console.log('error', error)
    }
  }

  const [blogs, setBlogs] = useState([])
  useEffect(() => {
    data()
  }, [])

  return (
    <ProtectedPage level={ROL}>
      <div className="main-wrapper">
        {/* Header */}
        {/* <Header /> */}
        <Sidebar id='menu-item11' id1='menu-items11' activeClassName='blog-grid' />
        {/* Sidebar */}
        {/* Page Wrapper */}


        <div className="page-wrapper">
          <div className="content">
            {/* Page Header */}
            <div className="page-header">
              <div className="row">
                <div className="col-sm-12">
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="/blogview">Blog </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="feather-chevron-right">
                        <FeatherIcon icon="chevron-right" />
                      </i>
                    </li>
                    <li className="breadcrumb-item active">Blogs</li>
                  </ul>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            <div className="row">

              {
                blogs.map((blog) => (
                  <div className="col-sm-6 col-md-6 col-xl-4" key={`blog${blog.id}`}>
                    <div className="blog grid-blog">
                      <div className="blog-image">
                        <Link href="/blog">
                          <img
                            className="img-fluid"
                            src={blog.imagen}
                            alt="#"
                          />
                        </Link>
                        <div className="blog-views">
                          <h5>Psicología</h5>
                        </div>
                        {/* <ul className="nav view-blog-list blog-views">
                          <li>
                            <i className="feather-message-square me-1" />
                            <FeatherIcon icon="message-square" />
                            58
                          </li>
                          <li>
                            <i className="feather-eye me-1" />
                            <FeatherIcon icon="eye" />
                            500
                          </li>
                        </ul> */}
                      </div>
                      <div className="blog-content">
                        <div className="blog-grp-blk">
                          <div className="blog-img-blk">
                            {/* <Link href="/blog">
                              <img
                                className="img-fluid"
                                src={blogimg2.src}
                                alt="#"
                              />
                            </Link> */}
                            <div className="content-blk-blog ms-2">
                              <h4>
                                <Link href="profile.html">{blog.autor}</Link>
                              </h4>
                              <h5>M.B.B.S, Diabetologist</h5>
                            </div>
                          </div>
                          <span>
                            <i className="feather-calendar me-1" />
                            {blog.fecha_publicacion}
                          </span>
                        </div>
                        <h3 className="blog-title">
                          <Link href="/blog">
                            {blog.titulo}
                          </Link>
                        </h3>
                        <p>
                          {truncarPalabras(blog.texto, 20)}
                        </p>
                        <Link href="/blog" className="read-more d-flex">
                          {" "}
                          Leer más...
                          <i className="fa fa-long-arrow-right ms-2" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              }
              <div className="col-sm-6 col-md-6 col-xl-4">
                <div className="blog grid-blog">
                  <div className="blog-image">
                    <Link href="/blog">
                      <img
                        className="img-fluid"
                        src={blogimg1.src}
                        alt="#"
                      />
                    </Link>
                    <div className="blog-views">
                      <h5>Diabetes</h5>
                    </div>
                    <ul className="nav view-blog-list blog-views">
                      <li>
                        <i className="feather-message-square me-1" />
                        <FeatherIcon icon="message-square" />
                        58
                      </li>
                      <li>
                        <i className="feather-eye me-1" />
                        <FeatherIcon icon="eye" />
                        500
                      </li>
                    </ul>
                  </div>
                  <div className="blog-content">
                    <div className="blog-grp-blk">
                      <div className="blog-img-blk">
                        <Link href="/blog">
                          <img
                            className="img-fluid"
                            src={blogimg2.src}
                            alt="#"
                          />
                        </Link>
                        <div className="content-blk-blog ms-2">
                          <h4>
                            <Link href="profile.html">Jenifer Robinson</Link>
                          </h4>
                          <h5>M.B.B.S, Diabetologist</h5>
                        </div>
                      </div>
                      <span>
                        <i className="feather-calendar me-1" />
                        05 Sep 2022
                      </span>
                    </div>
                    <h3 className="blog-title">
                      <Link href="/blog">
                        Simple Changes That Lowered My Moms Blood Pressure
                      </Link>
                    </h3>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore magna aliqua...
                    </p>
                    <Link href="/blog" className="read-more d-flex">
                      {" "}
                      Read more in 8 Minutes
                      <i className="fa fa-long-arrow-right ms-2" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-md-6 col-xl-4">
                <div className="blog grid-blog">
                  <div className="blog-image">
                    <Link href="/blog">
                      <img
                        className="img-fluid"
                        src={blogimg3.src}
                        alt="#"
                      />
                    </Link>
                    <div className="blog-views">
                      <h5>Safety</h5>
                    </div>
                    <ul className="nav view-blog-list blog-views">
                      <li>
                        <i className="feather-message-square me-1" />
                        <FeatherIcon icon="message-square" />
                        18
                      </li>
                      <li>
                        <i className="feather-eye me-1" />
                        <FeatherIcon icon="eye" />

                        5k
                      </li>
                    </ul>
                  </div>
                  <div className="blog-content">
                    <div className="blog-grp-blk">
                      <div className="blog-img-blk">
                        <Link href="profile.html">
                          <img
                            className="img-fluid"
                            src={blogimg4.src}
                            alt="#"
                          />
                        </Link>
                        <div className="content-blk-blog ms-2">
                          <h4>
                            <Link href="profile.html">Mark hay smith</Link>
                          </h4>
                          <h5>M.B.B.S, Neurologist</h5>
                        </div>
                      </div>
                      <span>
                        <i className="feather-calendar me-1" />
                        05 Sep 2022
                      </span>
                    </div>
                    <h3 className="blog-title">
                      <Link href="/blog">
                        Vaccines Are Close - But Right Now We Need to Hunker Down
                      </Link>
                    </h3>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore magna aliqua...
                    </p>
                    <Link href="/blog" className="read-more d-flex">
                      {" "}
                      Read more in 2 Minutes
                      <i className="fa fa-long-arrow-right ms-2" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-md-6 col-xl-4">
                <div className="blog grid-blog">
                  <div className="blog-image">
                    <Link href="/blog">
                      <img
                        className="img-fluid"
                        src={blogimg5.src}
                        alt="#"
                      />
                    </Link>
                    <div className="blog-views">
                      <h5>Dermotology</h5>
                    </div>
                    <ul className="nav view-blog-list blog-views">
                      <li>
                        <i className="feather-message-square me-1" />
                        <FeatherIcon icon="message-square" />

                        28
                      </li>
                      <li>
                        <i className="feather-eye me-1" />
                        <FeatherIcon icon="eye" />

                        2.5k
                      </li>
                    </ul>
                  </div>
                  <div className="blog-content">
                    <div className="blog-grp-blk">
                      <div className="blog-img-blk">
                        <Link href="profile.html">
                          <img
                            className="img-fluid"
                            src={blogimg6.src}
                            alt="#"
                          />
                        </Link>
                        <div className="content-blk-blog ms-2">
                          <h4>
                            <Link href="profile.html">Denise Stevens</Link>
                          </h4>
                          <h5>M.B.B.S, Dermotologist</h5>
                        </div>
                      </div>
                      <span>
                        <i className="feather-calendar me-1" />
                        05 Sep 2022
                      </span>
                    </div>
                    <h3 className="blog-title">
                      <Link href="/blog">
                        Hair Loss On One Side of Head – Causes &amp; Treatments
                      </Link>
                    </h3>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore magna aliqua...
                    </p>
                    <Link href="/blog" className="read-more d-flex">
                      {" "}
                      Read more in 3 Minutes
                      <i className="fa fa-long-arrow-right ms-2" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-md-6 col-xl-4">
                <div className="blog grid-blog">
                  <div className="blog-image">
                    <Link href="/blog">
                      <img
                        className="img-fluid"
                        src={blogimg7.src}
                        alt="#"
                      />
                    </Link>
                    <div className="blog-views">
                      <h5>Ophthalmology</h5>
                    </div>
                    <ul className="nav view-blog-list blog-views">
                      <li>
                        <i className="feather-message-square me-1" />
                        <FeatherIcon icon="message-square" />

                        48
                      </li>
                      <li>
                        <i className="feather-eye me-1" />
                        <FeatherIcon icon="eye" />

                        600
                      </li>
                    </ul>
                  </div>
                  <div className="blog-content">
                    <div className="blog-grp-blk">
                      <div className="blog-img-blk">
                        <Link href="profile.html">
                          <img
                            className="img-fluid"
                            src={blogimg8.src}
                            alt="#"
                          />
                        </Link>
                        <div className="content-blk-blog ms-2">
                          <h4>
                            <Link href="profile.html">Laura Williams</Link>
                          </h4>
                          <h5>M.B.B.S, Ophthalmologist</h5>
                        </div>
                      </div>
                      <span>
                        <i className="feather-calendar me-1" />
                        05 Sep 2022
                      </span>
                    </div>
                    <h3 className="blog-title">
                      <Link href="/blog">
                        Eye Care Routine To Get Rid Of Under Eye Circles And Puffiness
                      </Link>
                    </h3>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore magna aliqua...
                    </p>
                    <Link href="/blog" className="read-more d-flex">
                      {" "}
                      Read more in 5 Minutes
                      <i className="fa fa-long-arrow-right ms-2" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-md-6 col-xl-4">
                <div className="blog grid-blog">
                  <div className="blog-image">
                    <Link href="/blog">
                      <img
                        className="img-fluid"
                        src={blogimg9.src}
                        alt="#"
                      />
                    </Link>
                    <div className="blog-views">
                      <h5>Dentist</h5>
                    </div>
                    <ul className="nav view-blog-list blog-views">
                      <li>
                        <i className="feather-message-square me-1" />
                        <FeatherIcon icon="message-square" />

                        48
                      </li>
                      <li>
                        <i className="feather-eye me-1" />
                        <FeatherIcon icon="eye" />

                        600
                      </li>
                    </ul>
                  </div>
                  <div className="blog-content">
                    <div className="blog-grp-blk">
                      <div className="blog-img-blk">
                        <Link href="profile.html">
                          <img
                            className="img-fluid"
                            src={blogimg10.src}
                            alt="#"
                          />
                        </Link>
                        <div className="content-blk-blog ms-2">
                          <h4>
                            <Link href="profile.html">Linda Carpenter </Link>
                          </h4>
                          <h5>M.B.B.S, Dentist</h5>
                        </div>
                      </div>
                      <span>
                        <i className="feather-calendar me-1" />
                        05 Sep 2022
                      </span>
                    </div>
                    <h3 className="blog-title">
                      <Link href="/blog">
                        5 Facts About Teeth Whitening You Should Know
                      </Link>
                    </h3>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore magna aliqua...
                    </p>
                    <Link href="/blog" className="read-more d-flex">
                      {" "}
                      Read more in 3 Minutes
                      <i className="fa fa-long-arrow-right ms-2" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-md-6 col-xl-4">
                <div className="blog grid-blog">
                  <div className="blog-image">
                    <Link href="/blog">
                      <img
                        className="img-fluid"
                        src={blogimg11.src}
                        alt="#"
                      />
                    </Link>
                    <div className="blog-views">
                      <h5>Gynecologist</h5>
                    </div>
                    <ul className="nav view-blog-list blog-views">
                      <li>
                        <i className="feather-message-square me-1" />
                        <FeatherIcon icon="message-square" />

                        18
                      </li>
                      <li>
                        <i className="feather-eye me-1" />
                        <FeatherIcon icon="eye" />

                        300
                      </li>
                    </ul>
                  </div>
                  <div className="blog-content">
                    <div className="blog-grp-blk">
                      <div className="blog-img-blk">
                        <Link href="profile.html">
                          <img
                            className="img-fluid"
                            src={blogimg12.src}
                            alt="#"
                          />
                        </Link>
                        <div className="content-blk-blog ms-2">
                          <h4>
                            <Link href="profile.html">Mark hay smith</Link>
                          </h4>
                          <h5>M.B.B.S, Gynecologist</h5>
                        </div>
                      </div>
                      <span>
                        <i className="feather-calendar me-1" />
                        05 Sep 2022
                      </span>
                    </div>
                    <h3 className="blog-title">
                      <Link href="/blog">
                        Sciatica: Symptoms, Causes &amp; Treatments
                      </Link>
                    </h3>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore magna aliqua...
                    </p>
                    <Link href="/blog" className="read-more d-flex">
                      {" "}
                      Read more in 10 Minutes
                      <i className="fa fa-long-arrow-right ms-2" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="notification-box">
            <div className="msg-sidebar notifications msg-noti">
              <div className="topnav-dropdown-header">
                <span>Messages</span>
              </div>
              <div className="drop-scroll msg-list-scroll" id="msg_list">
                <ul className="list-box">
                  <li>
                    <Link href="chat.html">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">R</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">Richard Miles </span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="chat.html">
                      <div className="list-item new-message">
                        <div className="list-left">
                          <span className="avatar">J</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">John Doe</span>
                          <span className="message-time">1 Aug</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="chat.html">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">T</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author"> Tarah Shropshire </span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="chat.html">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">M</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">Mike Litorus</span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="chat.html">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">C</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author"> Catherine Manseau </span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="chat.html">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">D</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author"> Domenic Houston </span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="chat.html">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">B</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author"> Buster Wigton </span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="chat.html">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">R</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author"> Rolland Webber </span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="chat.html">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">C</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author"> Claire Mapes </span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="chat.html">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">M</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">Melita Faucher</span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="chat.html">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">J</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">Jeffery Lalor</span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="chat.html">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">L</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">Loren Gatlin</span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="chat.html">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">T</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">Tarah Shropshire</span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="topnav-dropdown-footer">
                <Link href="chat.html">See all messages</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Main Wrapper */}
    </ProtectedPage>
  )
}

export default BlogView;
