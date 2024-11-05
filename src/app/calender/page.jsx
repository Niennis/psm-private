'use client'
/* eslint-disable no-const-assign */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";

import Link from "next/link";
// import { useParams } from "react-router-dom";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";

import Sidebar from "../../components/Sidebar";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import { DatePicker } from "antd";
import esLocale from '@fullcalendar/core/locales/es'
// import { fetchSchedules } from "../../utils/fetchSchedules";
import { fetchSchedules, fetchScheduleByDate, fetchScheduleByAvailability, fetchScheduleByUser } from "@/services/SchedulesServices";
import Carrousel from "@/components/skeletons/Carrousel";

const Calender = ({ id }) => {
  const [menu, setMenu] = useState(false);
  const [calendario, setCalendario] = useState(' ')

  const onChange = (date, dateString) => {
    // console.log(date, dateString);
  };
  console.log('ID in calender', id);
  const toggleMobileMenu = () => {
    setMenu(!menu);
  };
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
      {
        title: "Test Event 1",
        start: Date.now(),
        end: Date.now(),
        className: "bg-success",
      },
      {
        title: "Test Event 2",
        start: Date.now() + 168000000,
        className: "bg-info",
      },
      {
        title: "Test Event 3",
        start: Date.now() + 338000000,
        className: "bg-primary",
      },
    ];

  const datesToTimestamp = (fecha, hora) => {
    let fecha_obj = new Date(fecha);

    let [horas, minutos, segundos] = hora.split(":").map(Number);
    fecha_obj.setHours(fecha_obj.getHours() + horas, fecha_obj.getMinutes() + minutos, fecha_obj.getSeconds() + segundos);
    return fecha_obj.getTime()
  }

  useEffect(() => {
    const fetchData = async () => {
      // console.log('id', id);
      // const { users: response } = await fetchScheduleByAvailability(id)
      /*  const processed = response.map(item => {
         // detalleServicio y duracionServicio
         return (
           {
             ...item,
             start: new Date(`${item.fechaInicio}T${item.horaIni}`).getTime(),
             end: new Date(`${item.fechaFin}T${item.horaFin}`).getTime(),
             className: "bg-purple",
             title: item.detalleServicio || 'Disponible',
           }
         )
       }) */
      // console.log('RESPONSE', response);
      // const {bloques : servicio2Response} = await fetchScheduleByUser(id)

      // // Función para calcular los intervalos de tiempo
      // function calcularIntervalos(horaInicio, horaFin, duracionServicio, item) {
      //   const intervalos = [];
      //   let horaActual = horaInicio;

      //   while (horaActual <= horaFin) {
      //     const horaFinIntervalo = sumarMinutos(horaActual, duracionServicio);
      //     if (horaFinIntervalo <= horaFin) {
      //       intervalos.push({ ...item, horaInicioServicio: horaActual, horaFinServicio: horaFinIntervalo });
      //       horaActual = horaFinIntervalo;
      //     } else {
      //       break; // Termina el bucle si el intervalo supera la hora de finalización
      //     }
      //   }
      //   return intervalos;
      // }

      // function sumarMinutos(hora, minutos) {
      //   const [horas, minutosInicio] = hora.split(":").map(Number);
      //   const totalMinutos = horas * 60 + minutosInicio + minutos;
      //   const horasResultado = Math.floor(totalMinutos / 60);
      //   const minutosResultado = totalMinutos % 60;
      //   return `${String(horasResultado).padStart(2, '0')}:${String(minutosResultado).padStart(2, '0')}`;
      // }

      // // Función para combinar los resultados
      // function combinarResultados(resultados) {
      //   return resultados.reduce((acumulador, resultado) => {
      //     return acumulador.concat(resultado);
      //   }, []);
      // }

      // // Calculando los intervalos de tiempo para cada usuario
      // const resultadosIndividuales = response.map(usuario => {
      //   return calcularIntervalos(usuario.horaIni, usuario.horaFin, usuario.duracionServicio, usuario);
      // });
      // // console.log('resultadosIndividuales', resultadosIndividuales.flat());
      // // Combinando los resultados individuales en un solo array
      // const intervalosDeTiempo = combinarResultados(resultadosIndividuales.flat());
      // console.log('intervalosDeTiempo', intervalosDeTiempo);
      // // // Filtrando los bloques del segundo servicio que coincidan con los intervalos calculados
      // const bloquesFiltrados = servicio2Response.filter(bloque => {
      //   return intervalosDeTiempo.some(intervalo => {
      //     const [bloqueHoraInicio, bloqueMinutosInicio] = bloque.hora_inicio.split(":").map(Number);
      //     const [bloqueHoraFin, bloqueMinutosFin] = bloque.hora_fin.split(":").map(Number);
      //     const [intervaloHora, intervaloMinutos] = intervalo['horaInicioServicio'].split(":").map(Number);
      //     return (
      //       bloqueHoraInicio === intervaloHora &&
      //       bloqueMinutosInicio === intervaloMinutos &&
      //       bloqueHoraFin <= intervaloHora &&
      //       bloqueMinutosFin <= intervaloMinutos
      //     );
      //   });
      // });
      // console.log('bloquesFiltrados', bloquesFiltrados);



      // const algo = servicio2Response.map(bloque => {
      //   return intervalosDeTiempo.some(intervalo => {
      //     const [bloqueHoraInicio, bloqueMinutosInicio] = bloque.hora_inicio.split(":").map(Number);
      //     const [bloqueHoraFin, bloqueMinutosFin] = bloque.hora_fin.split(":").map(Number);
      //     const [intervaloHora, intervaloMinutos] = intervalo['horaInicioServicio'].split(":").map(Number);
      //     return (
      //       bloqueHoraInicio === intervaloHora &&
      //       bloqueMinutosInicio === intervaloMinutos &&
      //       bloqueHoraFin >= intervaloHora &&
      //       bloqueMinutosFin >= intervaloMinutos
      //     );
      //   });
      // });





      // // Formateando los datos resultantes
      // const resultadoFinal = bloquesFiltrados.map(bloque => ({
      //   horaInicio: bloque.hora_inicio
      // }));

      // console.log('RESULTADO FINAL', resultadoFinal);

      // // const ordered = processed.sort((a, b) => a.start - b.start);
      // // // console.log('ORDERED', ordered)
      // // const bloquesCombinados = ordered.reduce((resultado, bloque) => {
      // //   console.log('BLOQUE', bloque);
      // //   const ultimoBloque = resultado[resultado.length - 1];
      // //   if (ultimoBloque && ultimoBloque.end >= bloque.start) {
      // //     ultimoBloque.end = Math.max(ultimoBloque.end, bloque.end);
      // //   } else {
      // //     resultado.push(bloque);
      // //   }
      // //   return resultado;
      // // }, [])


      // const processed = resultadosIndividuales.map(item => {
      //   // detalleServicio y duracionServicio
      //   return (
      //     {
      //       ...item,
      //       start: new Date(`${item.fechaInicio}T${item.horaIni}`).getTime(),
      //       end: new Date(`${item.fechaFin}T${item.horaFin}`).getTime(),
      //       className: "bg-purple",
      //       title: item.detalleServicio || 'Disponible',
      //     }
      //   )
      // })

      // console.log('bloquesCombinados', bloquesCombinados);
      setCalendario(defaultEvents)
      // setCalendario(resultadoFinal)
    }
    fetchData()
  }, [])

  const handleChange = (date) => {
    setDate(date);
    console.log('HANDLECHANGE', date);
  };
  const addEvent = () => {
    setshowEvents(true);
    console.log('ADD EVENT')
  };
  const categoryHandler = () => {
    setshowCategory(true);
    console.log('CATEGORY HANDLER');
  };

  const handleClose = () => {
    setisnewevent(false);
    setiseditdelete(false);
    setshow(false);
    setshowCategory(false);
    setshowEvents(false);
    setshowmodel(false);
    console.log('HANDLE CLOSE')
  };

  const handleEventClick = (clickInfo) => {
    setiseditdelete(true);
    setevent_title(clickInfo.event.title);
    setcalenderevent(clickInfo.event);
    console.log('HANDLE EVENT CLICK', clickInfo);
  };

  const handleDateSelect = (selectInfo) => {
    setisnewevent(true);
    setaddneweventobj(selectInfo);
    console.log('HANDLE DATE SELECT', selectInfo);
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
    console.log('ON UPDATE MODAL CLOSE');
  };
  const oncreateeventModalClose = () => {
    setevent_title("");
    setisnewevent(false);
    console.log('ON CREATE EVENT MODAL CLOSE');
  };
  const removeevent = () => {
    calenderevent.remove();
    setiseditdelete(false);
    console.log('REMOVE EVENT');
  };
  const clickupdateevent = () => {
    const newArray = calendario;
    for (let i = 0; i < newArray.length; i++) {
      if (newArray[i].id === parseInt(calenderevent.id)) {
        newArray[i].title = event_title;
      }
    }
    setCalendario(newArray);
    setiseditdelete(false);
    console.log('CLICK UPDATE EVENT');
  };

  const handleClick = () => {
    setshow(true);
    console.log('HANDLE CLICK');
  };
  // console.log("showmodel", showmodel);

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
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="card">
                <div className="card-body">
                  <div id="calendar">

                    {calendario === ' ' ? <Carrousel />
                      : calendario.length === 0 ?
                        <FullCalendar
                          windowResize={true}
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
                          editable={true}
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
                          windowResize={true}
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
                          editable={true}
                          selectable={true}
                          selectMirror={true}
                          dayMaxEvents={true}
                          weekends={false}
                          initialEvents={calendario?.length > 0 ? calendario : []} // alternatively, use the `events` setting to fetch from a feed
                          select={handleDateSelect}
                          eventClick={(clickInfo) => handleEventClick(clickInfo)}
                        />

                    }

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
          {/* /Add Event Modal */}
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
                <span aria-hidden="true"></span>
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
    </>
  )
};

export default Calender;
