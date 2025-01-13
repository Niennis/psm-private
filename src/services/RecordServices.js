export const createInterviewRecord = async (input) => {
  const RECORD_URL = `${process.env.NEXT_PUBLIC_RECORD}/createentrevista`

  const body = {
    ...input,
    area_atencion_preferencia: input.area_atencion_preferencia?.label || input.area_atencion_preferencia ,
    diagnostico_salud_mental: 'no recuerda',
    diagnostico_salud_fisica: 'no recuerda',
    modalidad_atencion_evaluacion: input.modalidad_atencion_evaluacion,
    "prevision_salud_isapre": "Fonasa",
    "prevision_salud_fonasa": "",
    "prevision_salud_otro": "",
  }
  const data = await fetch(RECORD_URL, {
    method: "POST",
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
    },
    body: JSON.stringify(body)
  })

  return data.json()
}

export const reportes = async (tabla) => {
  const REPORTES_URL = process.env.NEXT_PUBLIC_GENERAR_REPORTE

  const body = {
    "nombre_tabla": tabla
  }

  try {
    const response = await fetch(
      REPORTES_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${tabla}.xlsx`;
    link.click();

    URL.revokeObjectURL(link.href);

  } catch (error) {
    console.error("Error al descargar el archivo:", error);
  }
}

export const showRecordById = async id_cita => {
  const record_url = `${process.env.NEXT_PUBLIC_RECORD}/showentrevista`

  const body = { "id_entrevista": id_cita }

  const data = await fetch(record_url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(body)
  })

  return data.json()
}

export const showRecords = async id_alumno => {
  const record_url = `${process.env.NEXT_PUBLIC_RECORD}/showentrevistabyidalumno`
  const body = {
    "id_alumno": id_alumno
  }

  const data = await fetch(record_url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(body)
  })

  const response = await data.json()
  return response
}
