import { Box, Typography, Button } from '@mui/material';
import useNavigation from '../utils/Navigation';
import { HomeOutlined, HomeRounded } from '@mui/icons-material';

export default function Error({ argbToHex, isDarkMode, md3Colors }) {
  const { gotoHome } = useNavigation()

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        p: 2,
        gap: 8,
      }}
    >
      <Typography variant="h4" fontWeight="bold" color={argbToHex(md3Colors.primary)}>
        Something went wrong!!!
      </Typography>

      <Button
        variant="contained"
        onClick={() => gotoHome()}
        size='large'
        sx={{
          borderRadius: '1rem',
          textTransform: 'none',
        }}
      >
        Go to Home
        <HomeOutlined sx={{ ml: 1 }} />
      </Button>

    </Box>
  );
}
