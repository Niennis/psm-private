"use client";
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
// import '@/assets/css/style.css'
import { useState, useEffect, useId } from "react";
import Select from "react-select";
import Link from "next/link";
import { useForm, Controller, set } from "react-hook-form";

import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
} from "@mui/material";
import { Modal, Button } from "react-bootstrap";

import {
  fetchUserByEmail,
  fetchUsers,
  fetchUser,
  updateUser,
  darAlta,
} from "@/services/UsersServices";
import {
  fetchAppointments,
  changeStatusAppointment,
  editContact,
  createContact,
} from "@/services/AppointmentsServices";
import { createInterviewRecord, showRecords } from "@/services/RecordServices";
import { fetchProfessionalsAndHybridActive } from "@/utils/getDoctorsWithDespeje";
import { isAssignedToProfessional } from "@/services/DoctorsServices";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SimpleBackdrop from "@/components/Backdrop";

import { useSidebar } from "@/context/SidebarContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import withAuth from "@/components/withAuth";
import CacheHandler from "@/utils/cache-handler";
import {
  carreras,
  tipo_apoyo,
  modalidad,
  area_atencion,
} from "@/utils/selects";
import {
  esFechaValida,
  formatDateToYYYYMMDD,
  normalizarHora,
} from "@/utils/managedata";
import { fetchScheduleByAvailability } from "@/services/SchedulesServices";
import { useUserContext } from "@/context/UserContext";

const AddInterviewRecord = ({ params }) => {
  const { data: session } = useSession();
  const router = useRouter();
  // useAuthorization(['alumno'])

  const [isClicked, setIsClicked] = useState(false);
  const [startTime, setStartTime] = useState();
  const [selectedOption, setSelectedOption] = useState(null);
  const [doctor, setDoctor] = useState([]);
  const [patient, setPatient] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [profesionales, setProfesionales] = useState([]);
  const [menuPortalTarget, setMenuPortalTarget] = useState(null);
  const { selectedUserId } = useUserContext();

  const [success, setSuccess] = useState("initial");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isAlta, setIsAlta] = useState(false);

  const [open, setOpen] = useState(false);
  const { setProps } = useSidebar();

  dayjs.extend(utc);
  dayjs.extend(timezone);

  useEffect(() => {
    setProps({
      id: "menu-item4",
      id1: "menu-items4",
      activeClassName: "add-medical-record",
    });
  }, [setProps]);

  useEffect(() => {
    setMenuPortalTarget(document.body);
  }, []);

  useEffect(() => {
    const checkAssignment = async () => {
      if (!selectedUserId || !session?.user?.id) return;

      const isAssigned = await isAssignedToProfessional(
        selectedUserId,
        session.user.id
      );

      if (session.user.rol != "alumno" && !isAssigned) {
        setSuccess("failAccess");
      }
    };

    checkAssignment();
  }, [selectedUserId, session?.user?.id, session?.user?.rol]);

  const convertirAInputDate = (fechaTexto) => {
    const fecha = dayjs.utc(fechaTexto).tz("America/Santiago", true);
    return fecha.format("YYYY-MM-DD");
  };

  const getData = async () => {
    setIsLoading(true);
    try {
      const responseAppointment = await fetchAppointments();
      const date = responseAppointment.filter(
        (item) => item.id_cita == params.id
      );
      const responsePatient = await fetchUserByEmail(date[0].email_estudiante);
      const { users: response } = await fetchUser(responsePatient.id);
      const { entrevista: records } = await showRecords(date[0].id_paciente);
      const obj = {
        id_alumno: date[0].id_paciente,
        id_profesional: date[0].id_profesional,
        ano_ingreso:
          response[0].anoIngresoCarrera === "No aplica" ||
            response[0].anoIngresoCarrera === null
            ? ""
            : response[0].anoIngresoCarrera,
        apellido: response[0].apellido,
        aplica_despeje: responsePatient.aplica_despeje,
        campus: date[0].campus,
        carrera: response[0].carrera,
        celular_contacto_emergencia1: response[0].contacto_numero,
        comuna: response[0].comuna,
        correo: date[0].email_estudiante,
        direccion: response[0].direccion,
        edad: dayjs().diff(dayjs.utc(responsePatient.fecha_nacimiento), "year"),
        email: date[0].email_estudiante,
        estado: date[0].estado,
        fecha_nacimiento: response[0].fecha_nacimiento
          ? convertirAInputDate(response[0].fecha_nacimiento)
          : "",
        fecha: dayjs(date[0].fecha).format("DD-MM-YYYY"),
        genero: responsePatient.genero,
        hora_cita: normalizarHora(date[0].hora),
        motivo_consulta:
          (date[0]?.primera_cita == 1
            ? date[0]?.motivo
            : records[0]?.motivo_consulta) || "",
        nombre_social: response[0].nombre_social,
        nombre: responsePatient.nombre,
        nombre_completo: !!(
          response[0]?.nombre_social && response[0]?.nombre_social.trim() !== ""
        )
          ? response[0].nombre_social + " " + response[0].apellido
          : response[0].nombre + " " + response[0].apellido,
        // nombre_completo: date[0].nombre_alumno,
        profesional_evaluador: date[0].nombre_profesional,
        region: response[0].region,
        rut: response[0].rut,
        status: responsePatient.status,
        telefono: date[0].telefono_estudiante,
        tipo_usuario: responsePatient.tipo_usuario,
        validacion: date[0].validacion,
        mail_contacto_emergencia1: response[0].contacto1_email,
        id_contacto_emergencia1: response[0].contacto1_id,
        nombre_contacto_emergencia1: response[0].contacto1_nombre,
        celular_contacto_emergencia1: response[0].contacto1_numero,
        parentesco_contacto_emergencia1: response[0].contacto1_relacion,
        mail_contacto_emergencia2: response[0].contacto2_email,
        id_contacto_emergencia2: response[0].contacto2_id,
        nombre_contacto_emergencia2: response[0].contacto2_nombre,
        celular_contacto_emergencia2: response[0].contacto2_numero,
        parentesco_contacto_emergencia2: response[0].contacto2_relacion,
      };
      const ultimoNumeroFicha =
        records.length > 0 ? records[records.length - 1].numero_ficha : 0;
      obj.numero_ficha = parseInt(ultimoNumeroFicha) + 1;

      setPatient(obj);
      setIsLoading(false);
      return obj;
    } catch (error) {
      console.log("Error", error);
    }
  };

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    trigger,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: async () => {
      try {
        const data = await getData();
        return data;
      } catch (error) {
        console.error("Error al cargar datos:", error);
        return { data: [] };
      }
    },
  });

  const fechaNacimiento = watch("fecha_nacimiento");
  useEffect(() => {
    if (fechaNacimiento) {
      setValue("fecha_nacimiento", fechaNacimiento);
      trigger("fecha_nacimiento").then((isValid) => {
        if (isValid) clearErrors("fecha_nacimiento");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fechaNacimiento]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("fechaCita");
      if (savedData) {
        setData(JSON.parse(savedData));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProfessionals = async () => {
    try {
      const response = await fetchProfessionalsAndHybridActive();

      const docs = response.map((doc, i) => {
        return {
          value: i + 2,
          label: doc.nombre + " " + doc.apellido,
          id: doc.id,
          email: doc.email,
          name: doc.nombre,
          // especialidad: doc.especialidad
        };
      });

      if (docs.length > 0) {
        setProfesionales(docs);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };
  const isChecked = watch("derivacion_interna");
  useEffect(() => {
    if (isChecked) {
      getProfessionals();
    } else {
      setValue("profesional_derivacion", null);
    }
    trigger("profesional_derivacion");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChecked]);

  useEffect(() => {
    if (isChecked) {
      getProfessionals();
    }
  }, [isChecked]);

  const derivacion_interna = watch("derivacion_interna");
  const derivacion_externa = watch("derivacion_externa");
  
  /* CITA NORMAL servicio es el mismo que el de despeje, pero se omiten los campos que no se necesitan */
  const handleAppointment = handleSubmit(async (data) => {
    setIsLoading(true);
    setSuccess("initial");
    const patientName = watch("name");
    const patientLastname = watch("lastName");
    const derivacion_interna = watch("derivacion_interna");

    const bodyInterview = {
      ...data,
      observaciones: derivacion_externa ? `${data.observaciones} -Derivado externamente-` : data.observaciones ,
      motivo_consulta: data.motivo_consulta || patient.motivo_consulta || "",
      anoIngresoCarrera: data.ano_ingreso,
      id_receptor: derivacion_interna ? data.profesional_derivacion.id : "",
      id_profesional: session?.user?.id,
      nombre_social: patient.nombre_social,
      patient_id: patient.id_alumno,
      fecha: formatDateToYYYYMMDD(data.fecha),
      fecha_nacimiento: formatDateToYYYYMMDD(data.fecha_nacimiento),
      tipos_apoyo_actual:
        data.tipos_apoyo_actual && data.tipos_apoyo_actual.length > 0
          ? data.tipos_apoyo_actual.map((item) => item.label).toString()
          : "",
      nombre_contacto_emergencia2: "",
      parentesco_contacto_emergencia2: "",
      celular_contacto_emergencia2: "",
      financiamiento_carrera: "",
      vivienda_situacion_actual: "",
      labores_cuidador: "",
      financiamiento_gastos_personales: "",
      financiamiento_carrera: "",
      apoyo_economico_tratamiento: "",
      pago_tratamiento_semanal: "",
      chequeos_salud_ultimo_ano: "",
      motivo_chequeos_salud: "",
      enfermedad_salud_fisica: "",
      medicacion_permanente: "",
      atenciones_previas_salud_mental: "",
      tratamientos_previos_salud_mental: "",
      tratamiento_actual_salud_mental: "",
      consume_alcohol: "",
      tipo_alcohol_consumido: "",
      frecuencia_consumo_alcohol: "",
      consume_drogas: "",
      tipo_drogas_consumidas: "",
      frecuencia_consumo_drogas: "",
      riesgo_suicida_escala: "",
      sintomatologia_motivo_consulta: "",
      expectativas_departamento: "",
      area_atencion_preferencia: "",
      primera_carrera: "",
      satisfecho_decision_carrera: "",
      desempeno_academico: "",
      desafio_enfrentado_universidad: "",
      redes_apoyo_personas_significativas: "",
      tipos_apoyo_actual: "",
      actividades_gustan_realizar: "",
      espacios_autocuidado: "",
      tiempo_descanso_horas_sueno: "",
      alimentacion_diaria_habitual: "",
      modalidad_atencion_evaluacion: "",
      estado_animo_afectividad: "",
      tipo_pensamiento_observado: "",
      deteccion_condiciones_deficit_cognitivo: "",
      consciencia_realidad: "",
      autoconcepto_autoestima: "",
      situaciones_riesgo_relacional: "",
      situaciones_riesgo_personal: "",
      prevision_salud_isapre: "Fonasa",
      prevision_salud_fonasa: "",
      prevision_salud_otro: "",
      id_emergencia: patient.id_contacto_emergencia1 || 0,
      id_emergencia_2: patient.id_contacto_emergencia2 || 0,
    };

    const bodyEstado = {
      id: parseInt(params.id),
      status: isAlta ? "alta" : "realizada",
      id_paciente: patient.id_alumno,
      id_profesional: data.id_profesional,
      appointment_date: data.fecha,
      campus: data.campus,
      carrera: data.carrera,
      email: data.email,
      lastName: data.apellido,
      name: data.nombre,
      selected_doctor: data.profesional_evaluador,
      start_time: normalizarHora(data.hora_cita),
      tipo_cita:
        data.aplica_despeje == 1
          ? "Entrevista de despeje"
          : "Atención con profesional",
    };

    const bodyUpdateUser = {
      apellido: data.lastName || patient.apellido,
      aplica_despeje: 0, // el único q debiera cambiar
      anoIngresoCarrera: data.ano_ingreso || patient.ano_ingreso,
      campus: data.campus || "No aplica",
      comuna: data.comuna || patient.comuna,
      carrera: data.carrera || patient.carrera,
      contrasena: "No aplica",
      direccion: data.direccion || patient.direccion,
      email: data.correo,
      entrevistador: 0,
      fecha_nacimiento:
        formatDateToYYYYMMDD(data.fecha_nacimiento) ||
        formatDateToYYYYMMDD(patient.fecha_nacimiento),
      genero: data.genero || patient.genero,
      id: parseInt(patient.id_alumno),
      jornada: "No aplica",
      mustChangePassword: 0,
      nombre: patient.nombre,
      nombre_social: patient.nombre_social,
      region: data.region || patient.region,
      rut: data.rut || patient.rut || "",
      status: patient.status,
      telefono: data.telefono || patient.telefono,
      tipo_usuario: patient.tipo_usuario,
      id_emergencia: patient.id_contacto_emergencia1 || 0,
      id_emergencia_2: patient.id_contacto_emergencia2 || 0,
    };

    try {
      const appointment = await createInterviewRecord(bodyInterview);
      const changeStatus = await changeStatusAppointment(bodyEstado);
      const updateUserSubmit = await updateUser(bodyUpdateUser);

      if (appointment.estado === false && changeStatus.validacion === false) {
        setSuccess("fail");
      } else {
        setSuccess("success");
      }
    } catch (err) {
      setSuccess("fail");
      if (err.message.includes("Cannot read properties of undefined")) {
        setError(`No se encontró al paciente`);
      }
    } finally {
      setIsLoading(false);
    }
  });

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("-");
    return `${year}-${day}-${month}`;
  };

  const convertDateFormat = (dateString) => {
    const [day, month, year] = dateString.split("-");
    return `${year}-${month}-${day}`;
  };

  /* ------- ENTREVISTA DE DESPEJE ----------- */
  const handleInterview = handleSubmit(async (data, e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess("initial");
    const derivacion_interna = watch("derivacion_interna");
    // setValue('numero_ficha', 1)
    const bodyInterview = {
      ...data,
      observaciones: derivacion_externa ? `${data.observaciones} -Derivado externamente-` : data.observaciones ,
      motivo_consulta: data.motivo_consulta || patient.motivo_consulta || "",
      id_receptor: derivacion_interna ? data.profesionales.id : "",
      id_profesional: session?.user?.id,
      id_alumno: patient.id_alumno,
      fecha: formatDateToYYYYMMDD(data.fecha),
      fecha_nacimiento: formatDateToYYYYMMDD(data.fecha_nacimiento),
      modalidad_atencion_evaluacion:
        data?.modalidad_atencion_evaluacion
          ?.map((obj) => obj.label)
          .join(", ") || "",
      area_atencion_preferencia:
        data?.area_atencion_preferencia?.map((obj) => obj.label).join(", ") ||
        "",
      tipos_apoyo_actual:
        data?.tipos_apoyo_actual?.map((obj) => obj.label).join(", ") || "",
      acuerdos: "",
    };

    const bodyUpdateUser = {
      apellido: data.lastName || patient.apellido,
      aplica_despeje: 0, // el único q debiera cambiar
      anoIngresoCarrera: data.ano_ingreso || patient.ano_ingreso,
      campus: data.campus || "No aplica",
      comuna: data.comuna || patient.comuna,
      carrera: data.carrera || patient.carrera,
      contrasena: "No aplica",
      direccion: data.direccion || patient.direccion,
      email: data.correo,
      entrevistador: 0,
      fecha_nacimiento:
        formatDateToYYYYMMDD(data.fecha_nacimiento) ||
        formatDateToYYYYMMDD(patient.fecha_nacimiento),
      genero: data.genero || patient.genero,
      id: parseInt(patient.id_alumno),
      jornada: "No aplica",
      mustChangePassword: 0,
      nombre: patient.nombre,
      nombre_social: patient.nombre_social,
      region: data.region || patient.region,
      rut: data.rut || patient.rut || "",
      status: patient.status,
      telefono: data.telefono || patient.telefono,
      tipo_usuario: patient.tipo_usuario,
      id_emergencia: patient.id_contacto_emergencia1 || 0,
      id_emergencia_2: patient.id_contacto_emergencia2 || 0,
    };

    const bodyEstado = {
      id: parseInt(params.id),
      status: "realizada",
      id_paciente: patient.id_alumno,
      id_profesional: data.id_profesional,
      appointment_date: data.fecha,
      campus: data.campus,
      carrera: data.carrera,
      email: data.email,
      lastName: data.apellido,
      name: data.nombre,
      selected_doctor: data.profesional_evaluador,
      start_time: normalizarHora(data.hora_cita),
      tipo_cita:
        data.aplica_despeje == 1
          ? "Entrevista de despeje"
          : "Atención con profesional",
      quien_cancela: "",
    };

    const bodyContactOne = {
      nombre:
        data?.nombre_contacto_emergencia1 ||
        patient.nombre_contacto_emergencia1 ||
        "",
      relacion:
        data?.parentesco_contacto_emergencia1 ||
        patient.parentesco_contacto_emergencia1 ||
        "",
      numero:
        data?.celular_contacto_emergencia1 ||
        patient.celular_contacto_emergencia1 ||
        "",
      mail:
        data?.email_contacto_emergencia1 ||
        patient.mail_contacto_emergencia1 ||
        "",
      parentesco:
        data?.parentesco_contacto_emergencia1 ||
        patient.parentesco_contacto_emergencia1 ||
        "",
      id_emergencia: patient.id_contacto_emergencia1 || 0,
    };

    const bodyContactTwo = {
      nombre:
        data?.nombre_contacto_emergencia2 ||
        patient.nombre_contacto_emergencia2 ||
        "",
      relacion:
        data?.parentesco_contacto_emergencia2 ||
        patient.parentesco_contacto_emergencia2 ||
        "",
      numero:
        data?.celular_contacto_emergencia2 ||
        patient.celular_contacto_emergencia2 ||
        "",
      mail:
        data?.email_contacto_emergencia2 ||
        patient.mail_contacto_emergencia2 ||
        "",
      parentesco:
        data?.parentesco_contacto_emergencia2 ||
        patient.parentesco_contacto_emergencia2 ||
        "",
      id_emergencia: patient.id_contacto_emergencia2 || 0,
    };

    let id_contact_1;
    let id_contact_2;

    try {
      const response1 =
        patient.contacto1_id == 0
          ? await createContact(bodyContactOne)
          : await editContact(bodyContactOne);

      const response2 =
        patient.contacto2_id == 0
          ? await createContact(bodyContactTwo)
          : await editContact(bodyContactTwo);

      id_contact_1 =
        patient.contacto1_id == 0
          ? response1.id
          : patient.id_contacto_emergencia1;

      id_contact_2 =
        patient.contacto2_id == 0
          ? response2.id
          : patient.id_contacto_emergencia2;
    } catch (error) {
      console.log(error);
    }

    if (id_contact_1 || id_contact_2) {
      try {
        const [resp, changeStatus, response] = await Promise.all([
          createInterviewRecord(bodyInterview),
          changeStatusAppointment(bodyEstado),
          updateUser(bodyUpdateUser),
        ]);

        if (
          resp.estado === true &&
          changeStatus.validacion === true &&
          response.validacion === true
        ) {
          setSuccess("success");
        } else if (
          resp.estado === true &&
          changeStatus.detalle === "success!!!"
        ) {
          setSuccess("success");
        } else {
          setSuccess("fail");
          setError(resp?.detalle || changeStatus?.detalle || response?.detalle);
        }
      } catch (error) {
        console.log("Error: ", error);
        setSuccess("success");
      } finally {
        setIsLoading(false);
      }
    }
  });

  /*  --- DAR ALTA  ----- */
  const handleAlta = async (e) => {
    e.preventDefault();
    const { users: disponibilidades } = await fetchScheduleByAvailability(
      session?.user?.id
    );

    const selectedHour = disponibilidades.find(
      (item) =>
        item.fechaInicio === convertDateFormat(patient.fecha) &&
        item.horaIni <= data.hora
    );
    const body = {
      profesional_id: session?.user?.id,
      alumno_id: patient.id_alumno,
      fecha: data.fecha,
      hora: data.hora,
    };
    try {
      const response = await darAlta(body);
    } catch (error) {
      console.log("Error", error);
      setSuccess("fail");
    }
  };

  const openWarningWithAlta = async (e) => {
    e.preventDefault();
    setSuccess("citaConAlta");
    setMessage("¿Desea confirmar la alta del servicio?");
    setIsAlta(true);
    const isValid = await trigger();
  };


  const openWarningInterview = async (e) => {
    e.preventDefault();
    setSuccess("despeje");
    
    if (!derivacion_interna && !derivacion_externa) {
      setMessage("No ha seleccionado un tipo de derivación, ¿desea confirmar el envío de datos sin derivar?");
    } else {
      setMessage("¿Desea confirmar el envío de datos?");
    }

    const isValid = await trigger();
  };

  const openWarningAppointment = async (e) => {
    e.preventDefault();
    setSuccess("cita");

    if (!derivacion_interna && !derivacion_externa) {
      setMessage("No ha seleccionado un tipo de derivación, ¿desea confirmar el envío de datos sin derivar?");
    } else {
      setMessage("¿Desea confirmar el envío de datos?");
    }

      const isValid = await trigger();
    };


    const handleClose = () => {
      setSuccess("initial");

      if (success === "failAccess" || !derivacion_interna) {
        router.push("/pacientes");
      } else {
        router.push("/citas/agendarcita");
      }
    };

    return (
      <>
        <div className="sidebar-overlay" data-reff="" style={{ zIndex: 98 }} />
        {isLoading ? (
          <SimpleBackdrop />
        ) : (
          <>
            <div className="page-wrapper">
              <div className="content">
                {/* Page Header */}
                <div className="page-header">
                  <div className="row">
                    <div className="col-sm-12">
                      <ul className="breadcrumb">
                        <li className="breadcrumb-item">
                          <Link href="#">Ficha </Link>
                        </li>
                        <li className="breadcrumb-item">
                          <i className="feather-chevron-right">
                            <FeatherIcon icon="chevron-right" />
                          </i>
                        </li>
                        <li className="breadcrumb-item active">
                          Entrevista de evaluación
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/* /Page Header */}
                <div className="row">
                  <div className="col-sm-12">
                    <div className="card">
                      {patient?.aplica_despeje != 1 ? (
                        /* ----- FORMULARIO CITA NORMAL ------ */
                        <div className="card-body">
                          <h4>Registrar atención</h4>
                          <form>
                            {/* Detalles de la cita */}
                            <div
                              className="row"
                              style={{
                                border: "1px solid lightgrey",
                                borderRadius: "8px",
                                padding: "20px 0 0 0",
                                margin: "10px",
                              }}
                            >
                              <div className="col-12 col-md-6 col-xl-6">
                                <div className="form-group local-forms">
                                  <label>
                                    Profesional que realiza evaluación{" "}
                                    <span className="login-danger">*</span>
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    {...register("profesional_evaluador", {
                                      required: {
                                        value: true,
                                        message: "Profesional es requerido",
                                      },
                                    })}
                                  />
                                  {errors.profesional_evaluador && (
                                    <span className="login-danger">
                                      <small>
                                        {errors.profesional_evaluador.message}
                                      </small>
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="col-12 col-md-6 col-xl-6">
                                <div className="form-group local-forms">
                                  <label>
                                    Fecha <span className="login-danger">*</span>
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    {...register("fecha", {
                                      required: {
                                        value: true,
                                        message: "Fecha es requerida",
                                      },
                                    })}
                                  />
                                  {errors.fecha && (
                                    <span className="login-danger">
                                      <small>{errors.fecha.message}</small>
                                    </span>
                                  )}
                                </div>
                              </div>
                              {/*   <div className="col-12 col-md-4 col-xl-4">
                              <div className="form-group local-forms">
                                <label>
                                  Número de ficha <span className="login-danger">*</span>
                                </label>
                                <input
                                  disabled
                                  className="form-control"
                                  type="text"
                                  {...register('numero_ficha', {
                                    required: {
                                      value: true,
                                      message: 'Número de ficha es requerido'
                                    }
                                  })}
                                />
                                {errors.numero_ficha && <span className="login-danger">
                                  <small>{errors.numero_ficha.message}</small>
                                </span>}
                              </div>
                            </div> */}
                            </div>

                            {/* 1. Datos de identificación */}
                            <Accordion>
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                              >
                                <div className="col-12">
                                  <div className="form-heading">
                                    <h4>1. Datos de identificación</h4>
                                  </div>
                                </div>
                              </AccordionSummary>
                              <AccordionDetails>
                                <div className="row">
                                  <div className="col-12 col-md-12 col-xl-12">
                                    <div className="form-group local-forms">
                                      <label>Nombre completo</label>

                                      <input
                                        disabled
                                        className="form-control"
                                        type="text"
                                        defaultValue={""}
                                        {...register("nombre_completo")}
                                      />
                                      {errors.nombre_completo && (
                                        <span className="login-danger">
                                          <small>
                                            {errors.nombre_completo.message}
                                          </small>
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-12 col-xl-12">
                                    <div className="form-group local-forms">
                                      <label>Rut</label>
                                      <input
                                        disabled={patient?.rut ? true : false}
                                        className="form-control"
                                        type="text"
                                        defaultValue={""}
                                        maxLength={12}
                                        minLength={8}
                                        {...register("rut")}
                                      />
                                      {errors.rut && (
                                        <span className="login-danger">
                                          <small>{errors.rut.message}</small>
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-6 col-xl-6">
                                    <div className="form-group local-forms">
                                      <label>
                                        Carrera{" "}
                                        <span className="login-danger">*</span>
                                      </label>
                                      <Controller
                                        control={control}
                                        name="carrera"
                                        rules={{
                                          validate: (value) => {
                                            if (!value)
                                              return "Carrera es requerida";

                                            if (typeof value === "string") {
                                              return (
                                                carreras.some(
                                                  (opt) =>
                                                    opt.value === value ||
                                                    opt.label === value
                                                ) || "Carrera inválida"
                                              );
                                            }

                                            return value.value || value.label
                                              ? true
                                              : "Carrera inválida";
                                          },
                                        }}
                                        render={({ field }) => {
                                          let selectedCarrera = null;

                                          // Si hay un valor en el paciente que viene de la base de datos
                                          if (patient?.carrera) {
                                            selectedCarrera = carreras.find(
                                              (c) =>
                                                c.label === patient.carrera ||
                                                c.value === patient.carrera
                                            );
                                          }

                                          // Si ya tenemos un valor en el campo del formulario, priorizamos ese
                                          if (field.value) {
                                            if (typeof field.value === "string") {
                                              selectedCarrera = carreras.find(
                                                (c) =>
                                                  c.label === field.value ||
                                                  c.value === field.value
                                              );
                                            } else {
                                              selectedCarrera = field.value;
                                            }
                                          }

                                          const isDisabled =
                                            !!patient?.carrera &&
                                            carreras.some(
                                              (opt) =>
                                                opt.label === patient.carrera ||
                                                opt.value === patient.carrera
                                            );

                                          return (
                                            <Select
                                              instanceId="select-carrera"
                                              value={selectedCarrera}
                                              onChange={(selectedOption) => {
                                                field.onChange(selectedOption);
                                              }}
                                              onBlur={field.onBlur}
                                              options={carreras}
                                              isDisabled={isDisabled}
                                              menuPortalTarget={menuPortalTarget}
                                              styles={{
                                                menuPortal: (base) => ({
                                                  ...base,
                                                  zIndex: 9999,
                                                }),
                                              }}
                                              id="carrera"
                                              components={{
                                                IndicatorSeparator: () => null,
                                              }}
                                              styles={{
                                                control: (baseStyles, state) => ({
                                                  ...baseStyles,
                                                  borderColor: state.isFocused
                                                    ? "none"
                                                    : "2px solid rgba(46, 55, 164, 0.1);",
                                                  boxShadow: state.isFocused
                                                    ? "0 0 0 1px #2e37a4"
                                                    : "none",
                                                  "&:hover": {
                                                    borderColor: state.isFocused
                                                      ? "none"
                                                      : "2px solid rgba(46, 55, 164, 0.1)",
                                                  },
                                                  borderRadius: "10px",
                                                  fontSize: "14px",
                                                  minHeight: "45px",
                                                }),
                                                dropdownIndicator: (
                                                  base,
                                                  state
                                                ) => ({
                                                  ...base,
                                                  transform: state.selectProps
                                                    .menuIsOpen
                                                    ? "rotate(-180deg)"
                                                    : "rotate(0)",
                                                  transition: "250ms",
                                                  width: "35px",
                                                  height: "35px",
                                                }),
                                              }}
                                            />
                                          );
                                        }}
                                      />
                                      {errors.carrera && (
                                        <span className="login-danger">
                                          <small>{errors.carrera.message}</small>
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-6 col-xl-6">
                                    <div className="form-group local-forms">
                                      <label>
                                        Año de ingreso{" "}
                                        <span className="login-danger">*</span>
                                      </label>
                                      <input
                                        disabled={
                                          patient?.ano_ingreso ? true : false
                                        }
                                        className="form-control"
                                        type="text"
                                        defaultValue={""}
                                        {...register("ano_ingreso", {
                                          required: {
                                            value: true,
                                            message:
                                              "Año de ingreso es requerida",
                                          },
                                        })}
                                      />
                                      {errors.ano_ingreso && (
                                        <span className="login-danger">
                                          <small>
                                            {errors.ano_ingreso.message}
                                          </small>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-12 col-md-6 col-xl-6">
                                    <div className="form-group local-forms">
                                      <label>
                                        Fecha de nacimiento{" "}
                                        <span className="login-danger">*</span>
                                      </label>
                                      <input
                                        disabled={esFechaValida(
                                          patient?.fecha_nacimiento
                                        )}
                                        className="form-control datetimepicker"
                                        type="date"
                                        placeholder=""
                                        {...register("fecha_nacimiento", {
                                          required: {
                                            value: true,
                                            message:
                                              "Fecha de nacimiento es requerida",
                                          },
                                        })}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setValue("fecha_nacimiento", value, {
                                            shouldValidate: true,
                                          });
                                        }}
                                      />
                                      {errors.fecha_nacimiento && (
                                        <span className="login-danger">
                                          <small>
                                            {errors.fecha_nacimiento.message}
                                          </small>
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-6 col-xl-6">
                                    <div className="form-group local-forms">
                                      <label>Edad</label>
                                      <input
                                        disabled
                                        className="form-control"
                                        type="text"
                                        defaultValue={""}
                                        {...register("edad")}
                                      />
                                      {errors.edad && (
                                        <span className="login-danger">
                                          <small>{errors.edad.message}</small>
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-12 col-xl-12">
                                    <div className="form-group local-forms">
                                      <label>Dirección</label>
                                      <input
                                        disabled={
                                          patient?.direccion ? true : false
                                        }
                                        className="form-control"
                                        type="text"
                                        defaultValue={""}
                                        {...register("direccion")}
                                      />
                                      {errors.direccion && (
                                        <span className="login-danger">
                                          <small>
                                            {errors.direccion.message}
                                          </small>
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-6 col-xl-6">
                                    <div className="form-group local-forms">
                                      <label>
                                        Correo electrónico{" "}
                                        <span className="login-danger">*</span>
                                      </label>
                                      <input
                                        disabled
                                        className="form-control"
                                        type="email"
                                        defaultValue={""}
                                        {...register("correo", {
                                          required: {
                                            value: true,
                                            message: "Correo es requerido",
                                          },
                                          pattern: {
                                            value:
                                              /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
                                            message: "Correo no es válido",
                                          },
                                        })}
                                      />
                                      {errors.correo && (
                                        <span className="login-danger">
                                          <small>{errors.correo.message}</small>
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-6 col-xl-6">
                                    <div className="form-group local-forms">
                                      <label>
                                        Teléfono{" "}
                                        <span className="login-danger">*</span>
                                      </label>
                                      <div className="input-group">
                                        <div className="input-group-prepend">
                                          <span className="input-group-text">
                                            +56
                                          </span>
                                        </div>
                                        <input
                                          // disabled={patient?.telefono ? true : false}
                                          type="tel"
                                          onKeyDown={(e) => {
                                            // Solo permite números, '+', '-', '(', ')' y teclas de control
                                            if (
                                              !/[0-9+\-()]/.test(e.key) &&
                                              e.key !== "Backspace" &&
                                              e.key !== "Delete"
                                            ) {
                                              e.preventDefault();
                                            }
                                          }}
                                          className="form-control"
                                          defaultValue={""}
                                          {...register("telefono", {
                                            required: {
                                              value: true,
                                              message: "Teléfono es requerido",
                                            },
                                            validate: (value) =>
                                              value.length === 9 ||
                                              "Cantidad de caracteres debe ser igual a 9",
                                          })}
                                          maxLength={9}
                                          minLength={9}
                                        />
                                        {errors.telefono && (
                                          <span className="login-danger">
                                            <small>
                                              {errors.telefono.message}
                                            </small>
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </AccordionDetails>
                            </Accordion>

                            {/* 2. Antecedentes generales */}
                            <Accordion>
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                              >
                                <div className="col-12">
                                  <div className="form-heading">
                                    <h4>
                                      2. Antecedentes Generales{" "}
                                      <span className="login-danger">*</span>
                                    </h4>
                                  </div>
                                </div>
                              </AccordionSummary>
                              <AccordionDetails>
                                <div className="row">
                                  <div className="col-12 col-md-12 col-xl-12">
                                    <div className="form-group local-forms">
                                      <textarea
                                        className="form-control"
                                        rows={2}
                                        cols={30}
                                        defaultValue={""}
                                        style={{ resize: "none" }}
                                        {...register("observaciones", {
                                          required: {
                                            value: true,
                                            message:
                                              "Antecedentes generales es requerido",
                                          },
                                        })}
                                      />
                                      {errors.observaciones && (
                                        <span className="login-danger">
                                          <small>
                                            {errors.observaciones.message}
                                          </small>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </AccordionDetails>
                            </Accordion>

                            {/* 3. Acuerdos */}
                            <Accordion>
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                              >
                                <div className="col-12">
                                  <div className="form-heading">
                                    <h4>
                                      3. Acuerdos{" "}
                                      <span className="login-danger">*</span>
                                    </h4>
                                  </div>
                                </div>
                              </AccordionSummary>
                              <AccordionDetails>
                                <div className="row">
                                  <div className="col-12 col-md-12 col-xl-12">
                                    <div className="form-group local-forms">
                                      <textarea
                                        className="form-control"
                                        rows={4}
                                        cols={30}
                                        defaultValue={""}
                                        style={{ resize: "none" }}
                                        {...register("acuerdos", {
                                          required: {
                                            value: true,
                                            message: "Acuerdos es requerido",
                                          },
                                        })}
                                      />
                                      {errors.acuerdos && (
                                        <span className="login-danger">
                                          <small>{errors.acuerdos.message}</small>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {/* DERIVAR */}
                                <div className="row">
                                  <div className="col-12 col-md-6 col-xl-6">
                                    <div className="form-group select-gender">
                                      <div className="form-check check-tables">
                                        <label className="form-check-label">
                                          <input
                                            type="checkbox"
                                            name="derivacion_interna"
                                            // value="derivacion_interna"
                                            className="form-check-input"
                                            {...register("derivacion_interna")}
                                          // onChange={getProfessionals}
                                          />
                                          Derivación interna
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-12 col-md-6 col-xl-6">
                                    <div className="form-group select-gender">
                                      <div className="form-check check-tables">
                                        <label className="form-check-label">
                                          <input
                                            type="checkbox"
                                            name="derivacion_externa"
                                            // value="derivacion_externa"
                                            className="form-check-input"
                                            {...register("derivacion_externa")}
                                          />
                                          Derivación externa
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                  {isChecked && (
                                    <div className="col-12 col-md-6 col-xl-6">
                                      <Controller
                                        control={control}
                                        name="profesional_derivacion"
                                        rules={{
                                          validate: (value) => {
                                            return isChecked && (!value || !value.id)
                                              ? "Debe seleccionar un profesional"
                                              : true
                                          }
                                        }}
                                        ref={null}
                                        render={({
                                          field: { onChange, onBlur, value, name, ref },
                                          fieldState: { error }
                                        }) => {
                                          return (
                                            <Select
                                              placeholder={
                                                profesionales.length === 0
                                                  ? "Cargando..."
                                                  : "Seleccione..."
                                              }
                                              instanceId="profesionales"
                                              defaultValue={selectedOption}
                                              onChange={(e) => {
                                                onChange(e);
                                                console.log("");
                                              }}
                                              getOptionLabel={(e) => e.label}
                                              options={profesionales}
                                              styles={{
                                                menuPortal: (base) => ({
                                                  ...base,
                                                  zIndex: 9999,
                                                }),
                                              }}
                                              id="profesionales"
                                              components={{
                                                IndicatorSeparator: () => null,
                                              }}
                                              styles={{
                                                control: (baseStyles, state) => ({
                                                  ...baseStyles,
                                                  borderColor: state.isFocused
                                                    ? "none"
                                                    : "2px solid rgba(46, 55, 164, 0.1);",
                                                  boxShadow: state.isFocused
                                                    ? "0 0 0 1px #2e37a4"
                                                    : "none",
                                                  "&:hover": {
                                                    borderColor: state.isFocused
                                                      ? "none"
                                                      : "2px solid rgba(46, 55, 164, 0.1)",
                                                  },
                                                  borderRadius: "10px",
                                                  fontSize: "14px",
                                                  minHeight: "45px",
                                                }),
                                                dropdownIndicator: (
                                                  base,
                                                  state
                                                ) => ({
                                                  ...base,
                                                  transform: state.selectProps
                                                    .menuIsOpen
                                                    ? "rotate(-180deg)"
                                                    : "rotate(0)",
                                                  transition: "250ms",
                                                  width: "35px",
                                                  height: "35px",
                                                }),
                                              }}
                                            />
                                          );
                                        }}
                                      />
                                      {errors.profesional_derivacion && (
                                        <span className="login-danger">
                                          <small>{errors.profesional_derivacion.message}</small>
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </AccordionDetails>
                            </Accordion>

                            <div className="col-12">
                              <div className="doctor-submit text-end mt-3">
                                <button
                                  // type="submit"
                                  className="btn btn-primary btn-success submit-form me-2"
                                  onClick={(e) => {
                                    openWarningWithAlta(e);
                                  }}
                                >
                                  Dar de alta
                                </button>
                                <button
                                  // type="submit"
                                  className="btn btn-primary submit-form me-2"
                                  onClick={(e) => {
                                    openWarningAppointment(e);
                                  }}
                                >
                                  Registrar cita
                                </button>
                                <Link href={"/pacientes"}>
                                  <button
                                    type="reset"
                                    className="btn btn-primary cancel-form"
                                  >
                                    Cancelar
                                  </button>
                                </Link>
                              </div>
                            </div>
                          </form>
                        </div>
                      ) : (
                        /* ----- FORMULARIO ENTREVISTA DE DESPEJE ------ */
                        <div className="card-body">
                          <h4>Entrevista de evaluación</h4>
                          <form>
                            {/* Detalles de la cita */}

                            <div
                              className="row"
                              style={{
                                border: "1px solid lightgrey",
                                borderRadius: "8px",
                                padding: "20px 0 0 0",
                                margin: "10px",
                              }}
                            >
                              <div className="col-12 col-md-6 col-xl-6">
                                <div className="form-group local-forms">
                                  <label>
                                    Profesional que realiza evaluación{" "}
                                    <span className="login-danger">*</span>
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    {...register("profesional_evaluador")}
                                  />
                                </div>
                              </div>
                              <div className="col-12 col-md-6 col-xl-6">
                                <div className="form-group local-forms">
                                  <label>
                                    Fecha <span className="login-danger">*</span>
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    {...register("fecha", {
                                      required: {
                                        value: true,
                                        message: "Fecha es requerida",
                                      },
                                    })}
                                  />
                                  {errors.fecha && (
                                    <span className="login-danger">
                                      <small>{errors.fecha.message}</small>
                                    </span>
                                  )}
                                </div>
                              </div>
                              {/*  <div className="col-12 col-md-4 col-xl-4">
                              <div className="form-group local-forms">
                                <label>
                                  Número de ficha <span className="login-danger">*</span>
                                </label>
                                <input
                                  className="form-control"
                                  disabled
                                  value={1}
                                  type="text"
                                  {...register('numero_ficha', {
                                    required: {
                                      value: true,
                                      message: 'Número de ficha es requerido'
                                    }
                                  })}
                                />
                                {errors.numero_ficha && <span className="login-danger">
                                  <small>{errors.numero_ficha.message}</small>
                                </span>}
                              </div>
                            </div> */}
                            </div>

                            {/* 1. Datos de identificación */}
                            <Accordion>
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                              >
                                <div className="col-12">
                                  <div className="form-heading">
                                    <h4>1. Datos de identificación</h4>
                                  </div>
                                </div>
                              </AccordionSummary>
                              <AccordionDetails>
                                <div className="row">
                                  <div className="col-12 col-md-12 col-xl-12">
                                    <div className="form-group local-forms">
                                      <label>Nombre completo</label>
                                      {/* <select className="select form-control" name="cars" id="cars">
                              {
                                patients.map(patient => (
                                  <option
                                    value={`${patient.nombre} ${patient.apellido}`}
                                    key={patient.id}>{patient.nombre} {patient.apellido}
                                  </option>
                                ))
                              }
                            </select> */}
                                      <input
                                        disabled
                                        className="form-control"
                                        type="text"
                                        defaultValue={""}
                                        {...register("nombre_completo")}
                                      />
                                      {errors.nombre_completo && (
                                        <span className="login-danger">
                                          <small>
                                            {errors.nombre_completo.message}
                                          </small>
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-12 col-xl-12">
                                    <div className="form-group local-forms">
                                      <label>Rut</label>
                                      <input
                                        disabled={patient?.rut ? true : false}
                                        className="form-control"
                                        type="text"
                                        defaultValue={""}
                                        maxLength={12}
                                        minLength={8}
                                        {...register("rut")}
                                      />
                                      {errors.rut && (
                                        <span className="login-danger">
                                          <small>{errors.rut.message}</small>
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-6 col-xl-6">
                                    <div className="form-group local-forms">
                                      <label>
                                        Carrera{" "}
                                        <span className="login-danger">*</span>
                                      </label>
                                      <Controller
                                        control={control}
                                        name="carrera"
                                        rules={{
                                          validate: (value) => {
                                            if (!value)
                                              return "Carrera es requerida";

                                            if (typeof value === "string") {
                                              return (
                                                carreras.some(
                                                  (opt) =>
                                                    opt.value === value ||
                                                    opt.label === value
                                                ) || "Carrera inválida"
                                              );
                                            }

                                            return value.value || value.label
                                              ? true
                                              : "Carrera inválida";
                                          },
                                        }}
                                        render={({ field }) => {
                                          let selectedCarrera = null;

                                          // Si hay un valor en el paciente que viene de la base de datos
                                          if (patient?.carrera) {
                                            selectedCarrera = carreras.find(
                                              (c) =>
                                                c.label === patient.carrera ||
                                                c.value === patient.carrera
                                            );
                                          }

                                          // Si ya tenemos un valor en el campo del formulario, priorizamos ese
                                          if (field.value) {
                                            if (typeof field.value === "string") {
                                              selectedCarrera = carreras.find(
                                                (c) =>
                                                  c.label === field.value ||
                                                  c.value === field.value
                                              );
                                            } else {
                                              selectedCarrera = field.value;
                                            }
                                          }

                                          const isDisabled =
                                            !!patient?.carrera &&
                                            carreras.some(
                                              (opt) =>
                                                opt.label === patient.carrera ||
                                                opt.value === patient.carrera
                                            );

                                          return (
                                            <Select
                                              instanceId="select-carrera"
                                              value={selectedCarrera}
                                              onChange={(selectedOption) => {
                                                field.onChange(selectedOption);
                                              }}
                                              onBlur={field.onBlur}
                                              options={carreras}
                                              isDisabled={isDisabled}
                                              menuPortalTarget={menuPortalTarget}
                                              styles={{
                                                menuPortal: (base) => ({
                                                  ...base,
                                                  zIndex: 9999,
                                                }),
                                              }}
                                              id="carrera"
                                              components={{
                                                IndicatorSeparator: () => null,
                                              }}
                                              styles={{
                                                control: (baseStyles, state) => ({
                                                  ...baseStyles,
                                                  borderColor: state.isFocused
                                                    ? "none"
                                                    : "2px solid rgba(46, 55, 164, 0.1);",
                                                  boxShadow: state.isFocused
                                                    ? "0 0 0 1px #2e37a4"
                                                    : "none",
                                                  "&:hover": {
                                                    borderColor: state.isFocused
                                                      ? "none"
                                                      : "2px solid rgba(46, 55, 164, 0.1)",
                                                  },
                                                  borderRadius: "10px",
                                                  fontSize: "14px",
                                                  minHeight: "45px",
                                                }),
                                                dropdownIndicator: (
                                                  base,
                                                  state
                                                ) => ({
                                                  ...base,
                                                  transform: state.selectProps
                                                    .menuIsOpen
                                                    ? "rotate(-180deg)"
                                                    : "rotate(0)",
                                                  transition: "250ms",
                                                  width: "35px",
                                                  height: "35px",
                                                }),
                                              }}
                                            />
                                          );
                                        }}
                                      />
                                      {errors.carrera && (
                                        <span className="login-danger">
                                          <small>{errors.carrera.message}</small>
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-6 col-xl-6">
                                    <div className="form-group local-forms">
                                      <label>
                                        Año de ingreso{" "}
                                        <span className="login-danger">*</span>
                                      </label>
                                      <input
                                        disabled={
                                          patient?.ano_ingreso ? true : false
                                        }
                                        className="form-control"
                                        type="text"
                                        defaultValue={""}
                                        {...register("ano_ingreso", {
                                          required: {
                                            value: true,
                                            message:
                                              "Año de ingreso es requerida",
                                          },
                                        })}
                                      />
                                      {errors.ano_ingreso && (
                                        <span className="login-danger">
                                          <small>
                                            {errors.ano_ingreso.message}
                                          </small>
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-6 col-xl-6">
                                    <div className="form-group local-forms">
                                      <label>
                                        Fecha de nacimiento{" "}
                                        <span className="login-danger">*</span>
                                      </label>
                                      <input
                                        disabled={esFechaValida(
                                          patient?.fecha_nacimiento
                                        )}
                                        className="form-control datetimepicker"
                                        type="date"
                                        placeholder=""
                                        {...register("fecha_nacimiento", {
                                          required: {
                                            value: true,
                                            message:
                                              "Fecha de nacimiento es requerida",
                                          },
                                        })}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setValue("fecha_nacimiento", value, {
                                            shouldValidate: true,
                                          });
                                        }}
                                      />
                                      {errors.fecha_nacimiento && (
                                        <span className="login-danger">
                                          <small>
                                            {errors.fecha_nacimiento.message}
                                          </small>
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-6 col-xl-6">
                                    <div className="form-group local-forms">
                                      <label>Edad</label>
                                      <input
                                        disabled
                                        className="form-control"
                                        type="text"
                                        defaultValue={""}
                                        {...register("edad")}
                                      />
                                      {errors.edad && (
                                        <span className="login-danger">
                                          <small>{errors.edad.message}</small>
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-12 col-xl-12">
                                    <div className="form-group local-forms">
                                      <label>Dirección</label>
                                      <input
                                        disabled={
                                          patient?.direccion ? true : false
                                        }
                                        className="form-control"
                                        type="text"
                                        defaultValue={""}
                                        {...register("direccion")}
                                      />
                                      {errors.direccion && (
                                        <span className="login-danger">
                                          <small>
                                            {errors.direccion.message}
                                          </small>
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-6 col-xl-6">
                                    <div className="form-group local-forms">
                                      <label>
                                        Correo electrónico{" "}
                                        <span className="login-danger">*</span>
                                      </label>
                                      <input
                                        disabled
                                        className="form-control"
                                        type="email"
                                        defaultValue={""}
                                        {...register("correo", {
                                          required: {
                                            value: true,
                                            message: "Correo es requerido",
                                          },
                                          pattern: {
                                            value:
                                              /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
                                            message: "Correo no es válido",
                                          },
                                        })}
                                      />
                                      {errors.correo && (
                                        <span className="login-danger">
                                          <small>{errors.correo.message}</small>
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-6 col-xl-6">
                                    <div className="form-group local-forms">
                                      <label>
                                        Teléfono{" "}
                                        <span className="login-danger">*</span>
                                      </label>
                                      <div className="input-group">
                                        <div className="input-group-prepend">
                                          <span className="input-group-text">
                                            +56
                                          </span>
                                        </div>
                                        <input
                                          // disabled={patient?.telefono ? true : false}
                                          className="form-control"
                                          type="tel"
                                          onKeyDown={(e) => {
                                            // Solo permite números, '+', '-', '(', ')' y teclas de control
                                            if (
                                              !/[0-9+\-()]/.test(e.key) &&
                                              e.key !== "Backspace" &&
                                              e.key !== "Delete"
                                            ) {
                                              e.preventDefault();
                                            }
                                          }}
                                          defaultValue={""}
                                          {...register("telefono", {
                                            required: {
                                              value: false,
                                            },
                                            validate: (value) =>
                                              value.length === 9 ||
                                              "Cantidad de caracteres debe ser igual a 9",
                                          })}
                                          maxLength={9}
                                          minLength={9}
                                        />
                                        {errors.telefono && (
                                          <span className="login-danger">
                                            <small>
                                              {errors.telefono.message}
                                            </small>
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </AccordionDetails>
                            </Accordion>

                            {/* 2. Datos de contactos de urgencia */}
                            <Accordion>
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                              >
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
                                      <label>
                                        Nombre y apellido{" "}
                                        <span className="login-danger">*</span>
                                      </label>
                                      <input
                                        className="form-control"
                                        type="text"
                                        {...register(
                                          "nombre_contacto_emergencia1",
                                          {
                                            required: {
                                              value: true,
                                              message:
                                                "Nombre de contacto es requerido",
                                            },
                                          }
                                        )}
                                      />
                                      {errors.nombre_contacto_emergencia1 && (
                                        <span className="login-danger">
                                          <small>
                                            {
                                              errors.nombre_contacto_emergencia1
                                                .message
                                            }
                                          </small>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-12 col-md-4 col-xl-4">
                                    <div className="form-group local-forms">
                                      <label>
                                        Parentesco o relación{" "}
                                        <span className="login-danger">*</span>
                                      </label>
                                      <input
                                        className="form-control"
                                        type="text"
                                        {...register(
                                          "parentesco_contacto_emergencia1",
                                          {
                                            required: {
                                              value: true,
                                              message:
                                                "Parentesco de contacto es requerido",
                                            },
                                          }
                                        )}
                                      />
                                      {errors.parentesco_contacto_emergencia1 && (
                                        <span className="login-danger">
                                          <small>
                                            {
                                              errors
                                                .parentesco_contacto_emergencia1
                                                .message
                                            }
                                          </small>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-12 col-md-4 col-xl-4">
                                    <div className="form-group local-forms">
                                      <label>
                                        Teléfono{" "}
                                        <span className="login-danger">*</span>
                                      </label>
                                      <div className="input-group">
                                        <div className="input-group-prepend">
                                          <span className="input-group-text">
                                            +56
                                          </span>
                                        </div>
                                        <input
                                          className="form-control"
                                          type="tel"
                                          onKeyDown={(e) => {
                                            // Solo permite números, '+', '-', '(', ')' y teclas de control
                                            if (
                                              !/[0-9+\-()]/.test(e.key) &&
                                              e.key !== "Backspace" &&
                                              e.key !== "Delete"
                                            ) {
                                              e.preventDefault();
                                            }
                                          }}
                                          {...register(
                                            "celular_contacto_emergencia1",
                                            {
                                              required: {
                                                value: true,
                                                message:
                                                  "Número de contacto es requerido",
                                              },
                                              validate: (value) =>
                                                value.length === 9 ||
                                                "Cantidad de caracteres debe ser igual a 9",
                                            }
                                          )}
                                          maxLength={9}
                                          minLength={9}
                                        />
                                      </div>
                                      {errors.celular_contacto_emergencia1 && (
                                        <span className="login-danger">
                                          <small>
                                            {
                                              errors.celular_contacto_emergencia1
                                                .message
                                            }
                                          </small>
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-4 col-xl-4">
                                    <div className="form-group local-forms">
                                      <label>Nombre y apellido</label>
                                      <input
                                        className="form-control"
                                        type="text"
                                        {...register(
                                          "nombre_contacto_emergencia2"
                                        )}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-12 col-md-4 col-xl-4">
                                    <div className="form-group local-forms">
                                      <label>Parentesco o relación</label>
                                      <input
                                        className="form-control"
                                        type="text"
                                        {...register(
                                          "parentesco_contacto_emergencia2"
                                        )}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-12 col-md-4 col-xl-4">
                                    <div className="form-group local-forms">
                                      <label>Teléfono</label>
                                      <div className="input-group">
                                        <div className="input-group-prepend">
                                          <span className="input-group-text">
                                            +56
                                          </span>
                                        </div>
                                        <input
                                          className="form-control"
                                          type="tel"
                                          onKeyDown={(e) => {
                                            // Solo permite números, '+', '-', '(', ')' y teclas de control
                                            if (
                                              !/[0-9+\-()]/.test(e.key) &&
                                              e.key !== "Backspace" &&
                                              e.key !== "Delete"
                                            ) {
                                              e.preventDefault();
                                            }
                                          }}
                                          {...register(
                                            "celular_contacto_emergencia2",
                                            {
                                              required: { value: false },
                                              validate: (value) =>
                                                value.length === 9 ||
                                                value.length === 0 ||
                                                "Cantidad de caracteres debe ser igual a 9",
                                            }
                                          )}
                                          maxLength={9}
                                          minLength={0}
                                        />
                                      </div>
                                      {errors.celular_contacto_emergencia2 && (
                                        <span className="login-danger">
                                          <small>
                                            {
                                              errors.celular_contacto_emergencia2
                                                .message
                                            }
                                          </small>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </AccordionDetails>
                            </Accordion>

                            {/* 3. Motivo de consulta */}
                            <Accordion>
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                              >
                                <div className="col-12">
                                  <div className="form-heading">
                                    <h4>3. Motivo de consulta</h4>
                                  </div>
                                </div>
                              </AccordionSummary>
                              <AccordionDetails>
                                <div className="row">
                                  <div className="col-12 col-md-12 col-xl-12">
                                    <div className="form-group local-forms">
                                      <label>
                                        Descripción motivo de consulta
                                      </label>
                                      <input
                                        className="form-control"
                                        type="text"
                                        {...register("motivo_consulta")}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-12 col-md-12 col-xl-12">
                                    <div className="form-group local-forms">
                                      <label>
                                        Sintomatología asociada al motivo de
                                        consulta
                                      </label>
                                      <input
                                        className="form-control"
                                        type="text"
                                        {...register(
                                          "sintomatologia_motivo_consulta"
                                        )}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-12 col-md-12 col-xl-12">
                                    <div className="form-group local-forms">
                                      <label>
                                        ¿Cuál es tu expectativa con respecto a la
                                        atención en nuestro departamento?
                                      </label>
                                      <input
                                        className="form-control"
                                        // value={rut}
                                        type="text"
                                        {...register("expectativas_departamento")}
                                      />
                                    </div>
                                    <div className="col-12 col-md-12 col-xl-12">
                                      <div className="form-group local-forms">
                                        <label>
                                          Área de atención de preferencia del/la
                                          estudiante
                                          <span className="login-danger">*</span>
                                        </label>
                                        <Controller
                                          control={control}
                                          defaultValue={null} // evita que lo exija
                                          rules={{ required: false }}
                                          name="area_atencion_preferencia"
                                          render={({
                                            field: { onChange, onBlur, value },
                                          }) => (
                                            <Select
                                              isMulti
                                              instanceId="area_atencion_preferencia"
                                              value={value || []} // convierte null o undefined a array vacío
                                              onChange={onChange}
                                              options={area_atencion}
                                              // menuPortalTarget={document.body}
                                              styles={{
                                                menuPortal: (base) => ({
                                                  ...base,
                                                  zIndex: 9999,
                                                }),
                                              }}
                                              id="area_atencion_preferencia"
                                              components={{
                                                IndicatorSeparator: () => null,
                                              }}
                                              styles={{
                                                control: (baseStyles, state) => ({
                                                  ...baseStyles,
                                                  borderColor: state.isFocused
                                                    ? "none"
                                                    : "2px solid rgba(46, 55, 164, 0.1);",
                                                  boxShadow: state.isFocused
                                                    ? "0 0 0 1px #2e37a4"
                                                    : "none",
                                                  "&:hover": {
                                                    borderColor: state.isFocused
                                                      ? "none"
                                                      : "2px solid rgba(46, 55, 164, 0.1)",
                                                  },
                                                  borderRadius: "10px",
                                                  fontSize: "14px",
                                                  minHeight: "45px",
                                                }),
                                                dropdownIndicator: (
                                                  base,
                                                  state
                                                ) => ({
                                                  ...base,
                                                  transform: state.selectProps
                                                    .menuIsOpen
                                                    ? "rotate(-180deg)"
                                                    : "rotate(0)",
                                                  transition: "250ms",
                                                  width: "35px",
                                                  height: "35px",
                                                }),
                                              }}
                                            />
                                          )}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </AccordionDetails>
                            </Accordion>

                            {/* 4. Antecedentes sociales y familiares */}
                            <Accordion>
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                              >
                                <div className="col-12">
                                  <div className="form-heading">
                                    <h4>4. Antecedentes sociales y familiares</h4>
                                  </div>
                                </div>
                              </AccordionSummary>
                              <AccordionDetails>
                                <div className="row">
                                  <div className="col-12 col-md-12 col-xl-12">
                                    <div className="form-group select-gender">
                                      <label>Financiamiento carrera </label>
                                      <div className="form-check-inline">
                                        <label className="form-check-label">
                                          <input
                                            type="radio"
                                            name="financiamiento_carrera"
                                            value="gratuidad"
                                            className="form-check-input"
                                            {...register(
                                              "financiamiento_carrera"
                                            )}
                                          />
                                          Gratuidad
                                        </label>
                                      </div>
                                      <div className="form-check-inline">
                                        <label className="form-check-label">
                                          <input
                                            type="radio"
                                            name="financiamiento_carrera"
                                            value="beca"
                                            className="form-check-input"
                                            {...register(
                                              "financiamiento_carrera"
                                            )}
                                          />
                                          Beca
                                        </label>
                                      </div>
                                      <div className="form-check-inline">
                                        <label className="form-check-label">
                                          <input
                                            type="radio"
                                            name="financiamiento_carrera"
                                            value="credito"
                                            className="form-check-input"
                                            {...register(
                                              "financiamiento_carrera"
                                            )}
                                          />
                                          Crédito
                                        </label>
                                      </div>
                                      <div className="form-check-inline">
                                        <label className="form-check-label">
                                          <input
                                            type="radio"
                                            name="financiamiento_carrera"
                                            value="sin beneficio"
                                            className="form-check-input"
                                            {...register(
                                              "financiamiento_carrera"
                                            )}
                                          />
                                          Sin beneficio
                                        </label>
                                      </div>
                                      {errors.financiamiento_carrera && (
                                        <span className="login-danger">
                                          <small>
                                            {
                                              errors.financiamiento_carrera
                                                .message
                                            }
                                          </small>
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-12 col-xl-12">
                                    <div className="form-group local-forms">
                                      <label>
                                        ¿Dónde y con quién vives? Relación que
                                        tienes con ellos. ¿cómo te llevas con
                                        ellos?
                                      </label>

                                      <textarea
                                        className="form-control"
                                        rows={3}
                                        cols={30}
                                        defaultValue={""}
                                        style={{ resize: "none" }}
                                        {...register("vivienda_situacion_actual")}
                                      />
                                      {errors.vivienda_situacion_actual && (
                                        <span className="login-danger">
                                          <small>
                                            {
                                              errors.vivienda_situacion_actual
                                                .message
                                            }
                                          </small>
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-12 col-xl-12">
                                    <div className="form-group local-forms">
                                      <label>
                                        ¿Tienes labores de cuidador? ¿A quién
                                        cuidas?
                                      </label>

                                      <textarea
                                        className="form-control"
                                        rows={3}
                                        cols={30}
                                        defaultValue={""}
                                        style={{ resize: "none" }}
                                        {...register("labores_cuidador")}
                                      />
                                      {errors.labores_cuidador && (
                                        <span className="login-danger">
                                          <small>
                                            {errors.labores_cuidador.message}
                                          </small>
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-12 col-xl-12">
                                    <div className="form-group local-forms">
                                      <label>
                                        ¿De qué manera financias tus gastos
                                        personales?
                                      </label>
                                      <textarea
                                        className="form-control"
                                        rows={3}
                                        cols={30}
                                        defaultValue={""}
                                        style={{ resize: "none" }}
                                        {...register(
                                          "financiamiento_gastos_personales"
                                        )}
                                      />
                                      {errors.financiamiento_gastos_personales && (
                                        <span className="login-danger">
                                          <small>
                                            {
                                              errors
                                                .financiamiento_gastos_personales
                                                .message
                                            }
                                          </small>
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-12 col-xl-12">
                                    <div className="form-group local-forms">
                                      <label>
                                        En caso de que tuvieses que costear
                                        tratamiento externo, quién/es podrían
                                        apoyarte económicamente?
                                      </label>
                                      <input
                                        className="form-control"
                                        type="text"
                                        defaultValue={""}
                                        {...register(
                                          "apoyo_economico_tratamiento"
                                        )}
                                      />
                                      {errors.apoyo_economico_tratamiento && (
                                        <span className="login-danger">
                                          <small>
                                            {
                                              errors.apoyo_economico_tratamiento
                                                .message
                                            }
                                          </small>
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-12 col-xl-12">
                                    <div className="form-group local-forms">
                                      <label>
                                        ¿Cuánto crees que podrías pagar para
                                        acceder a tratamiento semanalmente?
                                      </label>
                                      <input
                                        className="form-control"
                                        type="text"
                                        defaultValue={""}
                                        {...register("pago_tratamiento_semanal")}
                                      />
                                      {errors.pago_tratamiento_semanal && (
                                        <span className="login-danger">
                                          <small>
                                            {
                                              errors.pago_tratamiento_semanal
                                                .message
                                            }
                                          </small>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </AccordionDetails>
                            </Accordion>

                            {/* 5. Antecedentes de salud */}
                            <Accordion>
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                              >
                                <div className="col-12">
                                  <div className="form-heading">
                                    <h4>5. Antecedentes de salud</h4>
                                  </div>
                                </div>
                              </AccordionSummary>
                              <AccordionDetails>
                                <div className="row">
                                  <div className="col-12 col-md-12 col-xl-12">
                                    <label>
                                      ¿Te has realizado chequeos de salud durante
                                      el último año?{" "}
                                    </label>
                                    <div className="form-group select-gender">
                                      <div className="form-check-inline col-2 col-md-1 col-xl-1">
                                        <label className="form-check-label">
                                          <input
                                            type="radio"
                                            value="si"
                                            name="chequeos_salud_ultimo_ano"
                                            className="form-check-input"
                                            {...register(
                                              "chequeos_salud_ultimo_ano"
                                            )}
                                          />
                                          Sí
                                        </label>
                                      </div>
                                      <div className="form-check-inline col-6 col-md-2 col-xl-2">
                                        <label className="form-check-label">
                                          <input
                                            type="radio"
                                            value="no"
                                            name="chequeos_salud_ultimo_ano"
                                            className="form-check-input"
                                            {...register(
                                              "chequeos_salud_ultimo_ano"
                                            )}
                                          />
                                          No / No recuerdo
                                        </label>
                                      </div>
                                      <div
                                        className="form-check-inline col-8"
                                        style={{ display: "inline-flex" }}
                                      >
                                        <label className="form-check-label">
                                          Motivo
                                        </label>
                                        <textarea
                                          className="form-control"
                                          rows={1}
                                          cols={30}
                                          defaultValue={""}
                                          style={{ resize: "none" }}
                                          {...register("motivo_chequeos_salud")}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-12 col-xl-12">
                                    <label>
                                      ¿Tienes alguna enfermedad de salud física?
                                    </label>
                                    <div className="form-group select-gender">
                                      <div className="form-check-inline col-2 col-md-1 col-xl-1">
                                        <label className="form-check-label">
                                          <input
                                            type="radio"
                                            value="si"
                                            name="enfermedad_salud_fisica"
                                            className="form-check-input"
                                            {...register(
                                              "enfermedad_salud_fisica"
                                            )}
                                          />
                                          Sí
                                        </label>
                                      </div>
                                      <div className="form-check-inline col-6 col-md-2 col-xl-2">
                                        <label className="form-check-label">
                                          <input
                                            type="radio"
                                            value="no"
                                            name="enfermedad_salud_fisica"
                                            className="form-check-input"
                                            {...register(
                                              "enfermedad_salud_fisica"
                                            )}
                                          />
                                          No / No sé
                                        </label>
                                      </div>
                                      <div
                                        className="form-check-inline col-8"
                                        style={{ display: "inline-flex" }}
                                      >
                                        <label className="form-check-label">
                                          ¿Cuál?
                                        </label>
                                        <textarea
                                          className="form-control"
                                          rows={1}
                                          cols={30}
                                          defaultValue={""}
                                          style={{ resize: "none" }}
                                          {...register(
                                            "diagnostico_salud_fisica"
                                          )}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-12 col-xl-12">
                                    <label>
                                      ¿Tienes algún diagnóstico de salud mental?
                                    </label>
                                    <div className="form-group select-gender">
                                      <div className="form-check-inline col-2 col-md-1 col-xl-1">
                                        <label className="form-check-label">
                                          <input
                                            type="radio"
                                            value="si"
                                            name="enfermedad_salud_mental"
                                            className="form-check-input"
                                            {...register(
                                              "enfermedad_salud_mental"
                                            )}
                                          />
                                          Sí
                                        </label>
                                      </div>
                                      <div className="form-check-inline col-6 col-md-2 col-xl-2">
                                        <label className="form-check-label">
                                          <input
                                            type="radio"
                                            value="no"
                                            name="enfermedad_salud_mental"
                                            className="form-check-input"
                                            {...register(
                                              "enfermedad_salud_mental"
                                            )}
                                          />
                                          No
                                        </label>
                                      </div>
                                      <div
                                        className="form-check-inline col-8"
                                        style={{ display: "inline-flex" }}
                                      >
                                        <label className="form-check-label">
                                          ¿Cuál?
                                        </label>
                                        <textarea
                                          className="form-control"
                                          rows={1}
                                          cols={30}
                                          defaultValue={""}
                                          style={{ resize: "none" }}
                                          {...register(
                                            "diagnostico_salud_mental"
                                          )}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-12 col-xl-12">
                                    <label>
                                      ¿Tomas alguna medicación de manera
                                      permanente? (salud física y/o salud mental)
                                    </label>
                                    <div className="form-group select-gender">
                                      <div className="form-check-inline col-2 col-md-1 col-xl-1">
                                        <label className="form-check-label">
                                          <input
                                            type="radio"
                                            value="si"
                                            name="medicacion_permanente"
                                            className="form-check-input"
                                            {...register("medicacion_permanente")}
                                          />
                                          Sí
                                        </label>
                                      </div>
                                      <div className="form-check-inline col-6 col-md-2 col-xl-2">
                                        <label className="form-check-label">
                                          <input
                                            type="radio"
                                            value="no"
                                            name="medicacion_permanente"
                                            className="form-check-input"
                                            {...register("medicacion_permanente")}
                                          />
                                          No
                                        </label>
                                      </div>
                                      <div
                                        className="form-check-inline col-8"
                                        style={{ display: "inline-flex" }}
                                      >
                                        <label className="form-check-label">
                                          ¿Cuál/es?
                                        </label>
                                        <textarea
                                          className="form-control"
                                          rows={1}
                                          cols={30}
                                          defaultValue={""}
                                          style={{ resize: "none" }}
                                          {...register(
                                            "medicacion_permanente_nombres"
                                          )}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-12 col-xl-12">
                                    <label>
                                      ¿Tienes atenciones previas en el
                                      departamento de salud mental?
                                    </label>
                                    <div className="form-group select-gender">
                                      <div className="form-check-inline col-2 col-md-1 col-xl-1">
                                        <label className="form-check-label">
                                          <input
                                            type="radio"
                                            name="atenciones_previas_salud_mental"
                                            className="form-check-input"
                                            {...register(
                                              "atenciones_previas_salud_mental"
                                            )}
                                          />
                                          Sí
                                        </label>
                                      </div>
                                      <div className="form-check-inline col-6 col-md-2 col-xl-2">
                                        <label className="form-check-label">
                                          <input
                                            type="radio"
                                            name="atenciones_previas_salud_mental"
                                            className="form-check-input"
                                            {...register(
                                              "atenciones_previas_salud_mental"
                                            )}
                                          />
                                          No
                                        </label>
                                      </div>
                                      <div
                                        className="form-check-inline col-8"
                                        style={{ display: "inline-flex" }}
                                      >
                                        <label className="form-check-label">
                                          Describe
                                        </label>
                                        <textarea
                                          className="form-control"
                                          rows={1}
                                          cols={30}
                                          defaultValue={""}
                                          style={{ resize: "none" }}
                                          {...register(
                                            "atenciones_previas_salud_mental"
                                          )}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-12 col-xl-12">
                                    <label>
                                      ¿Has estado en tratamientos previos en salud
                                      mental? ¿Cuánto tiempo y de qué tipo?
                                    </label>
                                    <div className="form-group select-gender">
                                      <div className="form-check-inline col-2 col-md-1 col-xl-1">
                                        <label className="form-check-label">
                                          <input
                                            type="radio"
                                            name="tratamientos_previos_salud_mental"
                                            className="form-check-input"
                                            {...register(
                                              "tratamientos_previos_salud_mental"
                                            )}
                                          />
                                          Sí
                                        </label>
                                      </div>
                                      <div className="form-check-inline col-6 col-md-2 col-xl-2">
                                        <label className="form-check-label">
                                          <input
                                            type="radio"
                                            name="tratamientos_previos_salud_mental"
                                            className="form-check-input"
                                            {...register(
                                              "tratamientos_previos_salud_mental"
                                            )}
                                          />
                                          No
                                        </label>
                                      </div>
                                      <div
                                        className="form-check-inline col-8"
                                        style={{ display: "inline-flex" }}
                                      >
                                        <label className="form-check-label">
                                          Describe
                                        </label>
                                        <textarea
                                          className="form-control"
                                          rows={1}
                                          cols={30}
                                          defaultValue={""}
                                          style={{ resize: "none" }}
                                          {...register(
                                            "tratamientos_previos_salud_mental"
                                          )}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-12 col-xl-12">
                                    <label>
                                      ¿Actualmente estás con algún tratamiento en
                                      salud mental?
                                    </label>
                                    <div className="form-group select-gender">
                                      <div className="form-check-inline col-2 col-md-1 col-xl-1">
                                        <label className="form-check-label">
                                          <input
                                            type="radio"
                                            name="tratamiento_actual_salud_mental"
                                            className="form-check-input"
                                            {...register(
                                              "tratamiento_actual_salud_mental"
                                            )}
                                          />
                                          Sí
                                        </label>
                                      </div>
                                      <div className="form-check-inline col-6 col-md-2 col-xl-2">
                                        <label className="form-check-label">
                                          <input
                                            type="radio"
                                            name="tratamiento_actual_salud_mental"
                                            className="form-check-input"
                                            {...register(
                                              "tratamiento_actual_salud_mental"
                                            )}
                                          />
                                          No
                                        </label>
                                      </div>
                                      <div
                                        className="form-check-inline col-8"
                                        style={{ display: "inline-flex" }}
                                      >
                                        <label className="form-check-label">
                                          ¿De qué tipo?
                                        </label>
                                        <textarea
                                          className="form-control"
                                          rows={1}
                                          cols={30}
                                          defaultValue={""}
                                          style={{ resize: "none" }}
                                          {...register(
                                            "tratamiento_actual_salud_mental"
                                          )}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  {/* Consumo de alcohol y/o drogas */}
                                  <div className="col-12">
                                    <div className="form-heading">
                                      <h4>a) Consumo de alcohol y/o drogas</h4>
                                    </div>
                                  </div>

                                  {/* Consumo de alcohol */}

                                  <div className="col-12 col-md-12 col-xl-12">
                                    <div className="form-group select-gender">
                                      <label>¿Consumes alcohol?</label>
                                      <div className="form-check-inline">
                                        <label className="form-check-label">
                                          <input
                                            type="radio"
                                            name="consume_alcohol"
                                            value="si"
                                            className="form-check-input"
                                            {...register("consume_alcohol")}
                                          />
                                          Sí
                                        </label>
                                      </div>
                                      <div className="form-check-inline">
                                        <label className="form-check-label">
                                          <input
                                            type="radio"
                                            name="consume_alcohol"
                                            value="no"
                                            className="form-check-input"
                                            {...register("consume_alcohol")}
                                          />
                                          No
                                        </label>
                                      </div>
                                      <div className="form-check-inline">
                                        <label className="form-check-label">
                                          <input
                                            type="radio"
                                            name="alcohol"
                                            value="ocasional"
                                            className="form-check-input"
                                            {...register("consume_alcohol")}
                                          />
                                          Ocasional
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-12 col-md-6 col-xl-6">
                                    <div className="form-group local-forms">
                                      <label>¿Qué tipo?</label>
                                      <input
                                        className="form-control"
                                        type="text"
                                        {...register("tipo_alcohol_consumido")}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-12 col-md-6 col-xl-6">
                                    <div className="form-group local-forms">
                                      <label>Frecuencia en que consumes</label>
                                      <input
                                        className="form-control"
                                        type="text"
                                        {...register(
                                          "frecuencia_consumo_alcohol"
                                        )}
                                      />
                                    </div>
                                  </div>

                                  {/* Consumo de drogas */}
                                  <div className="col-12 col-md-12 col-xl-12">
                                    <div className="form-group select-gender">
                                      <label>¿Consumes drogas? </label>
                                      <div className="form-check-inline">
                                        <label className="form-check-label">
                                          <input
                                            type="radio"
                                            name="consume_drogas"
                                            className="form-check-input"
                                            {...register("consume_drogas")}
                                          />
                                          Sí
                                        </label>
                                      </div>
                                      <div className="form-check-inline">
                                        <label className="form-check-label">
                                          <input
                                            type="radio"
                                            name="consume_drogas"
                                            className="form-check-input"
                                            {...register("consume_drogas")}
                                          />
                                          No
                                        </label>
                                      </div>
                                      <div className="form-check-inline">
                                        <label className="form-check-label">
                                          <input
                                            type="radio"
                                            name="consume_drogas"
                                            className="form-check-input"
                                            {...register("consume_drogas")}
                                          />
                                          Ocasional
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-12 col-md-6 col-xl-6">
                                    <div className="form-group local-forms">
                                      <label>¿Qué tipo?</label>
                                      <input
                                        className="form-control"
                                        type="text"
                                        {...register("tipo_drogas_consumidas")}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-12 col-md-6 col-xl-6">
                                    <div className="form-group local-forms">
                                      <label>Frecuencia en que consumes</label>
                                      <input
                                        className="form-control"
                                        type="text"
                                        {...register("frecuencia_consumo_drogas")}
                                      />
                                    </div>
                                  </div>

                                  {/* Riesgo suicida */}
                                  <div className="col-12">
                                    <div className="form-heading">
                                      <h4>b) Riesgo suicida</h4>
                                    </div>
                                  </div>
                                  <div className="col-12 col-md-12 col-xl-12">
                                    <div className="form-group local-forms">
                                      <label>Aplicar escala riesgo suicida</label>
                                      <input
                                        className="form-control"
                                        type="text"
                                        {...register("riesgo_suicida_escala")}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </AccordionDetails>
                            </Accordion>

                            {/* 6. Antecedentes académicos */}
                            <Accordion>
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                              >
                                <div className="col-12">
                                  <div className="form-heading">
                                    <h4>6. Antecedentes académicos</h4>
                                  </div>
                                </div>
                              </AccordionSummary>
                              <AccordionDetails>
                                <div className="row">
                                  <div className="col-12 col-md-12 col-xl-12">
                                    <label>¿Es tu primera carrera?</label>
                                    <div className="form-group select-gender">
                                      <div className="form-check-inline col-2 col-md-1 col-xl-1">
                                        <label className="form-check-label">
                                          <input
                                            type="radio"
                                            name="primera_carrera"
                                            className="form-check-input"
                                            {...register("primera_carrera")}
                                          />
                                          Sí
                                        </label>
                                      </div>
                                      <div className="form-check-inline col-6 col-md-2 col-xl-2">
                                        <label className="form-check-label">
                                          <input
                                            type="radio"
                                            name="primera_carrera"
                                            className="form-check-input"
                                            {...register("primera_carrera")}
                                          />
                                          No
                                        </label>
                                      </div>
                                      <div
                                        className="form-check-inline col-8"
                                        style={{ display: "inline-flex" }}
                                      >
                                        <label className="form-check-label">
                                          Si es no, ¿qué estudiaste antes?
                                        </label>
                                        <textarea
                                          className="form-control"
                                          rows={1}
                                          cols={30}
                                          defaultValue={""}
                                          style={{ resize: "none" }}
                                          {...register("primera_carrera")}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-12 col-xl-12">
                                    <label>
                                      ¿Te sientes satisfecho/a con tu decisión de
                                      carrera actual?
                                    </label>
                                    <div className="form-group select-gender">
                                      <div className="form-check-inline col-2 col-md-1 col-xl-1">
                                        <label className="form-check-label">
                                          <input
                                            type="radio"
                                            name="satisfecho_decision_carrera"
                                            className="form-check-input"
                                            {...register(
                                              "satisfecho_decision_carrera"
                                            )}
                                          />
                                          Sí
                                        </label>
                                      </div>
                                      <div className="form-check-inline col-6 col-md-2 col-xl-2">
                                        <label className="form-check-label">
                                          <input
                                            type="radio"
                                            name="satisfecho_decision_carrera"
                                            className="form-check-input"
                                            {...register(
                                              "satisfecho_decision_carrera"
                                            )}
                                          />
                                          No
                                        </label>
                                      </div>
                                      <div className="form-check-inline col-6 col-md-2 col-xl-2">
                                        <label className="form-check-label">
                                          <input
                                            type="radio"
                                            name="satisfecho_decision_carrera"
                                            className="form-check-input"
                                            {...register(
                                              "satisfecho_decision_carrera"
                                            )}
                                          />
                                          Aún no lo sé
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-12 col-xl-12">
                                    <label>
                                      ¿Cómo consideras que ha sido tu desempeño
                                      hasta ahora?
                                    </label>
                                    <div className="form-group select-gender">
                                      <div className="form-check-inline col-2 col-md-1 col-xl-1">
                                        <label className="form-check-label">
                                          <input
                                            type="radio"
                                            name="desempeno_academico"
                                            className="form-check-input"
                                            {...register("desempeno_academico")}
                                          />
                                          Bueno
                                        </label>
                                      </div>
                                      <div className="form-check-inline col-6 col-md-2 col-xl-2">
                                        <label className="form-check-label">
                                          <input
                                            type="radio"
                                            name="desempeno_academico"
                                            className="form-check-input"
                                            {...register("desempeno_academico")}
                                          />
                                          Malo
                                        </label>
                                      </div>
                                      <div className="form-check-inline col-6 col-md-2 col-xl-2">
                                        <label className="form-check-label">
                                          <input
                                            type="radio"
                                            name="desempeno_academico"
                                            className="form-check-input"
                                            {...register("desempeno_academico")}
                                          />
                                          Regular
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-12 col-xl-12">
                                    <label>
                                      ¿Cuál ha sido el principal desafío al que te
                                      has enfrentado en la universidad?
                                    </label>
                                    <div className="form-group local-forms">
                                      <textarea
                                        className="form-control"
                                        rows={2}
                                        cols={30}
                                        defaultValue={""}
                                        style={{ resize: "none" }}
                                        {...register(
                                          "desafio_enfrentado_universidad"
                                        )}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </AccordionDetails>
                            </Accordion>
                            {/* 7. Redes de apoyo disponibles */}
                            <Accordion>
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                              >
                                <div className="col-12">
                                  <div className="form-heading">
                                    <h4>7. Redes de apoyo disponibles</h4>
                                  </div>
                                </div>
                              </AccordionSummary>
                              <AccordionDetails>
                                <div className="row">
                                  <div className="col-12 col-md-12 col-xl-12">
                                    <div className="form-group local-forms">
                                      <label>
                                        ¿Cuentas con personas significativas que
                                        te apoyen hoy en día? ¿Quiénes son?
                                      </label>

                                      <textarea
                                        className="form-control"
                                        rows={2}
                                        cols={30}
                                        defaultValue={""}
                                        style={{ resize: "none" }}
                                        {...register(
                                          "redes_apoyo_personas_significativas"
                                        )}
                                      />
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-12 col-xl-12">
                                    <div className="form-group local-forms">
                                      <label>
                                        Tipos de apoyo actuales
                                        <span className="login-danger">*</span>
                                      </label>
                                      <Controller
                                        control={control}
                                        defaultValue={null}
                                        name="tipos_apoyo_actual"
                                        rules={{ required: false }}
                                        render={({
                                          field: { onChange, onBlur, value },
                                        }) => (
                                          <Select
                                            isMulti
                                            instanceId="tipos_apoyo_actual"
                                            value={value || []}
                                            onChange={onChange}
                                            options={tipo_apoyo}
                                            // menuPortalTarget={document.body}
                                            styles={{
                                              menuPortal: (base) => ({
                                                ...base,
                                                zIndex: 9999,
                                              }),
                                            }}
                                            id="tipos_apoyo_actual"
                                            components={{
                                              IndicatorSeparator: () => null,
                                            }}
                                            styles={{
                                              control: (baseStyles, state) => ({
                                                ...baseStyles,
                                                borderColor: state.isFocused
                                                  ? "none"
                                                  : "2px solid rgba(46, 55, 164, 0.1);",
                                                boxShadow: state.isFocused
                                                  ? "0 0 0 1px #2e37a4"
                                                  : "none",
                                                "&:hover": {
                                                  borderColor: state.isFocused
                                                    ? "none"
                                                    : "2px solid rgba(46, 55, 164, 0.1)",
                                                },
                                                borderRadius: "10px",
                                                fontSize: "14px",
                                                minHeight: "45px",
                                              }),
                                              dropdownIndicator: (
                                                base,
                                                state
                                              ) => ({
                                                ...base,
                                                transform: state.selectProps
                                                  .menuIsOpen
                                                  ? "rotate(-180deg)"
                                                  : "rotate(0)",
                                                transition: "250ms",
                                                width: "35px",
                                                height: "35px",
                                              }),
                                            }}
                                          />
                                        )}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </AccordionDetails>
                            </Accordion>
                            {/* 8. Intereses y autocuidado */}
                            <Accordion>
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                              >
                                <div className="col-12">
                                  <div className="form-heading">
                                    <h4>8. Intereses y autocuidado </h4>
                                  </div>
                                </div>
                              </AccordionSummary>
                              <AccordionDetails>
                                <div className="row">
                                  <div className="col-12 col-md-12 col-xl-12">
                                    <div className="form-group local-forms">
                                      <label>
                                        ¿Qué tipo de actividades te gusta
                                        realizar? ¿Les dedicas tiempo?
                                      </label>
                                      <textarea
                                        className="form-control"
                                        rows={2}
                                        cols={30}
                                        defaultValue={""}
                                        style={{ resize: "none" }}
                                        {...register(
                                          "actividades_gustan_realizar"
                                        )}
                                      />
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-12 col-xl-12">
                                    <div className="form-group local-forms">
                                      <label>
                                        ¿Tienes espacios de autocuidado? ¿Cómo
                                        cuáles?
                                      </label>
                                      <textarea
                                        className="form-control"
                                        rows={2}
                                        cols={30}
                                        defaultValue={""}
                                        style={{ resize: "none" }}
                                        {...register("espacios_autocuidado")}
                                      />
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-12 col-xl-12">
                                    <div className="form-group local-forms">
                                      <label>
                                        ¿Dedicas tiempo para descansar? Promedio
                                        de horas dedicadas a dormir
                                      </label>
                                      <textarea
                                        className="form-control"
                                        rows={2}
                                        cols={30}
                                        defaultValue={""}
                                        style={{ resize: "none" }}
                                        {...register(
                                          "tiempo_descanso_horas_sueno"
                                        )}
                                      />
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-12 col-xl-12">
                                    <div className="form-group local-forms">
                                      <label>
                                        ¿Cómo te alimentas? Describe un día de
                                        alimentación habitual
                                      </label>
                                      <textarea
                                        className="form-control"
                                        rows={2}
                                        cols={30}
                                        defaultValue={""}
                                        style={{ resize: "none" }}
                                        {...register(
                                          "alimentacion_diaria_habitual"
                                        )}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </AccordionDetails>
                            </Accordion>
                            {/* Evaluación profesional */}
                            <Accordion>
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                              >
                                <div className="col-12">
                                  <div className="form-heading">
                                    <h4>
                                      9. Evaluación profesional{" "}
                                      <small>
                                        (se completa luego de la entrevista)
                                      </small>
                                    </h4>
                                  </div>
                                </div>
                              </AccordionSummary>
                              <AccordionDetails>
                                <div className="row">
                                  <div className="col-12 col-md-12 col-xl-12">
                                    <label>
                                      Modalidad de atención a la cual accede según
                                      evaluación
                                    </label>
                                    <div className="form-group local-forms">
                                      <Controller
                                        control={control}
                                        defaultValue={null}
                                        rules={{ required: false }}
                                        name="modalidad_atencion_evaluacion"
                                        render={({
                                          field: { onChange, onBlur, value },
                                        }) => (
                                          <Select
                                            isMulti
                                            instanceId="modalidad_atencion_evaluacion"
                                            value={value || []}
                                            onChange={onChange}
                                            options={modalidad}
                                            // menuPortalTarget={document.body}
                                            styles={{
                                              menuPortal: (base) => ({
                                                ...base,
                                                zIndex: 9999,
                                              }),
                                            }}
                                            id="modalidad_atencion_evaluacion"
                                            components={{
                                              IndicatorSeparator: () => null,
                                            }}
                                            styles={{
                                              control: (baseStyles, state) => ({
                                                ...baseStyles,
                                                borderColor: state.isFocused
                                                  ? "none"
                                                  : "2px solid rgba(46, 55, 164, 0.1);",
                                                boxShadow: state.isFocused
                                                  ? "0 0 0 1px #2e37a4"
                                                  : "none",
                                                "&:hover": {
                                                  borderColor: state.isFocused
                                                    ? "none"
                                                    : "2px solid rgba(46, 55, 164, 0.1)",
                                                },
                                                borderRadius: "10px",
                                                fontSize: "14px",
                                                minHeight: "45px",
                                              }),
                                              dropdownIndicator: (
                                                base,
                                                state
                                              ) => ({
                                                ...base,
                                                transform: state.selectProps
                                                  .menuIsOpen
                                                  ? "rotate(-180deg)"
                                                  : "rotate(0)",
                                                transition: "250ms",
                                                width: "35px",
                                                height: "35px",
                                              }),
                                            }}
                                          />
                                        )}
                                      />
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-12 col-xl-12">
                                    <label>
                                      Estado de ánimo/ Afectividad (presencia o no
                                      de sintomatología asociada a ansiedad/
                                      depresión/ manía, entre otras)
                                    </label>
                                    <div className="form-group local-forms">
                                      <textarea
                                        className="form-control"
                                        rows={2}
                                        cols={30}
                                        defaultValue={""}
                                        style={{ resize: "none" }}
                                        {...register("estado_animo_afectividad")}
                                      />
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-12 col-xl-12">
                                    <label>
                                      Tipo de pensamiento observado (organizado,
                                      desorganizado, obsesivo, entre otros)
                                    </label>
                                    <div className="form-group local-forms">
                                      <textarea
                                        className="form-control"
                                        rows={2}
                                        cols={30}
                                        defaultValue={""}
                                        style={{ resize: "none" }}
                                        {...register(
                                          "tipo_pensamiento_observado"
                                        )}
                                      />
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-12 col-xl-12">
                                    <label>
                                      Detección de posibles condiciones asociadas
                                      a déficit cognitivo (TEA, TDHA)
                                    </label>
                                    <div className="form-group local-forms">
                                      <textarea
                                        className="form-control"
                                        rows={2}
                                        cols={30}
                                        defaultValue={""}
                                        style={{ resize: "none" }}
                                        {...register(
                                          "deteccion_condiciones_deficit_cognitivo"
                                        )}
                                      />
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-12 col-xl-12">
                                    <label>
                                      Consciencia de realidad (presencia de
                                      delirios, percepción alterada)
                                    </label>
                                    <div className="form-group local-forms">
                                      <textarea
                                        className="form-control"
                                        rows={2}
                                        cols={30}
                                        defaultValue={""}
                                        style={{ resize: "none" }}
                                        {...register("consciencia_realidad")}
                                      />
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-12 col-xl-12">
                                    <label>Autoconcepto y autoestima</label>
                                    <div className="form-group local-forms">
                                      <textarea
                                        className="form-control"
                                        rows={2}
                                        cols={30}
                                        defaultValue={""}
                                        style={{ resize: "none" }}
                                        {...register("autoconcepto_autoestima")}
                                      />
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-12 col-xl-12">
                                    <label>
                                      Situaciones de riesgo a nivel relacional
                                    </label>
                                    <div className="form-group local-forms">
                                      <textarea
                                        className="form-control"
                                        rows={2}
                                        cols={30}
                                        defaultValue={""}
                                        style={{ resize: "none" }}
                                        {...register(
                                          "situaciones_riesgo_relacional"
                                        )}
                                      />
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-12 col-xl-12">
                                    <label>
                                      Situaciones de riesgo a nivel personal
                                    </label>
                                    <div className="form-group local-forms">
                                      <textarea
                                        className="form-control"
                                        rows={2}
                                        cols={30}
                                        defaultValue={""}
                                        style={{ resize: "none" }}
                                        {...register(
                                          "situaciones_riesgo_personal"
                                        )}
                                      />
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-12 col-xl-12">
                                    <label>
                                      Observaciones{" "}
                                      <span className="login-danger">*</span>
                                    </label>
                                    <div className="form-group local-forms">
                                      <textarea
                                        className="form-control"
                                        rows={4}
                                        cols={30}
                                        defaultValue={""}
                                        style={{ resize: "none" }}
                                        {...register("observaciones", {
                                          required: {
                                            value: true,
                                            message: "Observaciones es requerido",
                                          },
                                        })}
                                      />
                                      {errors.observaciones && (
                                        <span className="login-danger">
                                          <small>
                                            {errors.observaciones.message}
                                          </small>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* DERIVAR */}
                                <div className="row">
                                  <div className="col-12 col-md-6 col-xl-6">
                                    <div className="form-group select-gender">
                                      <div className="form-check check-tables">
                                        <label className="form-check-label">
                                          <input
                                            type="checkbox"
                                            name="derivacion_interna"
                                            // value="derivacion_interna"
                                            className="form-check-input"
                                            {...register("derivacion_interna")}
                                          // onChange={getProfessionals}
                                          />
                                          Derivación interna
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-12 col-md-6 col-xl-6">
                                    <div className="form-group select-gender">
                                      <div className="form-check check-tables">
                                        <label className="form-check-label">
                                          <input
                                            type="checkbox"
                                            name="derivacion_externa"
                                            // value="derivacion_externa"
                                            className="form-check-input"
                                            {...register("derivacion_externa")}
                                          />
                                          Derivación externa
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                  {isChecked && (
                                    <div className="col-12 col-md-6 col-xl-6">
                                      <Controller
                                        control={control}
                                        name="profesionales"
                                        rules={{
                                          validate: (value) => {
                                            return isChecked && (!value || !value.id)
                                              ? "Debe seleccionar un profesional"
                                              : true
                                          }
                                        }}
                                        ref={null}
                                        render={({
                                          field: {
                                            onChange,
                                            onBlur,
                                            value,
                                            name,
                                            ref,
                                          },
                                        }) => {
                                          return (
                                            <Select
                                              placeholder={
                                                profesionales.length === 0
                                                  ? "Cargando..."
                                                  : "Seleccione..."
                                              }
                                              instanceId="profesionales"
                                              defaultValue={selectedOption}
                                              onChange={(e) => {
                                                onChange(e);
                                                console.log("");
                                              }}
                                              getOptionLabel={(e) => e.label}
                                              options={profesionales}
                                              styles={{
                                                menuPortal: (base) => ({
                                                  ...base,
                                                  zIndex: 9999,
                                                }),
                                              }}
                                              id="profesionales"
                                              components={{
                                                IndicatorSeparator: () => null,
                                              }}
                                              styles={{
                                                control: (baseStyles, state) => ({
                                                  ...baseStyles,
                                                  borderColor: state.isFocused
                                                    ? "none"
                                                    : "2px solid rgba(46, 55, 164, 0.1);",
                                                  boxShadow: state.isFocused
                                                    ? "0 0 0 1px #2e37a4"
                                                    : "none",
                                                  "&:hover": {
                                                    borderColor: state.isFocused
                                                      ? "none"
                                                      : "2px solid rgba(46, 55, 164, 0.1)",
                                                  },
                                                  borderRadius: "10px",
                                                  fontSize: "14px",
                                                  minHeight: "45px",
                                                }),
                                                dropdownIndicator: (
                                                  base,
                                                  state
                                                ) => ({
                                                  ...base,
                                                  transform: state.selectProps
                                                    .menuIsOpen
                                                    ? "rotate(-180deg)"
                                                    : "rotate(0)",
                                                  transition: "250ms",
                                                  width: "35px",
                                                  height: "35px",
                                                }),
                                              }}
                                            />
                                          );
                                        }}
                                      />
                                      {errors.profesionales && (
                                        <span className="login-danger">
                                          <small>{errors.profesionales.message}</small>
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </AccordionDetails>
                            </Accordion>
                            <div className="col-12">
                              <div className="doctor-submit text-end mt-3">
                                <button
                                  // type="submit"
                                  className="btn btn-primary submit-form me-2"
                                  onClick={(e) => {
                                    openWarningInterview(e);
                                  }}
                                >
                                  Registrar entrevista
                                </button>
                                <Link href={"/pacientes"}>
                                  <button
                                    type="reset"
                                    className="btn btn-primary cancel-form"
                                  >
                                    Cancelar
                                  </button>
                                </Link>
                              </div>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {success === "success" && (
              <div
                style={{
                  height: "100%",
                  position: "fixed",
                  top: "0",
                  width: "100%",
                  zIndex: 99999,
                  background: "#00000080",
                }}
              >
                <Alert
                  severity="success"
                  onClose={handleClose}
                  sx={{
                    zIndex: "tooltip",
                    position: "absolute",
                    left: "30%",
                    width: "50%",
                    padding: "50px",
                    bottom: "50vh",
                  }}
                  spacing={2}
                >
                  Acción exitosa. Revisa los detalles en la sección Lista de
                  citas.
                </Alert>
              </div>
            )}{" "}
            {success === "fail" && (
              <div
                className="row"
                style={{
                  height: "100%",
                  position: "fixed",
                  top: "0",
                  width: "100%",
                  zIndex: 99999,
                  background: "#00000080",
                }}
              >
                <div className="col-sm-12 col-lg-6">
                  <Alert
                    severity="error"
                    onClose={() => {
                      setSuccess("initial");
                    }}
                    sx={{
                      zIndex: "tooltip",
                      position: "absolute",
                      left: "30%",
                      width: "50%",
                      padding: "50px",
                      bottom: "50vh",
                    }}
                    spacing={2}
                  >
                    Ha ocurrido un problema. {error}
                  </Alert>
                </div>
              </div>
            )}
            {success === "citaConAlta" && (
              <div
                className="row"
                style={{
                  height: "100%",
                  position: "fixed",
                  top: "0",
                  width: "100%",
                  zIndex: 99999,
                  background: "#00000080",
                }}
              >
                <div className="col-sm-12 col-lg-6">
                  <Alert
                    severity="warning"
                    onClose={() => {
                      setSuccess("initial");
                    }}
                    sx={{
                      zIndex: "tooltip",
                      position: "absolute",
                      left: "30%",
                      width: "50%",
                      padding: "50px",
                      bottom: "50vh",
                    }}
                  >
                    {Object.keys(errors).length !== 0 ? (
                      <h4 className="font-red">Faltan campos por completar</h4>
                    ) : (
                      <>
                        <h4>{message}</h4>
                        <Button
                          variant="primary"
                          onClick={(e) => {
                            handleAlta(e);
                            handleAppointment(e);
                          }}
                        >
                          {" "}
                          Confirmar{" "}
                        </Button>
                      </>
                    )}
                  </Alert>
                </div>
              </div>
            )}
            {success === "cita" && (
              <div
                className="row"
                style={{
                  height: "100%",
                  position: "fixed",
                  top: "0",
                  width: "100%",
                  zIndex: 99999,
                  background: "#00000080",
                }}
              >
                <div className="col-sm-12 col-lg-6">
                  <Alert
                    severity="warning"
                    onClose={() => {
                      setSuccess("initial");
                    }}
                    sx={{
                      zIndex: "tooltip",
                      position: "absolute",
                      left: "30%",
                      width: "50%",
                      padding: "50px",
                      bottom: "50vh",
                    }}
                  >
                    {Object.keys(errors).length !== 0 ? (
                      <h4 className="font-red">Faltan campos por completar</h4>
                    ) : (
                      <>
                        <h4>{message}</h4>
                        <Button
                          variant="primary"
                          onClick={(e) => {
                            handleAppointment(e);
                          }}
                        >
                          {" "}
                          Confirmar{" "}
                        </Button>
                      </>
                    )}
                  </Alert>
                </div>
              </div>
            )}
            {success === "despeje" && (
              <div
                className="row"
                style={{
                  height: "100%",
                  position: "fixed",
                  top: "0",
                  width: "100%",
                  zIndex: 99999,
                  background: "#00000080",
                }}
              >
                <div className="col-sm-12 col-lg-6">
                  <Alert
                    severity="warning"
                    onClose={() => {
                      setSuccess("initial");
                    }}
                    sx={{
                      zIndex: "tooltip",
                      position: "absolute",
                      left: "30%",
                      width: "50%",
                      padding: "50px",
                      bottom: "50vh",
                    }}
                  >
                    {Object.keys(errors).length !== 0 ? (
                      <h4 className="font-red">Faltan campos por completar</h4>
                    ) : (
                      <>
                        {" "}
                        <h4>{message}</h4>
                        <Button
                          variant="primary"
                          onClick={(e) => {
                            handleInterview(e);
                          }}
                        >
                          {" "}
                          Confirmar{" "}
                        </Button>
                      </>
                    )}
                  </Alert>
                </div>
              </div>
            )}
            {success === "failAccess" && (
              <div
                className="row"
                style={{
                  height: "100%",
                  position: "fixed",
                  top: "0",
                  width: "100%",
                  zIndex: 99999,
                  background: "#00000080",
                }}
              >
                <div className="col-sm-12 col-lg-6">
                  <Alert
                    severity="error"
                    onClose={handleClose}
                    sx={{
                      zIndex: "tooltip",
                      position: "absolute",
                      left: "30%",
                      width: "50%",
                      padding: "50px",
                      bottom: "50vh",
                    }}
                    spacing={2}
                  >
                    No tienes acceso a esta ficha.
                  </Alert>
                </div>
              </div>
            )}
          </>
        )}
      </>
    );
  };

  // export default AddInterviewRecord;
  export default withAuth(AddInterviewRecord, [
    "administrador",
    "profesional",
    "blend",
  ]);
