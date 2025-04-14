'use client'
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useSidebar } from "@/context/SidebarContext";

import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import withAuth from '@/components/withAuth';

import { useForm, Controller, set } from 'react-hook-form'

import SimpleBackdrop from '@/components/Backdrop';
import { createGroup } from '@/services/GroupServices';

import FeatherIcon from 'feather-icons-react';
import Alert from '@mui/material/Alert';

import ModalAlert from '@/components/ModalAlert';

const CreateGroup = () => {
  const { data: session } = useSession()
  const router = useRouter();
  const { setProps } = useSidebar();
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [dataDoctor, setDataDoctor] = useState(null)
  const [message, setMessage] = useState('')
  const [alertType, setAlertType] = useState('initial');
  // const [alertMessage, setAlertMessage] = useState('');

  const { register, handleSubmit, watch, control, reset, setValue, getValues, setError,
    formState: { errors, isSubmitSuccessful }
  } = useForm()


  useEffect(() => {
    setProps({
      id: "menu-item5",
      id1: "menu-items5",
      activeClassName: "add-shedule",
    });
  }, [setProps]);

  const onSubmit = handleSubmit(async (data, e) => {
    e.preventDefault()
    setAlertType('initial')
    setOpenBackdrop(true)

    if (data) {
      try {
        const response = await createGroup(data)
        console.log('RESPONSE', response);
        if (!response) {

          setAlertType('fail')
          setMessage('El servicio no está disponible')
        } else {

          setAlertType('success')
          setMessage('El servicio salió exitoso')
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


  const handleCloseSuccess = () => {
    setAlertType('initial')
    router.push('/grupos')
  }

  const handleCloseFail = () => {
    setAlertType('initial')
  }

  const showConfirmation = () => {
    setAlertType('warning');
    setMessage('¿Está seguro que desea continuar con esta acción?');
  };

  return (
    < >
      <div className="sidebar-overlay" data-reff="" style={{ zIndex: 98 }} />
      <>
        <div className="page-wrapper mt-5 pt-5">
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
                    <li className="breadcrumb-item active">Agregar Grupo</li>
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
                            <h4>Detalles del Grupo</h4>
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
                              placeholder=""
                              {...register('name', {
                                required: {
                                  value: true,
                                  message: 'Nombre  de grupo es requerido'
                                },
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

                        <div className="col-12">
                          <div className="doctor-submit text-end">
                            <button
                              type="button"
                              className="btn btn-primary submit-form me-2"
                              onClick={showConfirmation}
                            >
                              Agregar grupo
                            </button>
                            {/* } */}
                            <Link href={'/profesionales'}>
                              <button
                                type="reset"
                                className="btn btn-primary cancel-form"
                              >
                                Cancelar
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </form>
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
          onConfirm={(e) => { onSubmit(e) }}
          confirmText="Confirmar"
        />
      </>
    </>
  );

}

export default withAuth(CreateGroup, ['administrador', 'profesional']);
