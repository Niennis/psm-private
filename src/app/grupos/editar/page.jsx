'use client'
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useSidebar } from "@/context/SidebarContext";

import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import withAuth from '@/components/withAuth';
import { useGroupContext } from '@/providers/GroupsProvider';

import { useForm, Controller, set } from 'react-hook-form'
import { Form, Switch, Table } from 'antd';
import Select from "react-select";

import SimpleBackdrop from '@/components/Backdrop';
import { addUserToGroup, deleteUserFromGroup, showGroups, usersGroups, showAllGroups } from '@/services/GroupServices';
import { fetchPatientsDespejeFalse } from '@/services/UsersServices';

import FeatherIcon from 'feather-icons-react';

import ModalAlert from '@/components/ModalAlert';
import { onShowSizeChange, itemRender } from '@/components/Pagination'

const EditGroup = () => {
  const { setProps } = useSidebar();
  const router = useRouter();
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [message, setMessage] = useState('')
  const [alertType, setAlertType] = useState('initial');
  const [selectedPatient, setSelectedPatient] = useState('')
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const { selectedGroupId } = useGroupContext();
  const [option, setOption] = useState()
  const [idPatient, setIdPatient] = useState()
  const [patientsWithDespeje, setPatientsWithDespeje] = useState([])

  const { register, handleSubmit, watch, control, reset, setValue, getValues, setError,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    setProps({
      id: "menu-item5",
      id1: "menu-items5",
      activeClassName: "edit-group",
    });
  }, [setProps]);

  const getPatientsByGroup = async (id) => {
    try {
      const body = {
        uuid: id
      }
      const response = await usersGroups(body)
      const alumnosArray = Object.values(response);

      const alumnosProcessed = alumnosArray.map((alumno, i) => {
        return {
          value: i + 2,
          label: alumno.email,
          name: alumno.nombre,
          lastName: alumno.apellido,
          id: alumno.id,
          fullName: `${alumno.nombre} ${alumno.apellido}`,
          email: alumno.email,
        }
      })

      setPatients(alumnosProcessed)
    } catch (error) {
      console.error("Error al traer data inicial:", error);
      return {};
    } finally {
      setLoading(false)
    }
  };

  const getGroups = async (id) => {
    try {
      const response = await showAllGroups()
      const gruposArray = Object.values(response);

      const selectedGroup = gruposArray.filter(item => item.uuid === id)
      setValue('name', selectedGroup[0].nota)

    } catch (error) {
      console.error("Error al traer data inicial:", error);
      return {};
    }
  }

  const getPatientsWithDespeje = async () => {
    try {
      const { users: response } = await fetchPatientsDespejeFalse()

      const noCoincidentes = response.filter((item1) => {
        return !patients?.some((item2) => item1.email === item2.label);
      });

      const alumnosProcessed = noCoincidentes.map((alumno, i) => {
        return {
          value: i + 2,
          label: alumno.email,
          name: alumno.nombre,
          lastName: alumno.apellido,
          id: alumno.id,
          fullName: `${alumno.nombre} ${alumno.apellido}`,
          email: alumno.email,
        }
      })

      setPatientsWithDespeje(alumnosProcessed)

    } catch (error) {
      console.error("Error al traer data inicial:", error);
      return {};
    }
  }

  useEffect(() => {
    if (selectedGroupId) {
      getPatientsByGroup(selectedGroupId);
      getGroups(selectedGroupId);
      getPatientsWithDespeje()
    } else {
      router.push('/grupos');
    }
  }, [selectedGroupId]);


  const handleSelectedalumno = async (e) => {
    setSelectedPatient(e)
    setValue('fullName', e?.fullName);
    setValue('email', e?.label);
  }

  /* ------- AGREGAR USUARIOS AL GRUPO --------- */
  const handleAddUser = handleSubmit(async (data, id) => {
    setAlertType('initial')
    setOpenBackdrop(true)

    const body = {
      uuid: selectedGroupId,
      id_user: id,
    }

    if (data) {
      try {
        const response = await addUserToGroup(body)
        if (response?.error) {
          setAlertType('fail')
          setMessage('El servicio no está disponible')
        } else if (response?.message) {
          setAlertType('success')
          setMessage(response?.message)

          // Actualizar datos después de agregar el usuario
          await getPatientsByGroup(selectedGroupId);
          await getPatientsWithDespeje();
          // Limpiar la selección actual
          setSelectedPatient('');
          setValue('alumno', null);
          setValue('fullName', '');
          setValue('email', '');
        }

      } catch (error) {
        console.log('Error:', error)
        setAlertType('fail')
        setMessage('El servicio no está disponible')
      } finally {
        setOpenBackdrop(false)

      }
    } else {
      setMessage('El servicio no está disponible')
    }
  })

  /* ------- REMOVER USUARIOS AL GRUPO --------- */
  const handleRemoveUser = handleSubmit(async (data, id) => {
    setAlertType('initial')
    setOpenBackdrop(true)

    const body = {
      uuid: selectedGroupId,
      id_user: id,
    }

    if (data) {
      try {
        const response = await deleteUserFromGroup(body)
        if (response?.error) {
          setAlertType('fail')
          setMessage('El servicio no está disponible')
        } else if (response?.message) {
          setAlertType('success')
          setMessage(`El servicio salió exitoso: ${response?.message}`)

          // Actualizar datos después de eliminar el usuario
          await getPatientsByGroup(selectedGroupId);
          await getPatientsWithDespeje();
        }

      } catch (error) {
        console.log('Error:', error)
        setAlertType('fail')
        setMessage('El servicio no está disponible')
      } finally {
        setOpenBackdrop(false)
      }
    } else {
      setMessage('El servicio no está disponible')
    }
  })


  const handleOnSubmit = async () => {
    if (option === 'remove') {
      await handleRemoveUser(idPatient)
    } else if (option === 'add') {
      await handleAddUser(idPatient)
    }
  }

  const handleCloseSuccess = async () => {
    setAlertType('initial')
    if (option === 'add' || option === 'remove') {
      await getPatientsByGroup(selectedGroupId);
      await getPatientsWithDespeje();
    }
  }

  const handleCloseFail = () => {
    setAlertType('initial')
  }

  const showConfirmation = (type, id) => {
    setOption(type)
    setIdPatient(id)
    setAlertType('warning');
    setMessage('¿Está seguro que desea continuar con esta acción?');
  };

  /* ENCABEZADOS DE LA TABLA */
  const columns = [
    {
      title: "Nombre estudiante",
      dataIndex: "nombre",
      fixed: 'left',
      render: (text, record) => (
        <>
          <h2 className="profile-image">

            <span >{record.name + ' ' + record.lastName}</span>
          </h2>
        </>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    }, {
      title: "Email",
      dataIndex: "label",
      sorter: (a, b) => a.label.localeCompare(b.label),
    }, {
      title: "",
      dataIndex: "estado",
      sorter: (a, b) => a.estado.localeCompare(b.estado),
      key: 'estado',
      // responsive: ['lg'], 
      render: (text, record) => (
        <div>
          {
            <span
              className="custom-badge status-pink m-1 "
              style={{ cursor: 'pointer', hover: { color: 'red' } }}
              onClick={() => { showConfirmation('remove', record.id) }}
            >
              {/* {record.id} */} Eliminar del grupo
            </span>
          }
          {/* )} */}
        </div>
      )
    },
  ]

  const tableProps = {
    loading,
  };

  return (
    <>
      <div className="sidebar-overlay" data-reff="" style={{ zIndex: 98 }} />
      <>
        <div className="page-wrapper">
          <div className="content">
            {/* Page Header */}
            <div className="page-header">
              <div className="row">
                <div className="col-sm-12">
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="#">Grupos </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="feather-chevron-right">
                        <FeatherIcon icon="chevron-right" />
                      </i>
                    </li>
                    <li className="breadcrumb-item active">Editar Grupo</li>
                  </ul>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            <div className="row">
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-body">
                    <form >
                      <div className="row">
                        <div className="col-12">
                          <div className="form-heading">
                            <h4>Editar Grupo</h4>
                          </div>
                        </div>
                        {/* Nombre */}
                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group local-forms">
                            <label>
                              Nombre del grupo<span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              disabled
                              placeholder=""
                              {...register('name', {
                                // required: {
                                //   value: true,
                                //   message: 'Nombre  de grupo es requerido'
                                // },
                                minLength: {
                                  value: 2,
                                  message: 'Nombre debe tener al menos 2 caracteres'
                                }
                              })}
                            />
                            {
                              errors.name && <span className="login-danger">
                                <small>{errors.name.message}</small>
                              </span>
                            }
                          </div>
                        </div>


                        {/* DATOS ESTUDIANTE */}
                        <div className="row">
                          <div className="col-12 col-md-6 col-xl-6">
                            <div className="form-group local-forms">
                              <label>
                                Seleccionar alumno {/* <span className="login-danger">*</span> */}
                              </label>
                              <Controller
                                control={control}
                                name="alumno"
                                {...register('alumno')}
                                ref={null}
                                render={({ field: { onChange, onBlur, value, name, ref } }) => {
                                  return (<Select

                                    placeholder={patientsWithDespeje.length === 0 ? 'Cargando...' : 'Seleccione...'}
                                    instanceId="alumno"
                                    onChange={(e) => {
                                      onChange(e);
                                      handleSelectedalumno(e);
                                    }}
                                    getOptionLabel={e => e.label}
                                    options={patientsWithDespeje}
                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                    id="alumno"
                                    components={{
                                      IndicatorSeparator: () => null
                                    }}

                                    styles={{
                                      control: (baseStyles, state) => ({
                                        ...baseStyles,
                                        borderColor: state.isFocused ? 'none' : '2px solid rgba(46, 55, 164, 0.1);',
                                        boxShadow: state.isFocused ? '0 0 0 1px #2e37a4' : 'none',
                                        '&:hover': {
                                          borderColor: state.isFocused ? 'none' : '2px solid rgba(46, 55, 164, 0.1)',
                                        },
                                        borderRadius: '10px',
                                        fontSize: "14px",
                                        minHeight: "45px",
                                      }),
                                      dropdownIndicator: (base, state) => ({
                                        ...base,
                                        transform: state.selectProps.menuIsOpen ? 'rotate(-180deg)' : 'rotate(0)',
                                        transition: '250ms',
                                        width: '35px',
                                        height: '35px',
                                      }),
                                    }}
                                  />)
                                }}
                              />
                              {errors.alumno && <span><small>{errors.alumno.message}</small></span>}

                            </div>
                          </div>

                        </div>
                        <div className="row">


                          <div className="col-12 col-md-5 col-xl-5">
                            <div className="form-group local-forms">
                              <label>
                                Nombre del estudiante{/* <span className="login-danger">*</span> */}
                              </label>
                              <input
                                className="form-control"
                                type="text"
                                value={selectedPatient?.fullName || ''}
                                disabled
                                {...register('fullName', {
                                  // required: {
                                  //   value: true,
                                  //   message: 'Nombre de estudiante requerido'
                                  // }
                                })}
                              />
                              {
                                errors.fullName && <span><small>{errors.fullName.message}</small></span>
                              }
                            </div>
                          </div>
                          <div className="col-12 col-md-5 col-xl-5">
                            <div className="form-group local-forms">
                              <label>
                                Email estudiante {/* <span className="login-danger">*</span> */}
                              </label>
                              <input
                                className="form-control"
                                type="text"
                                disabled
                                value={selectedPatient?.email || ''}
                                {...register('email', {
                                  // required: {
                                  //   value: true,
                                  //   message: 'Apellido de estudiante requerido'
                                  // }
                                })}
                              />
                              {
                                errors.email && <span><small>{errors.email.message}</small></span>
                              }
                            </div>
                          </div>

                          <div className="col-12 col-md-2 col-xl-2">

                            <button
                              type='button'
                              className='custom-badge status-green p-2 m-1'
                              onClick={() => { showConfirmation('add', selectedPatient.id) }}
                            >
                              Agregar al Grupo
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>


                    <div className="table-responsive doctor-list">
                      {loading ? (
                        <SimpleBackdrop />
                      ) : (
                        <Table
                          {...tableProps}
                          pagination={{
                            total: patients.length,
                            showTotal: (total, range) =>
                              `Mostrando ${range[0]} a ${range[1]} de ${total} entradas`,
                            // showSizeChanger: true,
                            onShowSizeChange: onShowSizeChange,
                            itemRender: itemRender,
                          }}
                          columns={columns}
                          dataSource={patients}

                          // rowSelection={rowSelection}
                          rowKey={(record) => record.id}
                          style={{
                            backgroundColor: '#f2f2f2',
                          }}
                        />)
                      }
                    </div>
                    <div className="col-12">
                      <div className="doctor-submit text-end">
                        {/* <button
                          type="button"
                          className="btn btn-primary submit-form me-2"
                          onClick={showConfirmation}
                        >
                          Agregar usuario
                        </button> */}
                        {/* } */}
                        <Link href={'/grupos'}>
                          <button
                            type="reset"
                            className="btn btn-primary cancel-form px-4"
                          >
                            Volver a Lista de Grupos
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {openBackdrop && <SimpleBackdrop />}

        <ModalAlert
          type={alertType}
          message={message}
          onClose={alertType === 'success' ? handleCloseSuccess : handleCloseFail}
          onConfirm={(e) => { handleOnSubmit(e) }}
          confirmText="Confirmar"
        />
      </></>
  )
}

export default withAuth(EditGroup, ['administrador', 'profesional']);
