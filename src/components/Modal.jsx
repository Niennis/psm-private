import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
// import { Link } from 'react-router-dom';
// import Link from 'next/link';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70svw',
  height: '80svh',
  overflow: 'auto',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  scrollBehavior: 'smooth'
};

const ModalConsent = ({ open, handleClose, onClick, errors }) => {
  // const [open, setOpen] = useState(false);
  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);
  // console.log('errors', errors)

  return (
    <div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Consentimiento Informado
          </Typography>
          {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}> */}
          Para solicitar atención en el Departamento de Salud Mental Estudiantil, perteneciente a la Dirección de Asuntos Estudiantiles (DAE) de  la Universidad Diego Portales, debes leer y aceptar los siguientes términos generales y específicos de atención:

          <b>Términos Generales</b>

          <b>Derechos</b>
          <ul>
            <li>Ser tratado(a) en todo momento con respeto y dignidad, sin importar mi condición social, étnica, nacionalidad, opción religiosa, sexual o política.</li>
            <li>Recibir atención de salud mental apropiada y de calidad.</li>
            <li>Ser informado(a) de mi diagnóstico, tratamiento y pronostico, si así lo requiero y solicito.</li>
            <li>Aceptar o rechazar el tratamiento que se me proponga (firmaré consentimiento o disentimiento según sea el caso).</li>
            <li>No ser objeto de investigaciones ni de tratamientos experimentales sin mi consentimiento.</li>
            <li>Saber que toda la información tratada en las sesiones y/o contenida en mi ficha clínica, se mantendrá en reserva, y está sujeta al secreto profesional de confidencialidad. Si la información entregada revierte algún riesgo vital para el paciente o algún tercero, será contactado algún familiar o adulto responsable.</li>
            <li>Ser atendido(a) puntualmente. Si el profesional se retrasa, deberá asignarme el tiempo que corresponde a mi atención.</li>
            <li>Presentar reclamos, felicitaciones o sugerencias por escrito, en caso de solicitarlo.</li>
          </ul>

          <b>Deberes</b>

          <ul>
            <li>Entregar toda la información que se me solicite de manera clara, precisa y veraz.</li>
            <li>Actualizar información de contacto en caso de producirse algún cambio, mientras me encuentre en tratamiento.</li>
            <li>Asistir puntualmente a todas las sesiones (individuales y/o grupales) que se me cite.</li>
            <li>De presentar un retraso mayor a 15 minutos, no podrá ser atendido. A no ser que se haya acordado con su tratante.</li>
            <li>De no poder asistir a una sesión, avisar por correo electrónico, con al menos un día de anticipación o justificarla 24 horas después, a fin de asegurar las sesiones siguientes.</li>
            <li>De no presentarse a la sesión de ingreso sin previo aviso, pasará nuevamente a la lista de espera.</li>
            <li>De no presentarse en dos ocasiones consecutivas a su sesión sin aviso previo (paciente ya en atención), su cupo será utilizado por otro alumno, y no podrá recibir atención hasta el año próximo.</li>
          </ul>

          <b>Términos Específicos:</b>

          Al realizarse atenciones presenciales:
          <ul>
            <li>Psicoterapia Breve: Sesiones tendrán una duración de 50 minutos aproximadamente, con regularidad de una vez a la semana (puede acordarse otro régimen previa evaluación/recomendación del tratante). La duración de los procesos terapéuticos serán de tipo breve y focal (un máximo de 6 sesiones).</li>
          </ul>

          Al realizarse intervenciones virtuales:

          <ul>
            <li>Dado el estado de catástrofe nacional declarado en Chile, a raíz de la pandemia de COVID19, las atenciones psicológicas presenciales fueron interrumpidas. Con el fin de mantener este tipo de servicio disponible para nuestros estudiantes, de forma exepcional y por el tiempo que se requieran los cuidados relacionados a la salud de nuestra comunidad, se realizarán intervenciones clínicas virtuales.</li>
            <li>Las intervenciones clínicas virtuales se realizarán a través de las siguientes modalidades, donde el estudiante debe optar por UNA de ellas:</li>
          </ul>
          <ol>
            <li>Videollamada a las cuales se puede acceder por el sitio Whereby. El profesional enviará un link al correo institucional del alumno para ingresar.</li>
            <li>Llamada telefónica, para lo cual el estudiante entregará un número de contacto.</li>
          </ol>
          <ul>
            <li>Cualquiera de estas modalidades será confidencial, por lo que el profesional resguardará aquello, al igual que será mi responsabilidad contar con la privacidad necesaria para desarrollar la sesión virtual.</li>
            <li>Algunas de las dificultades de utilizar estas modalidades virtuales radican en la complejidad para mantener confidencialidad, problemas en la calidad de la comunicación dados inconvenientes técnicos o de conectividad, además de la restricción del contacto directo y posibilidades de acción remota.</li>
            <li>No podrán ser registradas las sesiones, la grabación unilateral de cualquier sesión y sin consentimiento es incurrir en un acto ilícito, que podría ser sancionado.</li>
            <li>Si no deseo usar estas modalidades virtuales descritas, puedo esperar a recibir sesiones presenciales una vez que se normalicen las actividades de la Universidad.</li>
          </ul>

          Quedará expreso en este documento que declaro comprender y aceptar lo expuesto. Se me ha informado en qué consisten los servicios prestados por el Departamento de Salud Mental Estudiantil de forma presencial y la intervención clínica virtual producto de la pandemia COVID 19.

          Además declaro haber presentado todos datos necesarios para mi contacto y los de un familiar y/o adulto responsable e información fidedigna en la ficha de atención psicológica que completé anteriormente.
          {/* </Typography> */}
          {/* <Link to='/form'> */}
          <div className="row">
            <div className="col-12 text-end">
              {Object.keys(errors).length !== 0 && <p className=''>Faltan campos por completar</p>}
              <Button
                onClick={handleClose}
                className='btn btn-secondary m-2'>
                Cerrar</Button>
              <Button
                onClick={onClick}
                className='btn btn-primary submit-form m-2'>
                Aceptar</Button>
            </div>
          </div>
          {/* </Link> */}
        </Box>
      </Modal>
    </div>
  );
}

export default ModalConsent;