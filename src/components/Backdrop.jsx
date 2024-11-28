import CircularProgress from '@mui/material/CircularProgress';
import { Backdrop } from '@mui/material';
import Box from '@mui/material/Box';

const SimpleBackdrop = () => {
  return (
    <div style={{ height: '100vh', zIndex: 999999999, position: 'fixed' }}>
      
      {/* <Box sx={{ display: 'flex', color: '#b82925'}}>
        <CircularProgress sx={{margin: '50vh auto'}}  color="inherit" />
      </Box> */}
      <Backdrop
          sx={{ color: '#b82925', zIndex:  999999999 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
    </div>
  );
}

export default SimpleBackdrop;