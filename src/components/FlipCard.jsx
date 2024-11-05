import { Button } from "@mui/material"
import { StarRounded } from "@mui/icons-material"
import '@/components/flipCard.css'

const FlipCard = ({ titulo, descripcion, archivo }) => {
  return (
    <>
      <div class="flip-box">
        <div class="flip-box-inner">
          <div class="flip-box-front">
            <StarRounded style={{ fontSize: '70px' }} />
            <p style={{textWrap: 'balance'}}>{titulo}</p>
          </div>
          <div class="flip-box-back">
            <p style={{textWrap: 'pretty'}}>{descripcion}</p>
            <button className='roboto btn btn-outline-light' variant="outlined">
              <a href={archivo} style={{ color: 'white' }}>
                Haz click aquí para saber más
              </a>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default FlipCard;