import React from 'react';
import {
  Box,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  Collapse,
  IconButton,
  Typography
} from '@mui/material';
import { FilterList, Clear } from '@mui/icons-material';

interface TransactionFiltersProps {
  open: boolean;
  onToggle: () => void;
  filters: {
    tipo: string;
    dataInicio: string;
    dataFim: string;
    valorMin: string;
    valorMax: string;
    status: string;
  };
  onFilterChange: (filters: any) => void;
  onClearFilters: () => void;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  open,
  onToggle,
  filters,
  onFilterChange,
  onClearFilters
}) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Button
          startIcon={<FilterList />}
          onClick={onToggle}
          size="small"
          data-testid="btn-toggle-filters"
        >
          {open ? 'Ocultar Filtros' : 'Mostrar Filtros'}
        </Button>
        {open && (
          <Button
            startIcon={<Clear />}
            onClick={onClearFilters}
            size="small"
            color="secondary"
            data-testid="btn-clear-filters"
          >
            Limpar Filtros
          </Button>
        )}
      </Box>
      
      <Collapse in={open}>
        <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={filters.tipo}
                  label="Tipo"
                  onChange={(e) => onFilterChange({ ...filters, tipo: e.target.value })}
                  data-testid="filter-tipo"
                >
                  <MenuItem value="TODOS">Todos</MenuItem>
                  <MenuItem value="PIX">PIX</MenuItem>
                  <MenuItem value="TED">TED</MenuItem>
                  <MenuItem value="DOC">DOC</MenuItem>
                  <MenuItem value="TRANSFERENCIA">Transferência</MenuItem>
                  <MenuItem value="DEPOSITO">Depósito</MenuItem>
                  <MenuItem value="SAQUE">Saque</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
                  data-testid="filter-status"
                >
                  <MenuItem value="TODOS">Todos</MenuItem>
                  <MenuItem value="CONCLUIDA">Concluída</MenuItem>
                  <MenuItem value="PENDENTE">Pendente</MenuItem>
                  <MenuItem value="CANCELADA">Cancelada</MenuItem>
                  <MenuItem value="AGENDADA">Agendada</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Data Início"
                InputLabelProps={{ shrink: true }}
                value={filters.dataInicio}
                onChange={(e) => onFilterChange({ ...filters, dataInicio: e.target.value })}
                data-testid="filter-data-inicio"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Data Fim"
                InputLabelProps={{ shrink: true }}
                value={filters.dataFim}
                onChange={(e) => onFilterChange({ ...filters, dataFim: e.target.value })}
                data-testid="filter-data-fim"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Valor Mínimo"
                placeholder="R$ 0,00"
                value={filters.valorMin}
                onChange={(e) => onFilterChange({ ...filters, valorMin: e.target.value })}
                data-testid="filter-valor-min"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Valor Máximo"
                placeholder="R$ 0,00"
                value={filters.valorMax}
                onChange={(e) => onFilterChange({ ...filters, valorMax: e.target.value })}
                data-testid="filter-valor-max"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: '36px' }}>
              Filtros ativos ajudam a encontrar transações específicas
            </Typography>
          </Box>
        </Paper>
      </Collapse>
    </Box>
  );
};
