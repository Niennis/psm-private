export const createInterviewRecord = async (input) => {
  const RECORD_URL = process.env.NEXT_PUBLIC_RECORD
  console.log('input', input)

  const body = {
    ...input,
    area_atencion_preferencia: input.area_atencion_preferencia.label,
    diagnostico_salud_mental: 'no recuerda',
    diagnostico_salud_fisica: 'no recuerda',
    modalidad_atencion_evaluacion: input.modalidad_atencion_evaluacion[0].label,
    tipos_apoyo_actual: (input.tipos_apoyo_actual.map(item => item.label)).toString(),
    "prevision_salud_isapre": "Fonasa",
    "prevision_salud_fonasa": "",
    "prevision_salud_otro": "",
  }
  console.log('body', body)

  const data = await fetch(RECORD_URL, {
    method: "POST",
    cors: "no-cors",
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
      'ngrok-skip-browser-warning': 'any'
    },
    body: JSON.stringify(body)
  })

  return data.json()
}



// const body = {
//   "id_profesional": 6,
//   "id_alumno": 10,
//     "profesional_evaluador": "maria gracia subercaseaux",
//     "fecha": "2024-03-16",
//     "numero_ficha": 123456,
//   "nombre_completo": "gonzalo cáceres",
//     "rut": "12345678-9",
//     "carrera": "Psicopodología",
//     "ano_ingreso": 2020,
//     "fecha_nacimiento": "2000-01-01",
//             "edad": 24,
//              "direccion": "Calle 123, Santiago",
//     "correo": "juanito@email.com",
//     "telefono": "+56912345678",
//     "nombre_contacto_emergencia1": "María Pérez",
//     "parentesco_contacto_emergencia1": "Madre",
//     "celular_contacto_emergencia1": "+56987654321",
//     "nombre_contacto_emergencia2": "Pedro Pérez",
//     "parentesco_contacto_emergencia2": "Padre",
//     "celular_contacto_emergencia2": "+56998765432",
//     "prevision_salud_isapre": "Fonasa",
//     "prevision_salud_fonasa": "",
//     "prevision_salud_otro": "",
//     "financiamiento_carrera": "Beca",
//     "vivienda_situacion_actual": "Con mis padres, tengo buena relación",
//     "labores_cuidador": "No",
//     "financiamiento_gastos_personales": "Trabajo de medio tiempo",
//     "apoyo_economico_tratamiento": "Con mis padres",
//     "pago_tratamiento_semanal": 50000,
//     "chequeos_salud_ultimo_ano": "Sí",
//     "motivo_chequeos_salud": "Control anual",
//     "enfermedad_salud_fisica": "Ninguna",
//     "diagnostico_salud_mental": "No",
//     "medicacion_permanente": "",
//     "atenciones_previas_salud_mental": "No",
//     "tratamientos_previos_salud_mental": "",
//     "tratamiento_actual_salud_mental": "",
//     "consume_alcohol": "Ocasional",
//     "tipo_alcohol_consumido": "Cerveza",
//     "frecuencia_consumo_alcohol": "Semanal",
//     "consume_drogas": "No",
//     "tipo_drogas_consumidas": "",
//     "frecuencia_consumo_drogas": "",
//     "riesgo_suicida_escala": "No",
//     "motivo_consulta": "Problemas académicos",
//     "sintomatologia_motivo_consulta": "Ayuda de amigos",
//     "expectativas_departamento": "Emocional",
//     "area_atencion_preferencia": "Deporte",
//     "primera_carrera": "Sí, dedico tiempo a descansar",
//     "satisfecho_decision_carrera": 8,
//     "desempeno_academico": "Regular",
//     "desafio_enfrentado_universidad": 6,
//     "redes_apoyo_personas_significativas": "",
//     "tipos_apoyo_actual": "Buena",
//     "actividades_gustan_realizar": "No presenta",
//     "espacios_autocuidado": "No presenta",
//     "tiempo_descanso_horas_sueno": 8,
//     "alimentacion_diaria_habitual": "No presenta",
//     "modalidad_atencion_evaluacion": 8,
//     "estado_animo_afectividad": "Regular",
//     "tipo_pensamiento_observado": "",
//     "deteccion_condiciones_deficit_cognitivo": "",
//     "consciencia_realidad": "Buena",
//     "autoconcepto_autoestima": "No presenta",
//     "situaciones_riesgo_relacional": "No presenta",
//     "situaciones_riesgo_personal": "Buena",
//     "observaciones": "Observaciones adicionales sobre el paciente."
// }

