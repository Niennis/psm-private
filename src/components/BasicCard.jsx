import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import '@/components/flipCard.css'

const BasicCard = ({ children, maxWidth, bgColor, fontSize, border }) => {
  return (
    <Card sx={{
      minWidth: 275,
      maxWidth: maxWidth,
      backgroundColor: bgColor,
      border: `2px solid #${border}`

    }}>
      <CardContent>
        <Typography
          variant="body2"
          sx={{
            fontSize: fontSize
          }}
        >
          {children}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default BasicCard;