"use client"
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Table } from "antd";
// import Headerudp from '../Headerudp';
import Sidebar from '../../components/Sidebar';
import { onShowSizeChange, itemRender } from '../../components/Pagination'
import { fetchUsers } from '../../services/UsersServices'
import { search } from '../../services/AppointmentsServices'
import {
  blogimg10, imagesend, pdficon, pdficon3, pdficon4, plusicon, refreshicon, searchnormal, blogimg12,
  blogimg2, blogimg4, blogimg6, blogimg8
} from '../../components/imagepath';
import Link from "next/link";

import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import ProtectedPage from '@/components/ProtectedRoutes';

const PatientsList = () => {
  const ROL = ["profesional"]
  const { data: session } = useSession()
  const router = useRouter();
  // useAuthorization(['alumno'])

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [users, setUsers] = useState([])
  const [results, setResults] = useState([])
  const [show, setShow] = useState({ state: false, id: '' })

  useEffect(() => {
    const fetchData = async () => {
      const { users } = await fetchUsers()
      // console.log(users);
      const newArray = [...users.filter(user => user.tipo_usuario === 'alumno')]

      setUsers(newArray)
      setResults(newArray)
    }
    fetchData()
  }, [])

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };


  const handleSearch = (e) => {
    const bleh = search(users, e)
    setResults(bleh)
  }

  const handleRefresh = () => {
    setResults(users)
  }

  const columns = [
    {
      title: "Nombre",
      dataIndex: "nombre",
      sorter: (a, b) => a.nombre.length - b.nombre.length,
      fixed: 'left',
      render: (text, record) => (
        <>
          <h2 className="profile-image">
            {/* <Link href="#" className="avatar avatar-sm me-2">
              <img
                className="avatar-img rounded-circle"
                src={record.img ?? blogimg2 }
                alt="profile image"
              />
            </Link> */}
            <Link href="#">{record.nombre} {record.apellido}</Link>
          </h2>

        </>
      )
    },
    {
      title: "Teléfono",
      dataIndex: "mobile",
      sorter: (a, b) => a.telefono.length - b.telefono.length,
      render: (text, record) => (
        <>

          <Link href="#">{record.telefono}</Link>

        </>
      )
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.length - b.email.length
    },
    {
      title: "Estado",
      dataIndex: "status",
      sorter: (a, b) => a.status.length - b.status.length
    },
    {
      title: "",
      dataIndex: "FIELD8",
      fixed: 'right',
      render: (text, record) => (
        <>
          <div className="text-end">
            <div className="dropdown dropdown-action">
              <Link
                href="#"
                className="action-icon dropdown-toggle"
                // data-bs-toggle="dropdown"
                // aria-expanded="false"
                onClick={() => { setShow({ ...show, state: !show.state, id: record.id }) }}
              >
                <i className="fas fa-ellipsis-v" />
              </Link>
              <div
                className=
                {show.state === true && show.id === record.id
                  ? "dropdown-menu dropdown-menu-end show"
                  : "dropdown-menu dropdown-menu-end "
                }
              >
                <Link className="dropdown-item" href={`/pacientes/${record.id}`}>
                  <i className="far fa-edit me-2" />
                  Editar
                </Link>
                <Link className="dropdown-item" href="#"
                // data-bs-toggle="modal" 
                // data-bs-target="#delete_patient"
                >
                  <i className="fa fa-trash-alt m-r-5"></i>
                  Eliminar
                </Link>
              </div>
            </div>
          </div>
        </>
      ),
    },
  ]

  return (
    <ProtectedPage level={ROL}>
      {/* <Headerudp /> */}
      <Sidebar id='menu-item2' id1='menu-items2' activeClassName='patient-list' />
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link href="#">Pacientes </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right" />
                  </li>
                  <li className="breadcrumb-item active">Lista de pacientes</li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table show-entire">
                <div className="card-body">
                  {/* Table Header */}
                  <div className="page-table-header mb-2">
                    <div className="row align-items-center">
                      <div className="col">
                        <div className="doctor-table-blk">
                          <h3>Lista de Pacientes</h3>
                          <div className="doctor-search-blk">
                            <div className="top-nav-search table-search-blk">
                              <form>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Busca aquí"
                                  onChange={(e) => { handleSearch(e.target.value) }}
                                />
                                <Link href="#" className="btn">
                                  <img
                                    src={searchnormal.src}
                                    alt="#"
                                  />
                                </Link>
                              </form>
                            </div>
                            <div className="add-group">
                              <Link
                                href="/addpatients"
                                className="btn btn-primary add-pluss ms-2"
                              >

                                <img src={plusicon.src} alt="#" />
                              </Link>
                              <Link
                                href="#"
                                onClick={handleRefresh}
                                className="btn btn-primary doctor-refresh ms-2"
                              >
                                <img src={refreshicon.src} alt="#" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <div className="col-auto text-end float-end ms-auto download-grp">
                        <Link href="#" className=" me-2">
                          <img src={pdficon.src} alt="#" />
                        </Link>
                        <Link href="#" className=" me-2">
                        </Link>
                        <Link href="#" className=" me-2">
                          <img src={pdficon3.src} alt="#" />
                        </Link>
                        <Link href="#">
                          <img src={pdficon4.src} alt="#" />
                        </Link>
                      </div> */}
                    </div>
                  </div>
                  {/* /Table Header */}
                  <div className="table-responsive doctor-list">
                    <Table
                      pagination={{
                        total: results.length,
                        showTotal: (total, range) =>
                          `Mostrando ${range[0]} a ${range[1]} de ${total} entradas`,
                        // showSizeChanger: true,
                        onShowSizeChange: onShowSizeChange,
                        itemRender: itemRender,
                      }}
                      columns={columns}
                      dataSource={results}

                      rowSelection={rowSelection}
                      rowKey={(record) => record.id}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div id="delete_patient" className="modal fade delete-modal" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <img src={imagesend.src} alt="#" width={50} height={46} />
              <h3>Are you sure want to delete this ?</h3>
              <div className="m-t-20">
                {" "}
                <Link href="#" className="btn btn-white me-2" data-bs-dismiss="modal">
                  Cerrar
                </Link>
                <button type="submit" className="btn btn-danger">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedPage>

  )
}

export default PatientsList;
