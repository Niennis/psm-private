import { fetchUser } from './UsersServices'

import dayjs from 'dayjs';
import axios from 'axios';

export const sendEmail = async (email, typeUser) => {
  const SEND_EMAIL = process.env.NEXT_PUBLIC_SEND_EMAIL;
  const body = {
    'nombre': 'Prueba',
    'apellido': 'Usuario',
    'mail': "estefania.osses.v@gmail.com",
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
    console.log('Error:', error)
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
    // const response = await data.json()

    return data
  } catch (error) {
    console.log('Error:', error)
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

    return response
  } catch (error) {
    console.log('Error:', error)
  }
}

export const updateAppointment = async (appointment) => {
  const APPOINTMENT_API = `${process.env.NEXT_PUBLIC_EDIT_CITA}/main`
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
  } catch (error) {
    console.log('Error:', error)
  }
}

export const changeStatusAppointment = async (data) => {
  const APPOINMENT_API = process.env.NEXT_PUBLIC_CHANGE_STATUS

  const body = {
    id: data.id,
    id_paciente: data.id_paciente,
    id_profesional: data.id_profesional,
    carrera_estudiante: data.carrera || '',
    correo: data.email || '',
    dia_cita: data.appointment_date || '',
    hora_cita: data.start_time || '',
    lugar_cita: data.campus || '',
    nombre_estudiante: data?.name && data?.lastName ? `${data.name} ${data.lastName}` : data?.nombre_estudiante ? data.nombre_estudiante : '',
    nombre_profesional: data.selected_doctor || '',
    quien_cancela: data.quien_cancela || '', // id de quien cancela
    estado: data.status,
    tipo_cita: data.tipo_cita || '',
  }
  try {
    const data = await fetch(APPOINMENT_API, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(
        body
      )
    })
    const response = await data.json()
    return response

  } catch (error) {
    console.log('Error:', error)
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
  } catch (error) {
    console.log('Error:', error)
  }
}

export const search = (data, query) => {
  const response = data.filter(obj =>
    JSON.stringify(obj).toLowerCase().includes(query.toLowerCase()))
  return response
}


export const editAppointmentUuid = async (data) => {
  const URL = `${process.env.NEXT_PUBLIC_EDIT_CITA}/updatehoraxuuid`
  const body = {
    uuid: data.uuid,
    hora: data.hora
  }

  try {
    const data = await fetch(URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*',
      },
      body: JSON.stringify(body)
    })

    const response = await data.json()
    return response
  } catch (error) {
    console.log('Error:', error)
  }
}

export const editAppointmentHour = async (data) => {
  const URL = `${process.env.NEXT_PUBLIC_EDIT_CITA}/updatefechayhoraxid`
  const body = {
    id: data.id,
    fecha: data.fecha, // "2025-04-08",
    hora: data.hora // "10:30:00"
  }
  
  try {
    const data = await fetch(URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*',
      },
      body: JSON.stringify(body)
    })

    const response = await data.json()
    
    return response
  } catch (error) {
    console.log('Error:', error)
  }
}


//  ---- SERVICIOS DE CONTACTO DE EMERGENCIA

export const createContact = async (input) => {
  const URL = `${process.env.NEXT_PUBLIC_SHOWPATIENTS}/emergencia_create`

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
  } catch (error) {
    console.log('Error:', error)
  }

}

export const showContact = async (id) => {
  const URL = `${process.env.NEXT_PUBLIC_SHOWPATIENTS}/emergencia_read`
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

export const editContact = async (data) => {
  const URL = `${process.env.NEXT_PUBLIC_SHOWPATIENTS}/emergencia_update`

  const body = {
    nombre: data.nombre,
    relacion: data.relacion,
    numero: data.numero,
    mail: data.mail,
    id_emergencia: data.id_emergencia,
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
