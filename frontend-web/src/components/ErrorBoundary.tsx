import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: 2
          }}
        >
          <Paper
            sx={{
              p: 4,
              maxWidth: 500,
              textAlign: 'center',
              borderRadius: 4
            }}
          >
            <ErrorOutline sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom fontWeight={600}>
              Algo deu errado
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Desculpe, ocorreu um erro inesperado. Por favor, tente recarregar a página.
            </Typography>
            {this.state.error && this.state.errorInfo && (
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  bgcolor: 'grey.100',
                  borderRadius: 2,
                  textAlign: 'left',
                  maxHeight: 200,
                  overflow: 'auto'
                }}
              >
                <Typography variant="caption" component="pre" sx={{ fontSize: 10 }}>
                  {this.state.error.toString()}
                </Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant="contained" onClick={this.handleReload}>
                Recarregar Página
              </Button>
              <Button variant="outlined" onClick={this.handleGoHome}>
                Ir para Dashboard
              </Button>
            </Box>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
