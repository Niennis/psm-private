// ============================================================
// USUARIOS (pacientes / alumnos)
// ============================================================
export const mockUsers = [
  {
    id: 1,
    nombre: "Admin",
    apellido: "Principal",
    rut: "1-1",
    email: "admin@mail.udp.cl",
    genero: "masculino",
    telefono: "+56911111111",
    tipo_usuario: "administrador",
    status: "activo",
    validacion: true
  },
  {
    id: 2,
    nombre: "Pedro",
    apellido: "Profesional",
    rut: "2-2",
    email: "pedro.profesional@mail.udp.cl",
    genero: "masculino",
    telefono: "+56922222222",
    tipo_usuario: "profesional",
    status: "activo",
    validacion: true
  },
  {
    id: 3,
    nombre: "Ana",
    apellido: "González",
    nombre_social: "",
    rut: "12345678-9",
    email: "ana.gonzalez@mail.udp.cl",
    genero: "femenino",
    telefono: "+56933333333",
    fecha_nacimiento: "2002-05-14T00:00:00.000Z",
    tipo_usuario: "alumno",
    carrera: "Psicología",
    anoIngresoCarrera: "2021",
    jornada: "diurna",
    campus: "Sede Centro",
    direccion: "Av. República 180",
    region: "Región Metropolitana",
    comuna: "Santiago",
    status: "activo",
    validacion: true,
    despeje: false,
    aplica_despeje: true,
    contacto1_id: 1,
    contacto1_nombre: "María González",
    contacto1_email: "maria.gonzalez@gmail.com",
    contacto1_numero: "+56988888888",
    contacto1_relacion: "Madre",
    contacto2_id: 0,
    contacto2_nombre: "NA",
    contacto2_email: "NA",
    contacto2_numero: "NA",
    contacto2_relacion: "NA"
  },
  {
    id: 4,
    nombre: "Beto",
    apellido: "Blend",
    rut: "4-4",
    email: "beto.blend@mail.udp.cl",
    genero: "masculino",
    telefono: "+56944444444",
    tipo_usuario: "blend",
    status: "activo",
    validacion: true
  },
  {
    id: 5,
    nombre: "Camila",
    apellido: "Soto",
    nombre_social: "",
    rut: "19876543-2",
    email: "camila.soto@mail.udp.cl",
    genero: "femenino",
    telefono: "+56955555555",
    fecha_nacimiento: "2001-11-03T00:00:00.000Z",
    tipo_usuario: "alumno",
    carrera: "Derecho",
    anoIngresoCarrera: "2022",
    jornada: "vespertina",
    campus: "Sede Huechuraba",
    direccion: "Calle Huérfanos 456",
    region: "Región Metropolitana",
    comuna: "Providencia",
    status: "activo",
    validacion: true,
    despeje: false,
    aplica_despeje: true,
    contacto1_id: 2,
    contacto1_nombre: "Jorge Soto",
    contacto1_email: "jorge.soto@gmail.com",
    contacto1_numero: "+56999999999",
    contacto1_relacion: "Padre",
    contacto2_id: 0,
    contacto2_nombre: "NA",
    contacto2_email: "NA",
    contacto2_numero: "NA",
    contacto2_relacion: "NA"
  },
  {
    id: 6,
    nombre: "Nicolás",
    apellido: "Vargas",
    nombre_social: "Nico",
    rut: "17654321-0",
    email: "nicolas.vargas@mail.udp.cl",
    genero: "masculino",
    telefono: "+56966666666",
    fecha_nacimiento: "2000-03-22T00:00:00.000Z",
    tipo_usuario: "alumno",
    carrera: "Ingeniería Civil",
    anoIngresoCarrera: "2020",
    jornada: "diurna",
    campus: "Sede Centro",
    direccion: "Pasaje Los Aromos 12",
    region: "Región Metropolitana",
    comuna: "Ñuñoa",
    status: "activo",
    validacion: true,
    despeje: true,
    aplica_despeje: false,
    contacto1_id: 0,
    contacto1_nombre: "NA",
    contacto1_email: "NA",
    contacto1_numero: "NA",
    contacto1_relacion: "NA",
    contacto2_id: 0,
    contacto2_nombre: "NA",
    contacto2_email: "NA",
    contacto2_numero: "NA",
    contacto2_relacion: "NA"
  },
  {
    id: 8,
    nombre: "Estefanía",
    apellido: "Osses",
    nombre_social: "",
    rut: "99999999-9",
    email: "estefania.osses.v@gmail.com",
    genero: "femenino",
    telefono: "+56900000000",
    fecha_nacimiento: "2000-01-01T00:00:00.000Z",
    tipo_usuario: "alumno",
    carrera: "Ingeniería en Informática",
    anoIngresoCarrera: "2020",
    jornada: "diurna",
    campus: "Sede Centro",
    direccion: "Av. Ejemplo 123",
    region: "Región Metropolitana",
    comuna: "Santiago",
    status: "activo",
    validacion: true,
    despeje: false,
    aplica_despeje: true,
    contacto1_id: 0,
    contacto1_nombre: "NA",
    contacto1_email: "NA",
    contacto1_numero: "NA",
    contacto1_relacion: "NA",
    contacto2_id: 0,
    contacto2_nombre: "NA",
    contacto2_email: "NA",
    contacto2_numero: "NA",
    contacto2_relacion: "NA"
  },
  {
    id: 7,
    nombre: "Valentina",
    apellido: "Morales",
    nombre_social: "",
    rut: "20111222-3",
    email: "valentina.morales@mail.udp.cl",
    genero: "femenino",
    telefono: "+56977777777",
    fecha_nacimiento: "2003-08-17T00:00:00.000Z",
    tipo_usuario: "alumno",
    carrera: "Comunicaciones",
    anoIngresoCarrera: "2023",
    jornada: "diurna",
    campus: "Sede Centro",
    direccion: "Av. Italia 789",
    region: "Región Metropolitana",
    comuna: "Macul",
    status: "activo",
    validacion: true,
    despeje: false,
    aplica_despeje: true,
    contacto1_id: 0,
    contacto1_nombre: "NA",
    contacto1_email: "NA",
    contacto1_numero: "NA",
    contacto1_relacion: "NA",
    contacto2_id: 0,
    contacto2_nombre: "NA",
    contacto2_email: "NA",
    contacto2_numero: "NA",
    contacto2_relacion: "NA"
  }
];

// ============================================================
// PROFESIONALES
// ============================================================
export const mockProfessionals = [
  {
    id: 2,
    nombre: "Pedro",
    apellido: "Profesional",
    email: "pedro.profesional@mail.udp.cl",
    genero: "masculino",
    telefono: "+56922222222",
    tipo_usuario: "profesional",
    status: "activo",
    especialidad: "Psiquiatría",
    campus: "Sede Centro"
  },
  {
    id: 4,
    nombre: "Beto",
    apellido: "Blend",
    email: "beto.blend@mail.udp.cl",
    genero: "masculino",
    telefono: "+56944444444",
    tipo_usuario: "blend",
    status: "activo",
    especialidad: "Psicología Clínica",
    campus: "Sede Huechuraba"
  },
  {
    id: 8,
    nombre: "Laura",
    apellido: "Ramírez",
    email: "laura.ramirez@mail.udp.cl",
    genero: "femenino",
    telefono: "+56988888888",
    tipo_usuario: "profesional",
    status: "activo",
    especialidad: "Psicoterapia Infantil",
    campus: "Sede Centro"
  }
];

// ============================================================
// ESPECIALIDADES
// ============================================================
export const mockSpecialities = [
  { id: 1, especialidad: "Psiquiatría" },
  { id: 2, especialidad: "Psicología Clínica" },
  { id: 3, especialidad: "Psicoterapia Infantil" },
  { id: 4, especialidad: "Trabajo Social" },
  { id: 5, especialidad: "Intervención en Crisis" }
];

// Especialidades asignadas por profesional (para endpoint /byid)
export const mockProfessionalSpecialities = [
  { usuario_id: 2, id_especialidad: 1, especialidad: "Psiquiatría" },
  { usuario_id: 4, id_especialidad: 2, especialidad: "Psicología Clínica" },
  { usuario_id: 8, id_especialidad: 3, especialidad: "Psicoterapia Infantil" }
];

// ============================================================
// DISPONIBILIDADES (showdisponibilidad - configuración de horarios)
// ============================================================
export const mockAvailability = [
  {
    id: 1,
    id_user: 2,
    fechaInicio: "2026-02-23",
    fechaFin: "2026-06-30",
    horaIni: "09:00:00",
    horaFin: "13:00:00",
    dia: "Lunes",
    tipo: "profesional",
    tipo_cita: "individual",
    campus: "Sede Centro",
    modalidad: "Presencial",
    duracionServicio: 20,
    frecuencia: "semanal",
    detalleServicio: "Consulta Individual",
    repeticiones: "",
    uuid: "disp-uuid-001",
    id_bloque: null
  },
  {
    id: 2,
    id_user: 2,
    fechaInicio: "2026-02-25",
    fechaFin: "2026-06-30",
    horaIni: "14:00:00",
    horaFin: "17:00:00",
    dia: "Miércoles",
    tipo: "profesional",
    tipo_cita: "individual",
    campus: "Sede Centro",
    modalidad: "Online",
    duracionServicio: 20,
    frecuencia: "semanal",
    detalleServicio: "Consulta Online",
    repeticiones: "",
    uuid: "disp-uuid-002",
    id_bloque: null
  },
  {
    id: 3,
    id_user: 4,
    fechaInicio: "2026-02-24",
    fechaFin: "2026-06-30",
    horaIni: "10:00:00",
    horaFin: "14:00:00",
    dia: "Martes",
    tipo: "profesional",
    tipo_cita: "individual",
    campus: "Sede Huechuraba",
    modalidad: "Presencial",
    duracionServicio: 20,
    frecuencia: "semanal",
    detalleServicio: "Consulta Individual",
    repeticiones: "",
    uuid: "disp-uuid-003",
    id_bloque: null
  }
];

// ============================================================
// HORARIOS (showbloques30dias - vista de 30 días)
// ============================================================
export const mockSchedules = [
  {
    id: 1,
    id_user: 2,
    fechaInicio: "2026-02-23",
    fechaFin: "2026-06-30",
    horaIni: "09:00:00",
    horaFin: "13:00:00",
    dia: "Lunes",
    tipo: "profesional",
    campus: "Sede Centro",
    modalidad: "Presencial",
    duracionServicio: 20,
    detalleServicio: "Consulta Individual",
    uuid: "disp-uuid-001"
  },
  {
    id: 2,
    id_user: 2,
    fechaInicio: "2026-02-25",
    fechaFin: "2026-06-30",
    horaIni: "14:00:00",
    horaFin: "17:00:00",
    dia: "Miércoles",
    tipo: "profesional",
    campus: "Sede Centro",
    modalidad: "Online",
    duracionServicio: 20,
    detalleServicio: "Consulta Online",
    uuid: "disp-uuid-002"
  }
];

// ============================================================
// BLOQUES (showbloques - bloques de tiempo individuales)
// ============================================================
export const mockBlocks = [
  // Lunes 23 Feb - mañana (profesional 2)
  { id: 101, usuario_id: 2, fecha: "2026-02-23", hora_inicio: "09:00:00", hora_fin: "09:20:00", disponible: 1 },
  { id: 102, usuario_id: 2, fecha: "2026-02-23", hora_inicio: "09:20:00", hora_fin: "09:40:00", disponible: 1 },
  { id: 103, usuario_id: 2, fecha: "2026-02-23", hora_inicio: "09:40:00", hora_fin: "10:00:00", disponible: 0 },
  { id: 104, usuario_id: 2, fecha: "2026-02-23", hora_inicio: "10:00:00", hora_fin: "10:20:00", disponible: 0 },
  { id: 105, usuario_id: 2, fecha: "2026-02-23", hora_inicio: "10:20:00", hora_fin: "10:40:00", disponible: 1 },
  { id: 106, usuario_id: 2, fecha: "2026-02-23", hora_inicio: "10:40:00", hora_fin: "11:00:00", disponible: 1 },
  { id: 107, usuario_id: 2, fecha: "2026-02-23", hora_inicio: "11:00:00", hora_fin: "11:20:00", disponible: 1 },
  { id: 108, usuario_id: 2, fecha: "2026-02-23", hora_inicio: "11:20:00", hora_fin: "11:40:00", disponible: 1 },
  { id: 109, usuario_id: 2, fecha: "2026-02-23", hora_inicio: "11:40:00", hora_fin: "12:00:00", disponible: 0 },
  { id: 110, usuario_id: 2, fecha: "2026-02-23", hora_inicio: "12:00:00", hora_fin: "12:20:00", disponible: 1 },
  // Miércoles 25 Feb - tarde (profesional 2)
  { id: 201, usuario_id: 2, fecha: "2026-02-25", hora_inicio: "14:00:00", hora_fin: "14:20:00", disponible: 1 },
  { id: 202, usuario_id: 2, fecha: "2026-02-25", hora_inicio: "14:20:00", hora_fin: "14:40:00", disponible: 0 },
  { id: 203, usuario_id: 2, fecha: "2026-02-25", hora_inicio: "14:40:00", hora_fin: "15:00:00", disponible: 1 },
  { id: 204, usuario_id: 2, fecha: "2026-02-25", hora_inicio: "15:00:00", hora_fin: "15:20:00", disponible: 1 },
  // Martes 24 Feb (profesional 4)
  { id: 301, usuario_id: 4, fecha: "2026-02-24", hora_inicio: "10:00:00", hora_fin: "10:20:00", disponible: 1 },
  { id: 302, usuario_id: 4, fecha: "2026-02-24", hora_inicio: "10:20:00", hora_fin: "10:40:00", disponible: 1 },
  { id: 303, usuario_id: 4, fecha: "2026-02-24", hora_inicio: "10:40:00", hora_fin: "11:00:00", disponible: 0 }
];

// ============================================================
// CITAS (appointments)
// ============================================================
export const mockAppointments = [
  {
    id_cita: 501,
    id_paciente: 3,
    id_profesional: 2,
    fecha: "2026-02-23",
    hora: "10:00:00",
    estado: "reservada",
    status: "activo",
    campus: "Sede Centro - Manuel Rodríguez Sur 343, 2° piso",
    modalidad: "Presencial",
    nombre_alumno: "Ana González",
    email_estudiante: "ana.gonzalez@mail.udp.cl",
    telefono_estudiante: "+56933333333",
    carrera_estudiante: "Psicología",
    especialidad_profesional: "Psiquiatría",
    nombre_profesional: "Pedro Profesional",
    motivo: "Ansiedad generalizada",
    primera_cita: 1,
    uuid: "uuid-501",
    tipo_cita: "individual"
  },
  {
    id_cita: 502,
    id_paciente: 3,
    id_profesional: 4,
    fecha: "2026-02-14",
    hora: "15:30:00",
    estado: "realizada",
    status: "activo",
    campus: "Sede Huechuraba - Avenida Santa Clara 797, piso -2",
    modalidad: "Presencial",
    nombre_alumno: "Ana González",
    email_estudiante: "ana.gonzalez@mail.udp.cl",
    telefono_estudiante: "+56933333333",
    carrera_estudiante: "Psicología",
    especialidad_profesional: "Psicología Clínica",
    nombre_profesional: "Beto Blend",
    motivo: "Seguimiento estrés académico",
    primera_cita: 0,
    uuid: "uuid-502",
    tipo_cita: "individual"
  },
  {
    id_cita: 503,
    id_paciente: 5,
    id_profesional: 2,
    fecha: "2026-02-25",
    hora: "14:00:00",
    estado: "reservada",
    status: "activo",
    campus: "Videollamada",
    modalidad: "Online",
    nombre_alumno: "Camila Soto",
    email_estudiante: "camila.soto@mail.udp.cl",
    telefono_estudiante: "+56955555555",
    carrera_estudiante: "Derecho",
    especialidad_profesional: "Psiquiatría",
    nombre_profesional: "Pedro Profesional",
    motivo: "Dificultades de concentración y sueño",
    primera_cita: 1,
    uuid: "uuid-503",
    tipo_cita: "individual"
  },
  {
    id_cita: 504,
    id_paciente: 6,
    id_profesional: 4,
    fecha: "2026-02-10",
    hora: "11:00:00",
    estado: "cancelada",
    status: "activo",
    campus: "Sede Huechuraba - Avenida Santa Clara 797, piso -2",
    modalidad: "Presencial",
    nombre_alumno: "Nicolás Vargas",
    email_estudiante: "nicolas.vargas@mail.udp.cl",
    telefono_estudiante: "+56966666666",
    carrera_estudiante: "Ingeniería Civil",
    especialidad_profesional: "Psicología Clínica",
    nombre_profesional: "Beto Blend",
    motivo: "Crisis de pánico",
    primera_cita: 1,
    uuid: "uuid-504",
    tipo_cita: "individual"
  },
  {
    id_cita: 505,
    id_paciente: 7,
    id_profesional: 2,
    fecha: "2026-02-23",
    hora: "12:00:00",
    estado: "reservada",
    status: "activo",
    campus: "Sede Centro - Manuel Rodríguez Sur 343, 2° piso",
    modalidad: "Presencial",
    nombre_alumno: "Valentina Morales",
    email_estudiante: "valentina.morales@mail.udp.cl",
    telefono_estudiante: "+56977777777",
    carrera_estudiante: "Comunicaciones",
    especialidad_profesional: "Psiquiatría",
    nombre_profesional: "Pedro Profesional",
    motivo: "Bajo estado de ánimo",
    primera_cita: 0,
    uuid: "uuid-505",
    tipo_cita: "individual"
  }
];

// ============================================================
// FICHAS / REGISTROS DE ENTREVISTA
// ============================================================
export const mockRecords = [
  {
    id_entrevista: 901,
    id_alumno: 3,
    id_profesional: 4,
    numero_ficha: "F-001",
    profesional_evaluador: "Beto Blend",
    derivado: null,
    nombre_derivado: "",
    fecha: "2026-02-14",
    motivo_consulta: "Ansiedad",
    resumen: "Paciente presenta niveles altos de ansiedad relacionados con el rendimiento académico. Refiere dificultad para dormir y pensamientos intrusivos antes de evaluaciones.",
    observaciones: "Se trabajaron técnicas de respiración y regulación emocional.",
    acuerdos: "Continuar con técnicas de respiración. Próxima sesión en dos semanas.",
    diagnostico: "Trastorno de ansiedad situacional",
    area_atencion_preferencia: "Psicología",
    modalidad_atencion_evaluacion: "Presencial",
    prevision_salud_isapre: "Fonasa",
    prevision_salud_fonasa: "",
    prevision_salud_otro: "",
    como: "Redes sociales UDP",
    derivado_desde: "Autoderivación",
    diagnostico_previo: "Ninguno",
    tratamiento: "Ninguno",
    notas: "Paciente colaboradora y motivada al proceso terapéutico."
  },
  {
    id_entrevista: 903,
    id_alumno: 3,
    id_profesional: 2,
    numero_ficha: "F-002",
    profesional_evaluador: "Pedro Profesional",
    derivado: null,
    nombre_derivado: "",
    fecha: "2026-01-20",
    motivo_consulta: "Ansiedad",
    resumen: "Segunda sesión de seguimiento. Paciente reporta leve mejoría en calidad de sueño. Continúa con técnicas de respiración trabajadas en sesión anterior.",
    observaciones: "Mejora progresiva en calidad de sueño.",
    acuerdos: "Mantener técnicas de respiración. Seguimiento quincenal.",
    diagnostico: "Trastorno de ansiedad situacional",
    area_atencion_preferencia: "Psicología",
    modalidad_atencion_evaluacion: "Presencial",
    prevision_salud_isapre: "Fonasa",
    prevision_salud_fonasa: "",
    prevision_salud_otro: "",
    como: "Derivación interna",
    derivado_desde: "Psiquiatría",
    diagnostico_previo: "Trastorno de ansiedad situacional",
    tratamiento: "Psicoterapia individual",
    notas: "Se sugiere continuar con seguimiento quincenal."
  },
  {
    id_entrevista: 902,
    id_alumno: 5,
    id_profesional: 2,
    numero_ficha: "F-003",
    profesional_evaluador: "Pedro Profesional",
    derivado: null,
    nombre_derivado: "",
    fecha: "2026-02-01",
    motivo_consulta: "Insomnio",
    resumen: "Paciente relata episodios de insomnio de más de 3 semanas de duración. Dificultad para iniciar el sueño y despertares nocturnos frecuentes.",
    observaciones: "Se indica higiene del sueño y ejercicios de relajación previos al descanso.",
    acuerdos: "Aplicar rutina de higiene del sueño. Control en dos semanas.",
    diagnostico: "Insomnio secundario a estrés académico",
    area_atencion_preferencia: "Psiquiatría",
    modalidad_atencion_evaluacion: "Online",
    prevision_salud_isapre: "",
    prevision_salud_fonasa: "Fonasa",
    prevision_salud_otro: "",
    como: "Recomendación de par",
    derivado_desde: "Autoderivación",
    diagnostico_previo: "Ninguno",
    tratamiento: "Ninguno",
    notas: "Se indica higiene del sueño y se programa seguimiento en dos semanas."
  }
];

// ============================================================
// CONTACTOS DE EMERGENCIA
// ============================================================
export const mockContacts = [
  {
    id_emergencia: 1,
    id_alumno: 3,
    nombre: "María González",
    relacion: "familiar",
    parentesco: "Madre",
    numero: "+56988888888",
    mail: "maria.gonzalez@gmail.com"
  },
  {
    id_emergencia: 2,
    id_alumno: 5,
    nombre: "Jorge Soto",
    relacion: "familiar",
    parentesco: "Padre",
    numero: "+56999999999",
    mail: "jorge.soto@gmail.com"
  }
];

// ============================================================
// GRUPOS DE TERAPIA
// ============================================================
export const mockGroups = [
  {
    uuid: "grupo-uuid-001",
    nota: "Grupo Manejo de Ansiedad",
    id_profesional: 2,
    nombre_profesional: "Pedro Profesional",
    status: "activo",
    fecha_creacion: "2026-02-01"
  },
  {
    uuid: "grupo-uuid-002",
    nota: "Grupo Bienestar Estudiantil",
    id_profesional: 4,
    nombre_profesional: "Beto Blend",
    status: "activo",
    fecha_creacion: "2026-02-05"
  }
];

// Usuarios asignados a grupos
export const mockGroupUsers = [
  { id_alumno: 3, nombre: "Ana", apellido: "González", email: "ana.gonzalez@mail.udp.cl", uuid: "grupo-uuid-001" },
  { id_alumno: 7, nombre: "Valentina", apellido: "Morales", email: "valentina.morales@mail.udp.cl", uuid: "grupo-uuid-001" },
  { id_alumno: 5, nombre: "Camila", apellido: "Soto", email: "camila.soto@mail.udp.cl", uuid: "grupo-uuid-002" }
];

// ============================================================
// VISIBILIDAD PACIENTE-PROFESIONAL
// ============================================================
export const mockVisibility = [
  { id_alumno: 3, id_profesional: 2 },
  { id_alumno: 3, id_profesional: 4 },
  { id_alumno: 5, id_profesional: 2 },
  { id_alumno: 6, id_profesional: 4 },
  { id_alumno: 7, id_profesional: 2 }
];

// ============================================================
// BLOGS
// ============================================================
export const mockBlogs = [
  {
    blog_id: 1,
    blog_titulo: "Bienestar Mental en la Universidad",
    blog_bajada: "Consejos prácticos para manejar el estrés académico y cuidar tu salud mental durante tu etapa universitaria.",
    blog_texto: "<p>El éxito académico no debe ser a costa de tu salud mental. Aprender a poner límites es una habilidad vital que te acompañará toda la vida.</p><p>Identifica tus señales de alerta, busca apoyo temprano y recuerda que pedir ayuda es un acto de valentía, no de debilidad.</p>",
    blog_imagen: "blog1.jpg",
    blog_video: "",
    destacado: true,
    descargas: [
      {
        descarga_titulo: "Guía de Manejo de Estrés",
        descarga_bajada: "PDF con ejercicios prácticos para reducir el estrés en época de exámenes.",
        descarga_url: "/docs/guia-estres.pdf"
      }
    ]
  },
  {
    blog_id: 2,
    blog_titulo: "¿Cómo reconocer señales de ansiedad?",
    blog_bajada: "Aprende a identificar los síntomas de ansiedad y cuándo buscar ayuda profesional.",
    blog_texto: "<p>La ansiedad es una respuesta natural del cuerpo ante situaciones de estrés. Sin embargo, cuando se vuelve persistente puede afectar significativamente tu calidad de vida.</p><p>Algunos síntomas incluyen: tensión muscular, dificultad para concentrarse, irritabilidad y problemas de sueño.</p>",
    blog_imagen: "blog2.jpg",
    blog_video: "",
    destacado: false,
    descargas: []
  },
  {
    blog_id: 3,
    blog_titulo: "Técnicas de Respiración para Momentos de Crisis",
    blog_bajada: "Herramientas simples y efectivas para recuperar la calma en momentos difíciles.",
    blog_texto: "<p>La respiración diafragmática es una de las técnicas más eficaces para reducir el estrés de forma inmediata.</p><p>Practica la técnica 4-7-8: inhala 4 segundos, retén 7 segundos, exhala 8 segundos. Repite 4 veces.</p>",
    blog_imagen: "blog3.jpg",
    blog_video: "https://www.youtube.com/embed/ejemplo",
    destacado: true,
    descargas: [
      {
        descarga_titulo: "Ejercicios de respiración",
        descarga_bajada: "Guía rápida con técnicas de respiración.",
        descarga_url: "/docs/respiracion.pdf"
      }
    ]
  }
];
