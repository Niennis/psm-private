import { PlusCircle, MinusCircle } from "feather-icons-react/build/IconComponents";


const DownloadSection = ({ id, register, errors, handleDeleteDownload }) => {
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
          />
        </div>
      </div>
    </div>
  );
};

export default DownloadSection;