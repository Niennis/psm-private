"use client"
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Table } from "antd";
import { onShowSizeChange, itemRender } from '@/components/Pagination'
import Sidebar from '@/components/Sidebar';

import {
  imagesend, pdficon, pdficon3, pdficon4, plusicon, refreshicon, searchnormal
} from '@/components/imagepath';
import FeatherIcon from 'feather-icons-react/build/FeatherIcon';

import { fetchDoctors, fetchDoctor, addDoctor, updateDoctor, fetchSpeciality } from '@/services/DoctorsServices';
import { search } from '@/services/AppointmentsServices'
import ProtectedPage from '@/components/ProtectedRoutes';

const DoctorList = () => {
  const ROL = ["admin", "profesional"]
  const { data: session } = useSession()
  const router = useRouter();
  // useAuthorization(['alumno'])

  const [doctors, setDoctors] = useState([])
  const [results, setResults] = useState([])
  const [show, setShow] = useState({ state: false, id: '' })

  useEffect(() => {
    const fetchData = async () => {
      // const { users } = await fetchDoctors()

      // const usersAndSPeciality = users.map(async user => {
      //   const result = await fetchSpeciality(user.id)
      //   const newUser = {
      //     ...user,
      //     especialidad: result.especialidad.length === 0 ? 'Psicologia' : result.especialidad[0].especialidad
      //   }
      //   return newUser
      // })
      // const newUsers = await Promise.all(usersAndSPeciality)

      const newUsers = [
        {
          id: 10,
          nombre: 'Miguel',
          apellido: 'González',
          especialidad: 'Psicología',
          telefono: '912345678',
          email: 'miguelgonzalez@udp.cl',
          status: 'Activo'
        },
        {
          id: 11,
          nombre: 'María',
          apellido: 'Flores',
          especialidad: 'Psicología',
          telefono: '912345678',
          email: 'mariaflores@udp.cl',
          status: 'Activo'
        },
        {
          id: 12,
          nombre: 'Felipe',
          apellido: 'Perez',
          especialidad: 'Psicología',
          telefono: '912345678',
          email: 'felipeperez@udp.cl',
          status: 'Activo'
        },
      ]
      setDoctors(newUsers)
      setResults(newUsers)
    }
    fetchData()
  }, [])

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys) => {
    // console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const onChange = (date, dateString) => {
    // console.log(date, dateString);
  };

  const handleSearch = (e) => {
    const bleh = search(doctors, e)
    setResults(bleh)
  }

  const handleRefresh = () => {
    setResults(doctors)
  }

  const psicologos = [
    {
      id: 10,
      nombre: 'Miguel',
      apellido: 'González',
      especialidad: 'Psicología',
      telefono: '912345678',
      email: 'miguelgonzalez@udp.cl',
      status: 'Activo'
    },
    {
      id: 11,
      nombre: 'María',
      apellido: 'Flores',
      especialidad: 'Psicología',
      telefono: '912345678',
      email: 'mariaflores@udp.cl',
      status: 'Activo'
    },
    {
      id: 12,
      nombre: 'Felipe',
      apellido: 'Perez',
      especialidad: 'Psicología',
      telefono: '912345678',
      email: 'felipeperez@udp.cl',
      status: 'Activo'
    },
  ]

  const columns = [
    {
      title: "Nombre",
      dataIndex: "nameDoctor",
      fixed: 'left',
      render: (text, record) => (
        <>
          <h2 className="profile-image">
            {record.img && <Link href={`/profesionales/${record.id}`} className="avatar avatar-sm me-2">
              <img
                className="avatar-img rounded-circle"
                src={record.src}
                alt="User Image"
              />
            </Link>}
            <Link href={`/profesionales/${record.id}`}>{record.nombre + ' ' + record.apellido}</Link>
          </h2>

        </>
      ),
      sorter: (a, b) => a.nombre.length - b.nombre.length
    },
    {
      title: "Especialidad",
      dataIndex: "especialidad",
      sorter: (a, b) => a.especialidad.length - b.especialidad.length
    },
    // {
    //   title: "Specialization",
    //   dataIndex: "Specialization",
    //   sorter: (a, b) => a.Specialization.length - b.Specialization.length
    // },
    // {
    //   title: "Degree",
    //   dataIndex: "Degree",
    //   sorter: (a, b) => a.Degree.length - b.Degree.length
    // },
    {
      title: "Teléfono",
      dataIndex: "telefono",
      sorter: (a, b) => a.telefono.length - b.telefono.length,
      render: (text, record) => (
        <>
          <Link href="#">{record.telefono}</Link>
        </>
      )
    }, {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.length - b.email.length
    },
    {
      title: "Estado",
      dataIndex: "status",
      sorter: (a, b) => a.status.length - b.status.length,
      render: (text, record) => (
        <div>
          {record.status === "Activo" && (
            <span className="custom-badge status-green">
              {record.status}
            </span>
          )}
          {record.status === "Inactivo" && (
            <span className="custom-badge status-pink">
              {record.status}
            </span>
          )}
        </div>
      )
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
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={() => { setShow({ ...show, state: !show.state, id: record.id }) }}
              >
                <i className="fas fa-ellipsis-v" />
              </Link>
              <div
                style={{ right: '35px', top: 0}}
                className=
                {show.state === true && show.id === record.id
                  ? "dropdown-menu dropdown-menu-end dropdown-extra show"
                  : "dropdown-menu dropdown-menu-end dropdown-extra"
                }
              >
                <Link className="dropdown-item" href={`/horarios/agregarhorario/${record.id}`}>
                  <i className="far fa-edit me-2" />
                  Agregar horario
                </Link>
                <Link className="dropdown-item" href={`/profesionales/editar/${record.id}`}>
                  <i className="far fa-edit me-2" />
                  Editar
                </Link>
                <Link
                  href="#"
                  className="dropdown-item"
                  data-bs-toggle="modal"
                  data-bs-target="#delete_patient">
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
    <ProtectedPage level={'profesional'}>
      {/* <Headerudp /> */}
      <Sidebar id='menu-item1' id1='menu-items1' activeClassName='doctor-list' />
      <>
        <div className="page-wrapper mt-5 pt-5">
          <div className="content">
            {/* Page Header */}
            <div className="page-header">
              <div className="row">
                <div className="col-sm-12">
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="#">Profesionales </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="feather-chevron-right">
                        <FeatherIcon icon="chevron-right" />
                      </i>
                    </li>
                    <li className="breadcrumb-item active">Lista Profesionales</li>
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
                            <h3>Lista Profesionales</h3>
                            <div className="doctor-search-blk">
                              <div className="top-nav-search table-search-blk">
                                <form>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Busca aquí"
                                    onChange={(e) => { handleSearch(e.target.value) }}
                                  />
                                  <Link className="btn" href="#">
                                    <img
                                      src={searchnormal.src}
                                      alt="#"
                                    />
                                  </Link>
                                </form>
                              </div>
                              <div className="add-group">
                                <Link
                                  href="/profesionales/agregarprofesional"
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
                        dataSource={psicologos}

                        rowSelection={rowSelection}
                        rowKey={(record) => record.id}
                        style={{
                          backgroundColor: '#f2f2f2', // Replace with your desired background color for the table
                        }}
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
                    Close
                  </Link>
                  <button type="submit" className="btn btn-danger">
                    Delete
                  </button>
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
                      Close
                    </Link>
                    <button type="submit" className="btn btn-danger">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>


      <>

      </>

    </ProtectedPage>

  )
}

export default DoctorList;
