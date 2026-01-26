import React from 'react';
import { Alert, Snackbar } from '@mui/material';

interface ToastProps {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ open, message, severity, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

// Hook personalizado para facilitar uso
export const useToast = () => {
  const [toast, setToast] = React.useState({
    open: false,
    message: '',
    severity: 'info' as 'success' | 'error' | 'warning' | 'info'
  });

  const showToast = (message: string, severity: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, open: false }));
  };

  return { toast, showToast, closeToast };
};
