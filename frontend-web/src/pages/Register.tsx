import React from 'react';
import { Box, Container, Paper, TextField, Button, Typography, Link, Grid, MenuItem } from '@mui/material';

export default function Register() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" fontWeight={700} color="primary" gutterBottom>
              💳 IBank
            </Typography>
            <Typography variant="h5" gutterBottom>
              Criar Conta
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Preencha seus dados para começar
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Nome" required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Sobrenome" required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="CPF/NIF" required placeholder="000.000.000-00" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Data de Nascimento" type="date" required InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Email" type="email" required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Telefone" required placeholder="+55 11 98765-4321" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="País" defaultValue="BR" required>
                <MenuItem value="BR">Brasil</MenuItem>
                <MenuItem value="PT">Portugal</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Senha" type="password" required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Confirmar Senha" type="password" required />
            </Grid>
          </Grid>

          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            Criar Conta
          </Button>

          <Typography variant="body2" textAlign="center">
            Já tem uma conta?{' '}
            <Link href="/login" underline="hover">
              Entrar
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
