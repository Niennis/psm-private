'use client'
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import Sidebar from '../../../components/Sidebar';
import Link from 'next/link';
import { TextField, Alert } from '@mui/material';
import FeatherIcon from 'feather-icons-react/build/FeatherIcon';
import { useForm, Controller } from 'react-hook-form'

import Select from "react-select";

import { fetchSpeciality } from '@/services/DoctorsServices';
import { createSchedule, getDates, fetchScheduleByDate, validateDates } from '@/services/SchedulesServices';
import Calender from '../../calender/page';

import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import ProtectedPage from '@/components/ProtectedRoutes';

const ScheduleByProfessional = ({ params }) => {
  const ROL = ["profesional"]
  const { data: session } = useSession()
  const router = useRouter();
  // useAuthorization(['alumno'])

  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [profesional, setProfesional] = useState({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('initial')
  const [startDate, setStartDate] = useState();
  const [startDay, setStartDay] = useState('');

  const onChange = (date, dateString) => {
    // console.log(date, dateString);
  };
  const [selectedOption, setSelectedOption] = useState(null);
  const styleInput = {
    display: 'inline',
    width: '20%'
  }
  // const label = { inputProps: { 'aria-label': 'Switch demo' } };
  useEffect(() => {
    const fetchProfesional = async () => {
      const { especialidad: user } = await fetchSpeciality(params.id)
      // console.log('especialidad', user[0])
      setProfesional(user[0])
    }
    fetchProfesional()
  }, [])

  const { register, handleSubmit, watch, control,
    formState: { errors }
  } = useForm({
    defaultValues: async () => {
      console.log('Params en add schedule', params.id);
      const { especialidad: user } = await fetchSpeciality(params.id)
      console.log('user', user);
      const obj = {
        nombre: `${user[0].nombre} ${user[0].apellido}`,
        especialidad: user[0].especialidad,
        id: user[0].usuario_id,
        horaIni: '00:00:00',
        semanal: { dia: [] }
      }
      setProfesional(obj)
      return obj
    }
  })

  const handleDay = (e) => {
    const nuevoNumero = e.target.value;
    setStartDay(nuevoNumero);
    const nuevaFecha = new Date();
    nuevaFecha.setDate(parseInt(nuevoNumero));
    setStartDate(nuevaFecha.toISOString().split('T')[0]);
  }

  const handleDate = (e) => {
    const nuevaFecha = e.target.value;
    setStartDate(nuevaFecha);
    const split = nuevaFecha.split('-')
    setStartDay(split[2]);
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
  }));




  return (
    <ProtectedPage level={ROL}>
      <Sidebar id='menu-item5' id1='menu-items5' activeClassName='professional-shedule' />
      <>
        <div className="page-wrapper">
          <div className="content">
            {/* Page Header */}
            <div className="page-header">
              <div className="row">
                <div className="col-sm-12">
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="schedule.html">Horario</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="feather-chevron-right">
                        <FeatherIcon icon="chevron-right" />
                      </i>
                    </li>
                    <li className="breadcrumb-item active">Agregar horario</li>
                  </ul>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            <div className="row">
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-12">
                        <div className="form-heading">
                          <h4>Profesional</h4>
                        </div>
                      </div>

                      {/* Nombre profesional */}
                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="form-group local-forms">
                          <label>
                            Nombre profesional <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            {...register('nombre', {
                              required: {
                                value: true,
                                message: 'Nombre es requerido'
                              },
                              minLength: {
                                value: 2,
                                message: 'Nombre debe tener al menos 2 caracteres'
                              }
                            })}
                          />
                        </div>
                      </div>
                      {/* Especialidad */}
                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="form-group local-forms">
                          <label>
                            Especialidad <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            {...register('especialidad', {
                              required: {
                                value: true,
                                message: 'Especialidad es requerida'
                              }
                            })} />
                        </div>
                      </div>
                      <Calender id={params.id} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div >
      </>
    </ProtectedPage>
  )
}

export default ScheduleByProfessional;
