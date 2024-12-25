'use client'
import { forwardRef, useImperativeHandle } from "react";
import { useForm } from 'react-hook-form';
import { MinusCircle } from 'feather-icons-react/build/IconComponents';

const Contact = forwardRef(({ index, deleteContact }, ref) => {
  const { register, handleSubmit, getValues, trigger,
    formState: { errors }
  } = useForm()

  const handleClick = () => {
    deleteContact(index)
  }

  useImperativeHandle(ref, () => ({
    submitForm: async () => {
      // Valida y obtiene los valores del formulario
      const isValid = await trigger();
      if (isValid) {
        return getValues(); // Retorna los datos si son válidos
      }
      return null; // Retorna null si hay errores
    },
  }));

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
            {...register('name_contact')} />
        </div>
      </div>
      <div className="col-12 col-sm-6">
        <div className="form-group local-forms">
          <label>
            Parentesco o tipo de relación <span className="login-danger">*</span>
          </label>
          <input
            className="form-control" type="text"
            defaultValue={""}
            {...register('relationship_contact')} />
        </div>
      </div>
      <div className="col-12 col-sm-6">
        <div className="form-group local-forms">
          <label>
            Teléfono <span className="login-danger">*</span>
          </label>
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">+56</span>
            </div>
            <input
              className="form-control" type="tel"
              defaultValue={""}
              {...register('mobile_contact', {
                validate: (value) =>
                  value.length === 9 || "Cantidad de caracteres debe ser igual a 9",
              })}
              maxLength={9}
              minLength={9}
            />
          </div>
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
            {...register('email_contact')} />
        </div>
      </div>
    </>
  )
})

export default Contact;