import { useEffect, useState } from "react";
// 1. CAMBIO: Usamos report.service en lugar de loan.service
import { getOverdueLoans } from "../services/report.service";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

const ReportLateClient = () => {
  const [loans, setLoans] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchLateLoans = () => {
    // 2. CAMBIO: El nuevo servicio maneja la lógica de fechas internamente
    // Si startDate/endDate son vacíos, el backend devuelve todos.
    getOverdueLoans(startDate, endDate)
        .then(res => setLoans(res.data))
        .catch(err => console.error("Error al cargar reporte", err));
  };

  useEffect(() => {
    fetchLateLoans();
  }, []); // Carga inicial

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div>
      <h2>Reporte de Clientes Atrasados</h2>

      <Box display="flex" gap={2} mb={2}>
        <TextField
          type="date"
          label="Desde"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          type="date"
          label="Hasta"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Button
          variant="contained"
          sx={{ backgroundColor: "#1b5e20", "&:hover": { backgroundColor: "#145a16" } }}
          onClick={fetchLateLoans}
        >
          Filtrar / Actualizar
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Préstamo</TableCell>
              <TableCell>RUT Cliente</TableCell>
              <TableCell>Herramienta</TableCell>
              <TableCell>Fecha Pactada</TableCell>
              <TableCell>Días de Atraso (aprox)</TableCell>
              <TableCell>Multa Acumulada</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loans.map(loan => {
                // Cálculo simple de días de atraso para visualización
                const today = new Date();
                const scheduled = new Date(loan.scheduledReturnDate);
                const diffTime = Math.abs(today - scheduled);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

                return (
                  <TableRow key={loan.id}>
                    <TableCell>{loan.id}</TableCell>
                    
                    {/* CAMBIO CRÍTICO: Usamos clientRut porque 'loan.client' es null */}
                    <TableCell>{loan.clientRut}</TableCell> 
                    
                    <TableCell>{loan.toolName}</TableCell>
                    <TableCell>{formatDate(loan.scheduledReturnDate)}</TableCell>
                    
                    <TableCell>{diffDays} días</TableCell>
                    <TableCell>${loan.fine}</TableCell>
                  </TableRow>
                );
            })}
            
            {loans.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No hay clientes con atrasos en el rango seleccionado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ReportLateClient;
