export const createInterviewRecord = async (input) => {
  const RECORD_URL = process.env.NEXT_PUBLIC_RECORD
  console.log('input', input)

  const body = {
    ...input,
    area_atencion_preferencia: input.area_atencion_preferencia.label,
    diagnostico_salud_mental: 'no recuerda',
    diagnostico_salud_fisica: 'no recuerda',
    modalidad_atencion_evaluacion: input.modalidad_atencion_evaluacion,
    tipos_apoyo_actual: (input.tipos_apoyo_actual.map(item => item.label)).toString(),
    "prevision_salud_isapre": "Fonasa",
    "prevision_salud_fonasa": "",
    "prevision_salud_otro": "",
  }
  console.log('body', body)

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

// https://calculatetestpoints-fpdthpb8d3fqh2a4.eastus-01.azurewebsites.net/generate_excel
export const reportes = async (tabla) => {
  const REPORTES_URL = "https://calculatetestpoints-fpdthpb8d3fqh2a4.eastus-01.azurewebsites.net/generate_excel"

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