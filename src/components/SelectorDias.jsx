import { useEffect } from "react";

function SelectorDeDias({
  allDays,
  modalidad,
  campus,
  profesional,
  setDays,
  setHours,
  setDate,
  setTime,
  setLoadingDays
}) {
  // Reset al cambiar de profesional
  useEffect(() => {
    if (profesional) {
      setDays([]);
      setHours([]);
      setDate('');
      setTime('');
      // No activamos el loading aquí, solo limpiamos datos
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profesional]);

  // Nuevo useEffect para resetear horas cuando cambia el campus
  useEffect(() => {
    // Si cambiamos de campus, resetear las horas y fecha seleccionada
    if (modalidad === 'presencial' && campus) {
      setHours([]);
      setDate('');
      setTime('');
    } else if (modalidad === 'videollamada') {
      setHours([]);
      setDate('');
      setTime('');
    }
  }, [campus, modalidad, setHours, setDate, setTime]);

  // Manejo de filtrado de fechas basado en modalidad y campus
  useEffect(() => {
    // Solo procedemos si tenemos un profesional seleccionado
    if (!profesional) return;

    // Si seleccionamos una modalidad, empezamos a cargar
    if (modalidad) {
      setLoadingDays(true);

      // Si es presencial pero no hay campus seleccionado aún, esperamos
      if (modalidad === 'presencial' && !campus) {
        setLoadingDays(false);
        return; // No hacemos nada hasta que seleccionen campus
      }

      const getUniqueDates = (data) => {
        const seen = new Set();
        return data.filter(item => {
          if (seen.has(item.fechaInicio)) return false;
          seen.add(item.fechaInicio);
          return true;
        });
      };

      const shouldIncludeItem = (item) => {
        if (modalidad === 'presencial') {
          if (campus === 'centro') {
            return ['presencial', 'ambas'].includes(item.modalidad) && item.campus === 'centro';
          }
          if (campus === 'huechuraba') {
            return ['presencial', 'ambas'].includes(item.modalidad) && item.campus === 'huechuraba';
          }
          return false; // Si es presencial pero no hay campus válido, no incluimos nada
        }

        if (modalidad === 'videollamada') {
          return ['videollamada', 'ambas'].includes(item.modalidad);
        }

        return false;
      };

      // Procesamos la data primero
      const uniqueDates = getUniqueDates(allDays);
      const filtered = uniqueDates.filter(shouldIncludeItem);

      // new Promise((resolve) => {
      //   setLoadingDays(true)
      //   resolve(); // Nos aseguramos de ejecutar algo después de setDays
      // }).then(() => {
      //   setDays(filtered);
      //   setLoadingDays(true); // Esto se ejecuta solo después de que setDays termine
      // })
      //   .finally(() => { setLoadingDays(false) })


      // Usamos setTimeout para simular un proceso asíncrono y dar tiempo al UI
      setTimeout(() => {
        // Primero actualizamos los días
        setDays(filtered);
        // Luego desactivamos el estado de carga
        setLoadingDays(false);
      }, 1200);
    }
  }, [allDays, modalidad, campus, profesional, setDays, setLoadingDays, setDate, setHours, setTime]);

  return null; // Este componente solo maneja lógica, no renderiza nada
}

export default SelectorDeDias;
