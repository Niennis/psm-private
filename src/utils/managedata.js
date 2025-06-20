import { changeStatusAppointment } from "@/services/AppointmentsServices"

const cleanRut = rut => {
  return typeof rut === 'string'
    ? rut.replace(/^0+|[^0-9kK]+/g, '').toUpperCase()
    : ''
}

export const formatRut = (rut) => {
  rut = cleanRut(rut)

  let result;
  result = rut.slice(-4, -1) + '-' + rut.substr(rut.length - 1)
  for (let i = 4; i < rut.length; i += 3) {
    result = rut.slice(-3 - i, -i) + '.' + result
  }
  return result
}


export const validarRut = rut => {
  rut = rut.replace(/\./g, '').replace(/-/g, '');

  const cuerpo = rut.slice(0, -1);
  const dv = rut.slice(-1).toUpperCase();

  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i), 10) * multiplo;
    multiplo = (multiplo < 7) ? multiplo + 1 : 2;
  }

  const resto = suma % 11;
  let dvEsperado = 11 - resto;

  dvEsperado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

  return dvEsperado === dv;
}

// export const formatDateToYYYYMMDD = (dateString) => {
//   const date = new Date(dateString);
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');

//   return `${year}-${month}-${day}`;
// }

// export const formatDateToDDMMYYYY = (dateString) => {
//   const date = new Date(dateString)
//   const day = String(date.getDate()).padStart(2, '0')
//   const month = String(date.getMonth() + 1).padStart(2, '0')
//   const year = date.getFullYear()
//   return `${day}-${month}-${year}`
// }


export const formatDateToYYYYMMDD = (dateString) => {
  // Si ya está en formato YYYY-MM-DD, retorna igual
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }

  let date;
  
  // Intenta parsear como formato RFC 2822/GMT (ej: "Fri, 07 Feb 2020 00:00:00 GMT")
  if (/^[A-Za-z]{3},\s\d{2}\s[A-Za-z]{3}\s\d{4}/.test(dateString)) {
    date = new Date(dateString);
  } 
  // Si no, asume formato DD-MM-YYYY
  else {
    const [day, month, year] = dateString.split('-').map(Number);
    date = new Date(Date.UTC(year, month - 1, day));
  }

  // Validación por si el parseo falla
  if (isNaN(date.getTime())) {
    throw new Error(`Formato de fecha no reconocido: ${dateString}`);
  }

  // Extrae componentes en UTC
  const yearUTC = date.getUTCFullYear();
  const monthUTC = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dayUTC = String(date.getUTCDate()).padStart(2, '0');

  return `${yearUTC}-${monthUTC}-${dayUTC}`;
};

export const formatDateToDDMMYYYY = (dateString) => {
  // Si ya es YYYY-MM-DD (ISO), conviértela directamente
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split('-').map(Number);
    return `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
  }

  // Si es DD-MM-YYYY, extrae día, mes y año (evitando problemas de zona horaria con UTC)
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
    const [day, month, year] = dateString.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return `${String(date.getUTCDate()).padStart(2, '0')}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${date.getUTCFullYear()}`;
  }

  // Si es otro formato (como MM-DD-YYYY o fecha ISO con tiempo), usa el método seguro con UTC
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error("Formato de fecha no válido");
  }
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${day}-${month}-${year}`;
};



export const formatDateUTC = dateString => {
  const date = new Date(dateString);
  
  // Obtener valores en UTC
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}


export const normalizarHora = horaString => {
  // Elimina espacios en blanco alrededor de la hora
  const horaTrimmed = horaString.trim();
  
  // Divide la cadena en partes usando ":" como separador
  const partes = horaTrimmed.split(':');
  
  // Extrae horas, minutos y segundos (si existen)
  let horas = partes[0] || '00';
  let minutos = partes[1] || '00';
  let segundos = partes[2] || '00';
  
  // Asegura que horas, minutos y segundos tengan 2 dígitos
  horas = horas.padStart(2, '0');
  minutos = minutos.padStart(2, '0');
  segundos = segundos.padStart(2, '0');
  
  // Combina las partes en el formato HH:MM:SS
  return `${horas}:${minutos}:${segundos}`;
}


export const asegurarSegundos = horaStr => {
  const partes = horaStr.split(':');
  if (partes.length === 2) {
    return `${horaStr}:00`;
  }
  return horaStr;
}

export const esFechaValida = str => {
  const fecha = new Date(str);
  return !isNaN(fecha.getTime());
}

/* CAMBIAR ESTADO DE CITAS PERDIDAS */
export const filtrarFechasAnteriores = (arrayDeObjetos, claveFecha) => {
  const DIAS_TOLERANCIA = process.env.NEXT_PUBLIC_DIAS_TOLERANCIA || 0;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Normaliza la fecha actual

    return arrayDeObjetos.map(async (item) => {
        const bodyUpdate = {
            id: item.id_cita,
            id_paciente: item.id_paciente,
            id_profesional: item.id_profesional,
            carrera: item.carrera || '',
            email: item.email_estudiante || '',
            appointment_date: item.fecha || '',
            start_time: item.hora || '',
            campus: item.campus || '',
            nombre_estudiante: item.nombre_alumno,
            selected_doctor: item.nombre_profesional || '',
            quien_cancela: 'perdida',
            status: item.estado,
            tipo_cita: item.tipo_cita || '',
        };

        const fechaItem = new Date(item[claveFecha]);
        fechaItem.setHours(0, 0, 0, 0);

        // Calcula la fecha límite (fecha de la cita + días de tolerancia)
        const fechaLimite = new Date(fechaItem);
        fechaLimite.setDate(fechaLimite.getDate() + DIAS_TOLERANCIA);

        if (hoy > fechaLimite && item["estado"].includes('reservada')) {
            const res = await changeStatusAppointment(bodyUpdate);
            return { ...item, estado: 'perdida' };
        } else {
            return item;
        }
    });
};
