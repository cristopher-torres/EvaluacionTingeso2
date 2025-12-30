import { useEffect, useState } from "react";
// 1. IMPORTAMOS LO OPERACIONAL DE LOAN.SERVICE
import { getActiveLoans, returnLoan, updateFinePaid } from "../services/loan.service";
// 2. IMPORTAMOS LO ANALÍTICO (FILTROS) DE REPORT.SERVICE
import { getActiveLoansReport } from "../services/report.service";

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
  const rutEmployee = keycloak?.tokenParsed?.rut; 

  // CASO 1: Ver todos (Operacional -> Usa M2 LoanService)
  const fetchAllLoans = () => {
    getActiveLoans().then(res => setLoans(res.data));
  };

  // CASO 2: Filtrar por fechas (Reporte -> Usa M6 ReportService)
  const fetchLoansByDate = () => {
    if (!startDate || !endDate) return;
    // Usamos el servicio de reportes que creamos en el paso anterior
    getActiveLoansReport(startDate, endDate).then(res => setLoans(res.data));
  };

  useEffect(() => {
    fetchAllLoans();
  }, []);

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

    returnLoan(selectedLoan.id, rutEmployee, damaged, irreparable).then(res => {
      setLoanReceipt(res.data);
      setOpenReceiptDialog(true);
      setOpenDialog(false);
    }).catch(err => {
      console.error("Error al devolver", err);
      alert("Error al procesar la devolución");
    });
  };

  const handleFinePaid = (paid) => {
    if (!loanReceipt || !loanReceipt.id) return;

    updateFinePaid(loanReceipt.id, paid).then(res => {
      setLoanReceipt(res.data);
      setOpenReceiptDialog(false);
      setSelectedLoan(null);
      fetchAllLoans(); 
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
          onClick={fetchLoansByDate}
        >
          Filtrar por fechas
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#1b5e20", "&:hover": { backgroundColor: "#145a16" } }}
          onClick={fetchAllLoans}
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
              <TableCell>Cliente (RUT)</TableCell>
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
                {/* Ojo: Usamos las propiedades planas del JSON (sin objetos anidados) */}
                <TableCell>{loan.toolName}</TableCell> 
                <TableCell>{loan.clientRut}</TableCell>
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
              <p><strong>Cliente:</strong> {loanReceipt.clientRut}</p>
              <p><strong>Herramienta:</strong> {loanReceipt.toolName}</p>
              
              <p><strong>Precio préstamo:</strong> ${loanReceipt.loanPrice || '0'}</p>
              <p><strong>Multa por atraso:</strong> ${loanReceipt.fine || '0'}</p>
              <p><strong>Daño:</strong> ${loanReceipt.damagePrice || '0'}</p>
              <hr/>
              <p><strong>Total multas y daños:</strong> ${loanReceipt.fineTotal || '0'}</p>
              <p><strong>Total final a pagar:</strong> ${loanReceipt.total || '0'}</p>

              {loanReceipt.fineTotal > 0 && !loanReceipt.finePaid ? (
                <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
                  <p style={{color: 'red', fontWeight: 'bold'}}>¿El cliente paga la multa ahora?</p>
                  <Box display="flex" gap={2} justifyContent="center" mt={2}>
                    <Button
                      sx={{ backgroundColor: "#1b5e20", "&:hover": { backgroundColor: "#145a16" } }}
                      variant="contained"
                      onClick={() => handleFinePaid(true)}
                    >
                      Sí, pagar
                    </Button>
                    <Button variant="contained" color="error" onClick={() => handleFinePaid(false)}>
                      No pagar por ahora
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
                      fetchAllLoans();
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
