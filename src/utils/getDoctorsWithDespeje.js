import { fetchProfessionals } from '../services/DoctorsServices';
import { fetchScheduleByAvailability } from '@/services/SchedulesServices';

export const obtenerDoctoresDespeje = async () => {
  const doctores = await fetchProfessionals();
  // const doctoresConDespeje = [];

  // for (const doctor of doctores) {
  //   const { users: bloques } = await fetchScheduleByAvailability(doctor.id);
  //   const tieneDespeje = bloques.some(bloque => bloque.tipo && bloque.tipo.includes('despeje'));
  //   console.log('tieneDespeje', tieneDespeje)
  //   if (tieneDespeje) {
  //     doctoresConDespeje.push(doctor);
  //   }
  // }
  // return doctoresConDespeje;
  return doctores;
};
