"use client"
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Form, Switch, Table } from 'antd';
// import Headerudp from '../Headerudp';
import Sidebar from '../../components/Sidebar';
import { onShowSizeChange, itemRender } from '../../components/Pagination'
import { fetchUsers } from '../../services/UsersServices'
import { changeStatusAppointment, fetchAppointment, search } from '../../services/AppointmentsServices'
import { fetchAppointments } from '../../services/AppointmentsServices';
import {
  imagesend, plusicon, refreshicon, searchnormal,
} from '../../components/imagepath';
import Link from "next/link";
import { Alert } from '@mui/material';

import { useSidebar } from "@/context/SidebarContext";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import withAuth from '@/components/withAuth';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Button } from 'react-bootstrap'

const filtrarFechasAnteriores = (arrayDeObjetos, claveFecha) => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0); // Normaliza la fecha (elimina horas, minutos, segundos y milisegundos)

  return arrayDeObjetos.map(async (item) => {
    const bodyUpdate = {
      id: item.id_cita,
      id_paciente: item.id_paciente,
      id_profesional: item.id_profesional,
      carrera: item.carrera || '',
      email: item.email_estudiante || '',
      appointment_date: item.fecha || '',
      start_time: item.hora || '',
      campus: item.campus || '',
      nombre_estudiante: item.nombre_alumno,
      selected_doctor: item.nombre_profesional || '',
      quien_cancela: 'perdida',
      status: item.estado,
      tipo_cita: item.tipo_cita || '',
    }

    const fechaItem = new Date(item[claveFecha]);
    fechaItem.setHours(0, 0, 0, 0);

    if (fechaItem < hoy && item["estado"].includes('pendiente')) {
      const res = await changeStatusAppointment(bodyUpdate)
      return { ...item, estado: 'perdida' }
    } else {
      return item
    }
  });
}

const PatientsList = () => {
  const ROL = ["profesional"]
  const { data: session } = useSession()
  const router = useRouter();
  const { setProps } = useSidebar();

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [users, setUsers] = useState([])
  const [results, setResults] = useState([])
  const [patientResults, setPatientResults] = useState([])
  const [show, setShow] = useState({ state: false, id: '' })
  const [loading, setLoading] = useState(false);
  const [hash, setHash] = useState('');
  const [nombreEstudiante, setNombreEstudiante] = useState('')
  const [appointments, setAppointments] = useState([])
  const [idAppointment, setIdAppointment] = useState('')
  const [success, setSuccess] = useState('initial')
  const [message, setMessage] = useState('')
  const [idCita, setIdCita] = useState('')
  const mobile = useMediaQuery('(min-width:600px)');

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

  const fetchData = async () => {
    const { users } = await fetchUsers()
    const response = await fetchAppointments();

    const alumnos = [...users.filter(user => user.tipo_usuario === 'alumno')]
    const citasActivas = response.filter(item => (!item["estado"].includes('cancelada') /* && !item["estado"].includes('realizada') */))
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
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    fetchData()
  }, [])


  const loadAppointments = async (record) => {
    setLoading(true);
    setHash('citas')

    try {
      const response = await fetchAppointments();
      const dataChangeStatus = response.filter(item => (!item["estado"].includes('realizada')) && item.id_paciente === record.id_paciente)

      const promises = filtrarFechasAnteriores(dataChangeStatus, "fecha")
      const data = await Promise.all(promises)

      if (session.user?.rol === 'profesional') {
        const dataFiltered = data.filter(item => item.id_profesional == session.user?.id);
        setAppointments(dataFiltered);
        setPatientResults(dataFiltered);
      } else if (session.user?.rol === 'alumno') {
        const dataFiltered = data.filter(item => item.id_paciente == session.user?.id);
        setAppointments(dataFiltered);
        setPatientResults(dataFiltered);
      } else if (session.user?.rol === 'administrador') {
        setAppointments(data);
        setPatientResults(data);
      }
    } catch (error) {
      setError('')
    } finally {
      setLoading(false)
    }
  };

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


  const handleName = name => {
    setHash('citas')
    setNombreEstudiante(name)
  }


  const handleNavigate = (fecha, hora) => {
    localStorage.setItem('fechaCita', JSON.stringify({ fecha, hora }));
  };


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
            <a onClick={() => loadAppointments(record)}>{record.nombre_alumno}</a>
            {/* <Link href={`/fichas/${record.id_paciente}`}>{record.nombre_alumno}</Link> */}
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
              <button
                style={{ border: 'none' }}
                className="action-icon dropdown-toggle"
                // data-bs-toggle="dropdown"
                // aria-expanded="false"
                onClick={() => { setShow({ ...show, state: !show.state, id: record.id_paciente }) }}
              >
                <i className="fas fa-ellipsis-v" />
              </button>
              <div
                style={{ right: '35px', top: 0 }}
                className=
                {show.state === true && show.id === record.id_paciente
                  ? "dropdown-menu dropdown-menu-end dropdown-extra show"
                  : "dropdown-menu dropdown-menu-end dropdown-extra"
                }
                onMouseLeave={() => {
                  if (show.state === true && show.id === record.id_paciente) {
                    setShow({ state: false, id: null })
                  }
                }}
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
                <Link className="dropdown-item" href={`#`} onClick={() => loadAppointments(record)}
                // data-bs-toggle="modal" 
                // data-bs-target="#delete_patient"
                >
                  <i className="fa-regular fa-calendar-check me-2" />
                  Ver citas
                </Link>
              </div>
            </div>
          </div>
        </>
      ),
    },
  ]

  const patientColumns = [
    // {
    //   title: "Estudiante",
    //   dataIndex: "nombre_alumno",
    //   sorter: (a, b) => a['nombre_alumno'].localeCompare(b['nombre_alumno']),
    //   fixed: 'left',
    //   render: (text, record) => (
    //     <>
    //       <h2 className="profile-image">
    //         <Link href={`/fichas/${record.id_paciente}`}>{record.nombre_alumno}</Link>
    //       </h2>
    //     </>
    //   ),
    //   key: 'nombre_alumno',
    // },
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
      render: (text, record) => (
        <div>
          {record.estado === "pendiente" && (
            <span className="custom-badge status-green">
              {record.estado}
            </span>
          )}
          {record.estado === "realizada" && (
            <span className="custom-badge status-blue">
              {record.estado}
            </span>
          )}
          {record.estado.includes("cancelada") && (
            <span className="custom-badge status-pink">
              {record.estado}
            </span>
          )}
          {record.estado.includes("perdida") && (
            <span className="custom-badge status-pink">
              {record.estado}
            </span>
          )}
        </div>
      )
    }, {
      title: "",
      dataIndex: "field",
      fixed: 'right',
      // responsive: ['xs'],
      render: (text, record) => (
        <>
          <div className="text-end">
            <div className="dropdown dropdown-action">
              <button
                style={{ border: 'none' }}
                className="action-icon dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={() => { setShow({ ...show, state: !show.state, id: record.id_cita }) }}
              >
                <i className="fas fa-ellipsis-v" />
              </button>
              <div
                style={{ right: '35px', top: 0 }}
                className=
                {show.state === true && show.id === record.id_cita
                  ? "dropdown-menu dropdown-menu-end dropdown-extra show"
                  : "dropdown-menu dropdown-menu-end dropdown-extra"
                }
                onMouseLeave={() => {
                  if (show.state === true && show.id === record.id_cita) {
                    setShow({ state: false, id: null })
                  }
                }}
              >
                {session.user?.rol === ('profesional' || 'administrador') ?
                  (<>
                    <Link
                      className="dropdown-item"
                      href={`/fichas/agregarficha/${record.id_cita}`}
                      onClick={() => {
                        const estado = record.estado
                        if (estado.includes('Cancelada') || estado.includes('cancelada')) {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                        handleNavigate(record.fecha, record.hora)
                      }}
                      style={{
                        cursor: record.estado.includes('Cancelada') || record.estado.includes('cancelada') ? "not-allowed" : "pointer",
                        opacity: record.estado.includes('Cancelada') || record.estado.includes('cancelada') ? 0.5 : 1,
                      }}
                    >
                      <i className="far fa-edit me-2" />
                      Registrar atención
                    </Link>
                    {/* <Link className="dropdown-item" href={`/citas/${record.id_cita}`}>
                      <i className="far fa-edit me-2" />
                      Editar
                    </Link> */}
                    <span
                      className="dropdown-item"
                      data-bs-toggle="modal"
                      data-bs-target="#delete_appointment"
                      onClick={() => openWarning(record.id_cita)}
                      style={{
                        cursor: record.estado.includes('Cancelada') || record.estado.includes('cancelada') || record.estado.includes('perdida') ? "not-allowed" : "pointer",
                        opacity: record.estado.includes('Cancelada') || record.estado.includes('cancelada') || record.estado.includes('perdida') ? 0.5 : 1,
                      }}
                    >
                      <i className="fa fa-trash-alt m-r-5"></i>
                      Cancelar cita
                    </span>
                  </>
                  ) :
                  (
                    <span
                      className="dropdown-item"
                      data-bs-toggle="modal"
                      data-bs-target="#delete_appointment"
                      onClick={() => openWarning(record.id_cita)}>
                      <i className="fa fa-trash-alt m-r-5"></i>
                      Cancelar cita
                    </span>
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

  const handleTabClick = (tabId) => {
    setHash(tabId);
  };

  const changeStatusToCancel = async (id) => {
    const citaSelected = appointments.find(item => item?.id_cita == id)

    const bodyUpdate = {
      id: citaSelected.id_cita,
      id_paciente: citaSelected.id_paciente,
      id_profesional: citaSelected.id_profesional,
      carrera: citaSelected.carrera || '',
      email: citaSelected.email_estudiante || '',
      appointment_date: citaSelected.fecha || '',
      start_time: citaSelected.hora || '',
      campus: citaSelected.campus === 'centro'
        ? "Sede Centro - Manuel Rodríguez Sur 343 , 2° piso"
        : citaSelected.campus === 'huechuraba'
          ? "Sede Huechuraba - Avenida Santa Clara 797, Huechuraba, piso -2, edificio Cubo"
          : 'Videollamada',
      nombre_estudiante: citaSelected.nombre_alumno,
      selected_doctor: citaSelected.nombre_profesional || '',
      quien_cancela: session?.user?.id,
      status: session?.user?.rol === 'alumno' ? 'cancelada por alumno' : 'cancelada por profesional',
      tipo_cita: citaSelected.tipo_cita || '',
    }

    try {
      const response = await changeStatusAppointment(bodyUpdate)
      if (!response.validacion) {
        setSuccess('fail')
        setMessage('No se pudo cancelar la cita')
      } else if (response.validacion) {
        setSuccess('success')
        setMessage('Cita cancelada con éxito')
      }
    } catch (error) {
      console.log('Error', error)
      setSuccess('fail')
      setMessage('No se pudo cancelar la cita', error)
    }
  }


  const openWarning = (id) => {
    setSuccess('warning')
    setMessage('¿Desea confirmar la eliminación del servicio seleccionado?')
    setIdCita(id)
  }


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

                          <ul className="nav nav-tabs">
                            <li className="nav-item">
                              <Link
                                className={`nav-link ${hash === 'pacientes' ? 'active' : hash === '' ? 'active' : ''}`}
                                href="#pacientes"
                                onClick={() => handleTabClick('pacientes')}>
                                <h3>Lista de Pacientes</h3>
                              </Link>
                            </li>
                            {hash === 'citas' &&
                              <li className="nav-item">
                                <Link
                                  className={`nav-link ${hash === 'citas' ? 'active' : ''}`}
                                  href="#citas"
                                  onClick={() => handleTabClick('citas')}>
                                  <h3>{patientResults && patientResults[0]?.nombre_alumno || 'Detalle'} </h3>
                                </Link>
                              </li>}
                          </ul>

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
                                onClick={fetchData}
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

                  <div className="tab-content">
                    <div
                      className={`tab-pane ${hash === 'pacientes' || hash === '' ? 'show active' : ''}`}
                      id="pacientes">
                      <div className="table-responsive doctor-list" style={{ overflowY: 'hidden' }}>
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
                    <div
                      className={`tab-pane ${hash === 'citas' ? 'show active' : ''}`} id="citas">

                      <Table
                        {...tableProps}
                        pagination={{
                          total: patientResults.length,
                          showTotal: (total, range) =>
                            `Mostrando ${range[0]} a ${range[1]} de ${total} entradas`,
                          //showSizeChanger: true,
                          onShowSizeChange: onShowSizeChange,
                          itemRender: itemRender,
                        }}
                        columns={patientColumns}
                        dataSource={patientResults}

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
      <div className='p-0 m-0'>
        {
          success === 'success'
            ?
            <div style={{
              height: '100%',
              position: 'fixed',
              top: '0',
              width: '105%',
              zIndex: 99999,
              background: '#00000080',
              margin: 0,
            }}>
              {/* <div className="col-sm-12 col-lg-6"> */}
              <Alert
                severity="success"
                onClose={() => { setSuccess('initial') }}
                sx={{
                  zIndex: 'tooltip',
                  position: 'absolute',
                  left: '30%',
                  width: '50%',
                  padding: '50px',
                  bottom: '50vh'
                }}
              // spacing={2}
              >
                {message}
              </Alert>
              {/* </div> */}
            </div>

            : success === 'fail'
              ?
              <div className="row" style={{
                height: '100%',
                position: 'fixed',
                top: '0',
                width: '100%',
                zIndex: 99999,
                background: '#00000080',
                margin: 0,
              }}>
                <div className="col-sm-12 col-lg-6">
                  <Alert
                    severity="error"
                    onClose={() => { setSuccess('initial') }}
                    sx={{
                      zIndex: 'tooltip',
                      position: 'absolute',
                      left: '30%',
                      width: '50%',
                      padding: '50px',
                      bottom: '50vh'
                    }}
                  // spacing={2}
                  >
                    {message}
                  </Alert>
                </div>
              </div>
              : success === 'warning'
                ?
                <div className="row" style={{
                  height: '100%',
                  position: 'fixed',
                  top: '0',
                  width: '100%',
                  zIndex: 99999,
                  background: '#00000080',
                  margin: 0,
                }}>
                  <div className="col-sm-12 col-lg-6">
                    <Alert
                      severity="warning"
                      onClose={() => { setSuccess('initial') }}
                      sx={{
                        zIndex: 'tooltip',
                        position: 'absolute',
                        left: '30%',
                        width: '50%',
                        padding: '50px',
                        bottom: '50vh'
                      }}
                    // spacing={2}
                    >
                      <h4>{message}</h4>
                      <Button variant="primary" onClick={() => { changeStatusToCancel(idCita) }}> Confirmar </Button>
                    </Alert>
                  </div>
                </div>
                : ""
        }
      </div>
    </>

  )
}

// export default PatientsList;
export default withAuth(PatientsList, ['administrador', 'profesional']);

