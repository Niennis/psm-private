'use client'
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { Table } from 'antd';

import Sidebar from '@/components/Sidebar';
import SimpleBackdrop from '@/components/Backdrop';
import { onShowSizeChange, itemRender } from '@/components/Pagination'

import withAuth from '@/components/withAuth';
import CacheHandler from "@/utils/cache-handler";
import { fetchAppointments, changeStatusAppointment, search } from '@/services/AppointmentsServices'

import {
  imagesend, plusicon, refreshicon, searchnormal
} from '@/components/imagepath';
import FeatherIcon from 'feather-icons-react/build/FeatherIcon';
import useMediaQuery from '@mui/material/useMediaQuery';
import PasswordAlert from '@/components/PasswordAlert';
const cacheHandler = new CacheHandler();

const AppoinmentList = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [appointments, setAppointments] = useState([])
  const [results, setResults] = useState([])
  const [idAppointment, setIdAppointment] = useState('')
  const [show, setShow] = useState({ state: false, id: '' })
  const matches = useMediaQuery('(min-width:600px)');
  const [isValidated, setIsValidated] = useState(true)
  const [loading, setLoading] = useState(true)

  // const cacheKey = "external-api-data";

  useEffect(() => {

    const loadAppointments = async () => {
      setLoading(true);

      try {
        // let cachedData = await cacheHandler.get(cacheKey);

        // if (cachedData) {
        //   setAppointments(cachedData)
        //   setResults(cachedData);
        //   setLoading(false);
        //   return;
        // }

        const response = await fetchAppointments();
        const data = response.filter(item => (!item["estado"].includes('cancelada') && !item["estado"].includes('realizada')))
console.log(data)
        if (session.user?.rol === 'profesional') {
          const dataFiltered = data.filter(item => item.id_profesional == session.user?.sub);

          setAppointments(dataFiltered);
          setResults(dataFiltered);
          // setIsValidated(false)
        } else if (session.user?.rol === 'alumno') {
          const dataFiltered = data.filter(item => item.id_paciente == session.user?.id);

          setAppointments(dataFiltered);
          setResults(dataFiltered);
        } else if (session.user?.rol === 'administrador') {
          setAppointments(data);
          setResults(data);
        }
      } catch (error) {
        setError('')
      } finally {
        setLoading(false)
      }
    };
    loadAppointments();
    // }
  }, [session, status]);

  if (status === 'loading') {
    return <SimpleBackdrop />;
  }
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleCancel = () => {
    changeStatusAppointment(id, 'cancelada')
  }

  const handleSearch = (e) => {
    const result = search(appointments, e)
    setResults(result)
  }

  const handleRefresh = () => {
    setResults(appointments)
  }

  const allColumns = [
    {
      title: "Estudiante",
      dataIndex: "nombre_alumno",
      sorter: (a, b) => a['nombre_alumno'].localeCompare(b['nombre_alumno']),
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
      sorter: (a, b) => a['nombre_profesional'].localeCompare(b['nombre_profesional']),
      key: 'nombre_profesional',
      responsive: ['md'],
    },
    {
      title: "Especialidad",
      dataIndex: "especialidad_profesional",
      sorter: (a, b) => a.especialidad_profesional.localeCompare(b.especialidad_profesional),
      key: 'especialidad_profesional',
      responsive: ['md'],
    },
    // {
    //   title: "Teléfono",
    //   dataIndex: "telefono_estudiante",
    //   sorter: (a, b) => a['telefono_estudiante'].localeCompare(b['telefono_estudiante']),
    //   key: 'telefono_estudiante',
    //   responsive: ['md'],
    // },
    {
      title: "Correo electrónico",
      dataIndex: "email_estudiante",
      sorter: (a, b) => a['email_estudiante'].localeCompare(b['email_estudiante']),
      render: (text, record) => (
        <>
          <Link href="#">{record.email_estudiante}</Link>
        </>
      ),
      key: 'email_estudiante',
      responsive: ['md'],
    }, {
      title: "Día",
      dataIndex: "fecha",
      sorter: (a, b) => a['fecha'].localeCompare(b['fecha']),
      key: 'fecha',
      responsive: ['md'],
    }, {
      title: "Hora",
      dataIndex: "hora",
      sorter: (a, b) => a['hora'].localeCompare(b['hora']),
      key: 'hora',
      responsive: ['md'],
    }, {
      title: "Estado",
      dataIndex: "estado",
      sorter: (a, b) => a.estado.localeCompare(b.estado),
      key: 'estado',
      responsive: ['lg'],
    }, {
      title: "",
      dataIndex: "field",
      fixed: 'right',
      // responsive: ['xs'],
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
              <div
                style={{ right: '35px', top: 0 }}
                className=
                {show.state === true && show.id === record.id_cita
                  ? "dropdown-menu dropdown-menu-end dropdown-extra show"
                  : "dropdown-menu dropdown-menu-end dropdown-extra"
                }
              >
                {session.user?.rol === ('profesional' || 'administrador') ?
                  (<>
                    <Link className="dropdown-item" href={`/fichas/${record.id_cita}`}>
                      <i className="far fa-edit me-2" />
                      Registrar atención
                    </Link>
                    {/* <Link className="dropdown-item" href={`/citas/${record.id_cita}`}>
                   <i className="far fa-edit me-2" />
                   Editar
                 </Link> */}
                    <Link
                      href={`/citas/${record.id_cita}`}
                      className="dropdown-item"
                      data-bs-toggle="modal"
                      data-bs-target="#delete_appointment"
                      onClick={() => setIdAppointment(record.id_cita)}>
                      <i className="fa fa-trash-alt m-r-5"></i>
                      Cancelar cita
                    </Link>
                  </>
                  ) :
                  (
                    <Link
                      href={`/citas/${record.id_cita}`}
                      className="dropdown-item"
                      data-bs-toggle="modal"
                      data-bs-target="#delete_appointment"
                      onClick={() => setIdAppointment(record.id_cita)}>
                      <i className="fa fa-trash-alt m-r-5"></i>
                      Cancelar cita
                    </Link>
                  )
                }
              </div>
            </div>
          </div>
        </>
      ),
      key: 'field'
    },
  ]

  const columns = allColumns.filter((col) => {
    if (session.user?.rol === "profesional" && col.key !== "nombre_profesional") return true;
    if (session.user?.rol === "alumno" && col.key !== "nombre_alumno") return true;
    if (session.user?.rol === "administrador" ) return true;
    return false;
  });

  return (
    <div>
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
                                <form style={{ width: `${matches ? '270px' : '150px'} ` }}>
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
                          total: results.length,
                          showTotal: (total, range) =>
                            `Mostrando ${range[0]} a ${range[1]} de ${total} entradas`,
                          //showSizeChanger: true,
                          onShowSizeChange: onShowSizeChange,
                          itemRender: itemRender,
                        }}
                        columns={columns}
                        dataSource={results}

                        rowSelection={rowSelection}
                        rowKey={(record) => `${record.id_cita}`}
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
                  <Link href="#" className="btn btn-white me-2" /* data-bs-dismiss="modal" */>
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
        </div>
        {isValidated ? <div id="delete_patient" className="modal fade delete-modal" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body text-center">
                <img src={imagesend.src} alt="#" width={50} height={46} />
                <h3>Antes de continuar, cambia tu contraseña</h3>
                <div className="m-t-20">
                  {" "}
                  <Link href={`/profesionales/${session.user?.id}`} className="btn btn-white me-2" data-bs-dismiss="modal">
                    Ir a editar contraseña
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div> : ''}
      </>
      <PasswordAlert />
    </div>
  )
}

// export default AppoinmentList;
export default withAuth(AppoinmentList, ['alumno', 'profesional', 'administrador']);

