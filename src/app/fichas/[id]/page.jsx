'use client'
import React, { useState, useEffect } from "react";

import { activity01, activity02, activity03, blog08, user02, user03, user04, user05, user06 } from "@/components/imagepath";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";

import Link from 'next/link';

import { useSidebar } from "@/context/SidebarContext";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import withAuth from '@/components/withAuth';

const FichaAlumno = ({ params }) => {
  const { data: session } = useSession()
  const { setProps } = useSidebar();


  useEffect(() => {
    setProps({
      id: "menu-item4",
      id1: "menu-items4",
      activeClassName: "activity",
    });
  }, [setProps]);


  return (
    <>
      <div className="sidebar-overlay" data-reff="" style={{ zIndex: 98 }} />
      <div className="main-wrapper mt-5 pt-5">
        <div className="page-wrapper">
          <div className="content">
            {/* Page Header */}
            <div className="page-header">
              <div className="row">
                <div className="col-sm-12">
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="#">Fichas </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="feather-chevron-right">
                        <FeatherIcon icon="chevron-right" />
                      </i>
                    </li>
                    <li className="breadcrumb-item active">Ficha Estudiante</li>
                  </ul>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <div className="activity">
                      <div className="activity-box">
                        <ul className="activity-list">
                          <li>
                            <div className="activity-user">
                              <img
                                data-bs-toggle="tooltip"
                                className="avatar"
                              >

                              </img>
                            </div>
                            <div className="activity-content timeline-group-blk">
                              <div className="timeline-group flex-shrink-0">
                                <h4>20 Oct 2022</h4>
                                <span className="time">5.50 PM</span>
                              </div>
                              <div className="comman-activitys flex-grow-1">
                                <h3>
                                  Dr.Henry Markhay{" "}
                                  <span>
                                    {" "}
                                    Completed the Patient visit at Glory
                                    Hospital in Florida, USA .
                                  </span>
                                </h3>
                                <p>
                                  Lorem ipsum dolor sit amet, consectetur
                                  adipiscing elit, sed do eiusmod
                                </p>
                              </div>
                            </div>
                          </li>

                          <li>
                            <div className="activity-user">
                              <img
                                data-bs-toggle="tooltip"
                                className="avatar"
                              >

                              </img>
                            </div>
                            <div className="activity-content timeline-group-blk">
                              <div className="timeline-group flex-shrink-0">
                                <h4>Today</h4>
                                <span className="time">4.50 PM</span>
                              </div>
                              <div className="comman-activitys flex-grow-1">
                                <h3>
                                  Bernardo James{" "}
                                  <span>
                                    {" "}
                                    Uploaded 3 new photos for World Safety Event
                                  </span>
                                </h3>
                                <p>
                                  Lorem ipsum dolor sit amet, consectetur
                                  adipiscing elit, sed do eiusmod
                                </p>
                                <ul className="nav activity-sub-list mt-2">
                                  <li>
                                    <img
                                      className="img-fluid"
                                      src={activity01}
                                      alt="#"
                                    />
                                  </li>
                                  <li>
                                    <img
                                      className="img-fluid"
                                      src={activity02}
                                      alt="#"
                                    />
                                  </li>
                                  <li>
                                    <img
                                      className="img-fluid"
                                      src={activity03}
                                      alt="#"
                                    />
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </li>

                          <li>
                            <div className="activity-user">
                              <img
                                data-bs-toggle="tooltip"
                                className="avatar"
                              >

                              </img>
                            </div>
                            <div className="activity-content timeline-group-blk">
                              <div className="timeline-group flex-shrink-0">
                                <h4>20 Oct 2022</h4>
                                <span className="time">2.20 PM</span>
                              </div>
                              <div className="comman-activitys flex-grow-1">
                                <h3>
                                  Rio Williams{" "}
                                  <span>
                                    {" "}
                                    Posted a Blog about Corona Safety
                                    Measurements
                                  </span>
                                </h3>
                                <p>
                                  Lorem ipsum dolor sit amet, consectetur
                                  adipiscing elit, sed do eiusmod
                                </p>
                                <ul className="latest-posts latest-posts-act mt-2">
                                  <li>
                                    <div className="post-thumb">
                                      <Link href="#">
                                        <img
                                          className="img-fluid"
                                          src={blog08}
                                          alt="#"
                                        />
                                      </Link>
                                    </div>
                                    <div className="post-info">
                                      <div className="date-posts">
                                        <h5>Safety</h5>
                                        <span className="ms-2">
                                          10 Oct 2022
                                        </span>
                                      </div>
                                      <h4>
                                        <Link href="#">
                                          Keep Hand Sanitizers Away from Young
                                          Children
                                        </Link>
                                      </h4>
                                      <p>
                                        {" "}
                                        Read more in 8 Minutes
                                        <i className="fa fa-long-arrow-right ms-2" />
                                      </p>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </li>

                        </ul>
                      </div>
                    </div>
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
                    <Link href="#">
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
                    <Link href="#">
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
                    <Link href="#">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">T</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">
                            {" "}
                            Tarah Shropshire{" "}
                          </span>
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
                    <Link href="#">
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
                    <Link href="#">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">C</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">
                            {" "}
                            Catherine Manseau{" "}
                          </span>
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
                    <Link href="#">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">D</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">
                            {" "}
                            Domenic Houston{" "}
                          </span>
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
                    <Link href="#">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">B</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">
                            {" "}
                            Buster Wigton{" "}
                          </span>
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
                    <Link href="#">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">R</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">
                            {" "}
                            Rolland Webber{" "}
                          </span>
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
                    <Link href="#">
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
                    <Link href="#">
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
                    <Link href="#">
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
                    <Link href="#">
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
                    <Link href="#">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">T</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">
                            Tarah Shropshire
                          </span>
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
                <Link href="#">See all messages</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(FichaAlumno, ['administrador', 'profesional']);
