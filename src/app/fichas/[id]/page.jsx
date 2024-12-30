'use client'
import React, { useState, useEffect } from "react";

import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Link from 'next/link';
import { Accordion, AccordionSummary, AccordionDetails, Alert } from "@mui/material";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'; // Importa el plugin de UTC
import timezone from 'dayjs/plugin/timezone';

import { useSidebar } from "@/context/SidebarContext";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import withAuth from '@/components/withAuth';

import { showRecordById, showRecords } from "@/services/RecordServices";
import { fetchUser } from "@/services/UsersServices";

const FichaAlumno = ({ params }) => {
  const { data: session } = useSession()
  const { setProps } = useSidebar();
  const [records, setRecords] = useState()
  const [patient, setPatient] = useState()
  const [visibleItem, setVisibleItem] = useState(null);

  dayjs.extend(utc);
  dayjs.extend(timezone)

  useEffect(() => {
    setProps({
      id: "menu-item4",
      id1: "menu-items4",
      activeClassName: "activity",
    });
  }, [setProps]);


  const getRecords = async () => {
    try {
      const { entrevista: response } = await showRecords(params.id)
      console.log('response', response)
      setRecords(response)
    } catch (error) {
      console.log(error)
    }
  }

  const getStudent = async () => {
    try {
      const { users: student } = await fetchUser(params.id)
      console.log('student', student)
      setPatient(student[0])
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getRecords()
    getStudent()
  }, [])


  const toggleVisibility = (id) => {
    setVisibleItem(visibleItem === id ? null : id);
  };


  const FormatearFecha = (fechaOriginal) => {
    const fecha = new Date(fechaOriginal);
    const opciones = { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' };
    return fecha.toLocaleDateString('es-ES', opciones).replace(',', ''); // 'Lun, 15/04/2024'
  }

  function toTitleCase(str) {
    return str
      .toLowerCase() // Convertir todo a minúsculas primero
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalizar la primera letra de cada palabra
  }

  return (
    <>
      <div className="sidebar-overlay" data-reff="" style={{ zIndex: 98 }} />
      <div className="main-wrapper mt-5 pt-5">
        <div className="page-wrapper">
          <div className="content">
            {/* Page Header */}
            <div className="page-header">
              <div className="row">
                <div className="col-sm-12">
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="#">Fichas </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="feather-chevron-right">
                        <FeatherIcon icon="chevron-right" />
                      </i>
                    </li>
                    <li className="breadcrumb-item active">Ficha Estudiante</li>
                  </ul>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-12">
                        <div className="form-heading">
                          <h4>Estudiante</h4>
                        </div>
                      </div>

                      {/* Nombre profesional */}
                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="form-group local-forms">
                          <label className="col-md-3 col-form-label">
                            Nombre estudiante
                          </label>
                          <div className="col-md-12">
                            <input
                              type="text"
                              className="form-control"
                              value={`${patient?.nombre} ${patient?.apellido}` || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6 col-xl-6">

                        <div className="form-group local-forms">
                          <label className="col-md-3 col-form-label">
                            Email estudiante
                          </label>
                          <div className="col-md-12">
                            <input
                              type="email"
                              className="form-control"
                              value={patient?.email || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="card-body">

                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header">
                            <div className="col-12">
                              <div className="form-heading">
                                <h4>1. Datos de identificación</h4>
                              </div>
                            </div>
                          </AccordionSummary>
                          <AccordionDetails>
                            <div className="row">

                              <div className="col-12 col-md-6 col-xl-6">
                                <div className="form-group local-forms">
                                  <label>Rut</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    maxLength={12}
                                    minLength={8}
                                    value={patient?.rut || ""}
                                    readOnly
                                  />
                                </div>
                              </div>

                              <div className="col-12 col-md-6 col-xl-6">
                                <div className="form-group local-forms">
                                  <label>Fecha de nacimiento</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={dayjs.utc(patient?.fecha_nacimiento).format('DD-MM-YYYY') || ""}
                                    readOnly
                                  />
                                </div>
                              </div>

                              <div className="col-12 col-md-6 col-xl-6">
                                <div className="form-group local-forms">
                                  <label>Carrera</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={patient?.carrera || ""}
                                    readOnly
                                  />
                                </div>
                              </div>

                              <div className="col-12 col-md-6 col-xl-6">
                                <div className="form-group local-forms">
                                  <label>Año de ingreso</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={patient?.anoIngresoCarrera || ""}
                                    readOnly
                                  />
                                </div>
                              </div>

                              <div className="col-12 col-md-6 col-xl-6">
                                <div className="form-group local-forms">
                                  <label>Edad</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={dayjs().diff(dayjs.utc(patient?.fecha_nacimiento), 'year') || ""}
                                    readOnly
                                  />
                                </div>
                              </div>

                              <div className="col-12 col-md-6 col-xl-6">
                                <div className="form-group local-forms">
                                  <label>Comuna</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={patient?.comuna || ""}
                                    readOnly
                                  />
                                </div>
                              </div>

                              <div className="col-12 col-md-6 col-xl-6">
                                <div className="form-group local-forms">
                                  <label>Teléfono</label>
                                  <div className="input-group">
                                    <div className="input-group-prepend">
                                      <span className="input-group-text">+56</span>
                                    </div>
                                    <input
                                      type="tel"
                                      className="form-control"
                                      maxLength={9}
                                      minLength={9}
                                      value={patient?.telefono || ""}
                                      readOnly
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </AccordionDetails>
                        </Accordion>

                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header">
                            <div className="col-12">
                              <div className="form-heading">
                                <h4>2. Datos de contactos de urgencia</h4>
                              </div>
                            </div>
                          </AccordionSummary>
                          <AccordionDetails>
                            <div className="row">
                              <div className="col-12 col-md-4 col-xl-4">
                                <div className="form-group local-forms">
                                  <label>Nombre y apellido</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    value={patient?.contacto_emergencia1?.nombre || ""}
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div className="col-12 col-md-4 col-xl-4">
                                <div className="form-group local-forms">
                                  <label>Parentesco o relación</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    value={patient?.contacto_emergencia1?.parentesco || ""}
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div className="col-12 col-md-4 col-xl-4">
                                <div className="form-group local-forms">
                                  <label>Teléfono</label>
                                  <div className="input-group">
                                    <div className="input-group-prepend">
                                      <span className="input-group-text">+56</span>
                                    </div>
                                    <input
                                      className="form-control"
                                      type="tel"
                                      value={patient?.contacto_emergencia1?.telefono || ""}
                                      readOnly
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="col-12 col-md-4 col-xl-4">
                                <div className="form-group local-forms">
                                  <label>Nombre y apellido</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    value={patient?.contacto_emergencia2?.nombre || ""}
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div className="col-12 col-md-4 col-xl-4">
                                <div className="form-group local-forms">
                                  <label>Parentesco o relación</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    value={patient?.contacto_emergencia2?.parentesco || ""}
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div className="col-12 col-md-4 col-xl-4">
                                <div className="form-group local-forms">
                                  <label>Teléfono</label>
                                  <div className="input-group">
                                    <div className="input-group-prepend">
                                      <span className="input-group-text">+56</span>
                                    </div>
                                    <input
                                      className="form-control"
                                      type="tel"
                                      value={patient?.contacto_emergencia2?.telefono || ""}
                                      readOnly
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </AccordionDetails>
                        </Accordion>



                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <div className="activity">
                      <div className="activity-box" style={{ contentVisibility: 'auto' }}>
                        <ul className="activity-list">


                          {
                            records && records.map((item, index) => (
                              <li key={item.id_alumno + index}>
                                {/* Fila principal con los datos generales */}
                                <div className="activity-user">
                                  <img data-bs-toggle="tooltip" className="avatar"></img>
                                </div>
                                <div className="activity-content timeline-group-blk">
                                  <div className="timeline-group flex-shrink-0">
                                    <h4>{FormatearFecha(item.fecha)}</h4>
                                  </div>
                                  <div className="comman-activitys flex-grow-1">
                                    <h3>
                                      {item.numero_ficha} {" "}
                                      <span>{toTitleCase(item.profesional_evaluador)}</span>
                                    </h3>
                                    <span>
                                      {" "}
                                      {item.motivo_consulta || 'MOTIVO CONSULTA'}
                                    </span>
                                    <p>{item.observaciones || 'OBSERVACIONES'}</p>
                                    <button
                                      className="btn btn-primary"
                                      onClick={() => toggleVisibility(index)}
                                    >
                                      {visibleItem === index ? "Ocultar detalles" : "Ver más "}
                                    </button>
                                  </div>
                                </div>

                                {/* Mostrar detalles en una tabla cuando el item es visible */}
                                {visibleItem === index && (
                                  <div className="activity-content timeline-group-blk mt-2">
                                    <div className="timeline-group flex-shrink-0"></div>
                                    <div className="comman-activitys flex-grow-1">
                                      {/* Tabla con datos específicos */}

                                      {/* Condición para verificar si es el primer elemento */}
                                      {index === 0 ? (
                                        <>

                                          <table className="table">
                                            <caption style={{ captionSide: "top" }}>Antecedentes sociales y familiares</caption>
                                            <tbody>
                                              <tr>
                                                <td><strong>Financiamiento carrera:</strong></td>
                                                <td style={{ width: '50%' }}>{item.financiamiento_carrera || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Dónde y con quién vives? Relación que tienes con ellos. ¿cómo te llevas con ellos?:</strong></td>
                                                <td>{item.vivienda_situacion_actual || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Tienes labores de cuidador? ¿A quién cuidas?:</strong></td>
                                                <td>{item.labores_cuidador || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿De qué manera financias tus gastos personales?:</strong></td>
                                                <td>{item.financiamiento_gastos_personales || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>En caso de que tuvieses que costear tratamiento externo, quién/es podrían apoyarte económicamente?:</strong></td>
                                                <td>{item.apoyo_economico_tratamiento || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Cuánto crees que podrías pagar para acceder a tratamiento semanalmente?:</strong></td>
                                                <td>{item.pago_tratamiento_semanal || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Te has realizado chequeos de salud durante el último año?:</strong></td>
                                                <td>{item.chequeos_salud_ultimo_ano || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Tienes alguna enfermedad de salud física?:</strong></td>
                                                <td>{item.enfermedad_salud_fisica || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Cuál?:</strong></td>
                                                <td>{item.diagnostico_salud_fisica || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Tienes algún diagnóstico de salud mental?:</strong></td>
                                                <td>{item.enfermedad_salud_mental || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Cuál?:</strong></td>
                                                <td>{item.diagnostico_salud_mental || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Tomas alguna medicación de manera permanente? (salud física y/o salud mental):</strong></td>
                                                <td>{item.medicacion_permanente || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Cuál/es?:</strong></td>
                                                <td>{item.medicacion_permanente_nombres || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Tienes atenciones previas en el departamento de salud mental?:</strong></td>
                                                <td>{item.atenciones_previas_salud_mental || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Has estado en tratamientos previos en salud mental? ¿Cuánto tiempo y de qué tipo?:</strong></td>
                                                <td>{item.tratamientos_previos_salud_mental || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Actualmente estás con algún tratamiento en salud mental?:</strong></td>
                                                <td>{item.tratamiento_actual_salud_mental || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Consumes alcohol?:</strong></td>
                                                <td>{item.consume_alcohol || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Qué tipo?:</strong></td>
                                                <td>{item.tipo_alcohol_consumido || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Frecuencia en que consumes:</strong></td>
                                                <td>{item.frecuencia_consumo_alcohol || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Consumes drogas?:</strong></td>
                                                <td>{item.consume_drogas || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Qué tipo?:</strong></td>
                                                <td>{item.tipo_drogas_consumidas || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Frecuencia en que consumes:</strong></td>
                                                <td>{item.frecuencia_consumo_drogas || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Aplicar escala riesgo suicida:</strong></td>
                                                <td>{item.riesgo_suicida_escala || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Descripción motivo de consulta:</strong></td>
                                                <td>{item.motivo_consulta || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Sintomatología asociada al motivo de consulta:</strong></td>
                                                <td>{item.sintomatologia_motivo_consulta || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Cuál es tu expectativa con respecto a la atención en nuestro departamento?:</strong></td>
                                                <td>{item.expectativas_departamento || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Área de atención de preferencia del/la estudiante:</strong></td>
                                                <td>{item.area_atencion_preferencia || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Es tu primera carrera?:</strong></td>
                                                <td>{item.primera_carrera || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Te sientes satisfecho/a con tu decisión de carrera actual?:</strong></td>
                                                <td>{item.satisfecho_decision_carrera || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Cómo consideras que ha sido tu desempeño hasta ahora?:</strong></td>
                                                <td>{item.desempeno_academico || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Cuál ha sido el principal desafío al que te has enfrentado en la universidad?:</strong></td>
                                                <td>{item.desafio_enfrentado_universidad || "N/A"}</td>
                                              </tr>
                                            </tbody>
                                          </table>

                                          <table className="table">
                                            <caption style={{ captionSide: "top" }}>Redes de apoyo disponibles</caption>
                                            <tbody>
                                              <tr>
                                                <td><strong>¿Cuentas con personas significativas que te apoyen hoy en día? ¿Quiénes son?:</strong></td>
                                                <td style={{ width: '50%' }}>{item.redes_apoyo_personas_significativas || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Área de atención de preferencia del/la estudiante:</strong></td>
                                                <td>{item.tipos_apoyo_actual || "N/A"}</td>
                                              </tr>
                                            </tbody>
                                          </table>

                                          <table className="table">
                                            <caption style={{ captionSide: "top" }}>Intereses y autocuidado</caption>
                                            <tbody>
                                              <tr>
                                                <td><strong>¿Qué tipo de actividades te gusta realizar? ¿Les dedicas tiempo?:</strong></td>
                                                <td style={{ width: '50%' }}>{item.actividades_gustan_realizar || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Tienes espacios de autocuidado? ¿Cómo cuáles?:</strong></td>
                                                <td>{item.espacios_autocuidado || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Dedicas tiempo para descansar? Promedio de horas dedicadas a dormir:</strong></td>
                                                <td>{item.tiempo_descanso_horas_sueno || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>¿Cómo te alimentas? Describe un día de alimentación habitual:</strong></td>
                                                <td>{item.alimentacion_diaria_habitual || "N/A"}</td>
                                              </tr>
                                            </tbody>
                                          </table>

                                          <table className="table">
                                            <caption style={{ captionSide: "top" }}>Evaluación profesional</caption>
                                            <tbody>
                                              <tr>
                                                <td><strong>Modalidad de atención a la cual accede según evaluación:</strong></td>
                                                <td style={{ width: '50%' }}>{item.modalidad_atencion_evaluacion || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Estado de ánimo/ Afectividad (presencia o no de sintomatología asociada a ansiedad/ depresión/ manía, entre otras):</strong></td>
                                                <td>{item.estado_animo_afectividad || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Tipo de pensamiento observado (organizado, desorganizado, obsesivo, entre otros):</strong></td>
                                                <td>{item.tipo_pensamiento_observado || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Detección de posibles condiciones asociadas a déficit cognitivo (TEA, TDHA):</strong></td>
                                                <td>{item.deteccion_condiciones_deficit_cognitivo || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Consciencia de realidad (presencia de delirios, percepción alterada):</strong></td>
                                                <td>{item.consciencia_realidad || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Autoconcepto y autoestima:</strong></td>
                                                <td>{item.autoconcepto_autoestima || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Situaciones de riesgo a nivel relacional:</strong></td>
                                                <td>{item.situaciones_riesgo_relacional || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Situaciones de riesgo a nivel personal:</strong></td>
                                                <td>{item.situaciones_riesgo_personal || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Observaciones:</strong></td>
                                                <td>{item.observaciones || "N/A"}</td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </>
                                      ) : (
                                        <>
                                          <table className="table">
                                            <tbody>
                                              <tr>
                                                <td><strong>Motivo consulta:</strong></td>
                                                <td style={{ width: '50%' }}>{item.motivo_consulta || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Antecedentes generales:</strong></td>
                                                <td>{item.observaciones || "N/A"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Acuerdos:</strong></td>
                                                <td>{item.acuerdos || "N/A"}</td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </>
                                      )}

                                    </div>
                                  </div>
                                )}
                              </li>
                            ))
                          }


                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(FichaAlumno, ['administrador', 'profesional']);
