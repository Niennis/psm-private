'use client'

export default function GlobalError({ error, reset }) {
  return (
    <html lang="es">
      <body>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '16px' }}>
          <h2>Algo salió mal</h2>
          <p style={{ color: '#666' }}>{error?.message || 'Error inesperado de la aplicación.'}</p>
          <button
            onClick={() => reset()}
            style={{ padding: '8px 24px', background: '#0d6efd', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  )
}
