"use client"
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Form, Switch, Table } from 'antd';
// import Headerudp from '../Headerudp';
import Sidebar from '../../components/Sidebar';
import { onShowSizeChange, itemRender } from '../../components/Pagination'
import { fetchUsers } from '../../services/UsersServices'
import { search } from '../../services/AppointmentsServices'
import { fetchAppointments } from '../../services/AppointmentsServices';
import {
  imagesend, plusicon, refreshicon, searchnormal,
} from '../../components/imagepath';
import Link from "next/link";

import { useSidebar } from "@/context/SidebarContext";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import withAuth from '@/components/withAuth';
import CacheHandler from "@/utils/cache-handler";

const cacheHandler = new CacheHandler();

const PatientsList = () => {
  const ROL = ["profesional"]
  const { data: session } = useSession()
  const router = useRouter();
  const { setProps } = useSidebar();

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [users, setUsers] = useState([])
  const [results, setResults] = useState([])
  const [show, setShow] = useState({ state: false, id: '' })
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setProps({
      id: "menu-item2",
      id1: "menu-items2",
      activeClassName: "patient-list",
    });
  }, [setProps]);

  const uniqueByEmail = (array) => {
    const seenEmails = new Set();
    return array.filter((item) => {
      if (!seenEmails.has(item.email_estudiante)) {
        seenEmails.add(item.email_estudiante); // Agregar el email al conjunto
        return true; // Incluir el objeto en el resultado
      }
      return false; // Ignorar objetos con email repetido
    });
  };

  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      const { users } = await fetchUsers()
      const response = await fetchAppointments();

      const alumnos = [...users.filter(user => user.tipo_usuario === 'alumno')]
      const citasActivas = response.filter(item => (!item["estado"].includes('cancelada') && !item["estado"].includes('realizada')))
      const citasConStatus = citasActivas.map(item => {
        const alumno = alumnos.find(alumno => alumno.id === item.id_paciente); // Buscar el alumno por ID
        return {
          ...item,                      // Copiar los datos de la cita
          status: alumno?.status || null // Agregar `status`, manejar casos donde no exista alumno
        };
      });
      if (session.user?.rol === 'profesional') {
        const dataFiltered = citasConStatus.filter(item => item.id_profesional == parseInt(session.user?.id));
        const resp = uniqueByEmail(dataFiltered)
        setUsers(resp);
        setResults(resp);
        // setIsValidated(false)
      } else if (session.user?.rol === 'administrador') {
        const resp = uniqueByEmail(citasConStatus)

        setUsers(resp);
        setResults(resp);
      }

      // setUsers(usuariosFiltrados)
      // setResults(usuariosFiltrados)
      setLoading(false)
    }
    fetchData()
  }, [])

  const handleLoadingChange = (enable) => {
    setLoading(enable);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };


  const handleSearch = (e) => {
    const user = search(users, e)
    setResults(user)
  }

  const handleRefresh = () => {
    setResults(users)
  }

  const columns = [
    {
      title: "Nombre",
      dataIndex: "nombre",
      sorter: (a, b) => a.nombre_alumno,
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
            <Link href="#">{record.nombre_alumno}</Link>
          </h2>

        </>
      )
    },
    {
      title: "Teléfono",
      dataIndex: "mobile",
      sorter: (a, b) => a.telefono_estudiante.length - b.telefono_estudiante.length,
      render: (text, record) => (
        <>

          <Link href="#">{record.telefono_estudiante}</Link>

        </>
      )
    },
    {
      title: "Email",
      dataIndex: "email_estudiante",
      sorter: (a, b) => a.email_estudiante.length - b.email_estudiante.length
    },
    {
      title: "Estado",
      dataIndex: "status",
      sorter: (a, b) => a.status.length - b.status.length,
      render: (text, record) => (
        <div>
          {record.status === "activo" && (
            <span className="custom-badge status-green">
              {record.status}
            </span>
          )}
          {record.status === "inactivo" && (
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
                // data-bs-toggle="dropdown"
                // aria-expanded="false"
                onClick={() => { setShow({ ...show, state: !show.state, id: record.id_paciente }) }}
              >
                <i className="fas fa-ellipsis-v" />
              </Link>
              <div
                style={{ right: '35px', top: 0 }}
                className=
                {show.state === true && show.id === record.id_paciente
                  ? "dropdown-menu dropdown-menu-end dropdown-extra show"
                  : "dropdown-menu dropdown-menu-end dropdown-extra"
                }
              >
                <Link className="dropdown-item" href={`/pacientes/${record.id_paciente}`}
                // data-bs-toggle="modal" 
                // data-bs-target="#delete_patient"
                >
                  <i className="far fa-edit me-2" />
                  Editar
                </Link>
                <Link className="dropdown-item" href={`/fichas/${record.id_paciente}`}
                // data-bs-toggle="modal" 
                // data-bs-target="#delete_patient"
                >
                  <i className="fas fa-folder-open me-2" />
                  Ver ficha
                </Link>
              </div>
            </div>
          </div>
        </>
      ),
    },
  ]

  const tableProps = {
    loading,
  };
  return (
    < >
      <div className="sidebar-overlay" data-reff="" style={{ zIndex: 98 }} />
      <Form
        layout="inline"
        className="table-demo-control-bar"
        style={{
          marginBottom: 16,
        }}
      >
        <Form.Item label="loading">
          <Switch checked={loading} onChange={handleLoadingChange} />
        </Form.Item>
      </Form>
      {/* <Headerudp /> */}
      {/* <Sidebar id='menu-item2' id1='menu-items2' activeClassName='patient-list' /> */}
      <div className="page-wrapper mt-5 pt-5">
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
                              {/* <Link
                                href="/addpatients"
                                className="btn btn-primary add-pluss ms-2"
                              >

                                <img src={plusicon.src} alt="#" />
                              </Link> */}
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
                      {...tableProps}
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
                      rowKey={(record) => record.id_paciente}
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
    </>

  )
}

// export default PatientsList;
export default withAuth(PatientsList, ['administrador', 'profesional']);

