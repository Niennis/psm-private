import { fetchUser } from './UsersServices'

import dayjs from 'dayjs';
import axios from 'axios';

export const sendEmail = async (email, typeUser) => {
  const SEND_EMAIL = process.env.NEXT_PUBLIC_SEND_EMAIL;
  const body = {
    'nombre': 'Prueba',
    'apellido': 'Usuario',
    'mail':"estefania.osses.v@gmail.com",
    'test': 'Don test',
    'puntaje': (25).toString(),
    'resultado': 'el resultado',
  }
  try {
    const data = await fetch(SEND_EMAIL, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(body)
    })
    const resp = await data.json()
    return resp
  } catch (error) {
    console.log('ERROR', error)
  }
}

export const createInterview = async (appointment) => {
  const APPOINTMENT_API = process.env.NEXT_PUBLIC_CREATE_INTERVIEW
  const body = {
    ...appointment,
    alumno_id: appointment.patient_id,
    campus: appointment.campus,
    carrera: appointment.carrera,
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
    // console.log('response', response);

 /*    // ENVÍO DE MAIL
    if (response.estado === true) {
      // pruebaSendMail('estefania.osses.v@gmail.com')
      try {
        const data = await sendEmail()
        // const response = await data.json()
        console.log('RESPONSE', data)

      } catch (error) {
        console.log('ERROR SEND MAIL: ', error)
      }
    } */

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

export const createContact = async (input) => {
  const URL = `https://showpatients-fge8btdrhdbzhagw.eastus-01.azurewebsites.net/emergencia_create`

  const body = {
    nombre: input.nombre,
    relacion: input.relacion,
    numero: input.numero,
    mail: input.mail,
    parentesco: input.parentesco
  }

  try {
    const data = await fetch(URL, {
      method: "POST",
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(body)
    })
    const response = await data.json()
    return response
  } catch (err) {
    console.log(err)
  }

}

export const showContact = async (id) => {
  const URL = `https://showpatients-fge8btdrhdbzhagw.eastus-01.azurewebsites.net/emergencia_read`
  const body = {
    id 
  }

  try {
    const data = await fetch(URL, {
      method: "POST",
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    const response = await data.json();
    return response;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export const editContact = async (id) => {
  const URL = `https://showpatients-fge8btdrhdbzhagw.eastus-01.azurewebsites.net/emergencia_update`
  const body = {
    id 
  }

  try {
    const data = await fetch(URL, {
      method: "POST",
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    const response = await data.json();
    return response;
  } catch (err) {
    console.error(err);
    return [];
  }
}
