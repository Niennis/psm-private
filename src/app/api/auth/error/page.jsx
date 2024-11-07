import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

const Error = () => {
  return (
    <div className='center'>
      <div className="row justify-content-center " style={{ padding: 0, margin: "250px auto 0"  }}>
        <div className="col-sm-12 col-xl-4 text-center " style={{ padding: 0, margin: '32px 0 0' }}>

          <Card sx={{ minWidth: 275, padding:'20px'}}>
            <CardContent>
              {/* <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Word of the Day
              </Typography> */}
              <Typography variant="h5" component="div">
                El mail ingresado no está autorizado.
              </Typography>
              {/* <Typography sx={{ mb: 1.5 }} color="text.secondary">
              </Typography> */}
              <Typography variant="body2">
                Solo alumnos regulares pueden acceder a la plataforma.
              </Typography>
            </CardContent>
            <CardActions>
              <Link size="small" href="/">Ir a página inicio</Link>
            </CardActions>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Error;