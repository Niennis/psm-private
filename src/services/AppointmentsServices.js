import { fetchUser } from './UsersServices'
import { fetchDoctor } from './DoctorsServices';
import { fetchSpeciality } from './DoctorsServices';

import dayjs from 'dayjs';
import axios from 'axios';

export const sendEmail = async () => {
  // console.log('el body', body);
  const SEND_EMAIL = process.env.NEXT_PUBLIC_SEND_EMAIL;
  const lebody = {
    "tarjet": "estefania.osses.v@gmail.com",
    "paciente": true
  }
  console.log('lebody', lebody);
  try {
    const data = await fetch(SEND_EMAIL, {
      method: "POST",
      // cors: "no-cors",
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




export const createAppointment = async (appointment) => {
  const APPOINTMENT_API = process.env.NEXT_PUBLIC_CREATE_APPOINTMENT

  const body = {
    profesional_id: (appointment.professional.id).toString(),
    alumno_id: (appointment.patient_id).toString(),
    fecha: appointment.fecha,
    hora: appointment.hora,
    estado: "pendiente",
    modalidad: appointment.modalidad || 'modalidad',
    campus: appointment.campus || 'campus',
    notas: 'notas',
    motivo: appointment.motivo.label || 'motivo',
    como: 'como se entero',
    derivado_desde: 'derivado',
    tratamiento: 'tratamientos',
    diagnostico_previo: 'diagnosticos',
  }

  console.log('BODY', body);
  // const bodyEmailPatient = {
  //   "tarjet": appointment.email,
  //   "paciente": true
  // }

  // const bodyEmailProfessional = {
  //   "tarjet": appointment.doctor.email,
  //   "paciente": false
  // }

  try {
    const data = await fetch(APPOINTMENT_API, {
      method: "POST",
      cors: "no-cors",
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*'
      },
      body: JSON.stringify(body)
    })
    const response = await data.json()
    console.log('response', response.detalle);

    // ENVÍO DE MAIL
    if (response.detalle === 'success!!') {
      pruebaSendMail('estefania.osses.v@gmail.com')
      // await sendEmail(bodyEmailProfessional)
    }

    return response
  } catch (err) {
    console.log(err)
  }
}

export const updateAppointment = async (appointment, id) => {
  const APPOINTMENT_API = process.env.NEXT_PUBLIC_APPOINTMENTS_API
  console.log(appointment.appointment_date);
  const body = {
    "profesional_id": appointment.selected_doctor.id,
    "alumno_id": appointment.patient_id,
    "fecha": dayjs(appointment.appointment_date.$d).format('YYYY-MM-DD'),
    "hora": appointment.start_time,
    "hora_fin": appointment.end_time.concat(':00'),
    "estado": "pendiente"
  }
  try {
    const data = await fetch(APPOINTMENT_API + `/api/appointments/${id}`, {
      method: "PUT",
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*',
        'ngrok-skip-browser-warning': 'any'
      },
      body: JSON.stringify(body)
    })
    return data
  } catch (err) {
    console.log('ERROR', err)
  }
}

export const changeStatusAppointment = async (id, status) => {
  const APPOINMENT_API = process.env.NEXT_PUBLIC_APPOINTMENTS_API
  try {
    await fetch(APPOINMENT_API + `/api/appointments/${id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*',
        'ngrok-skip-browser-warning': 'any'
      },
      body: JSON.stringify({
        "estado": status
      })
    })
  } catch (err) {
    console.log(err)
  }
}

export const fetchAppointments = async (callback) => {
  try {
    const data = await fetch(process.env.NEXT_PUBLIC_SHOW_APPOINTMENTS)
    // const data = await fetch(process.env.VITE_SHOW_APPOINTMENTS)
    const response = await data.json()

    // response['citas'].forEach(element => {
    //   element['fecha_cita'] = element['fecha_cita'].slice(0, 10)
    // });

    const obj = response['citas'].map(async date => {
      // console.log('DATE', date);
      const doctor = await fetchDoctor(date.id_profesional)
      const fetchPatient = await fetchUser(date.id_paciente)
      const result = await fetchSpeciality(date.id_profesional)
      // const fetch
      return {
        ...date,
        nombre_alumno: fetchPatient.users[0].nombre + ' ' + fetchPatient.users[0].apellido,
        nombre_profesional: doctor.users[0].nombre + ' ' + doctor.users[0].apellido,
        telefono_alumno: fetchPatient.users[0].telefono,
        mail_alumno: fetchPatient.users[0].email,
        genero_alumno: fetchPatient.users[0].genero,
        especialidad: result.especialidad.length === 0 ? 'Psicologia' : result.especialidad[0].especialidad,
        key: date.id
      }
    })
    return Promise.all(obj).then(resp => callback(resp))
  } catch (err) {
    console.log(err)
  }
}

export const fetchAppointment = async (id) => {
  try {
    const data = await fetch(process.env.NEXT_PUBLIC_APPOINTMENTS_API + `/api/appintsimple/${id}`)
    const response = await data.json()
    const fetchDoctor = await fetchUser(response.id_professional)
    const fetchPatient = await fetchUser(response.id_patient)
    return {
      ...response,
      nombre_alumno: fetchPatient.nombre,
      apellido_alumno: fetchPatient.apellido,
      nombre_profesional: fetchDoctor.nombre + ' ' + fetchDoctor.apellido,
      telefono_alumno: fetchPatient.telefono,
      mail_alumno: fetchPatient.email,
    }
  } catch (err) {
    console.log(err)
  }
}

export const search = (data, query) => data.filter(obj => JSON.stringify(obj).toLowerCase().includes(query.toLowerCase()))