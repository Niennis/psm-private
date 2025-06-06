import dayjs from "dayjs"
// datos para 30 días
export const fetchScheduleByUser = async (id) => {
  const SCHEDULES_URL = process.env.NEXT_PUBLIC_SHOW_30_DAYS
  const body = {
    usuario_id: id
  }
  const data = await fetch(SCHEDULES_URL, {
    method: "POST",
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
    },
    body: JSON.stringify(body)
  })
  return data.json()
}

// info por día showBloques
export const fetchScheduleByDate = async (id, date) => {
  const SHOW_BLOQUES = process.env.NEXT_PUBLIC_SHOW_SCHEDULE_BY_DATE;
  const body = {
    usuario_id: id,
    fecha: date
  }

  const data = await fetch(SHOW_BLOQUES, {
    method: "POST",
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*'
    },
    body: JSON.stringify(body)
  })
  const response = await data.json()

  return response;
}

// BLOQUES DISPONIBLES POR DIA
export const fetchBlocksAvailables = async (id, date) => {
  const SHOW_BLOQUES = process.env.NEXT_PUBLIC_SCHEDULE_AVAILABLE;
  const body = {
    usuario_id: id,
    fecha: date
  }
  const data = await fetch(SHOW_BLOQUES, {
    method: "POST",
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*'
    },
    body: JSON.stringify(body)
  })
  const response = await data.json()
  return response;
}

// SHOW DISPONIBILIDADES
export const fetchScheduleByAvailability = async (id) => {
  const SCHEDULES_URL = process.env.NEXT_PUBLIC_SHOW_DISPONIBILIDADES;
  const body = {
    id_user: id
  }

  const data = await fetch(SCHEDULES_URL, {
    method: "POST",
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*'
    },
    body: JSON.stringify(body)
  })
  const response = await data.json()
  return response
}

const obtenerFechasUnicas = (hours) => {
  const fechas = hours.map((hour) => hour.fechaInicio);
  return [...new Set(fechas)]; // Elimina duplicados usando Set
};

export const generarHorasMedicas = async (id) => {
  // Obtener los horarios de disponibilidad del profesional
  const { users: schedules } = await fetchScheduleByAvailability(id);

  // Obtener todas las fechas únicas de los horarios
  const fechasUnicas = [...new Set(schedules.map(schedule => schedule.fechaInicio))];

  // Obtener los bloques disponibles para cada fecha
  const bloquesPromesas = fechasUnicas.map(async (date) => {
    const { bloques } = await fetchBlocksAvailables(id, date);
    
    return bloques?.map(bloque => ({ ...bloque, fecha: date }));
  });

  const bloquesDisponibles = (await Promise.all(bloquesPromesas)).flat();

  // Función para convertir hora a minutos para comparaciones
  const horaAMinutos = (hora) => {
    const [h, m, s] = hora.split(':').map(Number);
    return h * 60 + m;
  };

  // Procesar cada horario para determinar disponibilidad
  const horasMedicas = schedules.map(schedule => {
    const inicioSchedule = horaAMinutos(schedule.horaIni);
    const finSchedule = horaAMinutos(schedule.horaFin);

    // Buscar bloques que coincidan con este horario
    const bloquesEnEsteHorario = bloquesDisponibles.filter(bloque => {
      
      if (bloque?.fecha !== schedule.fechaInicio) return false;

      const inicioBloque = horaAMinutos(bloque.hora_inicio);
      const finBloque = horaAMinutos(bloque.hora_fin);
      
      // Verificar si el bloque está dentro del horario del schedule
      return (
        (inicioBloque >= inicioSchedule && finBloque <= finSchedule) &&
        bloque.usuario_id === schedule.id_user
      );
    });

    // Calcular disponibilidad (promedio de bloques disponibles)
    const totalBloques = bloquesEnEsteHorario.length;
    const bloquesDisponiblesCount = bloquesEnEsteHorario.filter(b => b.disponible === 1).length;
    const disponibilidad = totalBloques > 0 ? bloquesDisponiblesCount / totalBloques : 0;

    return {
      detalleServicio: schedule.detalleServicio,
      dia: schedule.dia,
      duracionServicio: schedule.duracionServicio,
      fechaInicio: schedule.fechaInicio,
      fechaFin: schedule.fechaFin,
      frecuencia: schedule.frecuencia,
      horaInicio: schedule.horaIni,
      horaFin: schedule.horaFin,
      id_disponibilidad: schedule.id,
      id_bloque: schedule.id_bloque,
      id_user: schedule.id_user,
      campus: schedule.campus,
      modalidad: schedule.modalidad,
      repeticiones: schedule.repeticiones,
      tipo: schedule.tipo,
      tipoServicio: schedule.tipoServicio,
      uuid: schedule.uuid,
      disponible: disponibilidad
    };
  });
  return horasMedicas;
};


const recurrencia = (obj) => {
  if (obj.frecuencia === "diaria") {
    if (obj.diaria.tipo === "recurrente") {
      return obj.diaria.recurrencia
    } else {
      return "1"
    }
  } else if (obj.frecuencia === "semanal") {
    return obj.semanal.recurrencia
  } else if (obj.frecuencia === "mensual") {
    if (obj.mensual.tipo === "cardinal") {
      return obj.mensual["cardinal-frecuencia"]
    } else {
      return obj.mensual["ordinal-frecuencia"]
    }
  } else {
    return ""
  }
}

const sumarDiasAFecha = (fechaOriginal, diasASumar) => {
  const fecha = new Date(fechaOriginal);
  fecha.setDate(fecha.getDate() + parseInt(diasASumar));
  return fecha.toISOString().split('T')[0];
}

const obtenerFechasSemana = (objeto, fechas) => {
  const { dias, fecha_inicio, fechaFin } = objeto;
  // const fechas = [];
  const semana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']

  // Función para verificar si una fecha corresponde a un día de la semana
  const esDiaDeLaSemana = (fecha, dia) => {
    return fecha.getDay() === semana.indexOf(dia);
  }

  dias.forEach(dia => {
    let fechaActual = new Date(fecha_inicio + 'T00:00:00');
    while (fechaActual <= new Date(fechaFin + 'T00:00:00')) {

      const esDiaValido = esDiaDeLaSemana(fechaActual, dia) &&
        fechaActual.getDay() !== 0 && fechaActual.getDay() !== 6;

      if (esDiaValido) {
        fechas.push(fechaActual.toISOString().split('T')[0]);
      }
      fechaActual = new Date(fechaActual.setDate(fechaActual.getDate() + 1))
    }
  })
  return fechas;
}

const obtenerFechasMensualesDia = (objeto, fechas) => {
  const { fecha_inicio, fechaFin, mensual } = objeto;

  // Convertir la fecha de inicio y fin a objetos Date
  let fechaActual = new Date(fecha_inicio + 'T00:00:00');
  const fechaFinal = new Date(fechaFin + 'T00:00:00');
  // Extraer la frecuencia mensual y el día especificado
  const frecuenciaMensual = parseInt(mensual['cardinal-frecuencia']);
  const diaMensual = parseInt(mensual['cardinal-numero']);

  // Obtener el mes y año del `fechaInicio`
  let mes = fechaActual.getMonth() + 1;
  let año = fechaActual.getFullYear();

  // Si el día es menor al día mensual, ir al siguiente mes
  if (fechaActual.getDate() < diaMensual) {
    mes++;
    if (mes > 12) {
      mes = 1;
      año++;
    }
  }
  // Establecer la fecha actual al día 5 del mes siguiente al `fechaInicio`
  fechaActual = new Date(año, mes - 1, diaMensual);
  // Mientras la fecha actual sea menor o igual a la fecha final
  while (fechaActual <= fechaFinal) {
    // Agregar la fecha actual al array de fechas
    fechas.push(fechaActual.toISOString().split('T')[0]);

    // Incrementar la fecha actual según la frecuencia mensual
    fechaActual.setMonth(fechaActual.getMonth() + frecuenciaMensual);
  }
  return fechas;
}

const obtenerFechasMensuales = (objeto, fechas) => {
  const { fecha_inicio, fechaFin, mensual } = objeto;
  const { 'ordinal-orden': tipo, 'ordinal-dia': diaSemana, 'ordinal-frecuencia': frecuencia } = mensual;

  const semana = { 'lunes': 1, 'martes': 2, 'miércoles': 3, 'jueves': 4, 'viernes': 5 }
  const ordenDia = {
    'primer': 1, "segundo": 2, "tercer": 3, "cuarto": 4, "último": 5
  }
  const [añoInicio, mesInicio, diaInicio] = fecha_inicio.split('-').map(Number);
  const [añoFin, mesFin] = fechaFin.split('-').map(Number);

  let mesActual = mesInicio;
  let añoActual = añoInicio;
  let contador = 0
  for (let i = 1; i <= diaInicio; i++) {
    let diaActual = new Date(añoActual, mesActual - 1, i); // dia de semana, del 0 al 6

    if (semana[diaSemana] === diaActual.getDay()) {
      contador++;
      if (contador === ordenDia[tipo]) {
        if ((diaInicio > i + ordenDia[tipo]) && ((((ordenDia[tipo] - 1) * 7) < i && i <= ordenDia[tipo] * 7))) {
          mesActual++
        }
      }
    }
  }

  for (let año = añoActual; año <= añoFin; año++) {
    const mesInicial = año === añoActual ? mesActual : 1;
    const mesFinal = año === añoFin ? mesFin : 12;

    for (let mes = mesInicial; mes <= mesFinal; mes++) {
      if ((mes - mesInicial) % parseInt(frecuencia) === 0) {
        const diasEnMes = new Date(año, mes, 0).getDate();
        let contador = 0;

        for (let dia = 1; dia <= diasEnMes; dia++) {
          const fecha = new Date(año, mes - 1, dia);

          if (fecha.getDay() === semana[diaSemana]) {
            contador++;
            if ((tipo === 'primer' && contador === 1) ||
              (tipo === 'segundo' && contador === 2) ||
              (tipo === 'tercer' && contador === 3) ||
              (tipo === 'cuarto' && contador === 4) ||
              (tipo === 'último' && dia + 7 > diasEnMes)) {
              const fechaFormateada = fecha.toISOString().split('T')[0];
              if (fechaFormateada >= fecha_inicio && fechaFormateada <= fechaFin) {
                fechas.push(fechaFormateada);
              }
            }
          }
        }
      }
    }
  }
  return fechas;
}

// Calcula las fechas pedidas, entra un objeto, debe retornar un array con fechas
export const getDates = (body) => {
  const fechas = []
  if (body.frecuencia === 'diaria') {
    let fechaActual = new Date(`${body.fecha_inicio}T14:00:00`)
    let fechaFin = new Date(`${body.fechaFin}T14:00:00`)

    while (fechaActual <= fechaFin) {
      if (fechaActual.getDay() !== 0 && fechaActual.getDay() !== 6) {
        fechas.push(fechaActual.toISOString().split('T')[0])
      }
      let recurrencia = body.diaria.tipo === 'recurrente' ? body.diaria.recurrencia : 1
      fechaActual = new Date(fechaActual.setDate(fechaActual.getDate() + Number(recurrencia)))
    }
  } else if (body.frecuencia === 'semanal') {
    obtenerFechasSemana(body, fechas)
  } else if (body.frecuencia === 'mensual') {
    if (body.mensual.tipo === 'cardinal') {
      obtenerFechasMensualesDia(body, fechas)
    } else {
      obtenerFechasMensuales(body, fechas)
    }
  }
  return fechas;
}

// CREATE DISPONIBILIDADES
export const createSchedule = async (schedule) => {
  // const SCHEDULES_URL = process.env.NEXT_PUBLIC_CREATE_DISPONIBILIDADES
  const SCHEDULES_URL = 'https://edituserexcel-g5c9f2drbzb9evb9.eastus-01.azurewebsites.net/main'
  const semana = ["lunes", "martes", "miércoles", "jueves", "viernes"]

  const body = {
    "campus": schedule.campus,
    "detalleServicio": schedule.title,
    "dias": schedule.frecuencia === "semanal" ? schedule.semanal.dia
      : schedule.frecuencia === "mensual" ? [schedule.mensual['ordinal-dia']] : semana,
    "duracionServicio": schedule.duracionServicio,
    "fechaInicio": dayjs(schedule.fecha_inicio).format('YYYY-MM-DD'),
    "fechaFin": dayjs(schedule.fechaFin).format('YYYY-MM-DD'),
    "frecuencia": schedule.frecuencia,
    "horaIni": schedule.horaIni,
    "horaFin": schedule.horaFin,
    "id_user": schedule.id_user,
    "modalidad": schedule.modalidad,
    "orden": schedule?.mensual?.["ordinal-orden"] || " ",
    "repeticiones": "",
    "tipo": "profesional",
    "tipo_cita": schedule.tipo_cita,
  }

  if (body.frecuencia !== "semanal") {
    body.recurrencia = recurrencia(schedule)
  }

  if (schedule.mensual["cardinal-numero"]) {
    body.diaNumero = schedule.mensual["cardinal-numero"]
  }

  // getDates(body)
  const data = await fetch(SCHEDULES_URL, {
    method: "POST",
    cors: "no-cors",
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
    },
    body: JSON.stringify(body)
  })
  const response = await data.json()
  return response
}

// EDIT BLOQUES DISPONIBLES
export const editBloqueDisponible = async (id_bloque, id_user) => {
  const EDIT_BLOQUE_URL = process.env.NEXT_PUBLIC_EDIT_BLOQUE_DISPONIBLE;
  const body = {
    id_bloque: id_bloque,
    id_user: id_user,
    comentario: 'cambio'
  }

  try {
    const data = await fetch(EDIT_BLOQUE_URL, {
      method: "POST",
      cors: "no-cors",
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

// Retorna true si hay choque de horario
const hayChoqueHorario = (inicioMayor, finMayor, bloquesMenores) => {
  for (const bloqueMenor of bloquesMenores) {
    const { hora_inicio, hora_fin } = bloqueMenor;

    const inicioMenor = hora_inicio.length < 8 ? (`0${hora_inicio}`).slice(0, 5) : hora_inicio.slice(0, 5)

    const finMenor = hora_fin.length < 8 ? (`0${hora_fin}`).slice(0, 5) : hora_fin.slice(0, 5)

    // Convertir las horas a objetos Date para facilitar la comparación
    const inicioMayorDate = new Date(`1970-01-01T${inicioMayor}`);
    const finMayorDate = new Date(`1970-01-01T${finMayor}`);
    const inicioMenorDate = new Date(`1970-01-01T${inicioMenor}`);
    const finMenorDate = new Date(`1970-01-01T${finMenor}`);

    // Comprobar si hay solapamiento de horarios
    if ((inicioMayorDate < finMenorDate && finMayorDate > inicioMenorDate) ||
      (inicioMenorDate < finMayorDate && finMenorDate > inicioMayorDate)) {
      return true; // Hay choque de horario
    }
  }
  return false; // No hay choque de horario
}

export const validateDates = async (fecha, horaInicio, horaFin, id) => {
  const { bloques: bloquesMenores } = await fetchScheduleByDate(id, fecha)

  if (bloquesMenores.length === 0) {
    return false
  } else {
    return hayChoqueHorario(horaInicio, horaFin, bloquesMenores)
  }
}

export const getSpecialities = async () => {
  const SPECIALITIES = process.env.NEXT_PUBLIC_ESPECIALIDADES;
  try {
    const data = await fetch(SPECIALITIES, {
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*',
      }
    })
    return data.json()
  } catch (error) {
    console.log('Error:', error)
  }
}

export const tomarHoraDisponible = (bloques, hora, disponibilidades, fecha) => {
  let duracion;
  let idBloque;
  const bloquesCambiarEstado = []

  const disponibilidadIndex = disponibilidades.findIndex(item => (item.horaIni === hora) && (item.fechaInicio === fecha))
  const bloqueIndex = bloques.findIndex(bloque => bloque.hora_inicio === hora);
  if (disponibilidadIndex !== -1 && bloqueIndex !== -1) {
    duracion = disponibilidades[disponibilidadIndex].duracionServicio
    idBloque = bloques[bloqueIndex].id;

    let bloquesCantidad = duracion / 5
    for (let i = 0; i < bloquesCantidad; i++) {
      bloquesCambiarEstado.push(bloques[bloqueIndex + i])
    }
  }
  return bloquesCambiarEstado
}

// Utilidades para manejar horas como objetos Date
const parseTime = (time) => {
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return new Date(1970, 0, 1, hours, minutes, seconds);
};

const formatTime = (date) =>
  date.toTimeString().split(" ")[0];

const addMinutes = (date, minutes) =>
  new Date(date.getTime() + minutes * 60000);

// Función para extraer el mes y año de una fecha
const getMonthYear = (dateString) => {
  const date = new Date(dateString);
  return { month: date.getMonth(), year: date.getFullYear() };
};

// Estado inicial para el mes actual
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();


// Función para filtrar por mes y año
const filtrarPorMes = (disponibilidades, bloques, month, year) => {
  return {
    disponibilidades: disponibilidades.filter(({ horaInicio }) => {
      const { month: m, year: y } = getMonthYear(horaInicio);
      return m === month && y === year;
    }),
    bloques: bloques.filter(({ horaInicio }) => {
      const { month: m, year: y } = getMonthYear(horaInicio);
      return m === month && y === year;
    }),
  };
}


// Navegación entre meses
const cambiarMes = (direccion) => {
  if (direccion === "siguiente") {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
  } else if (direccion === "anterior") {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
  }
}

export const editDisponibilidad = async (body) => {
  const url = `${process.env.NEXT_PUBLIC_EDIT_DISPONIBILIDAD}/editdisponibilidad`
  try {
    const data = await fetch(url, {
      method: "POST",
      cors: "no-cors",
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    const response = await data.json()

    return response
  } catch (error) {
    console.log(error)
  }
}

export const deleteDisponibilidad = async (id) => {
  const url = `${process.env.NEXT_PUBLIC_EDIT_DISPONIBILIDAD}/deletedisponibilidad`
  const body = {
    "id_disponibilidad": id
  }

  try {
    const data = await fetch(url, {
      method: "POST",
      cors: "no-cors",
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(body)
    })
    const response = await data.json()
    return response;
  } catch (error) {
    console.log('Error:', error)
  }
}

export const eliminarDisponibilidadPorId = async (id) => {
  const URL = `${process.env.NEXT_PUBLIC_DISPONIBILIDADES}/delete/id`
  const body = {
    id: id
  }
  try {
    const data = await fetch(URL, {
      method: "POST",
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*',
      },
      body: JSON.stringify(body)
    })
    const response = await data.json()

    return response
  } catch (error) {
    console.log('Error:', error);
    return error
  }
}

export const eliminarDisponibilidadCompleta = async (uuid) => {

  const URL = `${process.env.NEXT_PUBLIC_DISPONIBILIDADES}/delete/uuid`
  const body = {
    uuid: uuid
  }
  try {
    const data = await fetch(URL, {
      method: "POST",
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*',
      },
      body: JSON.stringify(body)
    })
    const response = await data.json()
    return response

  } catch (error) {
    console.log('Error:', error);
    return error
  }
}

