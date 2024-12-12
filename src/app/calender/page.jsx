'use client'
/* eslint-disable no-const-assign */
/* eslint-disable no-unused-vars */
import { useEffect, useState, forwardRef } from "react";

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";

import { DatePicker } from "antd";
import esLocale from '@fullcalendar/core/locales/es'
import {
  generarHorasMedicas,
} from "@/services/SchedulesServices";
import CalendarSkeleton from "@/components/skeletons/CalendarSkeleton";
import withAuth from '@/components/withAuth';
import CacheHandler from "@/utils/cache-handler";

const cacheHandler = new CacheHandler();

const Calender = forwardRef(({ id, calendario }, calendarRef)  => {
  console.log('calendario', calendario)
  const [menu, setMenu] = useState(false);

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

  const datesToTimestamp = (fecha, hora) => {
    // Combinar fecha y hora en un formato ISO 8601 compatible con `Date`
    const fechaHora = `${fecha} ${hora}`;
    const timestamp = Date.parse(fechaHora); // Obtiene el tiempo en milisegundos
    return timestamp;
  };

  const onChange = (date, dateString) => {
    // console.log(date, dateString);
  };
  // console.log('ID in calender', id);
  const toggleMobileMenu = () => {
    setMenu(!menu);
  };

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
    // setCalendario(newArray);
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

                    {!calendario ? <CalendarSkeleton />
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
                          ref={calendarRef}
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
                          // initialEvents={calendario?.length > 0 ? calendario : []} // alternatively, use the `events` setting to fetch from a feed
                          select={handleDateSelect}
                          eventClick={(clickInfo) => handleEventClick(clickInfo)}
                          events={calendario} 
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
});

// export default Calender;
Calender.displayName = 'Calender';
export default withAuth(Calender, ['alumno', 'profesional', 'administrador']);