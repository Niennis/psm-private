import { useState } from 'react'
import { Alert } from '@mui/material';
import { Button } from 'react-bootstrap'

const ModalAlert = ({
  type, // 'success', 'fail', 'warning', 'initial'
  message = '',
  onClose,
  onConfirm,
  confirmText = 'Confirmar'
}) => {
  // No mostrar nada si el tipo es 'initial' o no existe
  if (type === 'initial' || !type) {
    return null;
  }

  // Estilos base compartidos
  const overlayStyle = {
    height: '100%',
    position: 'fixed',
    top: '0',
    width: '100%',
    zIndex: 99999,
    background: '#00000080'
  };

  const alertStyle = {
    zIndex: 'tooltip',
    position: 'absolute',
    left: '30%',
    width: '50%',
    padding: '50px',
    bottom: '50vh'
  };

  // Configuración para cada tipo de alerta
  switch (type) {
    case 'success':
      return (
        <div style={overlayStyle}>
          <Alert
            severity="success"
            onClose={onClose}
            sx={alertStyle}
            spacing={2}
          >
            {message || 'Acción exitosa. Revisa los detalles en la sección Lista de citas.'}
          </Alert>
        </div>
      );

    case 'fail':
      return (
        <div style={overlayStyle} className="row">
          <div className="col-sm-12 col-lg-6">
            <Alert
              severity="error"
              onClose={onClose}
              sx={alertStyle}
              spacing={2}
            >
              Ha ocurrido un problema. {message}
            </Alert>
          </div>
        </div>
      );

    case 'warning':
      return (
        <div style={overlayStyle} className="row">
          <div className="col-sm-12 col-lg-6">
            <Alert
              severity="warning"
              onClose={onClose}
              sx={alertStyle}
            >
              <h4>{message}</h4>
              <Button variant="primary" onClick={onConfirm}>
                {confirmText}
              </Button>
            </Alert>
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default ModalAlert