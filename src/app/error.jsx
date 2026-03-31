'use client'

export default function Error({ error, reset }) {
  return (
    <div className="center">
      <div className="row justify-content-center" style={{ padding: 0, margin: '250px auto 0', width: '500px' }}>
        <div className="col-12 text-center" style={{ padding: 0, margin: '32px 0 0' }}>
          <div className="card p-4">
            <h5 className="card-title">Ocurrió un error inesperado</h5>
            <p className="card-text text-muted">{error?.message || 'Por favor intenta nuevamente.'}</p>
            <button className="btn btn-primary mt-3" onClick={() => reset()}>
              Reintentar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
