import { Fragment } from 'react';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }}  placement="right"/>
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 400,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
    padding: '5px 5px 5px 0',
    textAlign: 'left',
  },
}));

export default function CustomizedTooltips({ title, text, children }) {
  return (
    <div>
      <HtmlTooltip
        arrow
        title={
          <Fragment >
            <Typography color="inherit" sx={{ margin:0, padding: '5px 5px 0 5px' }}>{title}</Typography>
            <div style={{ margin: 0, padding: '5px' }}>{text}</div>
          </Fragment>
        }
      >
        {children}
      </HtmlTooltip>
    </div>
  );
}
