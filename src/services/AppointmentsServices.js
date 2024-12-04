import { fetchUser } from './UsersServices'

import dayjs from 'dayjs';
import axios from 'axios';

export const sendEmail = async (email, typeUser) => {
  console.log('el body', email, typeUser);
  const SEND_EMAIL = process.env.NEXT_PUBLIC_SEND_EMAIL;
  const lebody = {
    "tarjet": "estefania.osses.v@gmail.com",
    "paciente": true
  }
  console.log('lebody', lebody);
  try {
    const data = await fetch(SEND_EMAIL, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(lebody)
    })
    // const resp = await data.json()
    console.log('RESP', data);
    return data
  } catch (error) {
    console.log('ERROR', error)
  }
}

const pruebaSendMail = (mail) => {
  let data = JSON.stringify({
    "tarjet": mail,
    "paciente": true,
    "asunto": 'Holi'
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://us-central1-mkt-003001-00813.cloudfunctions.net/ZRZ-SendMail',
    headers: {
      'Content-Type': 'application/json',
      "Accept": "application/json, text/plain, */*",
    },
    data: data
  };

  axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
}

export const createInterview = async (appointment) => {
  const APPOINTMENT_API = process.env.NEXT_PUBLIC_CREATE_INTERVIEW
  console.log('appointment', appointment)
  const body = {
    alumno_id: appointment.patient_id,
    campus: appointment.campus,
    como: 'como se entero',
    derivado_desde: 'derivado',
    diagnostico_previo: 'diagnosticos',
    estado: "pendiente",
    fechaInicio: appointment.fecha,
    hora: appointment.hora,
    modalidad: appointment.modalidad || 'modalidad',
    motivo: appointment.motivo.label || 'motivo',
    notas: 'notas',
    primera_cita: 1,
    profesional_id: appointment.professional.id,
    tratamiento: 'tratamientos',
  }
  console.log('BODY', body);

  try {
    const data = await fetch(APPOINTMENT_API, {
      method: "POST",
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*'
      },
      body: JSON.stringify(body)
    })
    const response = await data.json()
    console.log('response', response.detalle);

    // ENVÍO DE MAIL
    // if (response.detalle === 'success!!') {
    // pruebaSendMail('estefania.osses.v@gmail.com')
    // await sendEmail(bodyEmailProfessional)
    // }

    return response
  } catch (err) {
    console.log(err)
  }
}

export const createAppointment = async (appointment) => {
  const APPOINTMENT_API = process.env.NEXT_PUBLIC_CREATE_APPOINTMENT
  const body = {
    alumno_id: appointment.patient_id,
    campus: appointment.campus,
    como: 'como se entero',
    derivado_desde: 'derivado',
    diagnostico_previo: 'diagnosticos',
    estado: "pendiente",
    fechaInicio: appointment.fecha,
    hora: appointment.hora,
    modalidad: appointment.modalidad,
    motivo: appointment.motivo.label || 'motivo',
    notas: 'notas',
    primera_cita: 0,
    profesional_id: appointment.professional.id,
    tratamiento: 'tratamientos',
  }
  console.log('BODY', body);

  try {
    const data = await fetch(APPOINTMENT_API, {
      method: "POST",
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*'
      },
      body: JSON.stringify(body)
    })
    const response = await data.json()
    console.log('response', response.detalle);

    // ENVÍO DE MAIL
    // if (response.detalle === 'success!!') {
    // pruebaSendMail('estefania.osses.v@gmail.com')
    // await sendEmail(bodyEmailProfessional)
    // }

    return response
  } catch (err) {
    console.log(err)
  }
}


export const updateAppointment = async (appointment) => {
  const APPOINTMENT_API = process.env.NEXT_PUBLIC_EDIT_CITA
  console.log(appointment.appointment_date);
  const body = {
    "profesional_id": appointment.selected_doctor.id,
    "alumno_id": appointment.patient_id,
    "fecha": dayjs(appointment.appointment_date.$d).format('YYYY-MM-DD'),
    "hora": appointment.start_time,
    "hora_fin": appointment.end_time.concat(':00'),
    "estado": appointment.status
  }
  try {
    const data = await fetch(APPOINTMENT_API, {
      method: "POST",
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*',
      },
      body: JSON.stringify(body)
    })
    return data
  } catch (err) {
    console.log('ERROR', err)
  }
}

export const changeStatusAppointment = async (id, status) => {
  const APPOINMENT_API = process.env.NEXT_PUBLIC_CHANGE_STATUS

  const body = {
    "id": id,
    "estado": status,
  }

  try {
    const data = await fetch(APPOINMENT_API, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*',
      },
      body: JSON.stringify(
        body
      )
    })
    return data.json()
  } catch (err) {
    console.log(err)
  }
}

export const fetchAppointments = async () => {
  try {
    const data = await fetch(process.env.NEXT_PUBLIC_SHOW_APPOINTMENTS, {
      method: "POST",
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*',
      },
    });

    const { citas } = await data.json();
    return citas;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const fetchAppointment = async (id) => {
  try {
    const data = await fetch(process.env.NEXT_PUBLIC_APPOINTMENTS_API)
    const response = await data.json()
    const fetchProfessional = await fetchUser(response.id_professional)
    const fetchPatient = await fetchUser(response.id_patient)
    return {
      ...response,
      nombre_alumno: fetchPatient.nombre,
      apellido_alumno: fetchPatient.apellido,
      nombre_profesional: fetchProfessional.nombre + ' ' + fetchProfessional.apellido,
      telefono_alumno: fetchPatient.telefono,
      mail_alumno: fetchPatient.email,
    }
  } catch (err) {
    console.log(err)
  }
}

export const search = (data, query) => {

  const response = data.filter(obj =>
    JSON.stringify(obj).toLowerCase().includes(query.toLowerCase()))

  return response
}