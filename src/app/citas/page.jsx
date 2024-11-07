'use client'
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import Link from 'next/link';
import { Table } from 'antd';
import Sidebar from '@/components/Sidebar';
import { onShowSizeChange, itemRender } from '@/components/Pagination'

import { useAuthorization } from '@/../hooks/useAuthorization';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

import { fetchAppointments, changeStatusAppointment, search } from '@/services/AppointmentsServices'

import {
  imagesend, pdficon, pdficon3, pdficon4, plusicon, refreshicon, searchnormal
} from '@/components/imagepath';
import FeatherIcon from 'feather-icons-react/build/FeatherIcon';
import useMediaQuery from '@mui/material/useMediaQuery';
import ProtectedPage from '@/components/ProtectedRoutes';

const citas = [
  {
    id: 1,
    id_cita: 1, 
    nombre_alumno: 'Juan Perez',
    nombre_profesional: 'Miguel González',
    especialidad: 'Psicología',
    telefono_alumno: '987654321',
    mail_alumno: 'miguelgonzalez@udp.cl',
    fecha: '12/07/2024',
    hora: '09:30',
    estado: 'Confirmada'
  }, 
  {
    id: 2,
    id_cita: 2, 
    nombre_alumno: 'Juan Perez',
    nombre_profesional: 'Miguel González',
    especialidad: 'Psicología',
    telefono_alumno: '987654321',
    mail_alumno: 'miguelgonzalez@udp.cl',
    fecha: '19/07/2024',
    hora: '09:30',
    estado: 'Pendiente'
  },
  {
    id: 3,
    id_cita: 3, 
    nombre_alumno: 'Juan Perez',
    nombre_profesional: 'Miguel González',
    especialidad: 'Psicología',
    telefono_alumno: '987654321',
    mail_alumno: 'miguelgonzalez@udp.cl',
    fecha: '26/07/2024',
    hora: '09:30',
    estado: 'Pendiente'
  },
  {
    id: 4,
    id_cita: 4, 
    nombre_alumno: 'Juan Perez',
    nombre_profesional: 'Miguel González',
    especialidad: 'Psicología',
    telefono_alumno: '987654321',
    mail_alumno: 'miguelgonzalez@udp.cl',
    fecha: '02/08/2024',
    hora: '09:30',
    estado: 'Pendiente'
  },
  {
    id: 5,
    id_cita: 5, 
    nombre_alumno: 'Juan Perez',
    nombre_profesional: 'Miguel González',
    especialidad: 'Psicología',
    telefono_alumno: '987654321',
    mail_alumno: 'miguelgonzalez@udp.cl',
    fecha: '09/07/2024',
    hora: '09:30',
    estado: 'Pendiente'
  }
]

const AppoinmentList = () => {
  const ROL = ["alumno"]
  const { data: session } = useSession()
  const router = useRouter();
  // useAuthorization(['alumno'])
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [appointments, setAppointments] = useState([])
  const [results, setResults] = useState([])
  const [idAppointment, setIdAppointment] = useState('')
  const [show, setShow] = useState({ state: false, id: '' })
  const matches = useMediaQuery('(min-width:600px)');

  useEffect(() => {
    // fetchAppointments(setAppointments)
    // fetchAppointments(setResults)
    setResults()
  }, [])

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleCancel = () => {
    console.log('ID', id, idAppointment)
    changeStatusAppointment(id, 'cancelada')
  }

  const handleSearch = (e) => {
    const bleh = search(appointments, e)
    setResults(bleh)
  }

  const handleRefresh = () => {
    setResults(appointments)
  }

  const columns = [
    {
      title: "Estudiante",
      dataIndex: "nombre_alumno",
      sorter: (a, b) => a['nombre_alumno'].length - b['nombre_alumno'].length,
      fixed: 'left',
      render: (text, record) => (
        <>
          <h2 className="profile-image">
            {/* <Link href="#" className="avatar avatar-sm me-2">
              <img
                className="avatar-img rounded-circle"
                src={record.Img}
                alt="User Image"
              />
            </Link> */}
            <Link href="#">{record.nombre_alumno}</Link>
          </h2>
        </>
      ),
      key: 'nombre_alumno',
    },
    {
      title: "Profesional",
      dataIndex: "nombre_profesional",
      sorter: (a, b) => a['nombre_profesional'].length - b['nombre_profesional'].length,
      key: 'nombre_profesional',
      responsive: ['md'],
    },
    {
      title: "Especialidad",
      dataIndex: "especialidad",
      sorter: (a, b) => a.especialidad.length - b.especialidad.length,
      key: 'especialidad',
      responsive: ['md'],
    },
    {
      title: "Teléfono",
      dataIndex: "telefono_alumno",
      sorter: (a, b) => a['telefono_alumno'].length - b['telefono_alumno'].length,
      key: 'telefono_alumno',
      responsive: ['md'],
    },
    {
      title: "Correo electrónico",
      dataIndex: "mail_alumno",
      sorter: (a, b) => a['mail_alumno'].length - b['mail_alumno'].length,
      render: (text, record) => (
        <>
          <Link href="#">{record.mail_alumno}</Link>
        </>
      ),
      key: 'mail_alumno',
      responsive: ['md'],
    }, {
      title: "Día",
      dataIndex: "fecha",
      sorter: (a, b) => a['fecha'].length - b['fecha'].length,
      key: 'fecha',
      responsive: ['md'],
    }, {
      title: "Hora",
      dataIndex: "hora",
      sorter: (a, b) => a['hora'].length - b['hora'].length,
      key: 'hora',
      responsive: ['md'],
    }, {
      title: "Estado",
      dataIndex: "estado",
      sorter: (a, b) => a.estado.length - b.estado.length,
      key: 'estado',
      responsive: ['lg'],
    }, {
      title: "",
      dataIndex: "field",
      fixed: 'right',
      responsive: ['xs'],
      render: (text, record) => (
        <>
          <div className="text-end">
            <div className="dropdown dropdown-action">
              <Link
                href="#"
                className="action-icon dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={() => { setShow({ ...show, state: !show.state, id: record.id_cita }) }}
              >
                <i className="fas fa-ellipsis-v" />
              </Link>
              {console.log('SHOW', show.id, record.id_cita)}
              <div
                style={{ right: '35px', top: 0 }}
                className=
                {show.state === true && show.id === record.id_cita
                  ? "dropdown-menu dropdown-menu-end dropdown-extra show"
                  : "dropdown-menu dropdown-menu-end dropdown-extra"
                }
              >
                <Link className="dropdown-item" href={`/fichas/${record.id_cita}`}>
                  <i className="far fa-edit me-2" />
                  Registrar atención
                </Link>
                <Link className="dropdown-item" href={`/citas/${record.id_cita}`}>
                  <i className="far fa-edit me-2" />
                  Editar
                </Link>
                <Link
                  href="#"
                  className="dropdown-item"
                  data-bs-toggle="modal"
                  data-bs-target="#delete_appointment"
                  onClick={() => setIdAppointment(record.id_cita)}>
                  <i className="fa fa-trash-alt m-r-5"></i>
                  Cancelar cita
                </Link>
              </div>
            </div>
          </div>
        </>
      ),
      key: 'field'
    },
  ]

  return (
    <ProtectedPage level={ROL}>
      {/* <Headerudp /> */}
      <Sidebar id='menu-item4' id1='menu-items4' activeClassName='appoinment-list' />
      <>
        <div className="page-wrapper mt-5 pt-5">
          <div className="content">
            {/* Page Header */}
            <div className="page-header">
              <div className="row">
                <div className="col-sm-12">
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="#">Citas </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="feather-chevron-right">
                        <FeatherIcon icon="chevron-right" />
                      </i>
                    </li>
                    <li className="breadcrumb-item active">Lista de citas </li>
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
                            {matches && <h3>Lista de citas </h3>}
                            <div className="doctor-search-blk">
                              <div className="top-nav-search table-search-blk col-6">
                                <form style={{width: `${matches ? '270px' : '150px' } ` }}>
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
                            </div>
                              <div className="add-group">
                                <Link href="/citas/agendarcita"
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
                    <div className="table-responsive patient-list">
                      <Table
                        pagination={{
                          total: citas.length,
                          showTotal: (total, range) =>
                            `Mostrando ${range[0]} a ${range[1]} de ${total} entradas`,
                          //showSizeChanger: true,
                          onShowSizeChange: onShowSizeChange,
                          itemRender: itemRender,
                        }}
                        columns={columns}
                        dataSource={citas}

                        rowSelection={rowSelection}
                        rowKey={(record) => record.id_cita}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div id="delete_appointment" className="modal fade delete-modal" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body text-center">
                <img src={imagesend.src} alt="#" width={50} height={46} />
                <h3>¿Está seguro que desea cancelar la cita?</h3>
                <div className="m-t-20">
                  {" "}
                  <Link href="#" className="btn btn-white me-2" data-bs-dismiss="modal">
                    Cerrar
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-danger"
                    onClick={() => { handleCancel(idAppointment) }}
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* <div id="delete_patient" className="modal fade delete-modal" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-body text-center">
                  <img src={imagesend} alt="#" width={50} height={46} />
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
          </div> */}
        </div>
      </>
      <>
      </>
    </ProtectedPage>
  )
}

export default AppoinmentList;

