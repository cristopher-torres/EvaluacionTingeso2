import React, { useEffect, useState } from "react";
import { getUnpaidLoans, updateFinePaid } from "../services/loan.service";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const UnpaidLoansPage = () => {
  const [loans, setLoans] = useState([]);

  // Traer préstamos no pagados
  const fetchUnpaidLoans = () => {
    getUnpaidLoans()
      .then(res => setLoans(res.data))
      .catch(err => console.error("Error cargando préstamos:", err));
  };

  useEffect(() => {
    fetchUnpaidLoans();
  }, []);

  // Marcar multa como pagada
  const handleMarkPaid = (loanId) => {
    updateFinePaid(loanId, true)
      .then(() => {
        // Actualizar lista
        fetchUnpaidLoans();
      })
      .catch(err => console.error("Error actualizando multa:", err));
  };

  return (
    <div>
      <h2>Préstamos con Multas No Pagadas</h2>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Préstamo</TableCell>
              <TableCell>ID Usuario</TableCell>
              <TableCell>RUT</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Deuda</TableCell>
              <TableCell>Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loans.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell>{loan.id}</TableCell>
                <TableCell>{loan.client?.id}</TableCell>
                <TableCell>{loan.client?.rut}</TableCell>
                <TableCell>{loan.client?.email}</TableCell>
                <TableCell>{loan.client?.phoneNumber}</TableCell>
                <TableCell>${loan.fineTotal}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "#1b5e20", "&:hover": { backgroundColor: "#145a16" } }}
                    onClick={() => handleMarkPaid(loan.id)}
                  >
                    Pago
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {loans.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No hay préstamos con multas pendientes.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UnpaidLoansPage;
