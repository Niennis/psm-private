'use client'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MinusCircle } from 'feather-icons-react/build/IconComponents';

const Contact = ({ index, deleteContact }) => {
  const { register,
    formState: { errors }
  } = useForm()

  const handleClick = () => {
    deleteContact(index)
  }

  return (
    <>
      <div className="col-12 col-sm-6">
        <h6 style={{ lineHeight: '30px' }}>
          Nuevo contacto
        </h6>
      </div>
      <div className="col-12 col-sm-6">
        <h6 style={{ lineHeight: '30px', textAlign: 'right' }} onClick={handleClick}>
          Eliminar <MinusCircle />
        </h6>
      </div>

      <div className="col-12 col-sm-6">
        <div className="form-group local-forms">
          <label>
            Nombres y apellidos <span className="login-danger">*</span>
          </label>
          <input
            className="form-control" type="text"
            defaultValue={""}
            {...register('address')} />
        </div>
      </div>
      <div className="col-12 col-sm-6">
        <div className="form-group local-forms">
          <label>
            Parentesco <span className="login-danger">*</span>
          </label>
          <input
            className="form-control" type="text"
            defaultValue={""}
            {...register('address')} />
        </div>
      </div>
      <div className="col-12 col-sm-6">
        <div className="form-group local-forms">
          <label>
            Celular <span className="login-danger">*</span>
          </label>
          <input
            className="form-control" type="tel"
            defaultValue={""}
            placeholder="+56"
            {...register('address')} />
        </div>
      </div>
      <div className="col-12 col-sm-6">
        <div className="form-group local-forms">
          <label>
            Correo electrónico <span className="login-danger">*</span>
          </label>
          <input
            className="form-control" type="text"
            defaultValue={""}
            {...register('address')} />
        </div>
      </div>
    </>
  )
}

export default Contact;