'use client'
/* eslint-disable no-unused-vars */
/* eslint-disable-next-line react-hooks/exhaustive-deps */

import { useState, useEffect } from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { Form, Table } from 'antd';

import { onShowSizeChange, itemRender } from '@/components/Pagination'

import { useSidebar } from "@/context/SidebarContext";
import withAuth from '@/components/withAuth';
import { fetchAppointments, changeStatusAppointment, search, fetchAppointmentById } from '@/services/AppointmentsServices'
import { hasRecords } from '@/services/RecordServices';

import {
  imagesend, plusicon, refreshicon, searchnormal
} from '@/components/imagepath';
import FeatherIcon from 'feather-icons-react/build/FeatherIcon';
import useMediaQuery from '@mui/material/useMediaQuery';
import PasswordAlert from '@/components/PasswordAlert';
import { Button } from 'react-bootstrap'
import { Alert } from '@mui/material';
import { fetchUser } from '@/services/UsersServices';
import { formatDateUTC, filtrarFechasAnteriores } from '@/utils/managedata';
import { updateUser } from '@/services/UsersServices';
import SimpleBackdrop from '@/components/Backdrop';


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
  const [loadTable, setLoadTable] = useState(false);
  const [success, setSuccess] = useState('initial')
  const [message, setMessage] = useState('')
  const { setProps } = useSidebar();

  useEffect(() => {
    setProps({
      id: "menu-item4",
      id1: "menu-items4",
      activeClassName: "appoinment-list",
    });
  }, [setProps]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetchAppointments();

      if (session.user?.rol === 'profesional') {
        const dataChangeStatus = response.filter(item => (!item["estado"].includes('realizada')))
        const promises = filtrarFechasAnteriores(dataChangeStatus, "fecha")
        const data = await Promise.all(promises)
        const dataFiltered = data.filter(item => item.id_profesional == session.user?.id);
        setAppointments(dataFiltered);
        setResults(dataFiltered);

      } else if (session.user?.rol === 'alumno') {
        // const dataChangeStatus = response.filter(item => (!item["estado"].includes('realizada')))
        const promises = filtrarFechasAnteriores(response, "fecha")
        const data = await Promise.all(promises)
        const dataFiltered = data.filter(item => item.id_paciente == session.user?.id);
        setAppointments(dataFiltered);
        setResults(dataFiltered);

      } else if (session.user?.rol === 'administrador' || session.user?.rol === 'blend') {
        const dataChangeStatus = response.filter(item => (!item["estado"].includes('realizada')))
        const promises = filtrarFechasAnteriores(dataChangeStatus, "fecha")
        const data = await Promise.all(promises)
        setAppointments(data);
        setResults(data);
      }
    } catch (error) {
      setMessage('')
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    loadAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status]);

  // if ( loading) {
  //   return <SimpleBackdrop />;
  // }

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
    loadAppointments()
  }


  const handleNavigate = (fecha, hora) => {
    localStorage.setItem('fechaCita', JSON.stringify({ fecha, hora }));
  };


  const openWarning = (record) => {
    const citaDateTime = new Date(`${record.fecha}T${record.hora}`)
    const ahora = new Date()

    const diferenciaEnMs = citaDateTime - ahora
    const horasRestantes = diferenciaEnMs / (1000 * 60 * 60)

    if (horasRestantes < 24) {
      setSuccess('info') // o 'error', según cómo quieras mostrarlo
      setMessage('La cita ya no puede ser cancelada porque faltan menos de 24 horas.')
      return
    }

    setSuccess('warning')
    setMessage('¿Desea confirmar la eliminación del servicio seleccionado?')
    setIdAppointment(record.id_cita)
  }


  const changeStatusToCancel = async (id) => {
    setLoading(true)
    const citaSelected = appointments.find(item => item?.id_cita == id)
    const { users: alumno } = await fetchUser(citaSelected.id_paciente)
    const responseHasRecords = await hasRecords(citaSelected.id_paciente)

    const bodyUpdate = {
      id: citaSelected.id_cita,
      id_paciente: citaSelected.id_paciente,
      id_profesional: citaSelected.id_profesional,
      carrera: citaSelected.carrera || alumno[0]?.carrera || '',
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

    const bodyUpdateUser = {
      "aplica_despeje": 1, // Cambiar a 1 si cancela la cita y el estudiante NO tiene registros
      "apellido": alumno[0].apellido || 'No informado',
      "anoIngresoCarrera": alumno[0].anoIngresoCarrera || 'No aplica',
      "campus": alumno[0].campus || 'No aplica',
      "comuna": alumno[0].comuna || 'No informado',
      "carrera": alumno[0].carrera || 'No informado',
      "contrasena": 'No aplica',
      "direccion": alumno[0].direccion,
      "email": alumno[0].email,
      "entrevistador": 0,
      "fecha_nacimiento": formatDateUTC(alumno[0].fecha_nacimiento) || 'No informado',
      "genero": alumno[0].genero || 'No informado',
      "id": alumno[0].id,
      "jornada": 'No aplica',
      "mustChangePassword": 0,
      "nombre": alumno[0].nombre || 'No informado',
      "nombre_social": alumno[0].nombre_social || 'No informado',
      "region": alumno[0].region || 'No informado',
      "rut": alumno[0].rut || 'No informado',
      "status": alumno[0].status,
      "telefono": alumno[0].telefono || 'No informado',
      "tipo_usuario": alumno[0].tipo_usuario,
      "id_emergencia": alumno[0].contacto1_id || 0,
      "id_emergencia_2": alumno[0].contacto2_id || 0,
    }

    try {
      const response = await changeStatusAppointment(bodyUpdate)

      const validacionEstudiante = response?.resultado_mail_estudiante?.validacion;
      const validacionProfesional = response?.resultado_mail_profesional?.validacion;

      const validacionExitosa = validacionEstudiante && validacionProfesional;

      if (!validacionExitosa) {
        setSuccess('fail');
        setMessage('No se pudo cancelar la cita');
        return;
      }

      setSuccess('success');
      setMessage('Cita cancelada con éxito');

      if (!responseHasRecords) {
        const updateUserResponse = await updateUser(bodyUpdateUser);
      }
    } catch (error) {
      console.log('Error', error)
      setSuccess('fail')
      setMessage('No se pudo cancelar la cita', error)
    } finally {
      setLoading(false)
    }
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
              <Image
                className="avatar-img rounded-circle"
                src={record.Img}
                alt="User Image"
              />
            </Link> */}
            <Link href={`/fichas/${record.id_paciente}`}>{record.nombre_alumno}</Link>
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
      // responsive: ['md'],
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
      // responsive: ['md'],
      render: (text, record) => {
        const [year, month, day] = text.split('-');
        return `${day}-${month}-${year}`;
      },
    }, {
      title: "Hora",
      dataIndex: "hora",
      sorter: (a, b) => a['hora'].localeCompare(b['hora']),
      key: 'hora',
      // responsive: ['md'],
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
          {record.estado.includes("alta") && (
            <span className="custom-badge status-blue">
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
              >
                {(session.user?.rol === 'profesional' || session.user?.rol === 'administrador' || session.user?.rol === 'blend') ?
                  (<>
                    <Link
                      className="dropdown-item"
                      href={`/fichas/agregarficha/${record.id_cita}`}
                      onClick={() => { handleNavigate(record.fecha, record.hora) }}
                    >
                      <i className="far fa-edit me-2" />
                      Registrar atención
                    </Link>
                    <Link
                      href={`/citas/${record.id_cita}`}
                      className="dropdown-item"
                      data-bs-toggle="modal"
                      data-bs-target="#delete_appointment"
                      onClick={(e) => {
                        const isDisabled = record.estado.toLowerCase().includes('cancelada') || record.estado.toLowerCase().includes('perdida') || record.estado.includes('realizada');
                        if (isDisabled) {
                          e.preventDefault();
                          e.stopPropagation();
                          return;
                        }
                        setIdAppointment(record.id_cita);
                      }}
                      style={{
                        cursor: record.estado.toLowerCase().includes('cancelada') || record.estado.toLowerCase().includes('perdida') || record.estado.includes('realizada') ? "not-allowed" : "pointer",
                        opacity: record.estado.toLowerCase().includes('cancelada') || record.estado.toLowerCase().includes('perdida') || record.estado.includes('realizada') ? 0.5 : 1,
                      }}
                    >
                      <i className="fa fa-trash-alt m-r-5"></i>
                      Cancelar cita
                    </Link>
                  </>
                  ) :
                  (
                    <span
                      className="dropdown-item"
                      data-bs-toggle="modal"
                      data-bs-target="#delete_appointment"
                      onClick={(e) => {
                        const isDisabled = record.estado.toLowerCase().includes('cancelada') || record.estado.toLowerCase().includes('perdida') || record.estado.toLowerCase().includes('realizada');
                        if (isDisabled) {
                          e.preventDefault();
                          e.stopPropagation();
                          return;
                        }
                        { console.log('record', record) }
                        openWarning(record);
                      }}
                      style={{
                        cursor: record.estado.includes('Cancelada') || record.estado.includes('cancelada') || record.estado.includes('perdida') || record.estado.includes('realizada') ? "not-allowed" : "pointer",
                        opacity: record.estado.includes('Cancelada') || record.estado.includes('cancelada') || record.estado.includes('perdida') || record.estado.includes('realizada') ? 0.5 : 1,
                      }}
                    >
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

  const columns = allColumns.filter((col) => {
    if (session.user?.rol === "profesional" && col.key !== "nombre_profesional") return true;
    if (session.user?.rol === "alumno" && col.key !== "nombre_alumno") return true;
    if ((session.user?.rol === "administrador" || session.user?.rol === "blend")) return true;
    return false;
  });

  const handleLoadingChange = (enable) => {
    setLoading(enable);
  };

  const tableProps = {
    loading,
  }

  return (
    <>
      <div className="sidebar-overlay" data-reff="" style={{ zIndex: 98 }} />
      {loading && <SimpleBackdrop />}

      <Form
        layout="inline"
        className="table-demo-control-bar"
        style={{
          height: 0,
        }}
      >
        {/* <Form.Item label="loading">
          <Switch checked={loading} onChange={handleLoadingChange} />
        </Form.Item> */}
      </Form>
      <div className="page-wrapper">
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
                        <div className="doctor-table-blk mobile-header">
                          {matches && <h3>Lista de citas </h3>}
                          <div className="doctor-search-blk">
                            <div className="top-nav-search table-search-blk mobile-header">
                              <form >
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Busca aquí"
                                  onChange={(e) => { handleSearch(e.target.value) }}
                                />
                                <Link className="btn" href="#">
                                  <Image
                                    src={searchnormal}
                                    alt="#"
                                  />
                                </Link>
                              </form>
                            </div>
                            <div className="add-group">
                              {session?.user?.rol !== "alumno" && <Link href="/citas/agendarcita"
                                className="btn btn-primary add-pluss ms-2"
                              >
                                <Image src={plusicon} alt="#" />
                              </Link>}
                              <Link
                                href="#"
                                onClick={loadAppointments}
                                className="btn btn-primary doctor-refresh ms-2"
                              >
                                <Image src={refreshicon} alt="#" />
                              </Link>
                            </div>
                          </div>
                        </div>

                      </div>
                      {/* <div className="col-auto text-end float-end ms-auto download-grp">
                          <Link href="#" className=" me-2">
                            <Image src={pdficon} alt="#" />
                          </Link>
                          <Link href="#" className=" me-2">
                          </Link>
                          <Link href="#" className=" me-2">
                            <Image src={pdficon3} alt="#" />
                          </Link>
                          <Link href="#">
                            <Image src={pdficon4} alt="#" />
                          </Link>
                        </div> */}
                    </div>
                  </div>
                  {/* /Table Header */}

                  <div className="table-responsive patient-list">


                    <Table
                      {...tableProps}
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

                      // rowSelection={rowSelection}
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
              <Image src={imagesend} alt="#" width={50} height={46} />
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
              <Image src={imagesend} alt="#" width={50} height={46} />
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
      <PasswordAlert />
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
                      <Button variant="primary" onClick={() => { changeStatusToCancel(idAppointment) }}> Confirmar </Button>
                    </Alert>
                  </div>
                </div>
                : ""
        }
      </div>
    </>
  )
}

// export default AppoinmentList;
export default withAuth(AppoinmentList, ['alumno', 'profesional', 'administrador', 'blend']);

