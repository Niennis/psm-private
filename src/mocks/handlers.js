import { http, HttpResponse } from 'msw'
import {
  mockUsers,
  mockBlogs,
  mockProfessionals,
  mockSpecialities,
  mockProfessionalSpecialities,
  mockSchedules,
  mockAvailability,
  mockBlocks,
  mockAppointments,
  mockRecords,
  mockContacts,
  mockGroups,
  mockGroupUsers,
  mockVisibility
} from '../utils/mockupData'

export const handlers = [

  // ============================================================
  // USUARIOS / PACIENTES
  // ============================================================

  // Todos los pacientes
  http.post('https://showpatients-fge8btdrhdbzhagw.eastus-01.azurewebsites.net/main', () => {
    return HttpResponse.json(mockUsers)
  }),

  // Paciente por ID
  http.post('https://showpatientsid-bneyfpc6a3f3bwch.eastus-01.azurewebsites.net/main', async ({ request }) => {
    const { id } = await request.json()
    const user = mockUsers.find(u => u.id === Number(id))
    return HttpResponse.json({ users: user ? [user] : [] })
  }),

  // Validar usuario por email (login credentials)
  http.post('https://validateuser-haebdbb4fucebucz.eastus-01.azurewebsites.net/main', async ({ request }) => {
    const { email, contrasena } = await request.json()
    const user = mockUsers.find(u => u.email === email)
    if (user && contrasena === 'admin123') {
      return HttpResponse.json(user)
    }
    return HttpResponse.json(null)
  }),

  // Buscar usuario por email
  http.post('https://validateuser-haebdbb4fucebucz.eastus-01.azurewebsites.net/buscapormail', async ({ request }) => {
    const { email } = await request.json()
    const user = mockUsers.find(u => u.email === email)
    return HttpResponse.json(user || { error: 'User not found' })
  }),

  // Recuperar contraseña (envío de email)
  http.post('https://validateuser-haebdbb4fucebucz.eastus-01.azurewebsites.net/recuperapass', () => {
    return HttpResponse.json({ message: 'Email de recuperación enviado (mock)' })
  }),

  // Pacientes con despeje (despeje = true)
  http.post('https://showpatients-fge8btdrhdbzhagw.eastus-01.azurewebsites.net/despejetrue', () => {
    const patients = mockUsers.filter(u => u.tipo_usuario === 'alumno' && u.despeje === true)
    return HttpResponse.json(patients)
  }),

  // Pacientes sin despeje (despeje = false)
  http.post('https://showpatients-fge8btdrhdbzhagw.eastus-01.azurewebsites.net/despejefalse', () => {
    const patients = mockUsers.filter(u => u.tipo_usuario === 'alumno' && u.despeje === false)
    return HttpResponse.json(patients)
  }),

  // Crear paciente
  http.post('https://createpatient-b3d0atcah0fggjb0.eastus-01.azurewebsites.net/main', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ message: 'Paciente creado exitosamente (mock)', id: 99 })
  }),

  // Editar usuario (updateall) - también usado para profesionales
  http.post('https://edituser-bhghcahwaqdeaje7.eastus-01.azurewebsites.net/updateall', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ message: 'Usuario actualizado (mock)', ...body })
  }),

  // Dar de alta a paciente
  http.post('https://showpatients-fge8btdrhdbzhagw.eastus-01.azurewebsites.net/alta_patient', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ message: 'Alta registrada (mock)' })
  }),

  // Visibilidad: pacientes asignados a un profesional
  http.post('https://showpatients-fge8btdrhdbzhagw.eastus-01.azurewebsites.net/showvisibilidadxprofesional', async ({ request }) => {
    const { id_profesional } = await request.json()
    const alumnos = mockVisibility
      .filter(v => v.id_profesional === Number(id_profesional))
      .map(v => ({ id_alumno: v.id_alumno }))
    return HttpResponse.json({ alumnos })
  }),

  // Visibilidad: profesionales asignados a un alumno
  http.post('https://showpatients-fge8btdrhdbzhagw.eastus-01.azurewebsites.net/showvisibilidadxalumno', async ({ request }) => {
    const { id_alumno } = await request.json()
    const profesionales = mockVisibility
      .filter(v => v.id_alumno === Number(id_alumno))
      .map(v => ({ id_profesional: v.id_profesional }))
    return HttpResponse.json({ profesionales })
  }),

  // Profesionales y admins (no alumnos)
  http.post('https://showpatients-fge8btdrhdbzhagw.eastus-01.azurewebsites.net/shownoalumnos', () => {
    return HttpResponse.json({ users: mockProfessionals })
  }),

  // ============================================================
  // CONTACTOS DE EMERGENCIA
  // ============================================================

  http.post('https://showpatients-fge8btdrhdbzhagw.eastus-01.azurewebsites.net/emergencia_create', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ message: 'Contacto de emergencia creado (mock)', id_emergencia: 99 })
  }),

  http.post('https://showpatients-fge8btdrhdbzhagw.eastus-01.azurewebsites.net/emergencia_read', async ({ request }) => {
    const { id } = await request.json()
    const contact = mockContacts.find(c => c.id_alumno === Number(id))
    return HttpResponse.json(contact ? [contact] : [])
  }),

  http.post('https://showpatients-fge8btdrhdbzhagw.eastus-01.azurewebsites.net/emergencia_update', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ message: 'Contacto de emergencia actualizado (mock)' })
  }),

  // ============================================================
  // GRUPOS DE TERAPIA
  // ============================================================

  http.post('https://showpatients-fge8btdrhdbzhagw.eastus-01.azurewebsites.net/grupo/create', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ message: 'Grupo creado (mock)', uuid: 'grupo-uuid-new' })
  }),

  http.post('https://showpatients-fge8btdrhdbzhagw.eastus-01.azurewebsites.net/grupo/users', async ({ request }) => {
    const { uuid } = await request.json()
    const users = mockGroupUsers.filter(u => u.uuid === uuid)
    return HttpResponse.json({ users })
  }),

  http.post('https://showpatients-fge8btdrhdbzhagw.eastus-01.azurewebsites.net/grupo/showgrupos', async ({ request }) => {
    const { id_user } = await request.json()
    const groupsObj = {}
    mockGroups.forEach(g => { groupsObj[g.uuid] = g })
    return HttpResponse.json(groupsObj)
  }),

  http.post('https://showpatients-fge8btdrhdbzhagw.eastus-01.azurewebsites.net/grupo/showallgrupos', () => {
    const groupsObj = {}
    mockGroups.forEach(g => { groupsObj[g.uuid] = g })
    return HttpResponse.json(groupsObj)
  }),

  http.post('https://showpatients-fge8btdrhdbzhagw.eastus-01.azurewebsites.net/grupo/adduser', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ message: 'Usuario agregado al grupo (mock)' })
  }),

  http.post('https://showpatients-fge8btdrhdbzhagw.eastus-01.azurewebsites.net/grupo/deleteuser', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ message: 'Usuario eliminado del grupo (mock)' })
  }),

  http.post('https://showpatients-fge8btdrhdbzhagw.eastus-01.azurewebsites.net/grupo/delete', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ message: 'Grupo eliminado (mock)' })
  }),

  // ============================================================
  // PROFESIONALES
  // ============================================================

  // Todos los profesionales
  http.post('https://showprofessionals-babxgdcxeth9c2fn.eastus-01.azurewebsites.net/main', () => {
    return HttpResponse.json({ users: mockProfessionals })
  }),

  // Profesional por ID
  http.post('https://showprofessionalsid-cgbhdtg3gqg4g4d5.eastus-01.azurewebsites.net/main', async ({ request }) => {
    const { id } = await request.json()
    const user = mockProfessionals.find(u => u.id === Number(id))
    return HttpResponse.json({ users: user ? [user] : [] })
  }),

  // Crear profesional
  http.post('https://createprofessional-fthvbmgqhvb7a3ec.eastus-01.azurewebsites.net/main', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ message: 'Profesional creado (mock)', id: 99 })
  }),

  // Cambiar contraseña
  http.post('https://edituser-bhghcahwaqdeaje7.eastus-01.azurewebsites.net/updatepass', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ message: 'Contraseña actualizada (mock)' })
  }),

  // Actualizar especialidad
  http.post('https://edituser-bhghcahwaqdeaje7.eastus-01.azurewebsites.net/updateespecialidad', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ message: 'Especialidad actualizada (mock)' })
  }),

  // ============================================================
  // ESPECIALIDADES
  // ============================================================

  // Especialidades por profesional (asignaciones usuario-especialidad)
  http.post('https://showespecialidades-h6gba9h6drakhncc.eastus-01.azurewebsites.net/todas', () => {
    return HttpResponse.json({ especialidades: mockProfessionalSpecialities })
  }),

  // Especialidad de un profesional por su ID
  http.post('https://showespecialidades-h6gba9h6drakhncc.eastus-01.azurewebsites.net/byid', async ({ request }) => {
    const { usuario_id } = await request.json()
    const spec = mockProfessionalSpecialities.find(s => s.usuario_id === Number(usuario_id))
    return HttpResponse.json(spec ? [spec] : [])
  }),

  // Agregar especialidad a profesional
  http.post('https://showespecialidades-h6gba9h6drakhncc.eastus-01.azurewebsites.net/addespecialidad', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ message: 'Especialidad asignada (mock)' })
  }),

  // ============================================================
  // HORARIOS / BLOQUES
  // ============================================================

  // Horarios del profesional (próximos 30 días)
  http.post('https://showbloques30dias-ceehhrbzfmephufx.eastus-01.azurewebsites.net/main', async ({ request }) => {
    const body = await request.json()
    const schedules = body?.usuario_id
      ? mockSchedules.filter(s => s.id_user === Number(body.usuario_id))
      : mockSchedules
    return HttpResponse.json({ users: schedules })
  }),

  // Bloques por fecha
  http.post('https://showbloques-hbg8hmaxh8g3cheb.eastus-01.azurewebsites.net/xfecha', async ({ request }) => {
    const { usuario_id, fecha } = await request.json()
    const blocks = mockBlocks.filter(b => b.usuario_id === Number(usuario_id) && b.fecha === fecha)
    return HttpResponse.json({ bloques: blocks })
  }),

  // Bloques disponibles por fecha
  http.post('https://showbloques-hbg8hmaxh8g3cheb.eastus-01.azurewebsites.net/disponibles', async ({ request }) => {
    const { usuario_id, fecha } = await request.json()
    const blocks = mockBlocks.filter(
      b => b.usuario_id === Number(usuario_id) && b.fecha === fecha && b.disponible === 1
    )
    return HttpResponse.json({ bloques: blocks })
  }),

  // Bloques no disponibles por fecha
  http.post('https://showbloques-hbg8hmaxh8g3cheb.eastus-01.azurewebsites.net/nodisponibles', async ({ request }) => {
    const { usuario_id, fecha } = await request.json()
    const blocks = mockBlocks.filter(
      b => b.usuario_id === Number(usuario_id) && b.fecha === fecha && b.disponible === 0
    )
    return HttpResponse.json({ bloques: blocks })
  }),

  // Disponibilidades configuradas por profesional
  http.post('https://showdisponibilidad-bjffenhjdyabcgh2.eastus-01.azurewebsites.net/main', async ({ request }) => {
    const { id_user } = await request.json()
    const avail = id_user
      ? mockAvailability.filter(a => a.id_user === Number(id_user))
      : mockAvailability
    return HttpResponse.json({ users: avail })
  }),

  // Editar bloque disponible (marcar como ocupado/disponible)
  http.post('https://editbloquedisponible-fcfhd9gue7bga8ba.eastus-01.azurewebsites.net/main', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ message: 'Bloque actualizado (mock)' })
  }),

  // Editar disponibilidad
  http.post('https://showdisponibilidad-bjffenhjdyabcgh2.eastus-01.azurewebsites.net/editdisponibilidad', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ message: 'Disponibilidad editada (mock)' })
  }),

  // Eliminar disponibilidad individual (por id)
  http.post('https://showdisponibilidad-bjffenhjdyabcgh2.eastus-01.azurewebsites.net/deletedisponibilidad', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ message: 'Disponibilidad eliminada (mock)' })
  }),

  // Eliminar disponibilidad por id (edituserexcel)
  http.post('https://edituserexcel-g5c9f2drbzb9evb9.eastus-01.azurewebsites.net/delete/id', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ message: 'Disponibilidad eliminada (mock)' })
  }),

  // Eliminar disponibilidad completa por uuid (edituserexcel)
  http.post('https://edituserexcel-g5c9f2drbzb9evb9.eastus-01.azurewebsites.net/delete/uuid', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ message: 'Disponibilidad completa eliminada (mock)' })
  }),

  // Crear disponibilidad (edituserexcel/main - usado en createSchedule)
  http.post('https://edituserexcel-g5c9f2drbzb9evb9.eastus-01.azurewebsites.net/main', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ message: 'Disponibilidad creada (mock)', id: 99 })
  }),

  // ============================================================
  // CITAS (APPOINTMENTS)
  // ============================================================

  // Todas las citas
  http.post('https://showcitas-a3dxgabfa2e0dbag.eastus-01.azurewebsites.net/main', () => {
    return HttpResponse.json({ citas: mockAppointments })
  }),

  // Citas por profesional (no alumno)
  http.post('https://showcitas-a3dxgabfa2e0dbag.eastus-01.azurewebsites.net/showlistadocita_noalumno', async ({ request }) => {
    const { id_noalumno } = await request.json()
    const citas = id_noalumno
      ? mockAppointments.filter(c => c.id_profesional === Number(id_noalumno))
      : mockAppointments
    return HttpResponse.json({ citas })
  }),

  // Cita por ID (BUG FIX: era c.id, debe ser c.id_cita)
  http.post('https://showcitas-a3dxgabfa2e0dbag.eastus-01.azurewebsites.net/showcitasbyid', async ({ request }) => {
    const { id_cita } = await request.json()
    const cita = mockAppointments.find(c => c.id_cita === Number(id_cita))
    return HttpResponse.json({ citas: cita ? [cita] : [] })
  }),

  // Citas del doctor (endpoint alternativo)
  http.post('https://showcitasdoc-hjhmdzduafh8brbm.eastus-01.azurewebsites.net/main', async ({ request }) => {
    const body = await request.json()
    const citas = body?.id_profesional
      ? mockAppointments.filter(c => c.id_profesional === Number(body.id_profesional))
      : mockAppointments
    return HttpResponse.json({ citas })
  }),

  // Crear cita individual
  http.post('https://createcita-bmg3gkhhe8djd7f3.eastus-01.azurewebsites.net/insertcitas', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ message: 'Cita creada exitosamente (mock)', id_cita: 599 })
  }),

  // Crear entrevista / primera cita (despeje)
  http.post('https://createcita-bmg3gkhhe8djd7f3.eastus-01.azurewebsites.net/insertdespeje', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ message: 'Entrevista creada exitosamente (mock)', id_cita: 600 })
  }),

  // Crear cita grupal
  http.post('https://createcita-bmg3gkhhe8djd7f3.eastus-01.azurewebsites.net/insertcitasgrupo', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ message: 'Cita grupal creada exitosamente (mock)', id_cita: 601 })
  }),

  // Editar cita (general)
  http.post('https://editcita-hrc7dgf3bhftf6fc.eastus-01.azurewebsites.net/main', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ message: 'Cita actualizada (mock)' })
  }),

  // Cambiar estado de cita
  http.post('https://editcita-hrc7dgf3bhftf6fc.eastus-01.azurewebsites.net/updateestado', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ message: `Estado cambiado a ${body?.estado ?? 'nuevo estado'} (mock)` })
  }),

  // Cambiar hora de cita por UUID
  http.post('https://editcita-hrc7dgf3bhftf6fc.eastus-01.azurewebsites.net/updatehoraxuuid', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ message: 'Hora actualizada por UUID (mock)' })
  }),

  // Cambiar fecha y hora de cita por ID
  http.post('https://editcita-hrc7dgf3bhftf6fc.eastus-01.azurewebsites.net/updatefechayhoraxid', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ message: 'Fecha y hora actualizadas (mock)' })
  }),

  // Crear consulta simple
  http.post('https://createconsulta-cubbaxd9e6cgb4db.eastus-01.azurewebsites.net/main', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ message: 'Consulta creada (mock)' })
  }),

  // ============================================================
  // FICHAS / REGISTROS DE ENTREVISTA
  // ============================================================

  // Crear entrevista / ficha
  http.post('https://createentrevistaevaluacion-a8e6hmeab4f4djch.eastus-01.azurewebsites.net/createentrevista', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ message: 'Entrevista registrada (mock)', id_entrevista: 999 })
  }),

  // Ver ficha por ID
  http.post('https://createentrevistaevaluacion-a8e6hmeab4f4djch.eastus-01.azurewebsites.net/showentrevista', async ({ request }) => {
    const { id_entrevista } = await request.json()
    const record = mockRecords.find(r => r.id_entrevista === Number(id_entrevista))
    return HttpResponse.json({ entrevista: record ? [record] : [] })
  }),

  // Ver fichas por ID de alumno
  http.post('https://createentrevistaevaluacion-a8e6hmeab4f4djch.eastus-01.azurewebsites.net/showentrevistabyidalumno', async ({ request }) => {
    const { id_alumno } = await request.json()
    const records = mockRecords.filter(r => r.id_alumno === Number(id_alumno))
    return HttpResponse.json({ entrevista: records })
  }),

  // ============================================================
  // REPORTES / CORREOS
  // ============================================================

  // Generar reporte Excel (devuelve blob simulado)
  http.post('https://calculatetestpoints-fpdthpb8d3fqh2a4.eastus-01.azurewebsites.net/generate_excel', () => {
    const mockExcel = new Blob(['mock excel content'], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    return new HttpResponse(mockExcel, {
      headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    })
  }),

  // Enviar correo / calcular puntos test
  http.post('https://calculatetestpoints-fpdthpb8d3fqh2a4.eastus-01.azurewebsites.net/main', () => {
    return HttpResponse.json({ message: 'Correo enviado (mock)' })
  }),

  // ============================================================
  // BLOGS
  // ============================================================

  // Listado de blogs
  http.post('https://showbloglist-a6dzcva7fcfmfgdu.eastus-01.azurewebsites.net/main', () => {
    const flatBlogs = mockBlogs.flatMap(b => {
      if (b.descargas.length === 0) {
        return [{
          blog_id: b.blog_id,
          blog_titulo: b.blog_titulo,
          blog_bajada: b.blog_bajada,
          blog_imagen: b.blog_imagen,
          blog_video: b.blog_video,
          descarga_titulo: null,
          descarga_bajada: null,
          descarga_url: null
        }]
      }
      return b.descargas.map(d => ({
        blog_id: b.blog_id,
        blog_titulo: b.blog_titulo,
        blog_bajada: b.blog_bajada,
        blog_imagen: b.blog_imagen,
        blog_video: b.blog_video,
        descarga_titulo: d.descarga_titulo,
        descarga_bajada: d.descarga_bajada,
        descarga_url: d.descarga_url
      }))
    })
    return HttpResponse.json({ blogs: flatBlogs })
  }),

  // Blog por ID
  http.post('https://showblogbyid-f4dxh4bvgydmdzh6.eastus-01.azurewebsites.net/main', async ({ request }) => {
    const { id } = await request.json()
    const blog = mockBlogs.find(b => b.blog_id === Number(id))
    return HttpResponse.json({ blogs: blog ? [blog] : [] })
  }),

  // Crear blog
  http.post('https://showbloglist-a6dzcva7fcfmfgdu.eastus-01.azurewebsites.net/add_blog', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ message: 'Blog creado (mock)', blog_id: mockBlogs.length + 1 })
  }),

  // Editar blog (usa PUT en BlogServices)
  http.put('https://showbloglist-a6dzcva7fcfmfgdu.eastus-01.azurewebsites.net/edit_blog', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ message: 'Blog actualizado (mock)' })
  }),

  // Subir imagen para blog
  http.post('https://showbloglist-a6dzcva7fcfmfgdu.eastus-01.azurewebsites.net/upload', async ({ request }) => {
    return HttpResponse.json({ url: 'https://reposaludmental.blob.core.windows.net/publicsite/mock-image.jpg' })
  }),

  // Agregar descarga a blog
  http.post('https://showbloglist-a6dzcva7fcfmfgdu.eastus-01.azurewebsites.net/add_descarga', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ message: 'Descarga agregada al blog (mock)' })
  }),

  // Editar blog (endpoint alternativo con editblog)
  http.post('https://editblog-hjhjg2d2cbdeepek.eastus-01.azurewebsites.net/main', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ message: 'Blog editado (mock)' })
  }),
]
