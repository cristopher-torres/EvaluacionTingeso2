import { useEffect, useState } from "react";
import { getOverdueLoans, getOverdueLoansByDate } from "../services/loan.service";
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

  const fetchAllLateLoans = () => {
    getOverdueLoans().then(res => setLoans(res.data));
  };

  const fetchLateLoansByDate = () => {
    if (!startDate || !endDate) return;
    getOverdueLoansByDate(startDate, endDate).then(res => setLoans(res.data));
  };

  useEffect(() => {
    fetchAllLateLoans();
  }, []);

  return (
    <div>
      <h2>Préstamos Atrasados</h2>

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
          onClick={fetchLateLoansByDate}
        >
          Filtrar por fechas
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#1b5e20", "&:hover": { backgroundColor: "#145a16" } }}
          onClick={fetchAllLateLoans}
        >
          Ver todos
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Cliente</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>ID Préstamo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loans.map(loan => (
              <TableRow key={loan.id}>
                <TableCell>{loan.client.id}</TableCell>
                <TableCell>{loan.client.name}</TableCell>
                <TableCell>{loan.client.email}</TableCell>
                <TableCell>{loan.client.phoneNumber}</TableCell>
                <TableCell>{loan.id}</TableCell>
              </TableRow>
            ))}
            {loans.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No hay clientes con atrasos en devolucion de prestamos.
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
