"use client"
/* eslint-disable-next-line react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Form, Table } from 'antd';
import { useUserContext } from '@/context/UserContext';
// import Headerudp from '../Headerudp';
import { onShowSizeChange, itemRender } from '../../components/Pagination'
import { fetchPatientsDespejeFalse, fetchUser, fetchUsers, updateUser } from '../../services/UsersServices'
import { changeStatusAppointment, search, fetchAppointmentById, fetchAppointments, fetchListadoCitasPorProfesional } from '../../services/AppointmentsServices'
import { hasRecords } from '../../services/RecordServices'
import {
  imagesend, refreshicon, searchnormal,
} from '../../components/imagepath';
import { usersByProfessional, isAssignedToProfessional, professionalsByUser } from '@/services/DoctorsServices';

import Link from "next/link";
import Image from 'next/image';
import Alert from '@mui/material/Alert';

import { useSidebar } from "@/context/SidebarContext";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import withAuth from '@/components/withAuth';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Button } from 'react-bootstrap';
import { formatDateUTC, filtrarFechasAnteriores, normalizarHora } from '@/utils/managedata';
import SimpleBackdrop from '@/components/Backdrop';

// organizar citas por paciente, separando citas futuras y pasadas, y ordenando adecuadamente
const agruparCitasPorPaciente = (citas) => {
  const pacientesMap = {};
  const fechaActual = new Date();

  citas.forEach(cita => {
    const idPaciente = cita.id_paciente;

    // Asegurar formato de hora HH:mm:ss
    const horaNorm = normalizarHora(cita.hora);
    const [h, m, s] = horaNorm.split(":").map(Number);
    const [year, month, day] = cita.fecha.split("-").map(Number);
    const fechaCita = new Date(year, month - 1, day, h, m, s);

    if (!pacientesMap[idPaciente]) {
      pacientesMap[idPaciente] = {
        id_paciente: idPaciente,
        email_estudiante: cita.email_estudiante,
        nombre_alumno: cita.nombre_alumno,
        telefono_estudiante: cita.telefono_estudiante,
        status: cita.status,
        citasFuturas: [],
        citasPasadas: []
      };
    }

    const citaObj = {
      id_cita: cita.id_cita,
      fecha: cita.fecha,
      hora: cita.hora,
      estado: cita.estado,
      campus: cita.campus,
      especialidad_profesional: cita.especialidad_profesional,
      motivo: cita.motivo,
      primera_cita: cita.primera_cita,
      uuid: cita.uuid,
      id_profesional: cita.id_profesional
    };

    // Clasificación
    if (
      fechaCita >= fechaActual &&
      cita.estado.toLowerCase() !== "realizada"
    ) {
      pacientesMap[idPaciente].citasFuturas.push(citaObj);
    } else {
      pacientesMap[idPaciente].citasPasadas.push(citaObj);
    }
  });

  const resultado = Object.values(pacientesMap).map(paciente => {
    paciente.citasFuturas.sort((a, b) => {
      const fechaA = parseFechaHora(a.fecha, a.hora);
      const fechaB = parseFechaHora(b.fecha, b.hora);
      return fechaA - fechaB;
    });

    paciente.citasPasadas.sort((a, b) => {
      const fechaA = parseFechaHora(a.fecha, a.hora);
      const fechaB = parseFechaHora(b.fecha, b.hora);
      return fechaB - fechaA;
    });

    const citasFinales = paciente.citasFuturas.length > 0
      ? paciente.citasFuturas
      : paciente.citasPasadas.length > 0
        ? [paciente.citasPasadas[0]]
        : [];

    return { ...paciente, citas: citasFinales };
  });

  return resultado;
};

function parseFechaHora(fechaYYYYMMDD, hora) {
  const horaNorm = normalizarHora(hora);
  let [h, m, s] = horaNorm.split(":").map(Number);
  if (isNaN(h)) h = 0;
  if (isNaN(m)) m = 0;
  if (isNaN(s)) s = 0;

  const [year, month, day] = fechaYYYYMMDD.split("-").map(Number);
  return new Date(year, month - 1, day, h, m, s);
}
const formatDateToDDMMYYYY = (dateString) => {
  if (!dateString || dateString === '-' || dateString === "0000-00-00") return '-';
  const [year, month, day] = dateString.split('-');
  if (!year || !month || !day) return '-';
  return `${day}-${month}-${year}`;
};

const PatientsList = () => {
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
  const mobile = useMediaQuery('(max-width:780px)');
  const { setSelectedUserId } = useUserContext()
  const [primeraReservada, setPrieraCitaReservada] = useState(null);
  const HORAS_PARA_CANCELAR = process.env.NEXT_PUBLIC_HORAS_PARA_CANCELAR || 24;

  useEffect(() => {
    setProps({
      id: "menu-item2",
      id1: "menu-items2",
      activeClassName: "patient-list",
    });
  }, [setProps]);

  // limpia data en caso que vengan repetidos los emails
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
    const { citas } = await fetchListadoCitasPorProfesional(session.user?.id);
    const response = await fetchAppointments();

    const finalCitas = await Promise.all(
      agruparCitasPorPaciente(response).map(async paciente => {
        // Si tiene citas futuras, muestra la más próxima
        if (paciente.citasFuturas.length > 0) {
          // Para profesional: solo mostrar citas donde id_profesional es el usuario conectado
          if (session?.user?.rol === 'profesional') {
            const { alumnos: estudiantes } = await usersByProfessional(session.user.id);
            const asignado = estudiantes.find(e => e.id_alumno === paciente.id_paciente);

            // Si está asignado
            if (asignado) {
              // Si tiene citas futuras contigo, muestra la más próxima
              const citasConmigo = paciente.citasFuturas.filter(
                cita => cita.id_profesional == session.user.id
              );
              if (citasConmigo.length > 0) {
                const cita = citasConmigo[0];
                return {
                  emailalumno: paciente.email_estudiante,
                  nombrealumno: paciente.nombre_alumno,
                  nombreProfesional: "", // El profesional eres tú
                  fecha: cita.fecha,
                  hora: normalizarHora(cita.hora),
                  estado: cita.estado,
                  id_paciente: paciente.id_paciente,
                  id_cita: cita.id_cita,
                  id_profesional: session.user.id,
                };
              }
              // Si NO tiene citas futuras contigo, muestra "por agendar"
              return {
                emailalumno: paciente.email_estudiante,
                nombrealumno: paciente.nombre_alumno,
                nombreProfesional: "", // El profesional eres tú
                fecha: null,
                hora: null,
                estado: "por agendar",
                id_paciente: paciente.id_paciente,
                id_cita: "",
                id_profesional: session.user.id,
              };
            }
            // Si no está asignado, no lo muestres
            return null;
          } else {
            // Blend/administrador: muestra la cita futura más próxima
            const cita = paciente.citasFuturas[0];
            let nombreProfesional = "";
            if (cita.id_profesional) {
              try {
                const response = await fetchUser(cita.id_profesional);
                if (response && response.users && response.users[0]) {
                  const prof = response.users[0];
                  nombreProfesional = `${prof.nombre} ${prof.apellido}`;
                }
              } catch {
                nombreProfesional = "No informado";
              }
            }
            return {
              emailalumno: paciente.email_estudiante,
              nombrealumno: paciente.nombre_alumno,
              nombreProfesional,
              fecha: cita.fecha,
              hora: normalizarHora(cita.hora),
              estado: cita.estado,
              id_paciente: paciente.id_paciente,
              id_cita: cita.id_cita,
              id_profesional: cita.id_profesional,
            };
          }
        }

        // Si NO tiene citas futuras
        if (session?.user?.rol === 'profesional') {
          // Solo mostrar si está asignado
          const { alumnos: estudiantes } = await usersByProfessional(session.user.id);
          const asignado = estudiantes.find(e => e.id === paciente.id_paciente);
          if (asignado) {
            return {
              emailalumno: paciente.email_estudiante,
              nombrealumno: paciente.nombre_alumno,
              nombreProfesional: "", // El profesional eres tú
              fecha: null,
              hora: null,
              estado: "por agendar",
              id_paciente: paciente.id_paciente,
              id_cita: "",
              id_profesional: session.user.id,
            };
          }
          // Si no está asignado, no lo muestres
          return null;
        }

        // Blend/administrador: lógica de profesionales asociados
        if (session?.user?.rol === 'administrador' || session?.user?.rol === 'blend') {
          const { profesionales } = await professionalsByUser(paciente.id_paciente);
          let nombreProfesional = "";
          let id_profesional = "";
          if (profesionales && profesionales.length > 1) {
            const segundo = profesionales[1];
            nombreProfesional = "";
            id_profesional = segundo.id_profesional;
          } else if (profesionales && profesionales.length === 1) {
            nombreProfesional = "";
            id_profesional = "";
          }
          return {
            emailalumno: paciente.email_estudiante,
            nombrealumno: paciente.nombre_alumno,
            nombreProfesional,
            fecha: null,
            hora: null,
            estado: "por agendar",
            id_paciente: paciente.id_paciente,
            id_cita: "",
            id_profesional,
          };
        }

        // Si no cumple nada, retorna info vacía
        return {
          emailalumno: paciente.email_estudiante,
          nombrealumno: paciente.nombre_alumno,
          nombreProfesional: "",
          fecha: null,
          hora: null,
          estado: "por agendar",
          id_paciente: paciente.id_paciente,
          id_cita: "",
          id_profesional: "",
        };
      })
    );

    // Elimina los null (no asignados para profesional)
    const finalCitasClean = finalCitas.filter(Boolean);

    // Ordena para que "por agendar" quede primero
    finalCitasClean.sort((a, b) => {
      if (a.estado === "por agendar" && b.estado !== "por agendar") return -1;
      if (a.estado !== "por agendar" && b.estado === "por agendar") return 1;
      return 0;
    });

    setUsers(finalCitasClean);
    setResults(finalCitasClean);
    setLoading(false);
  };

  const handleUsersByProfessional = async (id) => {
    const response = await usersByProfessional(id);
  }

  const handleIsAssigned = async (id, id_profesional) => {
    const response = await isAssignedToProfessional(id, id_profesional);
  }

  useEffect(() => {
    setLoading(true)
    fetchData()
    // handleUsersByProfessional(session.user?.id)
    // handleIsAssigned(16258, session.user?.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const loadAppointments = async (record) => {
    setLoading(true);
    setHash('citas')

    try {
      const response = await fetchAppointments();
      const dataChangeStatus = response.filter(item => /* (!item["estado"].includes('realizada')) && */ item.id_paciente === record.id_paciente)

      const promises = filtrarFechasAnteriores(dataChangeStatus, "fecha")
      const data = await Promise.all(promises)

      const citasOrdenadas = data.sort((a, b) => {
        const fechaA = new Date(`${a.fecha}T${a.hora}`);
        const fechaB = new Date(`${b.fecha}T${b.hora}`);
        return fechaA - fechaB;
      });

      const primeraReservada = citasOrdenadas
        .filter(cita => cita.estado.toLowerCase() === 'reservada')
      setPrieraCitaReservada(primeraReservada[0]?.id_cita)

      if (session.user?.rol === 'profesional') {
        const dataFiltered = citasOrdenadas.filter(item => item.id_profesional == session.user?.id);
        setAppointments(dataFiltered);
        setPatientResults(dataFiltered);
      } else if (session.user?.rol === 'alumno') {
        const dataFiltered = citasOrdenadas.filter(item => item.id_paciente == session.user?.id);
        setAppointments(dataFiltered);
        setPatientResults(dataFiltered);
      } else if (session.user?.rol === 'administrador' || session.user?.rol === 'blend') {
        setAppointments(citasOrdenadas);
        setPatientResults(citasOrdenadas);
      }
    } catch (error) {
      console.log(error)
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


  const allColumns = [
    {
      title: "Nombre paciente",
      dataIndex: "nombrealumno",
      sorter: (a, b) => {
        // Limpia espacios y normaliza a minúsculas antes de comparar
        const nombreA = a.nombrealumno.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const nombreB = b.nombrealumno.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        return nombreA.localeCompare(nombreB, 'es', { sensitivity: 'base' });
      },
      fixed: 'left',
      onCell: () => ({
        style: {
          background: 'red', // Color de fondo para esta columna
        },
      }),
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
            <a style={{ color: '#0d6efd' }}
              onClick={() => loadAppointments(record)}>{record.nombrealumno}</a>
            {/* <Link href={`/fichas/${record.id_paciente}`}>{record.nombrealumno}</Link> */}
          </h2>

        </>
      ),
    },
    {
      title: "Email",
      dataIndex: "emailalumno",
      sorter: (a, b) => {
        // Extrae la primera letra (ignorando símbolos, números y espacios)
        const getFirstLetter = (email) => {
          const firstChar = email.trim().toLowerCase().replace(/[^a-záéíóúñ]/, '')[0];
          return firstChar || ''; // Si no hay letras, devuelve string vacío
        };

        return getFirstLetter(a.emailestudiante).localeCompare(
          getFirstLetter(b.emailestudiante), 'es');
      }
    },

    {
      title: "Fecha",
      dataIndex: "fecha",
      sorter: (a, b) => {
        // Convertir fechas dd-mm-yyyy a Date objects para comparación
        const parseDate = (dateStr) => {
          const [day, month, year] = dateStr.split('-');
          return new Date(`${year}-${month}-${day}`);
        };

        const dateA = parseDate(a.fecha);
        const dateB = parseDate(b.fecha);
        return dateA - dateB;
      },
      render: (text, record) => (
        <div>
          {record?.fecha != "0000-00-00" ? formatDateToDDMMYYYY(record?.fecha) : '-'}
        </div>
      )
    },
    {
      title: "Hora",
      dataIndex: "hora",
      sorter: (a, b) => {
        // Convertir horas h:mm:ss a segundos para comparación
        const timeToSeconds = (timeStr) => {
          const [hours, minutes, seconds] = timeStr.split(':').map(Number);
          return hours * 3600 + minutes * 60 + seconds;
        };

        return timeToSeconds(a.hora) - timeToSeconds(b.hora);
      },
      render: (text, record) => (
        <div>
          {(record?.hora != "00:00:00" && record?.hora != null) ? record?.hora : '-'}
        </div>
      )
    },
    {
      title: "Estado",
      dataIndex: "status",
      sorter: (a, b) => a.estado - b.estado,
      render: (text, record) => (
        <div>
          {record && record.estado === "reservada" && (
            <span className="custom-badge status-green">
              {record.estado}
            </span>
          )}
          {record && record.estado === "realizada" && (
            <span className="custom-badge status-blue">
              {record.estado}
            </span>
          )}
          {record && record.estado.includes("cancelada") && (
            <span className="custom-badge status-pink">
              {record.estado}
            </span>
          )}
          {record && record.estado.includes("perdida") && (
            <span className="custom-badge status-pink">
              {record.estado}
            </span>
          )}
          {record && record.estado == "alta" && (
            <span className="custom-badge status-blue">
              {record.estado}
            </span>
          )}
          {
            record && record.estado == "por agendar" && (
              <span className="custom-badge status-pink">
                Por agendar
              </span>
            )
          }
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
                {/* <span
                  className="dropdown-item"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setLoading(true)
                    router.push(`/pacientes/${record.id_paciente}`)
                  }}
                // data-bs-toggle="modal" 
                // data-bs-target="#delete_patient"
                >
                  <i className="far fa-edit me-2" />
                  Editar
                </span> */}
                <span className="dropdown-item"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setLoading(true)
                    handleSelectedId(record.id_paciente)
                    router.push(`/fichas/ver`)
                  }}
                // data-bs-toggle="modal" 
                // data-bs-target="#delete_patient"
                >
                  <i className="fas fa-folder-open me-2" />
                  Ver ficha
                </span>
                <Link className="dropdown-item" href={`#`} onClick={() => loadAppointments(record)}
                // data-bs-toggle="modal" 
                // data-bs-target="#delete_patient"
                >
                  <i className="fas fa-calendar"></i> Ver citas
                </Link>
              </div>
            </div>
          </div>
        </>
      ),
    },
  ]

  const columnProfesional = {
    title: "Nombre profesional",
    dataIndex: "nombreProfesional",
    sorter: (a, b) => {
      // Limpia espacios y normaliza a minúsculas antes de comparar
      const nombreA = a.nombreProfesional.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      const nombreB = b.nombreProfesional.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      return nombreA.localeCompare(nombreB, 'es', { sensitivity: 'base' });
    },
    fixed: 'left',
    onCell: () => ({
      style: {
        background: 'red', // Color de fondo para esta columna
      },
    }),
    render: (text, record) => (
      <>
        <h2 className="profile-image">
          {record.nombreProfesional}
        </h2>

      </>
    ),
  }

  // Filtrar columnas según rol
  const columns = [...allColumns];

  if (session?.user?.rol === 'administrador' || session?.user?.rol === 'blend') {
    columns.splice(2, 0, columnProfesional);
  }


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
      render: (text, record) => {
        const [year, month, day] = text.split('-');
        return `${day}-${month}-${year}`;
      },
    }, {
      title: "Hora",
      dataIndex: "hora",
      sorter: (a, b) => a['hora'].localeCompare(b['hora']),
      key: 'hora',
    }, {
      title: "Estado",
      dataIndex: "estado",
      sorter: (a, b) => a.estado.localeCompare(b.estado),
      key: 'estado',
      responsive: ['lg'],
      render: (text, record) => (
        <div>
          {record.estado === "reservada" && (
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
          {record.estado == "alta" && (
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
                onMouseLeave={() => {
                  if (show.state === true && show.id === record.id_cita) {
                    setShow({ state: false, id: null })
                  }
                }}
              >
                {(session.user?.rol === 'profesional' || session.user?.rol === 'administrador' || session.user?.rol === 'blend') ?
                  (<>
                    <Link
                      className="dropdown-item"
                      href={`/fichas/agregarficha/${record.id_cita}`}
                      onClick={(e) => {
                        const estadoLower = record.estado.toLowerCase();
                        const isDisabled = (
                          estadoLower.includes('cancelada') ||
                          estadoLower.includes('perdida') ||
                          estadoLower.includes('realizada') ||
                          estadoLower.includes('alta') ||
                          !(estadoLower === 'reservada' && record.id_cita === primeraReservada)
                        );
                        if (isDisabled) {
                          e.preventDefault();
                          e.stopPropagation();
                          return;
                        }
                        setLoading(true)
                        const estado = record.estado
                        if (estado.includes('Cancelada') || estado.includes('cancelada')) {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                        handleNavigate(record.fecha, record.hora)
                        handleSelectedId(record.id_paciente)
                      }}
                      style={{
                        cursor: (
                          record.estado.toLowerCase() === 'reservada' &&
                          record.id_cita === primeraReservada
                        )
                          ? 'pointer'
                          : 'not-allowed',
                        opacity: (
                          record.estado.toLowerCase() === 'reservada' &&
                          record.id_cita === primeraReservada
                        ) ? 1 : 0.5,
                      }}
                    >
                      <i className="far fa-edit me-2" />
                      Registrar atención
                    </Link>
                    <Link
                      className="dropdown-item"
                      href={`/citas/${record.id_cita}`}
                      style={{
                        cursor: record.estado.toLowerCase().includes('cancelada') || record.estado.toLowerCase().includes('perdida') || record.estado.toLowerCase().includes('realizada') || record.estado.toLowerCase().includes('alta') ? "not-allowed" : "pointer",
                        opacity: record.estado.toLowerCase().includes('cancelada') || record.estado.toLowerCase().includes('perdida') || record.estado.toLowerCase().includes('realizada') || record.estado.toLowerCase().includes('alta') ? 0.5 : 1,
                      }}
                      onClick={(e) => {
                        const isDisabled = record.estado.toLowerCase().includes('cancelada') || record.estado.toLowerCase().includes('perdida') || record.estado.toLowerCase().includes('realizada') || record.estado.toLowerCase().includes('alta')
                        if (isDisabled) {
                          e.preventDefault(); // Bloquea la navegación
                          e.stopPropagation(); // Evita que otros eventos se disparen
                        }
                      }}
                    >
                      <i className="far fa-edit me-2" />
                      Editar
                    </Link>
                    <span
                      className="dropdown-item"
                      data-bs-toggle="modal"
                      data-bs-target="#delete_appointment"
                      onClick={(e) => {
                        const isDisabled = record.estado.toLowerCase().includes('cancelada') || record.estado.toLowerCase().includes('perdida') || record.estado.toLowerCase().includes('realizada') || record.estado.toLowerCase().includes('alta')
                        if (isDisabled) {
                          e.preventDefault();
                          e.stopPropagation();
                          return;
                        }
                        openWarning(record);
                      }}
                      style={{
                        cursor: record.estado.toLowerCase().includes('cancelada') || record.estado.toLowerCase().includes('perdida') || record.estado.toLowerCase().includes('realizada') || record.estado.toLowerCase().includes('alta') ? "not-allowed" : "pointer",
                        opacity: record.estado.toLowerCase().includes('cancelada') || record.estado.toLowerCase().includes('perdida') || record.estado.toLowerCase().includes('realizada') || record.estado.toLowerCase().includes('alta') ? 0.5 : 1,
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
                      onClick={(e) => {
                        const isDisabled = record.estado.toLowerCase().includes('cancelada') || record.estado.toLowerCase().includes('perdida') || record.estado.toLowerCase().includes('realizada') || record.estado.toLowerCase().includes('alta')
                        if (isDisabled) {
                          e.preventDefault();
                          e.stopPropagation();
                          return;
                        }
                        openWarning(record.id_cita);
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

  const handleTabClick = (tabId) => {
    setHash(tabId);
  };

  const changeStatusToCancel = async (id) => {
    setLoading(true)
    const citaSelected = appointments.find(item => item?.id_cita == id)
    const { users: alumno } = await fetchUser(citaSelected.id_paciente)

    const bodyUpdate = {
      id: citaSelected.id_cita,
      id_paciente: citaSelected.id_paciente,
      id_profesional: citaSelected.id_profesional,
      carrera: citaSelected.carrera || alumno[0]?.carrera || '',
      email: citaSelected.email_estudiante || '',
      appointment_date: citaSelected.fecha || '',
      start_time: citaSelected.hora || '',
      campus: (citaSelected.campus).toLowerCase().includes('centro')
        ? "Sede Centro - Manuel Rodríguez Sur 343 , 2° piso"
        : (citaSelected.campus).toLowerCase().includes('huechuraba')
          ? "Sede Huechuraba - Avenida Santa Clara 797, Huechuraba, piso -2, edificio Cubo"
          : 'No aplica',
      nombre_estudiante: citaSelected.nombre_alumno,
      quien_cancela: citaSelected.nombre_profesional || 'Profesional',
      status: session?.user?.rol === 'alumno' ? 'cancelada por alumno' : 'cancelada por profesional',
      tipo_cita: (citaSelected.campus).toLowerCase().includes('sede') ? 'Presencial' : 'Videollamada',
    }

    const responseHasRecords = await hasRecords(citaSelected.id_paciente)

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

  const openWarning = (record) => {
    const hora = normalizarHora(record.hora);
    const citaDateTime = new Date(`${record.fecha}T${hora}`)
    const ahora = new Date()

    const diferenciaEnMs = citaDateTime - ahora
    const horasRestantes = diferenciaEnMs / (1000 * 60 * 60)

    // if (horasRestantes < HORAS_PARA_CANCELAR) {
    //   setSuccess('info') // o 'error', según cómo quieras mostrarlo
    //   setMessage('La cita ya no puede ser cancelada porque faltan menos de 24 horas.')
    //   return
    // }
    setSuccess('warning')
    setMessage('¿Desea confirmar la eliminación del servicio seleccionado?')
    setIdCita(record.id_cita)
  }


  const tableProps = {
    loading,
  };

  const handleSelectedId = (id) => {
    setSelectedUserId(id)
  }

  const handleClose = () => {
    setMessage('')
    setSuccess('initial')
  }

  return (
    < >
      <div className="sidebar-overlay" data-reff="" style={{ zIndex: 98 }} />
      <Form
        layout="inline"
        className="table-demo-control-bar"
        style={{
          height: 0,
        }}
      >
        {loading && <SimpleBackdrop />}
      </Form>
      {/* <Headerudp /> */}
      {/* <Sidebar id='menu-item2' id1='menu-items2' activeClassName='patient-list' /> */}
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
                        <div className="doctor-table-blk mobile-header">

                          <ul className="nav nav-tabs mobile-header">
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
                            <div className="top-nav-search table-search-blk mobile-header">
                              <form>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Busca aquí"
                                  onChange={(e) => { handleSearch(e.target.value) }}
                                />
                                <Link href="#" className="btn">
                                  <Image
                                    src={searchnormal}
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
                                <Image src={refreshicon} alt="#" />
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

                          // rowSelection={rowSelection}
                          rowKey={(record, i) => i + record.id_paciente}
                        />
                      </div>
                    </div>

                  </div>
                  {/* /Table Header */}

                  <div className="tab-content">
                    <div
                      className={`tab-pane ${hash === 'citas' ? 'show active' : ''}`} id="citas">
                      <div className="table-responsive doctor-list" style={{ overflowY: 'hidden' }}>

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
        </div>

      </div>
      <div className='p-0 m-0'>
        {
          success === 'success'
          &&
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
              onClose={handleClose}
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
        }
        {success === 'fail'
          &&
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
                onClose={handleClose}
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
        }
        {
          success === 'warning'
          &&
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
                onClose={handleClose}
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

        }
        {success === 'info'
          &&
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
                onClose={handleClose}
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
              </Alert>
            </div>
          </div>
        }
      </div>
    </>

  )
}

// export default PatientsList;
export default withAuth(PatientsList, ['administrador', 'profesional', 'blend']);

