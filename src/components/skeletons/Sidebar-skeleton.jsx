import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

export default function SidebarSkeleton() {
  return (
    <Stack spacing={2} sx={{padding: '12px 20px', fontSize: '14px'}}>
      {/* For variant="text", adjust the height via font-size */}
      {/* <Skeleton variant="text" sx={{ fontSize: '1rem' }} /> */}
      {/* For other variants, adjust the size with `width` and `height` */}
    
      <Skeleton 
        variant="rounded"
        width={'100%'}
        height={'40px'}
        sx={{
          padding: "12px 20px"
        }}
      />
      {/* <Skeleton variant="rounded" width={210} height={60} /> */}
    </Stack>
  );
}