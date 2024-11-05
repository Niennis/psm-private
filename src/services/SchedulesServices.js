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

// info por día
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

// SHOW DISPONIBILIDADES
export const fetchScheduleByAvailability = async (id) => {
  const SCHEDULES_URL = process.env.NEXT_PUBLIC_SHOW_DISPONIBILIDADES;
  const body = {
    id_user: id
  }
  console.log('body', body);
  const data = await fetch(SCHEDULES_URL, {
    method: "POST",
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*'
    },
    body: JSON.stringify(body)
  })
  return data.json()
}

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
  const { dias, fechaInicio, fechaFin } = objeto;
  const recurrencia = objeto.semanal.recurrencia
  // const fechas = [];
  const semana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
  // console.log('obtenerFechasSemana', dias)

  // Función para verificar si una fecha corresponde a un día de la semana
  const esDiaDeLaSemana = (fecha, dia) => {
    // console.log('bleh', fecha.getDay(), semana.indexOf(dia), dia);
    return fecha.getDay() === semana.indexOf(dia);
  }
  // Convertir fecha de inicio a objeto Date
  // Mientras la fecha actual sea menor o igual a la fecha de fin
  dias.forEach(dia => {
    let fechaActual = new Date(fechaInicio + 'T00:00:00');
    while (fechaActual <= new Date(fechaFin + 'T00:00:00')) {
      // Verificar si la fecha actual es un día de la semana válido y no es sábado ni domingo
      const esDiaValido = esDiaDeLaSemana(fechaActual, dia) &&
        fechaActual.getDay() !== 0 && fechaActual.getDay() !== 6;
      // Si es un día válido, agregarlo a la lista de fechas
      if (esDiaValido) {
        fechas.push(fechaActual.toISOString().split('T')[0]);
      }
      fechaActual = new Date(fechaActual.setDate(fechaActual.getDate() + 1))
    }
  })
  console.log('obtenerFechasSemana', 'fechas', fechas)
  return fechas;
}

const obtenerFechasMensualesDia = (objeto, fechas) => {
  const { fechaInicio, fechaFin, mensual } = objeto;

  // Convertir la fecha de inicio y fin a objetos Date
  let fechaActual = new Date(fechaInicio + 'T00:00:00');
  const fechaFinal = new Date(fechaFin + 'T00:00:00');
  console.log('fechaActual', fechaActual);
  // Extraer la frecuencia mensual y el día especificado
  const frecuenciaMensual = parseInt(mensual['cardinal-frecuencia']);
  const diaMensual = parseInt(mensual['cardinal-numero']);

  // Obtener el mes y año del `fechaInicio`
  let mes = fechaActual.getMonth() + 1;
  let año = fechaActual.getFullYear();

  // Si el día es menor al día mensual, ir al siguiente mes
  console.log('FECHA actual', fechaActual.getDate(), diaMensual);
  console.log('mes actual', mes);
  if (fechaActual.getDate() < diaMensual) {
    mes++;
    if (mes > 12) {
      mes = 1;
      año++;
    }
  }
  console.log('MES', mes)
  // Establecer la fecha actual al día 5 del mes siguiente al `fechaInicio`
  fechaActual = new Date(año, mes - 1, diaMensual);
  // Mientras la fecha actual sea menor o igual a la fecha final
  console.log('fechaActual <= fechaFinal', fechaActual, fechaFinal);
  while (fechaActual <= fechaFinal) {
    // Agregar la fecha actual al array de fechas
    fechas.push(fechaActual.toISOString().split('T')[0]);

    // Incrementar la fecha actual según la frecuencia mensual
    fechaActual.setMonth(fechaActual.getMonth() + frecuenciaMensual);
  }
  console.log('obtenerFechasMensualesDia', fechas)
  return fechas;
}

const obtenerFechasMensuales = (objeto, fechas) => {
  const { fechaInicio, fechaFin, mensual } = objeto;
  const { 'ordinal-orden': tipo, 'ordinal-dia': diaSemana, 'ordinal-frecuencia': frecuencia } = mensual;

  const semana = { 'lunes': 1, 'martes': 2, 'miércoles': 3, 'jueves': 4, 'viernes': 5 }
  const ordenDia = {
    'primer': 1, "segundo": 2, "tercer": 3, "cuarto": 4, "último": 5
  }
  const [añoInicio, mesInicio, diaInicio] = fechaInicio.split('-').map(Number);
  const [añoFin, mesFin] = fechaFin.split('-').map(Number);

  let mesActual = mesInicio;
  let añoActual = añoInicio;
  let contador = 0
  for (let i = 1; i <= diaInicio; i++) {
    let diaActual = new Date(añoActual, mesActual - 1, i); // dia de semana, del 0 al 6

    if (semana[diaSemana] === diaActual.getDay()) {
      console.log('contador', contador, ordenDia[tipo]);
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
    console.log('EN EL FOR', mesInicial)

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
              if (fechaFormateada >= fechaInicio && fechaFormateada <= fechaFin) {
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
    let fechaActual = new Date(`${body.fechaInicio}T14:00:00`)
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
  console.log('FECHAS', fechas)
  return fechas;
}

// CREATE DISPONIBILIDADES
export const createSchedule = async (schedule) => {
  const SCHEDULES_URL = process.env.NEXT_PUBLIC_CREATE_DISPONIBILIDADES
  const semana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes']

  const body = {
    "detalleServicio": schedule.title,
    "dias": schedule.frecuencia === "semanal" ? schedule.semanal.dia
      : schedule.frecuencia === "mensual" ? [schedule.mensual['ordinal-dia']] : semana,
    "duracionServicio": schedule.duracionServicio,
    "fechaInicio": schedule.fechaInicio,
    "fechaFin": schedule.fechaFin,
    "frecuencia": schedule.frecuencia,
    "horaIni": schedule.horaIni,
    "horaFin": schedule.horaFin,
    "id_user": schedule.id_user,
    "modalidad": schedule.modalidad,
    "orden": schedule?.mensual?.["ordinal-orden"] || " ",
    "repeticiones": "",
    "tipo": "profesional",
    "tipo_cita": schedule.tipo_cita
  }

  if (body.frecuencia !== 'semanal') {
    body.recurrencia = recurrencia(schedule)
    body.diaNumero = schedule.mensual["cardinal-numero"]
  }

  console.log('BODY', body)

  // getDates(body)
  const data = await fetch(SCHEDULES_URL, {
    method: "POST",
    cors: "no-cors",
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
      'ngrok-skip-browser-warning': 'any'
    },
    body: JSON.stringify(body)
  })
  const response = await data.json()
  console.log('RESPONSE', response)
  return response
}

// https://us-central1-mkt-003001-00813.cloudfunctions.net/ZRZ-updateBloque
// EDIT BLOQUES DISPONIBLES
export const editBloqueDisponible = async (id_bloque, id_user) => {
  const EDIT_BLOQUE_URL = process.env.NEXT_PUBLIC_EDIT_BLOQUE_DISPONIBLE;
  const body = {
    id_bloque: id_bloque,
    id_user: id_user,
    comentario: ''
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

    console.log('RESPONSE de editBloqueDisponibles', response)
    return response
  } catch (error) {
    console.log('Error', error)
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
      console.log('HAY CHOQUE')
      return true; // Hay choque de horario
    }
  }

  return false; // No hay choque de horario
}

export const validateDates = async (fecha, horaInicio, horaFin, id) => {
  // console.log('VALIDA', fecha, horaInicio, horaFin, id)
  const { bloques: bloquesMenores } = await fetchScheduleByDate(id, fecha)
  // console.log('BLOQUESMENORES', bloquesMenores)

  if (bloquesMenores.length === 0) {
    // console.log('TAMBIÉN ENTRA AQUÍ');
    return false
  } else {
    // console.log('HAY CHOQUE', hayChoqueHorario(horaInicio, horaFin, bloquesMenores))
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
        'ngrok-skip-browser-warning': 'any'
      }
    })
    return data.json()
  } catch (error) {
    console.log('Error: ', error)
  }
}

/* 

// Función para calcular los intervalos de tiempo
function calcularIntervalos(horaInicio, horaFin, duracionServicio) {
  const intervalos = [];
  let hora = horaInicio;

  while (hora <= horaFin) {
    intervalos.push(hora);
    // Agregar la duración del servicio a la hora actual
    const [horas, minutos, segundos] = hora.split(":").map(Number);
    const tiempoTotal = horas * 3600 + minutos * 60 + segundos;
    const nuevoTiempoTotal = tiempoTotal + (duracionServicio * 60);
    const nuevaHora = new Date(0, 0, 0, 0, 0, nuevoTiempoTotal);
    hora = nuevaHora.toLocaleTimeString("en-US", { hour12: false });
  }

  return intervalos;
}

// Función para combinar los resultados
function combinarResultados(resultados) {
  return resultados.reduce((acumulador, resultado) => {
    return acumulador.concat(resultado);
  }, []);
}

// Calculando los intervalos de tiempo para cada usuario
const resultadosIndividuales = servicio1Response.users.map(usuario => {
  return calcularIntervalos(usuario.horaIni, usuario.horaFin, usuario.duracionServicio);
});

// Combinando los resultados individuales en un solo array
const intervalosDeTiempo = combinarResultados(resultadosIndividuales);

// Filtrando los bloques del segundo servicio que coincidan con los intervalos calculados
const bloquesFiltrados = servicio2Response.bloques.filter(bloque => {
  return intervalosDeTiempo.some(intervalo => {
    const [bloqueHoraInicio, bloqueMinutosInicio] = bloque.hora_inicio.split(":").map(Number);
    const [bloqueHoraFin, bloqueMinutosFin] = bloque.hora_fin.split(":").map(Number);
    const [intervaloHora, intervaloMinutos] = intervalo.split(":").map(Number);
    return (
      bloqueHoraInicio === intervaloHora &&
      bloqueMinutosInicio === intervaloMinutos &&
      bloqueHoraFin >= intervaloHora &&
      bloqueMinutosFin >= intervaloMinutos
    );
  });
});

// Formateando los datos resultantes
const resultadoFinal = bloquesFiltrados.map(bloque => ({
  horaInicio: bloque.hora_inicio
})); */