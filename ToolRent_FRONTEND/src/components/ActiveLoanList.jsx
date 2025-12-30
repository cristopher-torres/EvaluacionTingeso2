import { useEffect, useState } from "react";
// Mantenemos solo las acciones de escritura (Devolución/Multa) en el servicio de Préstamos
import { returnLoan, updateFinePaid } from "../services/loan.service";
// Importamos el servicio de Reportes para la lectura de datos (M6)
import reportService from "../services/report.service";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import { useKeycloak } from "@react-keycloak/web";

const ActiveLoanList = () => {
  const [loans, setLoans] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [damaged, setDamaged] = useState(false);
  const [irreparable, setIrreparable] = useState(false);

  const [openReceiptDialog, setOpenReceiptDialog] = useState(false);
  const [loanReceipt, setLoanReceipt] = useState(null);
  const { keycloak } = useKeycloak();
  const rut = keycloak?.tokenParsed?.rut;

  // Función unificada para cargar préstamos
  // Acepta argumentos explícitos para no depender del estado asíncrono de React
  const fetchLoans = (start, end) => {
    reportService.getActiveLoansReport(start, end)
      .then(res => setLoans(res.data))
      .catch(err => console.error("Error cargando préstamos:", err));
  };

  // Carga inicial (envía comillas vacías)
  useEffect(() => {
    fetchLoans("", "");
  }, []);

  const handleFilter = () => {
    if (!startDate || !endDate) {
      alert("Seleccione ambas fechas para filtrar");
      return;
    }
    fetchLoans(startDate, endDate);
  };

  const handleOpenDialog = (loan) => {
    setSelectedLoan(loan);
    setDamaged(false);
    setIrreparable(false);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedLoan(null);
  };

  const handleReturn = () => {
    if (!selectedLoan) return;

    returnLoan(selectedLoan.id, rut, damaged, irreparable).then(res => {
      setLoanReceipt(res.data);
      setOpenReceiptDialog(true);
      setOpenDialog(false);
    }).catch(err => console.error("Error al devolver:", err));
  };

  const handleFinePaid = (paid) => {
    if (!loanReceipt || !loanReceipt.id) return;

    updateFinePaid(loanReceipt.id, paid).then(updatedLoan => {
      setLoanReceipt(prev => ({
        ...prev,
        finePaid: paid
      }));

      setOpenReceiptDialog(false);
      setSelectedLoan(null);
      
      // Al cerrar el recibo, recargamos la lista manteniendo el filtro actual
      // (Si el usuario limpió filtros, startDate ya será "", si no, usará la fecha seleccionada)
      fetchLoans(startDate, endDate);
      
    }).catch(error => {
      console.error('Error actualizando estado de multa:', error);
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div>
      <h2>Préstamos Activos</h2>

      {/* Filtros de fechas */}
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
          onClick={handleFilter}
        >
          Filtrar por fechas
        </Button>
        
        {/* AQUÍ ESTÁ EL BOTÓN CON LA LÓGICA QUE PEDISTE */}
        <Button
          variant="contained"
          sx={{ backgroundColor: "#1b5e20", "&:hover": { backgroundColor: "#145a16" } }}
          onClick={() => {
              // 1. Limpiamos visualmente los inputs
              setStartDate("");
              setEndDate("");
              // 2. Forzamos la carga con comillas vacías inmediatamente
              fetchLoans("", "");
          }}
        >
          Ver todos
        </Button>
      </Box>

      {/* Tabla de préstamos */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Herramienta</TableCell>
              <TableCell>Cliente (Rut)</TableCell>
              <TableCell>Inicio</TableCell>
              <TableCell>Fecha límite</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loans.map(loan => (
              <TableRow key={loan.id}>
                <TableCell>{loan.id}</TableCell>
                <TableCell>{loan.toolName || loan.tool?.name}</TableCell>
                <TableCell>{loan.clientRut || loan.client?.rut}</TableCell>
                <TableCell>{formatDate(loan.startDate)}</TableCell>
                <TableCell>{formatDate(loan.scheduledReturnDate)}</TableCell>
                <TableCell>{loan.loanStatus}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "#1b5e20", "&:hover": { backgroundColor: "#145a16" } }}
                    onClick={() => handleOpenDialog(loan)}
                  >
                    Devolver
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog de devolución */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Devolver Herramienta</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={<Checkbox checked={damaged} onChange={(e) => setDamaged(e.target.checked)} />}
            label="Herramienta dañada"
          />
          <FormControlLabel
            control={<Checkbox checked={irreparable} onChange={(e) => setIrreparable(e.target.checked)} disabled={!damaged} />}
            label="Daño irreparable"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#1b5e20", "&:hover": { backgroundColor: "#145a16" } }}
            onClick={handleReturn}
          >
            Confirmar devolución
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de boleta/multa */}
      <Dialog open={openReceiptDialog} onClose={() => setOpenReceiptDialog(false)}>
        <DialogTitle>Boleta de Devolución</DialogTitle>
        <DialogContent>
          {loanReceipt && (
            <div style={{ minWidth: "300px" }}>
              <p><strong>Cliente:</strong> {loanReceipt.client?.rut}</p>
              <p><strong>Herramienta:</strong> {loanReceipt.tool?.name}</p>
              <p><strong>Precio préstamo:</strong> ${loanReceipt.loanPrice || '0'}</p>
              <p><strong>Multa por atraso:</strong> ${loanReceipt.fine || '0'}</p>
              <p><strong>Daño:</strong> ${loanReceipt.damagePrice || '0'}</p>
              <p><strong>Total multa + daño:</strong> ${loanReceipt.fineTotal || '0'}</p>
              <p><strong>Total a pagar:</strong> ${loanReceipt.total || '0'}</p>

              {loanReceipt.fineTotal > 0 ? (
                <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
                  <p>¿Pagó la multa?</p>
                  <Box display="flex" gap={2} justifyContent="center" mt={2}>
                    <Button
                      sx={{ backgroundColor: "#1b5e20", "&:hover": { backgroundColor: "#145a16" } }}
                      variant="contained"
                      onClick={() => handleFinePaid(true)}
                    >
                      Sí, pagó
                    </Button>
                    <Button variant="contained" color="error" onClick={() => handleFinePaid(false)}>
                      No pagó
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box display="flex" justifyContent="center" mt={2}>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "#1b5e20", "&:hover": { backgroundColor: "#145a16" } }}
                    onClick={() => {
                      setOpenReceiptDialog(false);
                      setSelectedLoan(null);
                      // Recargamos usando el estado actual (que debería estar actualizado si venimos de un flujo normal)
                      fetchLoans(startDate, endDate);
                    }}
                  >
                    Cerrar
                  </Button>
                </Box>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActiveLoanList;