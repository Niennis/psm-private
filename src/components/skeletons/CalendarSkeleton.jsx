import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { Box } from '@mui/system';
import { Grid } from '@mui/material';

export default function CalendarSkeleton() {
  return (
    <Stack spacing={1}>
      {/* For variant="text", adjust the height via font-size */}
      {/* <Skeleton variant="h1" /> */}
      {/* For other variants, adjust the size with `width` and `height` */}
      <Grid container wrap="nowrap" sx={{ width: '100%' }}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'inline-block', width: '20%', pr: 1 }} >
            <Skeleton  variant="h1" />
          </Box>
          <Box sx={{ display: 'inline-block', width: '60%', pr: 1 }} >
            <Skeleton  variant="h1" />
          </Box>
          <Box sx={{ display: 'inline-block', width: '20%' }} >
            <Skeleton  variant="h1" />
          </Box></Box>
      </Grid>
      <Skeleton variant="rectangular" width={'100%'} height={'348px'} />
      {/* <Skeleton variant="rounded" width={210} height={60} /> */}
    </Stack>
  );
}