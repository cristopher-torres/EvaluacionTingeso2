import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import loanService from "../services/loan.service";
import toolService from "../services/tool.service";
import userService from "../services/user.service";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import SaveIcon from "@mui/icons-material/Save";


const AddLoan = () => {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();

  const userId = keycloak?.tokenParsed?.sub; 

  const [tools, setTools] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedToolId, setSelectedToolId] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [startDate, setStartDate] = useState("");
  const [scheduledReturnDate, setScheduledReturnDate] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Cargar herramientas y clientes
  useEffect(() => {
    toolService
      .getAvailable()
      .then((res) => setTools(res.data))
      .catch((err) => console.error("Error cargando herramientas", err));

    userService
      .getAllClients()
      .then((res) => setClients(res.data))
      .catch((err) => console.error("Error cargando clientes", err));
  }, []);

  // Obtener herramientas únicas por nombre
  const uniqueTools = tools.reduce((acc, tool) => {
    if (!acc.find((t) => t.name === tool.name)) {
      acc.push(tool);
    }
    return acc;
  }, []);

  const saveLoan = (e) => {
    e.preventDefault();

    const rut = keycloak?.tokenParsed?.rut; 

    const loanData = {
      tool: { id: selectedToolId },
      client: { id: selectedClient },
      startDate: startDate,              
      scheduledReturnDate: scheduledReturnDate, 
      createdLoan: new Date().toISOString(), 
      createdBy: { rut: rut },
    };

    loanService
      .createLoan(loanData, rut)
      .then(() => {
        setSuccessMessage("Préstamo creado exitosamente ✅");
        setOpenSnackbar(true);
        setTimeout(() => navigate("/"), 2500);
      })
      .catch((err) => {
        console.error("Error al crear préstamo ❌", err);
        alert("Error al crear préstamo: " + err.response?.data || err.message);
      });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ backgroundColor: "#f5f5f5" }}
    >
      <Box
        component="form"
        onSubmit={saveLoan}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "400px",
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "white",
        }}
      >
        <Typography variant="h6" align="center" gutterBottom>
          Registrar Préstamo
        </Typography>

        {/* Select de Herramienta con nombres únicos */}
        <FormControl fullWidth>
          <TextField
            select
            label="Herramienta"
            value={selectedToolId}
            onChange={(e) => setSelectedToolId(e.target.value)}
            required
          >
            {uniqueTools.map((tool) => (
              <MenuItem key={tool.id} value={tool.id}>
                {tool.name}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>

        {/* Select de Cliente */}
        <FormControl fullWidth>
          <TextField
            select
            label="Cliente"
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            required
          >
            {clients.map((client) => (
              <MenuItem key={client.id} value={client.id}>
                {client.username}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>

        {/* Fecha de inicio */}
        <FormControl fullWidth>
          <TextField
            label="Fecha de inicio"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
        </FormControl>

        {/* Fecha de devolución */}
        <FormControl fullWidth>
          <TextField
            label="Fecha de devolución"
            type="date"
            value={scheduledReturnDate}
            onChange={(e) => setScheduledReturnDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          sx={{ backgroundColor: "#1b5e20", "&:hover": { backgroundColor: "#2e7d32" } }}
          startIcon={<SaveIcon />}
        >
          Guardar
        </Button>
      </Box>

      {/* Snackbar de éxito */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddLoan;



