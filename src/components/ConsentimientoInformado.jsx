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

const ModalConsent = ({ open, handleClose, onClick, errors, register }) => {
  // const [open, setOpen] = useState(false);
  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);

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
          {Object.keys(errors).length !== 0 && <p className='font-red'>Faltan campos por completar</p>}
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Consentimiento Informado
          </Typography>
          {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}> */}
          <h3>Proceso de ingreso y/o derivación (PID)</h3>

          <p>
            En primera instancia se realizará una entrevsita de evaluación, la cual recabará información relevante sobre aspectos personales de la vida de el/la estudiante, motivo de consulta, principales dificultades y sintomatología. Dependiendo de los resultados de esta entrevista, criterios de exclusión y disponibilidad de horas, se indicará las posibilidades de atención dentro o fuera del DSME.
          </p>
          <p>
            La entrevista de evaluación es parte de un proceso de ingreso o derivación, por lo que el sólo hecho de tener la entrevista <b>no asegura un cupo</b> en las instancias del DSME. Es relevante considerar que, <b>si la información entregada por el/la estudiante revierte algún riesgo vital grave para el/ la estudiante o algún/a tercero, será contactado, incluso sin su consentimiento</b>, algún familiar o adulto/a responsable de su red de apoyo, con el fin de informar la situación y que  pueda acompañar su ingreso a su sistema de salud o acoger la sugerencia de derivación del DSME, <b>lo cual se hará de manera obligatoria al ser sintomatología de carácter grave.</b>
          </p>
          <p>
            Las alternativas de atención de salud mental <b>dentro del DSME</b> son: Psicoterapia individual breve (dependiendo del caso podría otorgarse un máximo 10 sesiones), acompañamiento psicológico (dependiendo del caso podría otorgarse un máximo 4 sesiones) tratamiento psiquiátrico (en casos puntuales), grupos psicoterapéuticos y atención psicopedagógica. Fuera del DSME exsiste una serie de centros en convenio para realizar una derivación a tratamiento psicológico y/o psiquiátrico.
          </p>

          <b>Derivación externa</b>
          <p>
            En caso de que durante la entrevista de evaluación se pesquise la necesidad de derivación externa,  dada su sintomatología o que se determine que el abordaje de su problemática requiere un tiempo más extenso tratamiento, el/la estudiante se compromete a acoger la sugerencia profesional. De no aceptar dicha sugerencia el/la estudiante se hace responsable de esta desición.
          </p>
          <p>
            Recalcar que la atención del DSME está enfocada en procesos breves de baja a mediana complejidad, por lo que en casos de riesgo vital, la derivación es mandatoria, además de la activación de la red  de apoyo.
          </p>

          <h3>Derechos y Deberes</h3>
          <p>
            Para todas las instancias, tanto la entrevista de evaluación, ingreso a alguna de las modalidades dentro del DSME, como derivación a un centro con convenio, el/la estudiante debe conocer los siguientes derechos y deberes:
          </p>

          <b>Derechos</b>
          <ol>
            <li>Ser tratado(a) en todo momento con respeto y dignidad, sin importar condición social, étnica, nacionalidad, opción religiosa, sexual o política.</li>
            <li>Recibir atención de salud mental apropiada y de calidad.</li>
            <li>Saber que toda la información tratada en la sesión, se mantendrá en reserva, y está sujeta al secreto profesional de confidencialidad, quebrandose la misma en casos de riesgo vital grave y/o develación de daño a terceras personas. </li>
            <li>Ser atendido(a) puntualmente. Si el profesional se retrasa, podrá asignarme el tiempo que corresponde a mi atención. </li>
          </ol>

          <b>Deberes</b>
          <ol>
            <li>
              Brindar un trato respetuoso a todos los funcionarios del DMSE. No se aceptarán faltas relacionadas a condición social, étnia, nacionalidad, religión, política o sexual, tampoco serán permitidos garabatos, gritos, insultos, junto a insinuaciones de carácter sexual o conductas indebidas. Si esto sucede se cerrará el proceso de forma inmediata y no podrá solicitar atención en el DSME.
            </li>
            <li>
              Entregar información fidedigna y datos necesarios para el contacto de un familiar y/o adulto responsable en caso de ser necesario.
            </li>
            <li>
              Criterios de inasistencia:
              <ol type="a">
                <li>
                  <strong>Entrevista de evaluación:</strong> se asignará una nueva hora si el estudiante justifica su inasistencia (certificados o documentos que avalen la ausencia). Podrá no presentarse a esta entrevista en sólo una oportunidad, luego de eso se cerrará el proceso y podrá solicitar ingreso al semestre siguiente.
                </li>
                <li>
                  <strong>Psicoterapia individual breve:</strong>
                  <ol type="i">
                    <li>2 inasistencias injustificadas seguidas se considerará abandono en el registro y se dará de alta del proceso en el DSME.</li>
                    <li>2 inasistencias injustificadas durante el proceso se considerará alta administrativa.</li>
                    <li>2 inasistencias justificadas o dos inasistencias justificadas intermitentemente, podrán continuar su proceso y si falta una tercera vez, se considerará alta administrativa.</li>
                  </ol>
                </li>
                <li>
                  <strong>Acompañamiento:</strong> 1 inasistencia será permitida durante el proceso y si falta una segunda oportunidad, se cierra el proceso como alta administrativa.
                </li>
                <li>
                  De presentar un retraso mayor a 15 minutos (individual y grupal/ presencial y online), no será atendido y se registrará como inasistencia.
                </li>
                <li>
                  Justificación debe realizarse dentro de las 12 horas previas o posteriores a la ausencia, si no se marcará como una inasistencia.
                </li>
                <li>
                  No se aceptará como justificación: quedarse dormido y olvido/confusión de la sesión.
                </li>
              </ol>
            </li>
            <li>
              De ser derivado a un lugar con convenio (libre elección) o haber ingresado a su sistema de salud público o privado, el/la estudiante deberá coordinar su hora de atención e ingresar para dar inicio al tratamiento requerido. Si no asiste, no podrá solicitar ingreso nuevamente al DSME hasta el año siguiente.
            </li>
          </ol>

          <p>
            Quedará expreso en este documento que declaro comprender y aceptar lo expuesto.
            {/* <input
              type="checkbox"
              {...register("aceptar", { required: true })}
              style={{ marginLeft: '8px' }}
            />
          <span><small> *</small></span> */}
          </p>
          {/* </Typography> */}
          {/* <Link to='/form'> */}
          <div className="row">
            <div className="col-12 text-end">
              {Object.keys(errors).length !== 0 && <p className='font-red'>Faltan campos por completar</p>}
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