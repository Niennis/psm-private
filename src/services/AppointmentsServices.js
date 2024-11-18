import { fetchUser } from './UsersServices'
import { fetchProfessionalById } from './DoctorsServices';
import { fetchSpecialityById } from './DoctorsServices';

import dayjs from 'dayjs';
import axios from 'axios';

const formatDate = (dateString) => {
  const [year, month, day] = dateString.split("-");
  return `${year}-${day}-${month}`;
};

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
      cache: 'no-store',
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
    cache: 'no-store',
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
    profesional_id: appointment.professional.id,
    alumno_id: appointment.patient_id,
    fechaInicio: formatDate(appointment.fecha),
    hora: appointment.hora,
    estado: "pendiente",
    modalidad: appointment.modalidad || 'modalidad',
    campus: appointment.campus || 'no aplica',
    notas: 'notas',
    motivo: appointment.motivo.label || 'motivo',
    como: 'como se entero',
    derivado_desde: 'derivado',
    tratamiento: 'tratamientos',
    diagnostico_previo: 'diagnosticos',
    primera_cita: 1,
  }
  console.log('BODY', body);

  try {
    const data = await fetch(APPOINTMENT_API, {
      method: "POST",
      cache: 'no-store',
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
console.log('appointment', appointment)
  const body = {
    profesional_id: appointment.professional.id,
    alumno_id: appointment.patient_id,
    fechaInicio: appointment.fecha,
    hora: appointment.hora,
    estado: "pendiente",
    modalidad: appointment.modalidad || 'modalidad',
    campus: appointment.campus || 'no aplica',
    notas: 'notas',
    motivo: appointment.motivo.label || 'motivo',
    como: 'como se entero',
    derivado_desde: 'derivado',
    tratamiento: 'tratamientos',
    diagnostico_previo: 'diagnosticos',
    primera_cita: 0,
  }
  console.log('BODY', body);

  try {
    const data = await fetch(APPOINTMENT_API, {
      method: "POST",
      cache: 'no-store',
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
    const data = await fetch(APPOINTMENT_API , {
      method: "POST",
      cache: 'no-store',
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
    "estado" : status,
  }

  console.log('body change status', body)
  try {
    return await fetch(APPOINMENT_API, {
      method: 'POST',
      cache: 'no-store',
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*',
      },
      body: JSON.stringify(
        body
      )
    })
  } catch (err) {
    console.log(err)
  }
}
/* 
export const fetchAppointments = async (callback) => {
  try {
    const data = await fetch(process.env.NEXT_PUBLIC_SHOW_APPOINTMENTS, {
      method: "POST",
    cache: 'no-store',
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*',
      },
    })
    // const data = await fetch(process.env.VITE_SHOW_APPOINTMENTS)
    const response = await data.json()

    // response['citas'].forEach(element => {
    //   element['fecha_cita'] = element['fecha_cita'].slice(0, 10)
    // });

    const obj = response['citas'].map(async date => {
      const doctor = await fetchProfessionalById(date.id_profesional)
      const fetchPatient = await fetchUser(date.id_paciente)
      const result = await fetchSpecialityById(date.id_profesional)
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
 */

export const fetchAppointments = async () => {
  try {
    const data = await fetch(process.env.NEXT_PUBLIC_SHOW_APPOINTMENTS, {
      method: "POST",
      cache: 'no-store',
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*',
      },
    });

    const {citas} = await data.json();

    // const appointments = await Promise.allSettled(
    //   citas.map(async (date) => {
    //     // const doctor = await fetchProfessionalById(date.id_profesional);
    //     // const {users: fetchPatient} = await fetchUser(date.id_paciente);
    //     const result = await fetchSpecialityById(date.id_profesional);

    //     return {
    //       ...date,
    //       // nombre_alumno: `${fetchPatient.users[0].nombre} ${fetchPatient.users[0].apellido}`,
    //       // nombre_profesional: `${doctor.users[0].nombre} ${doctor.users[0].apellido}`,
    //       // telefono_alumno: fetchPatient.users[0].telefono,
    //       // mail_alumno: fetchPatient.users[0].email,
    //       especialidad: result.especialidad.length === 0 ? 'Psicologia' : result.especialidad[0].especialidad,
    //       key: date.id
    //     };
    //   })
    // );

    return citas;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const fetchAppointment = async (id) => {
  try {
    const data = await fetch(process.env.NEXT_PUBLIC_APPOINTMENTS_API )
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

  const bleh = data.filter(obj =>
    JSON.stringify(obj).toLowerCase().includes(query.toLowerCase()))

  return bleh
}