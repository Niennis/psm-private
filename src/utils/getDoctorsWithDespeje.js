import { fetchProfessionals } from '@/services/DoctorsServices';
import { fetchScheduleByAvailability } from '@/services/SchedulesServices';

const fetchProfessionalsByServiceType = async (serviceType) => {
  const profesionales = await fetchProfessionals();

  const bloquesPromesas = profesionales.map(profesional =>
    fetchScheduleByAvailability(profesional.id).then(response => ({
      profesional,
      bloques: response.users
    }))
  );

  const profesionalesYBloques = await Promise.all(bloquesPromesas);

  const profesionalesFiltrados = profesionalesYBloques.filter(({ profesional, bloques }) =>
    bloques.some(bloque => bloque.tipoServicio && bloque.tipoServicio.includes(serviceType))
  ).map(({ profesional }) => profesional);
  return profesionalesFiltrados;
};


export const fetchFilteredProfesssionals = async (type) => {
  return await fetchProfessionalsByServiceType(type);
};

export const fetchProfDespeje = async () => {
  return await fetchProfessionalsByServiceType('despeje');
};

export const fetchProfAcompañamiento = async () => {
  return await fetchProfessionalsByServiceType('acompañamiento');
};

export const fetchProfPsicoBreve = async () => {
  return await fetchProfessionalsByServiceType('breve');
};

export const fetchProfPsicoIndividual = async () => {
  return await fetchProfessionalsByServiceType('individual');
};

/* 
export const fetchProfPsicoIndividual = async () => {
  const profesionales = await fetchProfessionals();

  const bloquesPromesas = profesionales.map(profesional =>
    fetchScheduleByAvailability(profesional.id).then(response => ({
      profesional,
      bloques: response.users
    }))
  );
  const profesionalesYBloques = await Promise.all(bloquesPromesas);
  const profesionalPsicoIndividual = profesionalesYBloques.filter(({ profesional, bloques }) =>
    bloques.some(bloque => bloque.tipoServicio && bloque.tipoServicio.includes('individual'))
  ).map(({ profesional }) => profesional);

  return profesionalPsicoIndividual;
};
 */


/* export const fetchProfDespeje = async () => {
  const profesionales = await fetchProfessionals();
  // const profesionalesConDespeje = [];

  // for (const profesional of profesionales) {
  //   const { users: bloques } = await fetchScheduleByAvailability(profesional.id);
  //   const tieneDespeje = bloques.some(bloque => bloque.tipoServicio && bloque.tipoServicio.includes('despeje'));
  //   if (tieneDespeje) {
  //     profesionalesConDespeje.push(profesional);
  //   }
  // }
  // return profesionalesConDespeje;
  return profesionales;
};
 */

/* 
export const fetchProfPsicoIndividual = async () => {
  const profesionales = await fetchProfessionals();
  const profesionalesConDespeje = [];

  for (const profesional of profesionales) {
    const { users: bloques } = await fetchScheduleByAvailability(profesional.id);
    const tieneDespeje = bloques.some(bloque => bloque.tipoServicio && bloque.tipoServicio.includes('individual'));
    if (tieneDespeje) {
      profesionalesConDespeje.push(profesional);
    }
  }
  return profesionalesConDespeje;
  // return profesionales;
};

*/