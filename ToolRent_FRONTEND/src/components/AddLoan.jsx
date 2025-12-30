import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { useKeycloak } from "@react-keycloak/web"; // Ya no necesitamos el RUT del empleado para la URL
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
  // const { keycloak } = useKeycloak(); // Opcional si necesitas validar roles
  const navigate = useNavigate();

  const [tools, setTools] = useState([]);
  const [clients, setClients] = useState([]);
  
  // Estados del formulario
  const [selectedToolId, setSelectedToolId] = useState("");
  const [selectedClientId, setSelectedClientId] = useState(""); // Guardamos el ID para el Select
  const [startDate, setStartDate] = useState("");
  const [scheduledReturnDate, setScheduledReturnDate] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // 1. Cargar herramientas y clientes al montar
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

  // Filtro visual: Herramientas únicas por nombre para el Dropdown
  // (Aunque técnicamente deberías seleccionar una unidad específica ID, 
  //  si tu UX es seleccionar por nombre, asegúrate de tomar el ID de la primera disponible)
  const uniqueTools = tools.reduce((acc, tool) => {
    if (!acc.find((t) => t.name === tool.name)) {
      acc.push(tool);
    }
    return acc;
  }, []);

  const saveLoan = (e) => {
    e.preventDefault();

    // 2. Obtener el RUT del Cliente seleccionado
    // El backend necesita el RUT del cliente que pide el préstamo, no del empleado logueado.
    const selectedClientObj = clients.find(c => c.id === selectedClientId);
    
    if (!selectedClientObj) {
        alert("Error: No se ha seleccionado un cliente válido.");
        return;
    }

    const clientRut = selectedClientObj.rut; 

    // 3. Preparar datos del cuerpo (Solo fechas, el resto va en la URL)
    const loanData = {
      startDate: startDate,
      scheduledReturnDate: scheduledReturnDate
      // El backend se encarga de 'createdLoan' y de asociar IDs
    };

    // 4. Llamada al Servicio Actualizado
    // Firma: createLoan(data, rutCliente, toolId)
    loanService
      .createLoan(loanData, clientRut, selectedToolId)
      .then(() => {
        setSuccessMessage("Préstamo creado exitosamente ✅");
        setOpenSnackbar(true);
        setTimeout(() => navigate("/"), 2500);
      })
      .catch((err) => {
        console.error("Error al crear préstamo ❌", err);
        // Manejo de error seguro por si err.response no existe
        const errorMsg = err.response?.data?.message || err.response?.data || err.message || "Error desconocido";
        alert("Error al crear préstamo: " + errorMsg);
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

        {/* Select de Herramienta */}
        <FormControl fullWidth>
          <TextField
            select
            label="Herramienta (ID - Nombre)"
            value={selectedToolId}
            onChange={(e) => setSelectedToolId(e.target.value)}
            required
          >
            {/* Nota: Aquí muestro todas las disponibles. Si usas uniqueTools, 
                asegúrate de que el ID corresponda a una unidad real disponible */}
            {tools.map((tool) => (
              <MenuItem key={tool.id} value={tool.id}>
                {tool.id} - {tool.name} ({tool.brand})
              </MenuItem>
            ))}
          </TextField>
        </FormControl>

        {/* Select de Cliente */}
        <FormControl fullWidth>
          <TextField
            select
            label="Cliente"
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            required
          >
            {clients.map((client) => (
              <MenuItem key={client.id} value={client.id}>
                {client.rut} - {client.name} {client.lastName}
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
          Guardar Préstamo
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



