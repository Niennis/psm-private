import { fetchProfessionals } from '../services/DoctorsServices';
import { fetchScheduleByAvailability } from '@/services/SchedulesServices';

export const fetchProfDespeje = async () => {
  const doctores = await fetchProfessionals();
  // const doctoresConDespeje = [];

  // for (const doctor of doctores) {
  //   const { users: bloques } = await fetchScheduleByAvailability(doctor.id);
  //   const tieneDespeje = bloques.some(bloque => bloque.tipoServicio && bloque.tipoServicio.includes('despeje'));
  //   if (tieneDespeje) {
  //     doctoresConDespeje.push(doctor);
  //   }
  // }
  // return doctoresConDespeje;
  return doctores;
};


export const FetchProfAcompañamiento = async () => {
  const doctores = await fetchProfessionals();
  const doctoresConDespeje = [];

  for (const doctor of doctores) {
    const { users: bloques } = await fetchScheduleByAvailability(doctor.id);
    const tieneDespeje = bloques.some(bloque => bloque.tipoServicio && bloque.tipoServicio.includes('Acompañamiento'));
    if (tieneDespeje) {
      doctoresConDespeje.push(doctor);
    }
  }
  return doctoresConDespeje;
  // return doctores;
};

export const fetchProfPsicoBreve = async () => {
  const doctores = await fetchProfessionals();
  const doctoresConDespeje = [];

  for (const doctor of doctores) {
    const { users: bloques } = await fetchScheduleByAvailability(doctor.id);
    const tieneDespeje = bloques.some(bloque => bloque.tipoServicio && bloque.tipoServicio.includes('breve'));
    if (tieneDespeje) {
      doctoresConDespeje.push(doctor);
    }
  }
  return doctoresConDespeje;
  // return doctores;
};

export const fetchProfPsicoIndividual = async () => {
  const doctores = await fetchProfessionals();
  const doctoresConDespeje = [];

  for (const doctor of doctores) {
    const { users: bloques } = await fetchScheduleByAvailability(doctor.id);
    const tieneDespeje = bloques.some(bloque => bloque.tipoServicio && bloque.tipoServicio.includes('individual'));
    if (tieneDespeje) {
      doctoresConDespeje.push(doctor);
    }
  }
  return doctoresConDespeje;
  // return doctores;
};
