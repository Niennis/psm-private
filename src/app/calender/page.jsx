'use client'
/* eslint-disable no-const-assign */
/* eslint-disable no-unused-vars */
import { useEffect, useState, forwardRef } from "react";
import Link from "next/link";

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { TextField, Alert } from '@mui/material';

import { DatePicker } from "antd";
import esLocale from '@fullcalendar/core/locales/es'
import {
  generarHorasMedicas,
} from "@/services/SchedulesServices";
import CalendarSkeleton from "@/components/skeletons/CalendarSkeleton";
import withAuth from '@/components/withAuth';
import CacheHandler from "@/utils/cache-handler";
import { Modal, Button } from 'react-bootstrap'
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDisponibilidadContext } from "@/context/DisponibilidadContext";
import SimpleBackdrop from "@/components/Backdrop";

const cacheHandler = new CacheHandler();

const Calender = forwardRef(({ editBloque, profesional_id, calendario, deleteBloque, deleteDisponibilidad, refresh }, calendarRef) => {
  const [menu, setMenu] = useState(false);
  const [success, setSuccess] = useState('initial')
  const [message, setMessage] = useState('')
  const { data, setData } = useDisponibilidadContext()
  const [loading, setLoading] = useState(false)

  const [startDate, setDate] = useState(new Date()),
    [showCategory, setshowCategory] = useState(false),
    [showmodel, setshowmodel] = useState(false),
    [showEvents, setshowEvents] = useState(false),
    [show, setshow] = useState(false),
    [iseditdelete, setiseditdelete] = useState(false),
    [addneweventobj, setaddneweventobj] = useState(null),
    [isnewevent, setisnewevent] = useState(false),
    [event_title, setevent_title] = useState(""),
    [category_color, setcategory_color] = useState(""),
    [calenderevent, setcalenderevent] = useState(""),
    [weekendsVisible, setweekendsVisible] = useState(true),
    [currentEvents, setscurrentEvents] = useState([]),
    defaultEvents = [
      {
        title: "Event Name 4",
        start: Date.now() + 148000000,
        className: "bg-purple",
      },
    ];
  const [showModal, setShowModal] = useState(false)
  const [eventDetails, setEventDetails] = useState('');
  const mobile = useMediaQuery('(min-width:600px)');
  const [eventosDelDia, setEventosDelDia] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

  const handleShow = () => setShowModal(true);

  const datesToTimestamp = (fecha, hora) => {
    // Combinar fecha y hora en un formato ISO 8601 compatible con `Date`
    const fechaHora = `${fecha} ${hora}`;
    const timestamp = Date.parse(fechaHora); // Obtiene el tiempo en milisegundos
    return timestamp;
  };

  const onChange = (date, dateString) => {
  };
  const toggleMobileMenu = () => {
    setMenu(!menu);
  };

  const handleChange = (date) => {
    setDate(date);
  };
  const addEvent = () => {
    setshowEvents(true);
  };
  const categoryHandler = () => {
    setshowCategory(true);
  };

  const handleClose = () => {
    setisnewevent(false);
    setiseditdelete(false);
    setshow(false);
    setshowCategory(false);
    setshowEvents(false);
    setshowmodel(false);
    setShowModal(false)
  };

  const handleEventClick = async (clickInfo) => {
    setiseditdelete(true);
    setevent_title(clickInfo.event.title);
    setcalenderevent(clickInfo.event);
    setShowModal(true);

  };

  const handleEdit = async () => {
    const data = calenderevent.extendedProps

    const obj = {
      "id": data.id_disponibilidad,
      "id_bloque": data.id_bloque,
      "id_disponibilidad": data.id_disponibilidad,
      "id_user": data.id_user,
      "tipo": data.tipo,
      "día": data.dia,
      "fechaInicio": data.fechaInicio,
      "fechaFin": data.fechaFin,
      "repeticiones": data.repeticiones,
      "horaIni": data.horaInicio,
      "horaFin": data.horaFin,
      "modalidad": data.modalidad,
      "frecuencia": data.frecuencia,
      "detalleServicio": data.detalleServicio,
      "duracionServicio": data.duracionServicio,
      "tipoServicio": data.tipoServicio,
      "campus": data.campus
    }
    setData(obj)
    if (typeof editBloque === "function") {
      try {
        await editBloque(obj); // Aquí se envía 'obj' al padre
      } catch (error) {
        console.error("Error al enviar datos al padre:", error);
      } finally {
        handleClose()
      }
    } else {
      console.error("editBloque no es una función");
    }
  }

  const handleDelete = async () => {
    await deleteBloque(calenderevent.extendedProps.id_disponibilidad)
    setSuccess('initial')
    handleClose()
  }

  const handleDeleteDisponibilidad = async () => {
    await deleteDisponibilidad(calenderevent.extendedProps.uuid)
    setSuccess('initial')
    handleClose()
  }

  const handleDateSelect = (selectInfo) => {
    setisnewevent(true);
    setaddneweventobj(selectInfo);
  };

  const addnewevent = () => {
    let calendarApi = addneweventobj.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (event_title) {
      calendarApi.addEvent({
        id: 10,
        title: event_title,
        className: category_color,
        start: addneweventobj.startStr,
        end: addneweventobj.endStr,
        allDay: addneweventobj.allDay,
      });
    }
    setisnewevent(false);
  };

  const onupdateModalClose = () => {
    setiseditdelete(false);
    setevent_title("");
  };
  const oncreateeventModalClose = () => {
    setevent_title("");
    setisnewevent(false);
  };
  const removeevent = () => {
    calenderevent.remove();
    setiseditdelete(false);
  };
  const clickupdateevent = () => {
    const newArray = calendario;
    for (let i = 0; i < newArray.length; i++) {
      if (newArray[i].id === parseInt(calenderevent.id)) {
        newArray[i].title = event_title;
      }
    }
    // setCalendario(newArray);
    setiseditdelete(false);
  };

  const handleClick = () => {
    setshow(true);
  };

  const formatToBullets = tipoServicio => {
    if (!tipoServicio) return null;

    // Convertir el string a un array
    let array;
    try {
      array = JSON.parse(tipoServicio.replace(/'/g, '"')); // Reemplazar comillas simples por dobles para JSON válido
    } catch (error) {
      console.error("Error al convertir el string en array:", error);
      return tipoServicio; // Si falla, retorna el string original
    }

    // Convertir el array en una lista con bullets
    return (
      <ul>
        {array.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  }

  const openWarning = () => {
    setSuccess('warning')
    setMessage('¿Desea confirmar la eliminación del servicio seleccionado?')
  }

  const openWarningGrupal = () => {
    setSuccess('warningGrupal')
    setMessage('¿Desea confirmar la eliminación de los servicios seleccionados?')
  }



  return (
    <>
      <div className="main-wrapper">
        {/* <div className="page-wrapper"> */}

        <div className="content container-fluid">

          <div className="page-header">
            <div className="row align-items-center">
              <div className="col" />

            </div>
          </div>
          {/* /Page Header */}
          {loading && <SimpleBackdrop /> }
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="card">
                <div className="card-body">
                  <div id="calendar">
                    <button className="btn btn-light m-1" onClick={refresh} style={{ margin: "10px" }}>
                      🔄 Refrescar
                    </button>
                    {!calendario ? <CalendarSkeleton />
                      : calendario.length === 0 ?
                        <FullCalendar
                          windowResizeDelay={100}  // Opcional: retraso en ms
                          windowResize={(view) => {
                            console.log("");
                          }}
                          locale={esLocale}
                          plugins={[
                            dayGridPlugin,
                            timeGridPlugin,
                            interactionPlugin,
                          ]}
                          headerToolbar={{
                            left: "prev,next today",
                            center: "title",
                            right: "dayGridMonth,timeGridWeek,timeGridDay",
                          }}
                          initialView="dayGridMonth"
                          editable={false}
                          selectable={true}
                          selectMirror={true}
                          dayMaxEvents={true}
                          weekends={false}
                          initialEvents={[]} // alternatively, use the `events` setting to fetch from a feed
                          select={handleDateSelect}
                          eventClick={(clickInfo) => handleEventClick(clickInfo)}
                        />
                        :
                        <FullCalendar
                          ref={calendarRef}
                          windowResizeDelay={100}  // Opcional: retraso en ms
                          windowResize={(view) => {
                            console.log("");
                          }}
                          locale={esLocale}
                          plugins={[
                            dayGridPlugin,
                            timeGridPlugin,
                            interactionPlugin,
                          ]}
                          headerToolbar={{
                            left: "prev,next today",
                            center: "title",
                            right: "dayGridMonth,timeGridWeek,timeGridDay",
                          }}
                          initialView="timeGridWeek"
                          editable={false}
                          selectable={true}
                          selectMirror={true}
                          dayMaxEvents={true}
                          weekends={false}
                          // slotMinTime="08:00:00"  // Comienza a las 8 AM
                          // slotMaxTime="18:00:00"  // Termina a las 6 PM
                          allDaySlot={false}      // Oculta la sección "all-day"
                          // initialEvents={calendario?.length > 0 ? calendario : []} // alternatively, use the `events` setting to fetch from a feed
                          select={handleDateSelect}
                          eventClick={(clickInfo) => handleEventClick(clickInfo)}
                          events={calendario}
                          dayMaxEventRows={true}
                          moreLinkClick={(arg) => {
                            setEventosDelDia(arg.allSegs.map(seg => seg.event));
                            setFechaSeleccionada(arg.date);
                            setMostrarModal(true);
                            return 'none'; // evita el popover por defecto
                          }}
                        />
                    }
                    {mostrarModal && (
                      <div style={{
                        position: "fixed",
                        top: 0, left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0,0,0,0.2)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999
                      }}>
                        <div style={{
                          backgroundColor: "#fff",
                          borderRadius: "4px",
                          width: "260px",
                          padding: "10px 10px 14px 10px",
                          fontFamily: "Arial, sans-serif",
                          fontSize: "13px",
                          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                          position: "relative"
                        }}>
                          {/* Cierre */}
                          <button onClick={() => setMostrarModal(false)} style={{
                            position: "absolute",
                            top: "6px",
                            right: "6px",
                            border: "none",
                            background: "none",
                            fontSize: "16px",
                            cursor: "pointer",
                            color: "#888"
                          }}>×</button>

                          {/* Fecha */}
                          <div style={{
                            fontWeight: "bold",
                            marginBottom: "8px",
                            paddingRight: "20px"
                          }}>
                            {fechaSeleccionada?.toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "long",
                              day: "numeric"
                            })}
                          </div>

                          {/* Eventos */}
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            {eventosDelDia.map((evento, i) => (
                              <div
                                key={i}
                                className={evento.classNames?.join(" ")} // Usa clases del evento para el color
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  padding: "6px 8px",
                                  borderRadius: "4px",
                                  color: "#fff",
                                  cursor: "pointer"
                                }}
                                onClick={() => handleEventClick({ event: evento })}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    fontWeight: "bold",
                                    fontSize: "13px",
                                    whiteSpace: "nowrap"
                                  }}>
                                  <span style={{
                                    width: "8px",
                                    height: "8px",
                                    borderRadius: "50%",
                                    backgroundColor: evento.backgroundColor || "#3788d8"
                                  }}></span>
                                  {evento.start
                                    ? new Date(evento.start).toLocaleTimeString("es-ES", {
                                      hour: "2-digit",
                                      minute: "2-digit"
                                    })
                                    : ""}
                                </div>
                                <span style={{ marginLeft: "auto", fontWeight: 600 }}>
                                  {evento.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <Modal
                      show={showModal}
                      onHide={handleClose}
                      style={{ alignContent: 'center' }}
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>{event_title}</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <p>Hora: {calenderevent && (calenderevent?.extendedProps?.horaInicio).split(':').slice(0, 2).join(':')} - {calenderevent && (calenderevent?.extendedProps?.horaFin).split(':').slice(0, 2).join(':')}</p>
                        <p>Modalidad: {calenderevent && calenderevent?.extendedProps?.modalidad}</p>
                        <p>Tipo de servicio:  </p> {calenderevent && formatToBullets(calenderevent?.extendedProps?.tipoServicio)}
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}> Cerrar </Button>
                        <Button variant="secondary" onClick={handleEdit}> Editar </Button>
                        <Button variant="secondary" onClick={openWarning}> Eliminar </Button>
                        <Button variant="secondary" onClick={openWarningGrupal}> Eliminar disponibilidad agrupada</Button>
                      </Modal.Footer>
                    </Modal>
                  </div>
                </div>

              </div>

            </div>

          </div>
          {/* Add Event Modal */}
          <div className="modal fade none-border" id="my_event">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Add Event</h4>

                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-hidden="true"
                  ></button>
                </div>
                <div className="modal-body" />

              </div>
            </div>
          </div>


        </div>

        {/* Footer */}
      </div>
      <div id="add_event" className="modal custom-modal fade" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Event</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true" ></span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label>
                    Event Name <span className="text-danger">*</span>
                  </label>
                  <input className="form-control" type="text" />
                </div>
                <div className="form-group">
                  <label>
                    Event Date <span className="text-danger">*</span>
                  </label>
                  <div className="cal-icon">
                    <DatePicker
                      className="form-control datetimepicker"
                      onChange={onChange}
                      suffixIcon={null}
                    />
                  </div>
                </div>
                <div className="submit-section">
                  <button className="btn btn-primary submit-btn">Submit</button>
                </div>
              </form>
            </div>
          </div>
          {/* </div> */}
        </div>
      </div>
      {/* /Main Wrapper */}
      <div style={{ marginLeft: mobile ? '-285px' : 0 }}>
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
              marginLeft: "-12px",
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
                background: '#00000080'
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
                  background: '#00000080'
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
                      <Button variant="primary" onClick={handleDelete}> Confirmar </Button>
                    </Alert>
                  </div>
                </div>
                : success === 'warningGrupal'
                  ?
                  <div className="row" style={{
                    height: '100%',
                    position: 'fixed',
                    top: '0',
                    width: '100%',
                    zIndex: 99999,
                    background: '#00000080'
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
                        <Button variant="primary" onClick={handleDeleteDisponibilidad}> Confirmar </Button>
                      </Alert>
                    </div>
                  </div>
                  : ""
        }
      </div>

    </>
  )
});

// export default Calender;
Calender.displayName = 'Calender';
export default withAuth(Calender, ['alumno', 'profesional', 'administrador']);