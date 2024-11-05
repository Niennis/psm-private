"use client"
import Image from "next/image";
import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query';
import { useSection } from "@/context/SectionContext";

import { fetchBlogs } from '../services/BlogServices';
import ImageSlider from '../components/ImageSlider';
import TestSlider from '../components/TestSlider';
import Events from '../components/Events';
import FrequentAskedQuestions from '../components/FAQ';
import QuienesSomos from "@/components/QuienesSomos";

import useMediaQuery from '@mui/material/useMediaQuery';
import FooterDae from "@/components/FooterDae";
import { saludMental01, saludMental02, saludMental03, saludMental05 } from '@/components/imagepath'
import ReservaTuHora from "@/components/ReservaHora";
import SimpleBackdrop from "@/components/Backdrop";

import { blogs } from "@/utils/blogs";

const events = [
  // {
  //   title: "Salud Mental",
  //   address: "Av. Portugal 782, Santiago",
  //   date: "2024/02/18",
  //   time: "09:00",
  //   campus: "Sede Santiago",
  //   location: "Auditorio",
  //   image: 'https://posgrados.udp.cl/wp/wp-content/uploads/2023/12/MBA-UDP-92-scaled-1.jpg',
  //   highlight: false,
  // },
  // {
  //   title: "Salud Mental",
  //   address: "Av. Portugal 782, Santiago",
  //   date: "2024/02/18",
  //   time: "09:00",
  //   campus: "Sede Centro",
  //   location: "Auditorio",
  //   image: 'https://posgrados.udp.cl/wp/wp-content/uploads/2023/12/MBA-UDP-92-scaled-1.jpg',
  //   highlight: true,
  // },
  // {
  //   title: "Salud Mental",
  //   address: "Av. Portugal 782, Santiago",
  //   date: "2024/03/18",
  //   time: "09:00",
  //   campus: "Sede Santiago",
  //   location: "Auditorio",
  //   image: 'https://posgrados.udp.cl/wp/wp-content/uploads/2023/12/MBA-UDP-92-scaled-1.jpg',
  //   highlight: false,
  // },
  // {
  //   title: "Salud Mental",
  //   address: "Av. Portugal 782, Santiago",
  //   date: "2024/02/18",
  //   time: "09:00",
  //   campus: "Sede Santiago",
  //   location: "Auditorio",
  //   image: 'https://posgrados.udp.cl/wp/wp-content/uploads/2023/12/MBA-UDP-92-scaled-1.jpg',
  //   highlight: false,
  // }
]

const tests = [

  {
    id: '0',
    titulo: 'Test de ansiedad de Beck',
    bajada: 'El test de ansiedad de Beck es un cuestionario que ayuda a saber cuánta ansiedad siente una persona. Tiene 21 preguntas sobre cómo se ha sentido recientemente.',
    url: '/tests/test_de_ansiedad',
    imagen: 'https://github.com/Niennis/imagesudp/blob/main/home_ansiedad.jpg?raw=true',
  },
  {
    id: '0',
    titulo: 'Test de depresión',
    bajada: 'El PHQ-9 es un cuestionario breve que ayuda a identificar si una persona podría estar deprimida. Consiste en 9 preguntas sobre cómo se ha sentido alguien en las últimas dos semanas.',
    url: '/tests/test_de_depresion',
    imagen: 'https://github.com/Niennis/imagesudp/blob/main/saludMental01.jpeg?raw=true',
  },
]

const questions = [
  {
    id: 'question01',
    title: '¿Cómo se solicita hora de atención?',
    answer: `
    Para acceder a entrevista de despeje debes seguir los siguientes pasos:

1. Ingresar al sitio de Solicitud de hora para entrevista de despeje
2. Completar el formulario
3. Tomar una hora en la agenda electrónica
4. Leer el consentimiento informado que se encuentra en el link

*Importante: Si no se completan los 3 primeros pasos, la hora no será agendada
`
  }, {
    id: 'question02',
    title: 'Si tomo hora, ¿ingresaré a psicoterapia?',
    answer: 'No necesariamente. La solicitud de hora es para una entrevista de despeje, donde a partir de criterios de gravedad, inclusión y exclusión, se define la mejor opción acorde a las necesidades del o la estudiante, lo cual puede incluir intervenciones individuales, grupales o derivación externa.'
  }, {
    id: 'question03',
    title: '¿¿Qué costo tiene la atención?',
    answer: 'La atención es gratuita.'
  }, {
    id: 'question04',
    title: '¿Quiénes pueden atenderse en el Departamento de Salud Mental Estudiantil?',
    answer: 'Las y los estudiantes regulares de pregrado de la Universidad.'
  }, {
    id: 'question05',
    title: '¿Cómo suspendo una hora?',
    answer: 'Debes enviar un correo al profesional que te contactó, por lo menos 24 horas antes de tu hora, es muy importante que anules tu hora si no puedes asistir, ya que tenemos una alta demanda y tu inasistencia dejará a otro/a estudiante sin posibilidad de atención.'
  }, {
    id: 'question06',
    title: '¿Qué pasa si pierdo la hora?',
    answer: `Se debe justificar la inasistencia con un plazo de 24 horas, antes o después de la cita, enviando un correo electrónico al profesional tratante.
    La inasistencia a más de dos sesiones sin justificar, será considerado abandono, se cerrará su ficha y no podrá volver a solicitar atención en el departamento hasta el semestre siguiente.`
  }, {
    id: 'question07',
    title: '¿Qué pasa si llego tarde?',
    answer: 'El/la estudiante debe ser puntual. Si asiste 15 minutos tarde o más, deberá justificar su retraso y conversar con su psicólogo/a para agendar una nueva hora. En casos excepcionales, el terapeuta podrá atender al estudiante posterior a 15 minutos, ya sea porque éste se encuentra en proceso de alta, derivación o urgencia.'
  }, {
    id: 'question08',
    title: '¿Y si no hay hora?',
    answer: `
    Tenemos un tiempo de espera de 15 días hábiles. Si no puedes esperar este tiempo, debes considerar acudir a profesionales externos, particulares o en la red de servicio público.

Números de Utilidad:

Teléfono prevención del suicidio: *4141

Salud Responde: 6003607777. Profesionales brindan orientación y ayuda en crisis

Fono Drogas: 1412

Orientación Violencia Contra la Mujer: 1455

Servicio de Atención Médica de Urgencia (SAMU): 131

Dirección Instituto Psiquiátrico Dr. Jose Horwitz Barack: Olivos 837, Recoleta.`
  }, {
    id: 'question09',
    title: '¿Qué certificados se emiten?',
    answer: 'Sólo se podrán emitir certificados de asistencia.'
  }, {
    id: 'question10',
    title: '¿Es confidencial la información entregada?',
    answer: 'Sí. Lo que hablas con el profesional es estrictamente privado y confidencial. La información que queda registrada en la ficha no puede ser entregada a nadie sin tu autorización. Salvo en casos de riesgo vital, en ese caso se contactará a la red de apoyo.'
  }, {
    id: 'question11',
    title: '¿Existen excepciones a la confidencialidad?',
    answer: 'Sí. Únicamente si la información entregada revierte algún riesgo vital para el/la estudiante o algún tercero, puede ser contactado algún familiar o adulto/a responsable.'
  }, {
    id: 'question12',
    title: '¿Por qué se solicitan datos de familiar(es) de contacto?',
    answer: 'Esta información es necesaria y sólo se utiliza en caso de existir riesgo vital y ocasiones excepcionales previo acuerdo con el o la estudiante y resguardando confidencialidad.'
  }, {
    id: 'question13',
    title: '¿El/la psicólogo/a se puede contactar con autoridades académicas?',
    answer: 'Se realizará contacto con la Secretaría de Estudios si ambas partes lo establecen como necesario.'
  }, {
    id: 'question14',
    title: '¿Cuándo consultar?',
    answer: `
    Los motivos de consulta psicológica más comunes están asociados al estrés, ansiedad, depresión, dificultades en las relaciones familiares y de pareja y consumo problemático de sustancias.

Te recomendamos consultar si:

No puedes concentrarte adecuadamente en tus tareas académicas y/o laborales y tu rendimiento se ha visto afectado;

Estás experimentando sentimientos de tristeza, agobio, enojo y/o frustración y tus problemas se mantienen, pese a tus esfuerzos y ayuda de las personas más cercanas para superar o mejorar las situaciones que te preocupan;

Te preocupas excesivamente, sueles esperas el peor resultado y te sientes con frecuencia sobrepasado/a;

Te estás llevando mal con tu familia, pareja y/o amigos/as y te cuesta comunicarte y/o disfrutar de la compañía de otros;

Te cuesta disfrutar de actividades que antes eran de tu gusto;

Tiendes a aislarte y encerrarte en ti mismo/a, evitando el contacto con tu red de apoyo cercana;

Identificas que tienes un consumo problemático de sustancias;

Habitualmente tienes malestares físicos como dolores estomacales, opresión en el pecho, dolor de espalda entre otros, que pueden ser atribuibles al estrés;

Has sufrido episodios de crisis, experimentando síntomas como: dificultad para respirar, opresión en el pecho, traspiración, aceleración del ritmo cardiaco y/o sensación de intenso temor;

Si has vivido experiencias traumáticas:

Si presentas dificultad para conciliar el sueño y/o comer;

Las recomendaciones previas no abarcan todos los motivos que pueden motivar una consulta psicológica, sólo son una guía. Te invitamos a consultar en caso de que experimentes algunas de las situaciones descritas o bien tengas otras preocupaciones pue puedan ser abordadas en conjunto con un especialista. ¡Recuerda que es muy importante la consulta precoz, no dejes pasar tiempo!
    `
  }
]

const sortedEvents = [...events].sort((a, b) => {
  // Primero, compara el campo highlight
  if (a.highlight && !b.highlight) {
    return -1;
  } else if (!a.highlight && b.highlight) {
    return 1;
  } else {
    // Si ambos tienen el mismo valor de highlight, compara las fechas
    return new Date(a.date) - new Date(b.date);
  }
});

export default function Home() {
  // const { isSuccess, isLoading, isError, data: blogs = [] } = useQuery({
  //   queryKey: ['blogs'],
  //   queryFn: async () => {
  //     const res = await fetchBlogs();
  //     console.log('RES', res);
  //     return res;
  //   }
  // })
  const { setActiveSection } = useSection();
  const sectionRefs = useRef([]);
  const isSmallDevice = useMediaQuery(
    "only screen and (max-width : 640px)"
  );
  const isMediumDevice = useMediaQuery(
    "only screen and (min-width : 641px) and (max-width : 768px)"
  );
  const isLargeDevice = useMediaQuery(
    "only screen and (min-width : 769px) and (max-width : 1024px)"
  );
  const isExtraLargeDevice = useMediaQuery(
    "only screen and (min-width : 1025px)"
  );

  const [index, setIndex] = useState(0);

  const matches = useMediaQuery('(min-width:600px)');

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const truncarPalabras = (texto, num) => {
    const aux = texto.split(' ');

    if (aux.length > num) {
      return aux.slice(0, num).join(' ') + '...';
    } else {
      return texto;
    }
  }

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionRefs.current.forEach(section => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionRefs.current.forEach(section => {
        if (section) observer.unobserve(section);
      });
    };
  }, [setActiveSection]);
  // console.log('BLOGS', blogs.slice(-4 ))

  return (
    <>
      <main >
        {!isSmallDevice && !isMediumDevice && !isLargeDevice && !isExtraLargeDevice
          ?
          <SimpleBackdrop />
          :
          <>
            {blogs.length > 0 && isSmallDevice && <ImageSlider slides={blogs.slice(-4)} innerRef={el => sectionRefs.current[0] = el} style={{ height: '100vh', padding: '1rem' }} />}
            {blogs.length > 0 && isExtraLargeDevice && <ImageSlider slides={blogs.slice(-4)} innerRef={el => sectionRefs.current[0] = el} style={{ height: '100vh', padding: '1rem' }} />}
            {/* {isLoading && <strong>Cargando...</strong>} */}
            {/* {isError && <p>Ha habido un error</p>} */}
            {/* {!isError && blogs.length === 0 && <Carrousel />} */}
            {blogs.length > 0 && <div style={{background: '#f1f1f1'}}><ReservaTuHora innerRef={el => sectionRefs.current[0] = el} style={{ height: '100vh', padding: '1rem' }} /> </div>}
            {blogs.length > 0 && <div ><QuienesSomos /></div>}
            {blogs.length > 0 && <TestSlider slides={tests.slice(0, 4)} innerRef={el => sectionRefs.current[0] = el} style={{ height: '100vh', padding: '1rem' }} />}

            {events.length !== 0 && <Events events={sortedEvents} matches={matches} innerRef={el => sectionRefs.current[0] = el} style={{ height: '100vh', padding: '1rem' }} />}

            <div className="row" style={{ padding: 0, margin: 0 }}>
              <div className="col-sm-12 text-center" style={{ padding: 0, margin: '32px 0 0' }}>
                <h2 style={{ fontSize: '32px', fontWeight: 400, lineHeight: '40px' }}>Preguntas frecuentes</h2>
              </div>
            </div>
            <FrequentAskedQuestions questions={questions} innerRef={el => sectionRefs.current[0] = el} style={{ height: '100vh', padding: '1rem' }} />
            <FooterDae matches={matches} />
          </>
        }
      </main>
    </>

  );
}
