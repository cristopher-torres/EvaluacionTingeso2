import { useEffect, useState } from "react";
import { getLoans } from "../services/loan.service";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const LoanList = () => {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    getLoans().then(res => setLoans(res.data));
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div>
      <h2>Listado de Préstamos</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Herramienta</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Inicio</TableCell>
              <TableCell>Fecha límite</TableCell>
              <TableCell>Devuelto</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loans.map(loan => (
              <TableRow key={loan.id}>
                <TableCell>{loan.id}</TableCell>
                <TableCell>{loan.tool?.id}</TableCell>
                <TableCell>{loan.client?.id}</TableCell>
                <TableCell>{formatDate(loan.startDate)}</TableCell>
                <TableCell>{formatDate(loan.scheduledReturnDate)}</TableCell>
                <TableCell>{loan.delivered ? "Sí" : "No"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default LoanList;
