import React, { useEffect, useState } from "react";
// Usamos ReportService para leer la lista y LoanService para ejecutar la acción de pago
import { getUnpaidLoans } from "../services/report.service"; 
import { updateFinePaid } from "../services/loan.service";

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

  // Traer préstamos no pagados (Reporte Financiero)
  const fetchUnpaidLoans = () => {
    getUnpaidLoans()
      .then(res => setLoans(res.data))
      .catch(err => console.error("Error cargando préstamos:", err));
  };

  useEffect(() => {
    fetchUnpaidLoans();
  }, []);

  // Marcar multa como pagada (Acción Operativa)
  const handleMarkPaid = (loanId) => {
    if(!window.confirm("¿Confirmar que el cliente pagó la multa total?")) return;

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
              {/* Eliminamos Email y Teléfono porque M2 no tiene esos datos */}
              <TableCell>Deuda Total</TableCell>
              <TableCell>Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loans.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell>{loan.id}</TableCell>
                
                {/* CAMBIO: Propiedades planas */}
                <TableCell>{loan.clientId}</TableCell>
                <TableCell>{loan.clientRut}</TableCell>
                
                <TableCell>${loan.fineTotal}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "#1b5e20", "&:hover": { backgroundColor: "#145a16" } }}
                    onClick={() => handleMarkPaid(loan.id)}
                  >
                    Marcar Pagado
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {loans.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
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
