"use client"
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Form, Switch, Table } from 'antd';

import { onShowSizeChange, itemRender } from '@/components/Pagination'
import ProtectedPage from '@/components/ProtectedRoutes';
import Sidebar from '@/components/Sidebar';
import { fetchProfessionals, professionalsWithSpeciality, fetchSpecialities } from '@/services/DoctorsServices';
import { search } from '@/services/AppointmentsServices'
import { useSidebar } from "@/context/SidebarContext";

import { imagesend, plusicon, refreshicon, searchnormal } from '@/components/imagepath';
import FeatherIcon from 'feather-icons-react/build/FeatherIcon';
import withAuth from '@/components/withAuth';
import CacheHandler from "@/utils/cache-handler";
import SimpleBackdrop from '@/components/Backdrop';
import { setServerData } from '../actions';

const cacheHandler = new CacheHandler();

const DoctorList = () => {
  const ROL = ["administrador", "profesional"]
  const { data: session } = useSession()
  const router = useRouter();
  // useAuthorization(['alumno'])

  const [doctors, setDoctors] = useState([])
  const [results, setResults] = useState([])
  const [show, setShow] = useState({ state: false, id: '' })
  const [isLoading, setIsLoading] = useState(true)
  const [loading, setLoading] = useState(false);
  const { setProps } = useSidebar();

  useEffect(() => {
    setProps({
      id: "menu-item1",
      id1: "menu-items1",
      activeClassName: "doctor-list",
    });
  }, [setProps]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await fetchProfessionals();
        const specialities = await fetchSpecialities()
        const professionals = await professionalsWithSpeciality(specialities, users);
        setDoctors(professionals)
        setResults(professionals)
        setIsLoading(false);
      } catch (error) {
        console.log('Error: ', error)
        setIsLoading(false);
      } finally {
        // Cambia isLoading a false cuando termina la carga
        setIsLoading(false);
      }
    }
    fetchData()
  }, [])

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const onChange = (date, dateString) => {
  };

  const handleSearch = (e) => {
    const result = search(doctors, e)
    setResults(result)
  }

  const handleRefresh = () => {
    setResults(doctors)
  }

  /* Encabezados de la tabla */
  const columns = [
    {
      title: "Nombre",
      dataIndex: "nombre",
      fixed: 'left',
      render: (text, record) => (
        <>
          <h2 className="profile-image">
            {record.img && <Link href={`/profesionales/editar/${record.id}`} className="avatar avatar-sm me-2">
              <img
                className="avatar-img rounded-circle"
                src={record.src}
                alt="User Image"
              />
            </Link>}
            <Link href={`/profesionales/editar/${record.id}`}>{record.nombre + ' ' + record.apellido}</Link>
          </h2>
        </>
      ),
      sorter: (a, b) => a.nombre.localeCompare(b.nombre),
    },
    {
      title: "Especialidad",
      dataIndex: "especialidad",
      sorter: (a, b) => a.nombre.localeCompare(b.nombre),
    },
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
      sorter: (a, b) => a.nombre.localeCompare(b.nombre),
    },
    {
      title: "Estado",
      dataIndex: "status",
      sorter: (a, b) => a.nombre.localeCompare(b.nombre),
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
              <button
                style={{ border: 'none' }}
                className="action-icon dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={() => { setShow({ ...show, state: !show.state, id: record.id }) }}
              >
                <i className="fas fa-ellipsis-v" />
              </button>
              <div
                style={{ right: '35px', top: 0 }}
                className=
                {show.state === true && show.id === record.id
                  ? "dropdown-menu dropdown-menu-end dropdown-extra show"
                  : "dropdown-menu dropdown-menu-end dropdown-extra"
                }
              >
                <form action={async () => {
                  await setServerData(record.id);
                  // Redirección después de la acción
                  router.push('/horarios/agregarhorario');
                }}>
                  <button
                    type="submit"
                    className="dropdown-item"
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <i className="far fa-edit me-2" />
                    Agregar horario
                  </button>
                </form>
                <Link className="dropdown-item" href={`/profesionales/editar/${record.id}`}>
                  <i className="far fa-edit me-2" />
                  Editar
                </Link>
                {/* <Link
                  href="#"
                  className="dropdown-item"
                  data-bs-toggle="modal"
                  data-bs-target="#delete_patient">
                  <i className="fa fa-trash-alt m-r-5"></i>
                  Eliminar
                </Link> */}
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
      {/* <Sidebar id='menu-item1' id1='menu-items1' activeClassName='doctor-list' /> */}
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
                    </div>
                  </div>
                  {/* /Table Header */}
                  <div className="table-responsive doctor-list">
                    {isLoading ? (
                      <SimpleBackdrop />
                    ) : (
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
                        rowKey={(record) => record.id}
                        style={{
                          backgroundColor: '#f2f2f2',
                        }}
                      />)
                    }
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
                  Cancelar
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
  )
}

// export default DoctorList;
export default withAuth(DoctorList, ['administrador', 'profesional']);
