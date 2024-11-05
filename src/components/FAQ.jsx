import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import { useState } from 'react';
import { useMediaQuery } from "@mui/material";

import { AddCircleOutlineOutlined, RemoveCircleOutline } from '@mui/icons-material';

const FrequentAskedQuestions = ({questions}) => {
  const [expanded, setExpanded] = useState(false);
  const matches = useMediaQuery('(min-width:600px)');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <Box sx={{ width: '90svw', margin: 'auto auto 40px' }} className='container col-12 col-lg-10 ' id="preguntas_frecuentes">
      {
        questions.map((question, i) => (
          <Accordion
            key={question.id}
            expanded={expanded === question.id}
            onChange={handleChange(question.id)}
            sx={
              expanded === question.id
                ? { bgcolor: '#3886FF', color: '#fff', margin: '5px', borderRadius: '8px' }
                : { boxShadow: 'none', border: '1px solid black', margin: '5px 0', borderRadius: '8px !important' }
            }
          >
            <AccordionSummary
              sx={{ borderBottom: matches && (expanded === question.id) && '1px solid #fff' }}
              expandIcon={matches && (expanded === question.id
                ? <RemoveCircleOutline sx={{ color: '#fff' }} />
                : <AddCircleOutlineOutlined />)
              }
              aria-controls={`panel${i}bh-content`}
              id={`panel${i}bh-header`}
            >
              <Typography sx={{ fontWeight: 700, fontFamily: 'sailec' }}>{question.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ fontFamily: 'sailec'}}>
                {question.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))
      }
    </Box>
  )
}

export default FrequentAskedQuestions;

