import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ 
  message = 'Carregando...', 
  fullScreen = false 
}) => {
  const sx = fullScreen
    ? {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 9999
      }
    : {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      };

  return (
    <Box sx={sx}>
      <CircularProgress size={fullScreen ? 60 : 40} />
      <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
        {message}
      </Typography>
    </Box>
  );
};

export default Loading;
