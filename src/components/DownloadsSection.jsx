'use client'
import { useEffect } from 'react'; 
import { useFormContext } from 'react-hook-form';
import { PlusCircle, MinusCircle } from "feather-icons-react/build/IconComponents";


const DownloadSection = ({ id, register, errors, handleDeleteDownload, initialData }) => {
  const { setValue } = useFormContext();

  useEffect(() => { 
    if (initialData) { 
      setValue(`descarga_titulo_${id}.`, initialData.descarga_titulo); 
      setValue(`descarga_bajada_${id}.`, initialData.descarga_bajada); 
      setValue(`descarga_url_${id}.`, initialData.descarga_url); 
    } 
  }, [initialData, id, setValue]);

  return (
    <div>
      <div className="col-12 col-sm-12">
        <h6 style={{ lineHeight: '30px', textAlign: 'right' }} onClick={handleDeleteDownload}>
          Eliminar <MinusCircle style={{ cursor: 'pointer' }} />
        </h6>
      </div>

      <div className="col-12 col-md-12 col-xl-12">
        <div className="form-group local-forms">
          <label>
            Título material descargable<span className="login-danger">*</span>
          </label>
          <input
            className="form-control"
            type="text"
            placeholder=""
            {...register(`descarga_titulo_${id}`, {
              required: {
                maxLength: {
                  value: 50,
                  message: 'El título no puede tener más de 50 caracteres',
                },
              },
            })}
            defaultValue={initialData?.descarga_titulo}
          />
          {errors[`descarga_titulo_${id}`] && (
            <span className="login-danger">
              <small>{errors[`descarga_titulo_${id}`].message}</small>
            </span>
          )}
        </div>
      </div>

      <div className="col-12">
        <div className="form-group local-forms">
          <label>
            Descripción material descargable<span className="login-danger">*</span>
          </label>
          <input
            className="form-control"
            type="text"
            placeholder=""
            {...register(`descarga_bajada_${id}`, {
              required: {
                maxLength: {
                  value: 50,
                  message: 'El título no puede tener más de 50 caracteres',
                },
              },
            })}
            defaultValue={initialData?.descarga_bajada}
          />
          {errors[`descarga_bajada_${id}`] && (
            <span className="login-danger">
              <small>{errors[`descarga_bajada_${id}`].message}</small>
            </span>
          )}
        </div>
      </div>

      <div className="col-12 col-md-6 col-xl-6">
        <div className="form-group local-forms">
          <label>
            Agregar url documento (pdf)
            <span className="login-danger">*</span>
          </label>
          <input
            type="text"
            data-role="files"
            className="form-control"
            accept=".pdf"
            multiple
            {...register(`descarga_url_${id}`)}
            defaultValue={initialData?.descarga_url}
          />
        </div>
      </div>
    </div>
  );
};

export default DownloadSection;